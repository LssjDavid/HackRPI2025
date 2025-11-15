#Pydantic models that describe the JSON we return to the frontend:
#ColumnSummary, ChartSpec, LLMSummary, AnalysisResult.

# app/models/analysis.py
from pydantic import BaseModel
from typing import List, Literal, Union, Dict, Any

ColumnType = Literal["numeric", "categorical", "datetime", "text"]


class ColumnSummary(BaseModel):
    name: str
    type: ColumnType
    missing_pct: float
    n_unique: int


class ChartSpec(BaseModel):
    column: str
    kind: Literal["histogram", "bar", "line"]
    x: List[Union[float, str]]
    y: List[float]


class LLMSummary(BaseModel):
    dataset_summary: str
    key_findings: List[str]
    data_quality_issues: List[str]
    next_questions: List[str]


class AnalysisResult(BaseModel):
    row_count: int
    column_count: int
    columns: List[ColumnSummary]
    charts: List[ChartSpec]
    anomalies: Dict[str, Any]
    llm: LLMSummary
