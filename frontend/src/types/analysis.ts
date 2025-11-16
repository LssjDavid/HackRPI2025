// frontend/src/types/analysis.ts

export interface ColumnSummary {
  name: string;
  type: string;
  missing_pct: number;
  n_unique: number;
}

export interface ChartSpec {
  column: string;
  kind: 'hist' | 'bar';
}

export interface LLMInsights {
  dataset_summary: string;
  key_findings: string[];
  data_quality_issues: string[];
  next_questions: string[];
}

export interface AnalysisResult {
  row_count: number;
  column_count: number;
  columns: ColumnSummary[];
  charts: ChartSpec[];
  anomalies: string[];
  llm: LLMInsights;          // ⬅️ now an object, not a string
}
