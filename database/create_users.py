import requests
import random
from faker import Faker

# Configuration
API_BASE_URL = "http://localhost:8080"
DEFAULT_PROFILE_PIC = "https://roamio-my-profile.s3.us-east-2.amazonaws.com/default.jpg"
STATE_CODES = ['CA', 'FL', 'NY', 'TX', 'WA', 'IL', 'AZ', 'CO', 'GA', 'NC']
NUM_USERS = 20

fake = Faker()
users = []

IMAGE_URLS = [
    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe",  # Woman with sunglasses
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",  # Smiling girl
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",  # Bearded man
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2",     # Laughing woman
    "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7",  # Guy in hoodie
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",  # Woman with glasses
    "https://images.unsplash.com/photo-1546456073-6712f79251bb",     # Stylish man
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",  # Studio portrait
    "https://images.unsplash.com/photo-1544725176-7c40e5a2c9f3",     # Smiling middle-aged man
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"   # Casual young man
]

# Step 1: Register Users
def register_user():
    fullname = fake.name()
    username = fake.user_name()
    email = fake.email()
    dob = fake.date_of_birth(minimum_age=18, maximum_age=50).isoformat()
    location = fake.city()

    payload = {
        "Fullname": fullname,
        "Username": username,
        "Email": email,
        "Password": "test123",
        "DOB": dob,
        "Location": location
    }
    r = requests.post(f"{API_BASE_URL}/users/register", json=payload)
    if r.status_code == 200:
        print(f"[✓] Registered: {username}")
        return username
    else:
        print(f"[x] Registration failed for {username}: {r.text}")
        return None

def login_and_get_user_id(username):
    payload = {
        "username_or_email": username,
        "password": "test123"
    }
    r = requests.post(f"{API_BASE_URL}/users/login", json=payload)
    if r.status_code == 200:
        return r.json()["user"]["ID"]
    return None

def set_profile_pic(username):
    use_default = random.random() < 0.5
    image_url = DEFAULT_PROFILE_PIC if use_default else random.choice(IMAGE_URLS)
    payload = {
        "username": username,
        "image_url": image_url
    }
    requests.post(f"{API_BASE_URL}/users/profile-pic", json=payload)

# Main execution
for _ in range(NUM_USERS):
    username = register_user()
    if username:
        user_id = login_and_get_user_id(username)
        if user_id:
            set_profile_pic(username)
            users.append((username, user_id))
