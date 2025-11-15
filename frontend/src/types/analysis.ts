export interface ColumnInfo {
  name: string;
  type: string;
  missing_pct: number;
  n_unique: number;
}

export interface ChartSpec {
  column: string;
  type: string;
  data: number[];
}

export interface AnalysisResult {
  row_count: number;
  column_count: number;
  columns: ColumnInfo[];
  charts: ChartSpec[];
  anomalies: Record<string, any>;
  llm: string;
}
