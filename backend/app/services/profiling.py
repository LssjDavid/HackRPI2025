'''
Pure functions that:
- read a pandas.DataFrame
- infer types
- compute basic stats
- detect anomalies
- return a profile dict / parts of AnalysisResult.

'''

# app/services/profiling.py
from typing import Dict, Any, List
import pandas as pd
from app.models.analysis import ColumnSummary


def infer_column_type(series: pd.Series) -> str:
    """
    Very simple placeholder type inference.
    We will refine this later.
    """
    if pd.api.types.is_numeric_dtype(series):
        return "numeric"
    if pd.api.types.is_datetime64_any_dtype(series):
        return "datetime"
    # crude heuristic for categorical vs text
    unique_ratio = series.nunique(dropna=True) / max(len(series), 1)
    if unique_ratio < 0.2:
        return "categorical"
    return "text"


def build_profile(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Build a compact profile dict and a list of ColumnSummary objects.

    Returns:
        {
            "row_count": int,
            "column_count": int,
            "columns": List[ColumnSummary],
            "anomalies": dict,
        }
    """
    row_count = len(df)
    column_count = df.shape[1]

    columns: List[ColumnSummary] = []
    anomalies: Dict[str, Any] = {}

    for col in df.columns:
        series = df[col]
        col_type = infer_column_type(series)
        missing_pct = float(series.isna().mean())
        n_unique = int(series.nunique(dropna=True))

        columns.append(
            ColumnSummary(
                name=col,
                type=col_type,  # type: ignore[arg-type]
                missing_pct=missing_pct,
                n_unique=n_unique,
            )
        )

        # placeholder anomaly detection
        col_anoms: Dict[str, Any] = {}
        if missing_pct > 0.3:
            col_anoms["high_missing"] = missing_pct

        if col_type == "numeric":
            desc = series.describe()
            col_anoms["min"] = float(desc.get("min", 0))
            col_anoms["max"] = float(desc.get("max", 0))

        if col_anoms:
            anomalies[col] = col_anoms

    return {
        "row_count": row_count,
        "column_count": column_count,
        "columns": columns,
        "anomalies": anomalies,
    }
