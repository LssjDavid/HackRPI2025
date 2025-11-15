#Wrapper around the LLM API. Takes a compact profile dict, returns LLMSummary.

# app/services/llm_client.py
from app.models.analysis import LLMSummary
from typing import Dict, Any


def analyze_with_llm(profile: Dict[str, Any]) -> LLMSummary:
    """
    Stub: in the real version, this will call an LLM API.

    For now, we synthesize a simple deterministic summary so we can
    verify end-to-end behavior without external dependencies.
    """
    row_count = profile.get("row_count", 0)
    column_count = profile.get("column_count", 0)
    col_names = [c.name for c in profile.get("columns", [])]

    return LLMSummary(
        dataset_summary=(
            f"The dataset has {row_count} rows and {column_count} columns. "
            f"Columns include: {', '.join(col_names[:5])}"
        ),
        key_findings=[
            "This is a placeholder LLM summary.",
            "Once LLM integration is added, this will contain real insights.",
        ],
        data_quality_issues=[
            "Data quality issues will be listed here in a later version."
        ],
        next_questions=[
            "What is the main KPI you care about in this dataset?",
            "Are there any target variables for modeling?",
        ],
    )
