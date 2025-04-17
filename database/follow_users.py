import sqlite3
import requests
import random

# Config
DB_PATH = "roamioDB.db"
API_BASE_URL = "http://localhost:8080"
STATE_CODES = ['CA', 'FL', 'NY', 'TX', 'WA', 'IL', 'AZ', 'CO', 'GA', 'NC']

# Load users from SQLite
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
cursor.execute("SELECT id, username FROM users;")
users = cursor.fetchall()

def follow_user(follower, target):
    if follower == target:
        return
    payload = {
        "follower_id": follower,
        "target_id": target,
        "type": "user"
    }
    requests.post(f"{API_BASE_URL}/users/follow", json=payload)

def follow_state(user_id, state_code):
    payload = {
        "follower_id": user_id,
        "target_id": state_code,
        "type": "page"
    }
    requests.post(f"{API_BASE_URL}/users/follow", json=payload)

# Simulate user follows
for uname, uid in users:
    follow_targets = random.sample([u for u in users if u[1] != uname], k=random.randint(1, 4))
    for _, tgt_id in follow_targets:
        follow_user(uid, tgt_id)

    # Follow random states
    for state in random.sample(STATE_CODES, k=random.randint(1, 3)):
        follow_state(uid, state)
