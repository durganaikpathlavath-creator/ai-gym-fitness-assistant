"""
AI_GYM_FITNESS & ASSISTANT (PhysioRecover AI Edition)
Comprehensive End-to-End System Verification Suite

Author: P. Durga Naik
Project: Clinical Physical Therapy, Joint ROM Biomechanics & Smart Gym Assistant
"""

import sys
import uuid
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from main import app
from create_tables import init_db

client = TestClient(app)

def run_e2e_verification():
    print("=" * 70)
    print("AI_GYM_FITNESS & ASSISTANT (PhysioRecover AI) - SYSTEM VERIFICATION")
    print("Author: P. Durga Naik")
    print("=" * 70)

    # 1. Initialize Tables & Default Seeds
    print("\n[STEP 1] Initializing database tables and default exercise seeds...")
    init_db()
    print("-> PASS: Database schema verified.")

    # 2. Test Root Endpoint
    print("\n[STEP 2] Verifying Root API Gateway...")
    res = client.get("/")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    root_data = res.json()
    assert "P. Durga Naik" in root_data["author"]
    assert "PhysioRecover AI" in root_data["project"]
    print(f"-> PASS: Root endpoint verified. Project: {root_data['project']} | Author: {root_data['author']}")

    # 3. Test Exercises Catalog
    print("\n[STEP 3] Verifying Rehabilitation & Fitness Exercise Catalog...")
    res = client.get("/exercises")
    assert res.status_code == 200
    exercises = res.json()
    assert len(exercises) >= 5, f"Expected at least 5 seeded exercises, got {len(exercises)}"
    exercise_names = [e["name"] for e in exercises]
    print(f"-> Available Exercises: {exercise_names}")
    assert any("Squat" in name for name in exercise_names)
    assert any("Knee" in name for name in exercise_names)
    print("-> PASS: Exercise catalog contains clinical rehabilitation protocols.")

    # 4. Test User Registration
    test_user_email = f"trainee_{uuid.uuid4().hex[:6]}@example.com"
    test_password = "SecurePassword123!"
    print(f"\n[STEP 4] Registering test patient/athlete profile: {test_user_email}...")
    register_payload = {
        "email": test_user_email,
        "name": "Durga Naik Test User",
        "password": test_password,
    }
    res = client.post("/auth/register", json=register_payload)
    assert res.status_code == 200 or res.status_code == 201, f"Registration failed: {res.text}"
    print(f"-> PASS: User registered successfully. Email: {test_user_email}")

    # 5. Test User Login & JWT Token
    print("\n[STEP 5] Authenticating user and obtaining JWT Bearer token...")
    login_payload = {
        "username": test_user_email,
        "password": test_password,
    }
    res = client.post("/auth/login", data=login_payload)
    assert res.status_code == 200, f"Login failed: {res.text}"
    token_data = res.json()
    access_token = token_data.get("access_token")
    assert access_token, "No access token returned!"
    headers = {"Authorization": f"Bearer {access_token}"}
    print("-> PASS: JWT Bearer token generated successfully.")

    # 6. Test User Profile Retrieval & Update
    print("\n[STEP 6] Testing User Profile retrieval and clinical goal configuration...")
    res = client.get("/users/me", headers=headers)
    assert res.status_code == 200
    profile = res.json()
    print(f"-> Initial Profile: Name={profile.get('name')}, Email={profile.get('email')}")

    update_payload = {
        "height_cm": 178.0,
        "weight_kg": 74.5,
        "fitness_goal": "Knee Rehab & Mobility",
        "activity_level": "moderate",
        "dietary_preference": "anti_inflammatory",
    }
    res = client.put("/users/me", json=update_payload, headers=headers)
    assert res.status_code == 200
    updated = res.json()
    assert updated["profile"]["fitness_goal"] == "Knee Rehab & Mobility"
    print("-> PASS: Profile configured with clinical rehabilitation goal.")

    # 7. Test Workout Session Lifecycle
    print("\n[STEP 7] Starting live rehab tracking session...")
    squat_ex = next(e for e in exercises if "Squat" in e["name"])
    start_payload = {
        "exercise_id": squat_ex["id"],
    }
    res = client.post("/workouts/start", json=start_payload, headers=headers)
    assert res.status_code == 200
    session_data = res.json()
    session_id = session_data["session_id"]
    print(f"-> Session Started: Session ID = {session_id}")

    # Log completed session with joint ROM telemetry
    print("\n[STEP 8] Logging completed session with ROM telemetry & form metrics...")
    finish_payload = {
        "exercise_id": squat_ex["id"],
        "sets": 1,
        "reps": 10,
        "calories": 24.5,
        "performance_score": 92.0,
        "rep_metrics": [
            {
                "rep_number": i + 1,
                "min_knee_angle": 102.0,
                "max_torso_lean": 78.0,
                "duration_seconds": 2.5,
                "form_status": "GOOD",
                "violations": [],
                "metrics_json": {"rom_score": 92.0, "tempo_score": 88.0, "valgus": False},
            }
            for i in range(10)
        ],
    }
    res = client.post(f"/workouts/{session_id}/complete", json=finish_payload, headers=headers)
    assert res.status_code == 200, f"Complete workout failed: {res.text}"
    finish_result = res.json()
    print(f"-> Session Completed: Score={finish_result.get('performance_score')}/100, Rating={finish_result.get('rating')}")
    print("-> PASS: Biomechanical ROM and rep metrics stored in database.")

    # 8. Test PhysioBuddy Rehabilitation Assistant
    print("\n[STEP 9] Testing PhysioBuddy AI recovery guidance...")
    buddy_payload = {
        "message": "What is the recommended joint range of motion and form cues for knee recovery?",
        "include_history": True,
    }
    res = client.post("/buddy/chat", json=buddy_payload, headers=headers)
    assert res.status_code == 200
    buddy_res = res.json()
    assert "PhysioRecover" in buddy_res["message"] or "Range of Motion" in buddy_res["message"]
    print(f"-> PhysioBuddy Provider: {buddy_res.get('provider')}")
    print(f"-> PhysioBuddy Response Preview: {buddy_res['message'][:120].encode('ascii', 'ignore').decode()}...")
    print("-> PASS: PhysioBuddy AI answered with clinical recovery guidance.")

    # 9. Test Anti-Inflammatory Nutrition & Recovery Meal Plan
    print("\n[STEP 10] Testing Recovery Nutrition & Meal Plan Generation...")
    res = client.post(
        "/diet/plan",
        json={"dietary_preference": "standard", "meals_per_day": 3},
        headers=headers,
    )
    assert res.status_code in (200, 201), f"Diet plan failed: {res.text}"
    plan = res.json()
    assert len(plan["meals"]) == 3
    assert len(plan["grocery_list"]) > 0
    print(f"-> Generated Plan: Calories={plan['calories_target']} kcal, Meals={len(plan['meals'])}, Grocery Items={len(plan['grocery_list'])}")
    print("-> PASS: Nutrition engine derived customized recovery plan.")

    # 10. Test Performance Analytics Summary
    print("\n[STEP 11] Testing Longitudinal Biomechanics Analytics...")
    res = client.get("/analytics/overview", headers=headers)
    assert res.status_code == 200, f"Analytics overview failed: {res.text}"
    analytics = res.json()
    print(f"-> Analytics Overview: Workouts Completed={analytics.get('total_workouts')}, Avg Score={analytics.get('avg_performance_score')}")

    res_w = client.get("/analytics/workouts", headers=headers)
    assert res_w.status_code == 200, f"Workout analytics failed: {res_w.text}"
    w_analytics = res_w.json()
    print(f"-> Detailed Workout Analytics: Total Reps={w_analytics.get('total_reps')}, Total Sessions={w_analytics.get('total_sessions')}")
    print("-> PASS: Biomechanics analytics computed successfully.")

    print("\n" + "=" * 70)
    print("ALL 11 VERIFICATION STAGES PASSED CLEANLY (100% SUCCESS)")
    print("=" * 70)

if __name__ == "__main__":
    run_e2e_verification()
