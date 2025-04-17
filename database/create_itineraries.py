
import sqlite3
import requests
import random
import numpy as np
from faker import Faker

# Configurable
DB_PATH = "roamioDB.db"
API_BASE_URL = "http://localhost:8080"
STATE_CODES = ['CA', 'FL', 'NY', 'TX', 'WA', 'IL', 'AZ', 'CO', 'GA', 'NC']
ZIPF_ALPHA = 1.5
AVG_POSTS_PER_USER = 5

IMAGE_URLS = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1494526585095-c41746248156",
    "https://images.unsplash.com/photo-1558980664-10ea76351b5d"
]

TRAVEL_TITLES = [
    "Exploring the Coast of {state}",
    "Hidden Gems in {state}",
    "A Culinary Tour of {state}",
    "Hiking Through the Heart of {state}",
    "Weekend Escape to {state}",
    "Urban Adventures in {state}",
    "Nature Trails and Tranquility in {state}",
    "Sunsets and Sand in {state}"
]

TRAVEL_HIGHLIGHTS = [
    "Visited breathtaking national parks.",
    "Enjoyed local cuisine and street food.",
    "Explored scenic hiking trails and lakes.",
    "Relaxed on the beach with stunning views.",
    "Discovered unique art galleries and museums.",
    "Tried thrilling water sports and adventures.",
    "Experienced vibrant nightlife and music scenes."
]

TRAVEL_SUGGESTIONS = [
    "Pack light but don’t forget hiking shoes.",
    "Book accommodation near downtown for convenience.",
    "Try food trucks — affordable and delicious!",
    "Keep some cash on hand for local vendors.",
    "Visit state parks early to avoid crowds.",
    "Use public transport for a local experience.",
    "Carry sunscreen and bug spray — essentials!"
]

TRAVEL_DESCRIPTIONS = [
    "This trip through {state} offered the perfect blend of relaxation and adventure. From scenic drives to hidden local gems, each day had something unique to offer.",
    "We explored some of the most iconic locations in {state}, immersing ourselves in its rich culture, natural beauty, and unforgettable cuisine.",
    "The journey was full of spontaneous discoveries and charming spots that made us fall in love with {state}. Ideal for anyone looking to disconnect and recharge.",
    "Whether it was hiking in the hills or kayaking through clear waters, our trip in {state} delivered on all fronts. A must-visit for outdoor lovers!"
]


fake = Faker()

# Step 1: Load users from DB
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
cursor.execute("SELECT id, username FROM users;")
users = cursor.fetchall()

# Step 2: Determine number of posts per user
user_post_weights = np.random.zipf(ZIPF_ALPHA, size=len(users))
user_post_counts = np.round(user_post_weights / user_post_weights.sum() * len(users) * AVG_POSTS_PER_USER).astype(int)
user_post_counts = np.clip(user_post_counts, 1, 5)

import matplotlib.pyplot as plt

plt.bar(range(len(user_post_counts)), user_post_counts)
plt.title("Posts per User")
plt.xlabel("User Index")
plt.ylabel("Number of Posts")
plt.show()

# Step 3: Create itineraries for each user
for i, (user_id, username) in enumerate(users):
    for _ in range(user_post_counts[i]):
        state_code = random.choice(STATE_CODES)
        title = fake.sentence(nb_words=6)
        budget = f"${random.randint(300, 5000)}"
        days = random.randint(2, 10)
        nights = days - 1
        group_size = random.randint(1, 6)
        description = random.choice(TRAVEL_DESCRIPTIONS).format(state=state_code)
        highlights = random.choice(TRAVEL_HIGHLIGHTS)
        suggestions = random.choice(TRAVEL_SUGGESTIONS)

        include_images = random.random() < 0.6
        selected_images = random.sample(IMAGE_URLS, k=2 if include_images else 0)
        image_string = ";".join(selected_images) if selected_images else ""

        payload = {
            "UserID": user_id,
            "StateCode": state_code,
            "Title": title,
            "Description": description,
            "NumDays": days,
            "NumNights": nights,
            "Size": group_size,
            "Budget": budget,
            "Highlights": highlights,
            "Suggestions": suggestions,
            "Images": image_string
        }

        r = requests.post(f"{API_BASE_URL}/itineraries", json=payload)
        if r.status_code == 201:
            print(f"[✓] Posted itinerary for user {username} in {state_code}")
        else:
            print(f"[x] Failed to post for {username}: {r.status_code} | {r.text}")
