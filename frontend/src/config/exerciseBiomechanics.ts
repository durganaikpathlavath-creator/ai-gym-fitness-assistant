/**
 * Clinical Biomechanics & Rehabilitation Exercise Configuration Registry
 * Author: P. Durga Naik
 * Project: AI_GYM_FITNESS & ASSISTANT (PhysioRecover AI Edition)
 *
 * Provides modular, medically sound joint angle calculations, ROM boundaries,
 * and real-time form evaluation cues for physical therapy and fitness training.
 */

export interface JointKeypoints {
  a: number; // Origin landmark index (e.g. Hip 23/24 or Shoulder 11/12)
  b: number; // Vertex / Pivot landmark index (e.g. Knee 25/26 or Elbow 13/14)
  c: number; // Terminal landmark index (e.g. Ankle 27/28 or Wrist 15/16)
}

export interface ExerciseBiomechanicsConfig {
  key: string;
  name: string;
  category: "Lower Limb Rehab" | "Knee Rehab" | "Elbow Rehab" | "Shoulder Rehab" | "Core & Upper Body";
  targetJoint: string;
  clinicalObjective: string;
  romRange: { min: number; max: number };
  calibrationMinAngle: number;
  thresholds: {
    top: number;        // Extended / starting position (e.g., 140°)
    descend: number;    // Movement initiation threshold (e.g., 130°)
    bottom: number;     // Target clinical excursion / peak flexion (e.g., 100°)
    ascending: number;  // Return phase trigger threshold (e.g., 115°)
  };
  keypoints: {
    left: JointKeypoints;
    right: JointKeypoints;
  };
  valgusProtection: boolean;
  coachingCues: {
    starting: string;
    ready: string;
    activePhase: string;
    peakExcursion: string;
    returnPhase: string;
    shallowAlert: string;
    completedRep: string;
    safetyWarning?: string;
  };
}

export const EXERCISE_CONFIGS: Record<string, ExerciseBiomechanicsConfig> = {
  squat: {
    key: "squat",
    name: "Squat Rehab & Mobility",
    category: "Lower Limb Rehab",
    targetJoint: "Knee (Tibiofemoral) & Hip Joint",
    clinicalObjective: "Controlled hip-knee flexion to restore lower limb strength and patellar tracking without valgus collapse.",
    romRange: { min: 90, max: 175 },
    calibrationMinAngle: 125,
    thresholds: {
      top: 135,
      descend: 130,
      bottom: 105,
      ascending: 115,
    },
    keypoints: {
      left: { a: 23, b: 25, c: 27 }, // Left Hip -> Left Knee -> Left Ankle
      right: { a: 24, b: 26, c: 28 }, // Right Hip -> Right Knee -> Right Ankle
    },
    valgusProtection: true,
    coachingCues: {
      starting: "Stand upright, feet shoulder-width apart. Extend knees fully to calibrate baseline.",
      ready: "Neutral stance confirmed. Begin controlled descent pushing hips backward.",
      activePhase: "Descending smoothly... track knees directly over toes.",
      peakExcursion: "Optimal depth reached (105°)! Press firmly through heels to rise.",
      returnPhase: "Extending upright... maintain tall torso alignment.",
      shallowAlert: "Shallow descent! Descend to at least 105° for therapeutic mobility.",
      completedRep: "Rep completed with stable mechanics. Ready for next excursion.",
      safetyWarning: "Watch knee valgus! Avoid letting knees cave inward.",
    },
  },

  knee_extension: {
    key: "knee_extension",
    name: "Knee Extension Recovery",
    category: "Knee Rehab",
    targetJoint: "Tibiofemoral & Patellofemoral Joint",
    clinicalObjective: "Terminal active knee extension for vastus medialis obliquus (VMO) re-education and swelling reduction.",
    romRange: { min: 90, max: 180 },
    calibrationMinAngle: 120,
    thresholds: {
      top: 155,       // Terminal extension target
      descend: 140,   // Release phase
      bottom: 95,     // Seated 90° flexion starting point
      ascending: 115,  // Extending upwards
    },
    keypoints: {
      left: { a: 23, b: 25, c: 27 }, // Left Hip -> Knee -> Ankle
      right: { a: 24, b: 26, c: 28 }, // Right Hip -> Knee -> Ankle
    },
    valgusProtection: true,
    coachingCues: {
      starting: "Position seated or standing. Align hip and knee in camera view.",
      ready: "Knee joint calibrated. Extend lower leg fully forward.",
      activePhase: "Extending quadriceps... maintain steady tension.",
      peakExcursion: "Full terminal extension achieved! Hold for a brief contraction.",
      returnPhase: "Slowly lower leg under eccentric control back to 95° flexion.",
      shallowAlert: "Extend fully to reach terminal 155°+ excursion.",
      completedRep: "Terminal extension rep verified. Excellent quadriceps engagement.",
      safetyWarning: "Avoid jerky locking at end range; control the terminal lockout.",
    },
  },

  curl: {
    key: "curl",
    name: "Bicep Flexion & Elbow Rehab",
    category: "Elbow Rehab",
    targetJoint: "Elbow (Humeroulnar) Joint",
    clinicalObjective: "Restoring functional elbow flexion excursion and distal tendon tensile resilience without shoulder swinging.",
    romRange: { min: 60, max: 165 },
    calibrationMinAngle: 125,
    thresholds: {
      top: 135,
      descend: 125,
      bottom: 65,
      ascending: 80,
    },
    keypoints: {
      left: { a: 11, b: 13, c: 15 }, // Left Shoulder -> Left Elbow -> Left Wrist
      right: { a: 12, b: 14, c: 16 }, // Right Shoulder -> Right Elbow -> Right Wrist
    },
    valgusProtection: false,
    coachingCues: {
      starting: "Stand with arms straight at your sides. Extend elbow to calibrate.",
      ready: "Baseline elbow angle calibrated. Initiate controlled forearm curl.",
      activePhase: "Flexing elbow... keep upper arm pinned closely to torso.",
      peakExcursion: "Full flexion achieved (65°)! Squeeze biceps and begin slow release.",
      returnPhase: "Lowering slowly under control... resist gravitational drop.",
      shallowAlert: "Curl higher! Bend elbow to 65° for full excursion range.",
      completedRep: "Elbow excursion rep complete. Clean rotational stability.",
      safetyWarning: "Avoid swaying torso or using hip momentum to swing the arm.",
    },
  },

  shoulder_press: {
    key: "shoulder_press",
    name: "Shoulder Press & Mobility",
    category: "Shoulder Rehab",
    targetJoint: "Glenohumeral & Scapulothoracic Joint",
    clinicalObjective: "Scapular upward rotation, rotator cuff stabilization, and overhead humeral elevation.",
    romRange: { min: 80, max: 170 },
    calibrationMinAngle: 120,
    thresholds: {
      top: 145,       // Extended overhead
      descend: 130,   // Lowering weights/hands to ear level
      bottom: 90,     // 90° elbow/shoulder rack
      ascending: 110,  // Pressing upwards
    },
    keypoints: {
      left: { a: 23, b: 11, c: 13 }, // Hip -> Shoulder -> Elbow (Shoulder Abduction/Elevation)
      right: { a: 24, b: 12, c: 14 }, // Hip -> Shoulder -> Elbow
    },
    valgusProtection: false,
    coachingCues: {
      starting: "Align upper torso in frame. Raise elbows to shoulder level (90°).",
      ready: "Starting rack position calibrated. Press overhead smoothly.",
      activePhase: "Pressing overhead... engage core and keep spine neutral.",
      peakExcursion: "Full overhead extension verified! Pause momentarily at apex.",
      returnPhase: "Lowering hands in plane of scapula back to 90° rack height.",
      shallowAlert: "Press arms fully overhead to verify end-range elevation.",
      completedRep: "Overhead press rep complete with solid scapular control.",
      safetyWarning: "Do not arch lower spine or flare ribs during overhead excursion.",
    },
  },

  pushup: {
    key: "pushup",
    name: "Push-up Alignment",
    category: "Core & Upper Body",
    targetJoint: "Shoulder & Elbow Complex",
    clinicalObjective: "Serratus anterior activation, chest recruitment, and spinal core stabilization during horizontal loading.",
    romRange: { min: 85, max: 165 },
    calibrationMinAngle: 120,
    thresholds: {
      top: 135,
      descend: 125,
      bottom: 95,
      ascending: 110,
    },
    keypoints: {
      left: { a: 11, b: 13, c: 15 }, // Shoulder -> Elbow -> Wrist
      right: { a: 12, b: 14, c: 16 }, // Shoulder -> Elbow -> Wrist
    },
    valgusProtection: false,
    coachingCues: {
      starting: "Set plank position with arms fully extended and core braced.",
      ready: "Straight arm plank calibrated. Lower chest smoothly toward ground.",
      activePhase: "Descending smoothly... keep elbows at a 45° angle from ribs.",
      peakExcursion: "Target 95° depth achieved! Push ground away through palms.",
      returnPhase: "Ascending... lock out arms into protraction at the top.",
      shallowAlert: "Descend deeper! Lower until elbows bend to 95°.",
      completedRep: "Clean push-up rep verified. Strong core alignment maintained.",
      safetyWarning: "Prevent hips from sagging; maintain rigid head-to-heel line.",
    },
  },
};

/**
 * Resolves appropriate ExerciseBiomechanicsConfig based on exercise name or ID.
 */
export function getExerciseConfig(exerciseName: string): ExerciseBiomechanicsConfig {
  const normalized = (exerciseName || "").toLowerCase().trim();

  if (normalized.includes("knee") || normalized.includes("extension")) {
    return EXERCISE_CONFIGS.knee_extension;
  }
  if (normalized.includes("curl") || normalized.includes("bicep")) {
    return EXERCISE_CONFIGS.curl;
  }
  if (normalized.includes("shoulder") || normalized.includes("press")) {
    return EXERCISE_CONFIGS.shoulder_press;
  }
  if (normalized.includes("push") || normalized.includes("bench")) {
    return EXERCISE_CONFIGS.pushup;
  }
  // Default to squat rehab
  return EXERCISE_CONFIGS.squat;
}
