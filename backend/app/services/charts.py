# app/services/charts.py
from typing import List
import numpy as np
import pandas as pd

from app.models.analysis import ChartSpec, ColumnSummary


def build_charts(df: pd.DataFrame, columns: List[ColumnSummary]) -> List[ChartSpec]:
    """
    Produce a small set of charts from the dataframe.

    For now:
    - first numeric column -> histogram (10 bins)
    - first categorical column -> bar chart of top categories (up to 10)
    """
    charts: List[ChartSpec] = []

    # numeric histogram
    for col in columns:
        if col.type == "numeric":
            series = df[col.name].dropna()

            # compute histogram counts and bin edges without plotting
            counts, bin_edges = np.histogram(series, bins=10)

            charts.append(
                ChartSpec(
                    column=col.name,
                    kind="histogram",
                    x=[float(edge) for edge in bin_edges[:-1]],  # left edges
                    y=[float(c) for c in counts],
                )
            )
            break  # only one numeric chart for now

    # categorical bar chart
    for col in columns:
        if col.type == "categorical":
            series = df[col.name].dropna()
            vc = series.value_counts().head(10)
            charts.append(
                ChartSpec(
                    column=col.name,
                    kind="bar",
                    x=[str(idx) for idx in vc.index],
                    y=[float(v) for v in vc.values],
                )
            )
            break  # only one categorical chart for now

    return charts
