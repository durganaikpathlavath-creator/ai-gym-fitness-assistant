"use client";

import React, { useState, useEffect, useRef } from "react";

interface DeviceItem {
  label: string;
  deviceId: string;
  isPhysical: boolean;
}

export default function CameraTestPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const dynamicContainerRef = useRef<HTMLDivElement | null>(null);

  // Device list & active selection
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [selectedDeviceLabel, setSelectedDeviceLabel] = useState<string>("Detecting...");

  // Status displays
  const [cameraPermission, setCameraPermission] = useState<string>("Checking...");
  const [cameraStreamStatus, setCameraStreamStatus] = useState<string>("None");
  const [videoPlayStatus, setVideoPlayStatus] = useState<string>("Stopped");
  const [readyStateText, setReadyStateText] = useState<string>("0 (HAVE_NOTHING)");
  const [videoWidth, setVideoWidth] = useState<number>(0);
  const [videoHeight, setVideoHeight] = useState<number>(0);
  const [videoTrackInfo, setVideoTrackInfo] = useState<string>("None");
  const [errorMessage, setErrorMessage] = useState<string>("None");
  const [isConnectedStatus, setIsConnectedStatus] = useState<boolean>(false);

  // Events fired
  const [eventsFired, setEventsFired] = useState<string[]>([]);
  const [eventLogs, setEventLogs] = useState<string[]>([]);

  // Test results summary
  const [pcCameraResult, setPcCameraResult] = useState<string>("Not tested yet");
  const [sharingCameraResult, setSharingCameraResult] = useState<string>("Not tested yet");
  const [dynamicVideoResult, setDynamicVideoResult] = useState<string>("Not tested yet");

  function addLog(msg: string) {
    const ts = new Date().toLocaleTimeString();
    setEventLogs((prev) => [`[${ts}] ${msg}`, ...prev.slice(0, 59)]);
  }

  function recordEvent(name: string) {
    setEventsFired((prev) => (prev.includes(name) ? prev : [...prev, name]));
    addLog(`EVENT: ${name}`);
  }

  // Phase 5: Browser Capabilities & Device Enumeration on Mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const protocol = window.location.protocol;
    const origin = window.location.origin;
    const isSecure = window.isSecureContext;

    console.log("=== PHASE 5: BROWSER CAPABILITIES ===");
    console.log("Protocol:", protocol);
    console.log("Origin:", origin);
    console.log("isSecureContext:", isSecure);
    console.log("mediaDevices:", navigator.mediaDevices);
    console.log("getUserMedia:", navigator.mediaDevices?.getUserMedia);

    addLog(`Protocol: ${protocol}`);
    addLog(`Origin: ${origin}`);
    addLog(`isSecureContext: ${isSecure}`);
    addLog(`mediaDevices: ${!!navigator.mediaDevices}`);
    addLog(`getUserMedia: ${!!navigator.mediaDevices?.getUserMedia}`);

    // Check video element connection
    if (videoRef.current) {
      setIsConnectedStatus(videoRef.current.isConnected);
      console.log("INITIAL VIDEO ELEMENT:", videoRef.current);
      console.log("INITIAL IS CONNECTED:", videoRef.current.isConnected);
    }

    // Permission API query
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "camera" as any })
        .then((p) => {
          setCameraPermission(p.state);
          console.log("Camera permission state:", p.state);
          addLog(`Permission API state: ${p.state}`);
          p.onchange = () => {
            setCameraPermission(p.state);
            addLog(`Permission state changed: ${p.state}`);
          };
        })
        .catch((err) => {
          setCameraPermission(`Query unsupported: ${err.message}`);
        });
    }

    // Enumerate devices and prioritize physical PC Camera
    refreshDevices();
  }, []);

  async function refreshDevices() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      addLog("enumerateDevices() not supported!");
      return;
    }

    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoIns = allDevices.filter((d) => d.kind === "videoinput");
      console.log("=== DETECTED VIDEOINPUT DEVICES ===");
      console.table(videoIns);
      addLog(`Found ${videoIns.length} videoinput device(s)`);

      const parsed: DeviceItem[] = videoIns.map((d, idx) => {
        const lbl = d.label || `Camera ${idx + 1}`;
        const isVirtual = lbl.toLowerCase().includes("sharing") || lbl.toLowerCase().includes("virtual");
        return {
          label: lbl,
          deviceId: d.deviceId,
          isPhysical: !isVirtual,
        };
      });

      setDevices(parsed);

      if (parsed.length > 0) {
        // Find physical camera first (prefer PC Camera / USB / not Sharing Camera)
        const physical = parsed.find((d) => d.isPhysical) || parsed[0];
        setSelectedDeviceId(physical.deviceId);
        setSelectedDeviceLabel(physical.label);
        addLog(`Selected camera: "${physical.label}" (${physical.isPhysical ? "Physical Webcam" : "Virtual Camera"})`);
      }
    } catch (e: any) {
      console.error("enumerateDevices error:", e);
      addLog(`enumerateDevices error: ${e.message}`);
    }
  }

  // Periodic video state watcher
  useEffect(() => {
    const timer = setInterval(() => {
      const vid = videoRef.current;
      if (vid) {
        setIsConnectedStatus(vid.isConnected);
        const stateLabels: Record<number, string> = {
          0: "0 (HAVE_NOTHING)",
          1: "1 (HAVE_METADATA)",
          2: "2 (HAVE_CURRENT_DATA)",
          3: "3 (HAVE_FUTURE_DATA)",
          4: "4 (HAVE_ENOUGH_DATA)",
        };
        setReadyStateText(stateLabels[vid.readyState] || `${vid.readyState}`);
        setVideoWidth(vid.videoWidth);
        setVideoHeight(vid.videoHeight);

        if (!vid.paused && vid.readyState >= 2) {
          setVideoPlayStatus("Playing");
        } else if (vid.paused && streamRef.current) {
          setVideoPlayStatus("Paused");
        } else if (!streamRef.current) {
          setVideoPlayStatus("Stopped");
        }
      }
    }, 400);

    return () => clearInterval(timer);
  }, []);

  // Stop camera helper
  function stopCamera() {
    addLog("=== STOP CAMERA TRIGGERED ===");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => {
        t.stop();
        addLog(`Stopped track: ${t.label}`);
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraStreamStatus("None");
    setVideoPlayStatus("Stopped");
    setVideoTrackInfo("None");
    setReadyStateText("0 (HAVE_NOTHING)");
    setVideoWidth(0);
    setVideoHeight(0);
    setEventsFired([]);
    addLog("Camera stream stopped.");
  }

  // Core Test Function: Implements Section 4 Exact Sequence
  async function testCamera(targetDeviceId?: string, customLabel?: string) {
    stopCamera();
    setErrorMessage("None");
    setEventsFired([]);

    const devId = targetDeviceId || selectedDeviceId;
    const devObj = devices.find((d) => d.deviceId === devId);
    const label = customLabel || devObj?.label || "Camera";
    setSelectedDeviceId(devId);
    setSelectedDeviceLabel(label);

    addLog(`=== TESTING CAMERA: "${label}" ===`);

    // 1. Inspect actual ref lifecycle before assignment
    const video = videoRef.current;
    if (!video) {
      const err = "VIDEO ELEMENT DOES NOT EXIST (videoRef.current is null)";
      console.error(err);
      setErrorMessage(err);
      addLog(err);
      throw new Error(err);
    }

    console.log("=== STEP 1: BEFORE ASSIGNMENT ===");
    console.log("videoRef.current:", video);
    console.log("videoRef.current.isConnected:", video.isConnected);
    console.log("videoRef.current.readyState:", video.readyState);
    console.log("videoRef.current.srcObject:", video.srcObject);
    addLog(`Before: isConnected=${video.isConnected}, readyState=${video.readyState}, srcObject=${video.srcObject}`);

    // Attach Phase 7 Event Listeners
    video.onloadedmetadata = () => {
      console.log("EVENT: loadedmetadata");
      recordEvent("loadedmetadata");
    };
    video.oncanplay = () => {
      console.log("EVENT: canplay");
      recordEvent("canplay");
    };
    video.onplaying = () => {
      console.log("EVENT: playing");
      recordEvent("playing");
      setVideoPlayStatus("Playing");
    };
    video.onpause = () => {
      console.log("EVENT: pause");
      recordEvent("pause");
      setVideoPlayStatus("Paused");
    };
    video.onerror = () => {
      console.error("EVENT: video error", video.error);
      recordEvent(`video error: ${video.error?.message || "code " + video.error?.code}`);
      setErrorMessage(`video element error: ${video.error?.message || "code " + video.error?.code}`);
    };

    let stream: MediaStream | null = null;

    // 4. Request MediaStream with specific deviceId if provided
    try {
      const constraints: MediaStreamConstraints = {
        video: devId
          ? {
              deviceId: { exact: devId },
              width: { ideal: 640 },
              height: { ideal: 480 },
            }
          : { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      };

      console.log("Calling getUserMedia with constraints:", constraints);
      addLog(`Calling getUserMedia({ deviceId: "${label}" })...`);

      stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      console.log("STREAM:", stream);
      console.log("TRACK:", stream.getVideoTracks()[0]);
      addLog(`getUserMedia() SUCCESS! Stream ID: ${stream.id}`);
      setCameraStreamStatus(`Active (ID: ${stream.id})`);

      // Track inspection (Phase 6)
      const tracks = stream.getVideoTracks();
      console.log("VIDEO TRACKS:", tracks);
      if (tracks.length > 0) {
        const track = tracks[0];
        const settings = track.getSettings ? track.getSettings() : {};
        console.log("Track:", {
          label: track.label,
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState,
          settings,
        });

        const desc = `"${track.label}" | state: ${track.readyState} | enabled: ${track.enabled} | muted: ${track.muted} | res: ${settings.width || "?"}x${settings.height || "?"}`;
        setVideoTrackInfo(desc);
        addLog(`Track info: ${desc}`);
      }
    } catch (gumError: any) {
      console.error("GET USER MEDIA ERROR:", gumError);
      const errStr = `${gumError.name}: ${gumError.message}`;
      setErrorMessage(errStr);
      setCameraStreamStatus("Failed");
      addLog(`GET USER MEDIA ERROR: ${errStr}`);
      if (label.toLowerCase().includes("pc camera")) {
        setPcCameraResult(`FAILED: ${errStr}`);
      } else if (label.toLowerCase().includes("sharing")) {
        setSharingCameraResult(`FAILED: ${errStr}`);
      }
      return;
    }

    // 4. Assign stream to video using exact user sequence
    video.autoplay = true;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("autoplay", "");
    video.srcObject = stream;

    console.log("ASSIGNED SRC OBJECT:", video.srcObject);
    console.log("AFTER ASSIGNMENT: isConnected =", video.isConnected, "readyState =", video.readyState);
    addLog(`Assigned video.srcObject. Waiting for metadata (max 5s)...`);

    // Await metadata with 5s timeout
    await new Promise<void>((resolve) => {
      if (video.readyState >= 1) {
        console.log("ALREADY HAVE METADATA (readyState >= 1)");
        addLog("ALREADY HAVE METADATA");
        resolve();
        return;
      }

      const origOnLoaded = video.onloadedmetadata;
      video.onloadedmetadata = (ev) => {
        console.log("LOADED METADATA FIRED");
        addLog("LOADED METADATA FIRED");
        recordEvent("loadedmetadata");
        if (origOnLoaded) origOnLoaded.call(video, ev);
        resolve();
      };

      setTimeout(() => {
        console.log("METADATA TIMEOUT (5s expired without loadedmetadata)");
        addLog("METADATA TIMEOUT (5s expired without loadedmetadata)");
        resolve();
      }, 5000);
    });

    console.log({
      readyState: video.readyState,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      paused: video.paused,
      srcObject: video.srcObject,
    });
    addLog(`State after metadata wait: readyState=${video.readyState}, ${video.videoWidth}x${video.videoHeight}, paused=${video.paused}`);

    // Call video.play()
    try {
      await video.play();
      console.log("PLAY SUCCESS");
      addLog(`PLAY SUCCESS! paused=${video.paused}, ${video.videoWidth}x${video.videoHeight}`);
      setVideoPlayStatus("Playing");

      const summary = `PASS: readyState=${video.readyState}, ${video.videoWidth}x${video.videoHeight}, playing`;
      if (label.toLowerCase().includes("pc camera")) {
        setPcCameraResult(summary);
      } else if (label.toLowerCase().includes("sharing")) {
        setSharingCameraResult(summary);
      }
    } catch (playErr: any) {
      console.error("PLAY ERROR:", playErr);
      const playErrStr = `video.play() failed: ${playErr.name}: ${playErr.message}`;
      setErrorMessage(playErrStr);
      setVideoPlayStatus("Play Rejected");
      addLog(`PLAY ERROR: ${playErrStr}`);

      const summary = `FAIL: ${playErr.name} (${playErr.message})`;
      if (label.toLowerCase().includes("pc camera")) {
        setPcCameraResult(summary);
      } else if (label.toLowerCase().includes("sharing")) {
        setSharingCameraResult(summary);
      }
    }
  }

  // 5. Dynamic Video Element Test (document.createElement('video'))
  async function runDynamicVideoTest() {
    addLog("=== RUNNING DYNAMIC VIDEO ELEMENT TEST ===");
    setDynamicVideoResult("Testing...");

    if (!streamRef.current) {
      addLog("No active stream! Starting camera first...");
      await testCamera();
    }

    const stream = streamRef.current;
    if (!stream) {
      setDynamicVideoResult("FAIL: No stream available");
      addLog("FAIL: No stream available");
      return;
    }

    const track = stream.getVideoTracks()[0];
    if (track) {
      console.log("DYNAMIC TEST TRACK SETTINGS:", track.getSettings());
      console.log("DYNAMIC TEST TRACK READYSTATE:", track.readyState);
      console.log("DYNAMIC TEST TRACK ENABLED:", track.enabled);
      console.log("DYNAMIC TEST TRACK MUTED:", track.muted);
    }

    // Create dynamic video element
    const testVideo = document.createElement("video");
    testVideo.autoplay = true;
    testVideo.muted = true;
    testVideo.playsInline = true;
    testVideo.srcObject = stream;
    testVideo.style.width = "320px";
    testVideo.style.height = "240px";
    testVideo.style.border = "3px dashed #10b981";
    testVideo.style.borderRadius = "8px";
    testVideo.style.marginTop = "8px";

    if (dynamicContainerRef.current) {
      dynamicContainerRef.current.innerHTML = "";
      dynamicContainerRef.current.appendChild(testVideo);
    }

    try {
      await testVideo.play();
      console.log("DYNAMIC VIDEO PLAY SUCCESS");
      addLog(`DYNAMIC VIDEO PLAY SUCCESS! readyState=${testVideo.readyState}, ${testVideo.videoWidth}x${testVideo.videoHeight}`);
      setDynamicVideoResult(`PASS: readyState=${testVideo.readyState}, ${testVideo.videoWidth}x${testVideo.videoHeight}`);
    } catch (e: any) {
      console.error("DYNAMIC VIDEO PLAY ERROR", e);
      addLog(`DYNAMIC VIDEO PLAY ERROR: ${e.name}: ${e.message}`);
      setDynamicVideoResult(`FAIL: ${e.name} (${e.message})`);
    }
  }

  // Quick Test Buttons for PC Camera vs Sharing Camera
  async function testPcCameraDirect() {
    const pcCam = devices.find((d) => d.label.toLowerCase().includes("pc camera")) || devices.find((d) => d.isPhysical);
    if (pcCam) {
      await testCamera(pcCam.deviceId, pcCam.label);
    } else {
      addLog("No 'PC Camera' found in enumerated devices list! Testing default with video:true");
      await testCamera();
    }
  }

  async function testSharingCameraDirect() {
    const sharingCam = devices.find((d) => d.label.toLowerCase().includes("sharing"));
    if (sharingCam) {
      await testCamera(sharingCam.deviceId, sharingCam.label);
    } else {
      addLog("No 'Sharing Camera' found in enumerated devices list.");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#030712",
        color: "#f9fafb",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ borderBottom: "1px solid #1f2937", paddingBottom: "16px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#38bdf8", margin: 0 }}>
                LIVE CAMERA TEST (ISOLATED BROWSER WEBCAM)
              </h1>
              <p style={{ fontSize: "13px", color: "#9ca3af", margin: "6px 0 0 0" }}>
                Pure browser webcam test — NO MediaPipe, NO AI, NO FSM, NO Workout APIs.
              </p>
            </div>
            <a
              href="/workout"
              style={{
                fontSize: "12px",
                padding: "8px 14px",
                backgroundColor: "#1e293b",
                color: "#38bdf8",
                border: "1px solid #334155",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              ← Back to Workout
            </a>
          </div>
        </div>

        {/* Camera Selector Dropdown (Phase 7 Requirement) */}
        <div
          style={{
            backgroundColor: "#111827",
            border: "1px solid #374151",
            borderRadius: "8px",
            padding: "14px 16px",
            marginBottom: "16px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <label style={{ fontSize: "13px", fontWeight: "bold", color: "#e5e7eb" }}>
            Select Hardware Camera:
          </label>
          <select
            value={selectedDeviceId}
            onChange={(e) => {
              const dev = devices.find((d) => d.deviceId === e.target.value);
              setSelectedDeviceId(e.target.value);
              setSelectedDeviceLabel(dev?.label || "Camera");
              addLog(`Switched camera selector to: "${dev?.label}"`);
            }}
            style={{
              flex: "1",
              minWidth: "260px",
              padding: "8px 12px",
              backgroundColor: "#030712",
              color: "#ffffff",
              border: "1px solid #4b5563",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.isPhysical ? "📸 " : "⚠️ "}
                {d.label} {d.isPhysical ? "(Physical Webcam - RECOMMENDED)" : "(Virtual / Remote Camera - ZERO FRAMES)"}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={refreshDevices}
            style={{
              padding: "8px 12px",
              backgroundColor: "#1f2937",
              color: "#9ca3af",
              border: "1px solid #374151",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            🔄 Refresh List
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
          <button
            type="button"
            onClick={() => testCamera()}
            style={{
              padding: "12px 20px",
              backgroundColor: "#10b981",
              color: "#030712",
              fontWeight: "bold",
              fontSize: "14px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            [ START CAMERA ({selectedDeviceLabel.slice(0, 16)}) ]
          </button>

          <button
            type="button"
            onClick={testPcCameraDirect}
            style={{
              padding: "12px 20px",
              backgroundColor: "#0284c7",
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: "13px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
            title="Test the physical PC Camera hardware directly"
          >
            📸 Test PC Camera (Physical)
          </button>

          <button
            type="button"
            onClick={testSharingCameraDirect}
            style={{
              padding: "12px 18px",
              backgroundColor: "#d97706",
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: "13px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
            title="Test the virtual Sharing Camera to verify zero-frame issue"
          >
            ⚠️ Test Sharing Camera (Virtual)
          </button>

          <button
            type="button"
            onClick={runDynamicVideoTest}
            style={{
              padding: "12px 18px",
              backgroundColor: "#6366f1",
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: "13px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
            title="Create dynamic HTMLVideoElement to test browser decoder outside React"
          >
            🧪 Dynamic Video Element Test
          </button>

          <button
            type="button"
            onClick={stopCamera}
            style={{
              padding: "12px 18px",
              backgroundColor: "#ef4444",
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: "13px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            [ STOP CAMERA ]
          </button>
        </div>

        {/* Real Webcam Video Feed */}
        <div
          style={{
            width: "100%",
            maxWidth: "640px",
            height: "480px",
            backgroundColor: "#000000",
            border: "3px solid #00f2fe",
            borderRadius: "12px",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {cameraStreamStatus === "None" && (
            <div
              style={{
                position: "absolute",
                color: "#6b7280",
                fontSize: "16px",
                fontWeight: "bold",
                textAlign: "center",
                pointerEvents: "none",
              }}
            >
              REAL WEBCAM VIDEO FEED
              <br />
              <span style={{ fontSize: "12px", fontWeight: "normal" }}>
                Select PC Camera and click [ START CAMERA ]
              </span>
            </div>
          )}
        </div>

        {/* Container for Phase 5 Dynamic Video Element */}
        <div ref={dynamicContainerRef} style={{ marginBottom: "20px" }}></div>

        {/* Real-time Status Table */}
        <div
          style={{
            backgroundColor: "#111827",
            border: "1px solid #374151",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
            fontFamily: "monospace",
            fontSize: "13px",
            lineHeight: "1.8",
          }}
        >
          <div>
            <strong style={{ color: "#9ca3af" }}>Camera Selected:</strong>{" "}
            <span style={{ color: selectedDeviceLabel.toLowerCase().includes("pc camera") ? "#34d399" : "#fbbf24", fontWeight: "bold" }}>
              {selectedDeviceLabel} {selectedDeviceLabel.toLowerCase().includes("pc camera") ? "(Physical)" : "(Virtual/Other)"}
            </span>
          </div>

          <div>
            <strong style={{ color: "#9ca3af" }}>Camera Permission:</strong>{" "}
            <span style={{ color: cameraPermission === "granted" ? "#34d399" : cameraPermission === "denied" ? "#f87171" : "#fbbf24", fontWeight: "bold" }}>
              {cameraPermission}
            </span>
          </div>

          <div>
            <strong style={{ color: "#9ca3af" }}>Camera Stream:</strong>{" "}
            <span style={{ color: cameraStreamStatus.startsWith("Active") ? "#34d399" : "#f87171", fontWeight: "bold" }}>
              {cameraStreamStatus}
            </span>
          </div>

          <div>
            <strong style={{ color: "#9ca3af" }}>Video Element isConnected:</strong>{" "}
            <span style={{ color: isConnectedStatus ? "#34d399" : "#f87171", fontWeight: "bold" }}>
              {String(isConnectedStatus)}
            </span>
          </div>

          <div>
            <strong style={{ color: "#9ca3af" }}>Video:</strong>{" "}
            <span style={{ color: videoPlayStatus === "Playing" ? "#34d399" : "#fbbf24", fontWeight: "bold" }}>
              {videoPlayStatus}
            </span>
          </div>

          <div>
            <strong style={{ color: "#9ca3af" }}>Ready State:</strong>{" "}
            <span style={{ color: readyStateText.startsWith("0") ? "#f87171" : "#34d399", fontWeight: "bold" }}>
              {readyStateText}
            </span>
          </div>

          <div>
            <strong style={{ color: "#9ca3af" }}>Video Width:</strong>{" "}
            <span style={{ color: videoWidth > 0 ? "#34d399" : "#f87171", fontWeight: "bold" }}>
              {videoWidth}px
            </span>
          </div>

          <div>
            <strong style={{ color: "#9ca3af" }}>Video Height:</strong>{" "}
            <span style={{ color: videoHeight > 0 ? "#34d399" : "#f87171", fontWeight: "bold" }}>
              {videoHeight}px
            </span>
          </div>

          <div>
            <strong style={{ color: "#9ca3af" }}>Video Track:</strong>{" "}
            <span style={{ color: "#e5e7eb" }}>{videoTrackInfo}</span>
          </div>

          <div>
            <strong style={{ color: "#9ca3af" }}>Error:</strong>{" "}
            <span style={{ color: errorMessage === "None" ? "#34d399" : "#f87171", fontWeight: "bold" }}>
              {errorMessage}
            </span>
          </div>
        </div>

        {/* Camera Comparative Test Results Summary */}
        <div
          style={{
            backgroundColor: "#111827",
            border: "1px solid #374151",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
            fontSize: "12px",
            fontFamily: "monospace",
          }}
        >
          <div style={{ fontWeight: "bold", color: "#38bdf8", marginBottom: "8px", textTransform: "uppercase" }}>
            Comparative Test Results Summary
          </div>
          <div>
            <strong>1. PC Camera (Physical Hardware):</strong>{" "}
            <span style={{ color: pcCameraResult.startsWith("PASS") ? "#34d399" : pcCameraResult.startsWith("FAIL") ? "#f87171" : "#9ca3af" }}>
              {pcCameraResult}
            </span>
          </div>
          <div>
            <strong>2. Sharing Camera (Virtual Software):</strong>{" "}
            <span style={{ color: sharingCameraResult.startsWith("PASS") ? "#34d399" : sharingCameraResult.startsWith("FAIL") ? "#f87171" : "#9ca3af" }}>
              {sharingCameraResult}
            </span>
          </div>
          <div>
            <strong>3. Dynamic Video Element Test:</strong>{" "}
            <span style={{ color: dynamicVideoResult.startsWith("PASS") ? "#34d399" : dynamicVideoResult.startsWith("FAIL") ? "#f87171" : "#9ca3af" }}>
              {dynamicVideoResult}
            </span>
          </div>
        </div>

        {/* Phase 7 Events Fired */}
        <div
          style={{
            backgroundColor: "#111827",
            border: "1px solid #374151",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
            fontSize: "12px",
            fontFamily: "monospace",
          }}
        >
          <div style={{ fontWeight: "bold", color: "#fbbf24", marginBottom: "8px", textTransform: "uppercase" }}>
            HTML5 Video Events Fired (Phase 7)
          </div>
          <div>
            {eventsFired.length === 0 ? (
              <span style={{ color: "#6b7280" }}>No video events fired yet. Click [ START CAMERA ].</span>
            ) : (
              eventsFired.map((ev, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    backgroundColor: "#065f46",
                    color: "#6ee7b7",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    marginRight: "6px",
                    marginBottom: "4px",
                    fontWeight: "bold",
                  }}
                >
                  ✓ {ev}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Runtime Console Logs */}
        <div
          style={{
            backgroundColor: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "8px",
            padding: "16px",
            fontSize: "11px",
            fontFamily: "monospace",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontWeight: "bold", color: "#94a3b8", textTransform: "uppercase" }}>
              Live Execution Event Logs
            </span>
            <button
              type="button"
              onClick={() => setEventLogs([])}
              style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "11px" }}
            >
              Clear
            </button>
          </div>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {eventLogs.length === 0 ? (
              <div style={{ color: "#475569" }}>Logs will appear here.</div>
            ) : (
              eventLogs.map((l, i) => (
                <div key={i} style={{ color: l.includes("ERROR") || l.includes("FAIL") ? "#f87171" : "#cbd5e1" }}>
                  {l}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
