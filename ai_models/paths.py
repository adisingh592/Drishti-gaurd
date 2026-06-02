"""Repository paths for Drishti Guard multi-model layout."""

from __future__ import annotations

from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
AI_MODELS_ROOT = REPO_ROOT / "ai_models"

# Canonical Phase 1 source — never modified by setup
PHASE1_WEIGHTS_SOURCE = REPO_ROOT / "ml" / "models" / "phase1" / "best.pt"

MODEL_A_ROOT = AI_MODELS_ROOT / "Model_A_SecurityThreats"
MODEL_B_ROOT = AI_MODELS_ROOT / "Model_B_CrowdBehavior"
MODEL_C_ROOT = AI_MODELS_ROOT / "Model_C_TrafficMonitoring"
MODEL_D_ROOT = AI_MODELS_ROOT / "Model_D_SafetyMonitoring"
MASTER_ROOT = AI_MODELS_ROOT / "MasterDetectionEngine"

UPLOADS_ROOT = REPO_ROOT / "uploads"
REPORTS_ROOT = REPO_ROOT / "reports"
DOCS_ROOT = REPO_ROOT / "docs"
