function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && window.location) {
    const hostname = window.location.hostname || "localhost";
    if (hostname.includes("vercel.app")) {
      return "https://ai-gym-fitness-assistant-2m2a.onrender.com";
    }
    const protocol = window.location.protocol || "http:";
    return `${protocol}//${hostname}:8000`;
  }
  return "http://localhost:8000";
}

export const API_BASE_URL = getApiBaseUrl();
