import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from database import SessionLocal
from models.exercise import Exercise

INITIAL_EXERCISES = [
    {
        "name": "Squat Rehab & Mobility",
        "category": "Lower Limb Rehab",
        "description": "Controlled hip-knee flexion exercise targeting quad engagement, knee stability, and joint range of motion.",
    },
    {
        "name": "Knee Extension Recovery",
        "category": "Knee Rehab",
        "description": "Terminal knee extension exercise for quadriceps re-education and patellar alignment tracking.",
    },
    {
        "name": "Bicep Flexion & Elbow Rehab",
        "category": "Elbow Rehab",
        "description": "Controlled elbow flexion/extension for restoring joint excursion, tendon resilience, and arm mobility.",
    },
    {
        "name": "Shoulder Press & Mobility",
        "category": "Shoulder Rehab",
        "description": "Scapular upward rotation and overhead mobility exercise for shoulder girdle stability.",
    },
    {
        "name": "Push-up Alignment",
        "category": "Core & Upper Body",
        "description": "Bodyweight alignment movement targeting scapular protraction, chest activation, and core stabilization.",
    },
]


def seed_exercises():
    """Idempotent seed function to populate default rehabilitation and fitness exercises."""
    db = SessionLocal()
    try:
        added_count = 0
        existing_count = 0

        for item in INITIAL_EXERCISES:
            existing = db.query(Exercise).filter(Exercise.name == item["name"]).first()
            if not existing:
                exercise = Exercise(
                    name=item["name"],
                    category=item["category"],
                    description=item["description"],
                )
                db.add(exercise)
                added_count += 1
                print(f"[SEED] Added exercise: {item['name']} ({item['category']})")
            else:
                existing_count += 1
                print(f"[SEED] Exercise already exists: {item['name']} (skipped)")

        if added_count > 0:
            db.commit()
            print(f"[SUCCESS] Seeded {added_count} new exercise(s).")
        else:
            print("[INFO] All seed exercises already present.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_exercises()
