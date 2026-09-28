# AI_GYM_FITNESS & ASSISTANT (PhysioRecover AI Edition) — Project State

**Author:** P. Durga Naik  
**Project:** Physical Therapy, Joint Range-of-Motion (ROM), Form Biomechanics & Smart Gym Assistant  
**Status:** ACTIVE / EXPANDED

---

## 1. Project Overview & Scope

AI_GYM_FITNESS & ASSISTANT is an intelligent computer-vision powered health, physical therapy, and fitness assistant. It pairs real-time markerless pose estimation (MediaPipe & OpenCV) with clinical joint angle range-of-motion (ROM) telemetry, exercise form correction, personalized anti-inflammatory and recovery nutrition, rehabilitation routine planning, and interactive AI physio coaching.

---

## 2. Core Modules

1. **AI Live Rehab & Form Coach (`/workout`):** Real-time webcam joint angle detection, rep counting, and safety biomechanics.
2. **Clinical Range of Motion (ROM) Analyzer:** Continuous joint excursion measurement across knee, hip, shoulder, and elbow.
3. **Rehab Protocols & Smart Planner (`/planner`):** Evidence-based rehabilitation and conditioning routine creation.
4. **Anti-Inflammatory & Recovery Nutrition Coach (`/nutrition`):** Targeted meal plans optimizing muscular repair and metabolic recovery.
5. **PhysioBuddy AI Assistant (`/buddy`):** Contextual conversation assistant for recovery tips, soreness management, and exercise pacing.
6. **Mobility & Adherence Habit Tracker (`/habit`):** Consistency monitoring and physical therapy streak metrics.
7. **Comprehensive Clinical Telemetry & Analytics (`/analytics` & `/reports`):** In-depth angle distributions, stability scores, and PDF/printable clinical session summaries.

---

## 3. Technology Stack

- **Frontend:** Next.js (App Router), React 19, TypeScript, Tailwind CSS, MediaPipe Pose (Webcam CV)
- **Backend:** Python, FastAPI, SQLAlchemy ORM, SQLite / PostgreSQL dual-dialect engine, Pydantic, JWT Auth
- **Computer Vision & AI:** MediaPipe Pose Landmark Engine, OpenCV, NumPy, Scikit-Learn
- **Author & Maintainer:** P. Durga Naik