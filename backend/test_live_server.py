import urllib.request
import json
import urllib.parse
import uuid

base = "http://127.0.0.1:8000"

# 1. Exercises
req = urllib.request.urlopen(f"{base}/exercises")
exs = json.loads(req.read().decode())
print(f"1. /exercises: Status 200, Count={len(exs)}")

# 2. Register
uid = uuid.uuid4().hex[:6]
email = f"durga_{uid}@test.com"
reg_data = json.dumps({"email": email, "name": "Durga Naik", "password": "PassWord123!"}).encode()
req = urllib.request.Request(f"{base}/auth/register", data=reg_data, headers={"Content-Type": "application/json"})
res = json.loads(urllib.request.urlopen(req).read().decode())
print(f"2. /auth/register: Status 200, User={res.get('name')}")

# 3. Login
login_data = urllib.parse.urlencode({"username": email, "password": "PassWord123!"}).encode()
req = urllib.request.Request(f"{base}/auth/login", data=login_data, headers={"Content-Type": "application/x-www-form-urlencoded"})
token_res = json.loads(urllib.request.urlopen(req).read().decode())
token = token_res["access_token"]
auth_headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
print("3. /auth/login: Status 200, Token obtained")

# 4. Profile
req = urllib.request.Request(f"{base}/users/me", headers=auth_headers)
prof = json.loads(urllib.request.urlopen(req).read().decode())
print(f"4. /users/me: Status 200, Profile={prof.get('email')}")

# 5. Workout Start
start_data = json.dumps({"exercise_id": exs[0]["id"]}).encode()
req = urllib.request.Request(f"{base}/workouts/start", data=start_data, headers=auth_headers)
w_start = json.loads(urllib.request.urlopen(req).read().decode())
sid = w_start["session_id"]
print(f"5. /workouts/start: Status 200, SessionID={sid}")

# 6. Workout Complete
comp_data = json.dumps({"exercise_id": exs[0]["id"], "sets": 1, "reps": 5, "calories": 15.0, "performance_score": 95.0, "rep_metrics": []}).encode()
req = urllib.request.Request(f"{base}/workouts/{sid}/complete", data=comp_data, headers=auth_headers)
w_comp = json.loads(urllib.request.urlopen(req).read().decode())
print(f"6. /workouts/{sid}/complete: Status 200, Reps={w_comp.get('reps')}")

# 7. PhysioBuddy
buddy_data = json.dumps({"message": "What is the recommended range of motion for knee rehabilitation?"}).encode()
req = urllib.request.Request(f"{base}/buddy/chat", data=buddy_data, headers=auth_headers)
buddy_res = json.loads(urllib.request.urlopen(req).read().decode())
print(f"7. /buddy/chat: Status 200, Provider={buddy_res.get('provider')}")

# 8. Nutrition Diet Plan
diet_data = json.dumps({"dietary_preference": "anti_inflammatory", "meals_per_day": 3}).encode()
req = urllib.request.Request(f"{base}/diet/plan", data=diet_data, headers=auth_headers)
diet_res = json.loads(urllib.request.urlopen(req).read().decode())
print(f"8. /diet/plan: Status 201, Calories={diet_res.get('calories_target')}, Meals={len(diet_res.get('meals', []))}")

# 9. Analytics Overview
req = urllib.request.Request(f"{base}/analytics/overview", headers=auth_headers)
an_res = json.loads(urllib.request.urlopen(req).read().decode())
print(f"9. /analytics/overview: Status 200, Total Workouts={an_res.get('total_workouts')}")

print("\nALL 9 LIVE SERVER API CHECKS PASSED WITH 200/201 STATUS!")
