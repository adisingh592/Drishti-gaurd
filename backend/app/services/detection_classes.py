"""Threat taxonomy and COCO / custom model class mapping."""

# Weights for risk scoring (user spec)
THREAT_WEIGHTS: dict[str, int] = {
    "Handgun": 85,
    "Gun": 85,
    "Pistol": 85,
    "Rifle": 85,
    "Knife": 50,
    "Weapon": 85,
    "Fire": 90,
    "Smoke": 35,
    "Violence": 70,
    "Fighting": 65,
    "Accident": 85,
    "Dense_Crowd": 45,
    "Overcrowding": 55,
    "Crowd": 25,
    "No_Mask": 30,
    "No_Helmet": 35,
    "Masked Person": 20,
    "Mask": 10,
    "Crowd Density Warning": 25,
    "Crowd Density Critical": 50,
    "Rash Driving": 40,
    "Rash_Driving": 40,
    "Wrong-Side Driving": 45,
    "Wrong_Direction": 45,
    "Abandoned Object": 35,
    "Intrusion": 50,
    "Overspeeding": 40,
    "Zig-Zag Driving": 40,
    "Sudden Direction Change": 35,
}

WEAPON_CLASSES = {"gun", "pistol", "rifle", "knife", "weapon"}
VEHICLE_CLASSES = {"car", "bike", "truck", "bus", "motorcycle", "bicycle"}
PERSON_CLASSES = {"person", "masked person"}

# COCO class names (yolo11n.pt) -> Drishti taxonomy
COCO_TO_DRISHTI: dict[str, str] = {
    "person": "Person",
    "car": "Car",
    "motorcycle": "Bike",
    "bicycle": "Bike",
    "bus": "Bus",
    "truck": "Truck",
    "backpack": "Backpack",
    "handbag": "Bag",
    "suitcase": "Bag",
    "knife": "Knife",
    "handgun": "Pistol",
    "firearm": "Gun",
    "shotgun": "Rifle",
    "weapon": "Weapon",
}

# Custom surveillance model aliases (when using fine-tuned weights)
CUSTOM_ALIASES: dict[str, str] = {
    "gun": "Handgun",
    "handgun": "Handgun",
    "pistol": "Handgun",
    "rifle": "Rifle",
    "knife": "Knife",
    "fire": "Fire",
    "smoke": "Smoke",
    "mask": "Mask",
    "no_mask": "No_Mask",
    "dense_crowd": "Dense_Crowd",
    "overcrowding": "Overcrowding",
    "fighting": "Fighting",
    "violence": "Violence",
    "masked person": "Masked Person",
    "masked_person": "Masked Person",
    "abandoned object": "Abandoned Object",
    "abandoned_object": "Abandoned Object",
}


def map_class_name(raw: str) -> str:
    key = raw.lower().strip()
    if key in CUSTOM_ALIASES:
        return CUSTOM_ALIASES[key]
    if key in COCO_TO_DRISHTI:
        return COCO_TO_DRISHTI[key]
    return raw.title()


def severity_for_threat(threat_type: str, confidence: float) -> str:
    t = threat_type.lower()
    if any(w in t for w in ("gun", "pistol", "rifle", "weapon", "knife")):
        return "CRITICAL"
    if any(w in t for w in ("crowd density critical", "violence", "intrusion")):
        return "CRITICAL"
    if any(w in t for w in ("rash", "wrong-side", "masked", "crowd density warning")):
        return "HIGH"
    if confidence >= 0.85:
        return "HIGH"
    if confidence >= 0.65:
        return "MEDIUM"
    return "LOW"


def risk_level_label(score: int) -> str:
    if score <= 25:
        return "Safe"
    if score <= 50:
        return "Moderate Risk"
    if score <= 75:
        return "High Risk"
    return "Critical Risk"


def crowd_density_level(count: int) -> str:
    if count <= 20:
        return "SAFE"
    if count <= 50:
        return "MODERATE"
    if count <= 100:
        return "WARNING"
    return "CRITICAL"
