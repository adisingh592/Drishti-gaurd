"""Crowd monitoring from person detections."""

from __future__ import annotations


def crowd_level(count: int) -> str:
    if count <= 20:
        return "SAFE"
    if count <= 50:
        return "MODERATE"
    if count <= 100:
        return "WARNING"
    return "CRITICAL"


def analyze_person_count(count: int) -> dict:
    return {
        "count": count,
        "level": crowd_level(count),
        "alert": count > 50,
    }
