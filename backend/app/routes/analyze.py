'''
The /api/analyze endpoint:
- accept CSV upload
- read into DataFrame
- call profiling, charts, llm_client
- return AnalysisResult.
'''

# app/routes/analyze.py
from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import io
from app.models.analysis import AnalysisResult
from app.services.profiling import build_profile
from app.services.charts import build_charts
from app.services.llm_client import analyze_with_llm

router = APIRouter()


@router.post("/analyze", response_model=AnalysisResult)
async def analyze_dataset(file: UploadFile = File(...)) -> AnalysisResult:
    """
    Main analysis endpoint.

    Steps:
    1. Read uploaded CSV into a DataFrame.
    2. Build a dataset profile (types, stats, anomalies).
    3. Generate chart specs.
    4. Call the LLM (stub for now) to get narrative insights.
    """
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported for now.")

    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {exc}")

    profile_dict = build_profile(df)
    columns = profile_dict["columns"]
    anomalies = profile_dict["anomalies"]

    charts = build_charts(df, columns)
    llm_summary = analyze_with_llm(profile_dict)

    result = AnalysisResult(
        row_count=profile_dict["row_count"],
        column_count=profile_dict["column_count"],
        columns=columns,
        charts=charts,
        anomalies=anomalies,
        llm=llm_summary,
    )
    return result
