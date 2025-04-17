import sqlite3
import requests
import random
from faker import Faker

# Config
DB_PATH = "roamioDB.db"
API_BASE_URL = "http://localhost:8080"
MAX_COMMENTS_PER_POST = 5

fake = Faker()

# Load users and itineraries
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
cursor.execute("SELECT id, username FROM users;")
users = cursor.fetchall()

cursor.execute("SELECT id FROM itineraries;")
itineraries = [row[0] for row in cursor.fetchall()]

TRAVEL_COMMENTS = [
    "This looks like an amazing trip!",
    "Adding this to my bucket list for sure.",
    "Did you visit any local hidden gems?",
    "Looks like a perfect itinerary for the summer!",
    "Great suggestions — especially the food stops!",
    "Wow, I've been wanting to go here!",
    "Awesome photos, especially the hike shots.",
    "Was it family-friendly?",
    "Any tips for first-time visitors?",
    "Thanks for sharing — super helpful!"
]

# Post comments
for post_id in itineraries:
    num_comments = random.randint(1, MAX_COMMENTS_PER_POST)
    commenters = random.sample(users, k=min(num_comments, len(users)))
    for user_id, username in commenters:  # ✅ corrected unpacking
        payload = {
            "userID": int(user_id),
            "postID": int(post_id),
            "description": random.choice(TRAVEL_COMMENTS)
        }
        r = requests.post(f"{API_BASE_URL}/comments", json=payload)
        if r.status_code == 201:
            print(f"[✓] Comment by user {username} on post {post_id}")
        else:
            print(f"[x] Failed to comment by {username} on {post_id}: {r.status_code} | {r.text}")
