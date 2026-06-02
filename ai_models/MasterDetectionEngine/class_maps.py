"""Per-model class ID filters and display names (Phase 1 index layout)."""

from __future__ import annotations

# Phase 1 trained indices (frozen)
PHASE1_NAMES: dict[int, str] = {
    0: "person",
    1: "gun",
    2: "knife",
    3: "mask",
    4: "no_mask",
    5: "car",
    6: "motorcycle",
    7: "bus",
    8: "truck",
    9: "fire",
    10: "smoke",
}

MODEL_A_IDS: dict[int, str] = {
    0: "Person",
    1: "Handgun",
    2: "Knife",
    5: "Vehicle",
    6: "Motorcycle",
    7: "Bus",
    8: "Truck",
}

MODEL_D_IDS: dict[int, str] = {
    3: "Mask",
    4: "No_Mask",
    9: "Fire",
    10: "Smoke",
}

MODEL_C_IDS: dict[int, str] = {
    5: "Vehicle",
    6: "Motorcycle",
    7: "Bus",
    8: "Truck",
}

# Heuristic crowd labels (Model B without weights)
CROWD_LABELS = ("Crowd", "Dense_Crowd", "Overcrowding", "Fighting", "Violence")

THREAT_PRIORITY: dict[str, str] = {
    "Handgun": "critical",
    "Rifle": "critical",
    "Pistol": "critical",
    "Gun": "critical",
    "Fire": "critical",
    "Accident": "critical",
    "Violence": "critical",
    "Knife": "high",
    "Fighting": "high",
    "Dense_Crowd": "high",
    "Overcrowding": "high",
    "Smoke": "medium",
    "No_Helmet": "medium",
    "No_Mask": "medium",
    "Mask": "low",
    "Rash_Driving": "medium",
    "Wrong_Direction": "medium",
}

RISK_LEVELS = ("Safe", "Moderate Risk", "High Risk", "Critical Risk")
