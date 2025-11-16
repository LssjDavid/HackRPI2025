'use client';

import { useState } from 'react';
import type { AnalysisResult } from '../types/analysis';


export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [significantColumns, setSignificantColumns] = useState('');
  const [significantRows, setSignificantRows] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  //Temp variables just to see if it'll actually work it'll store backend results + error
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        alert('Please upload a CSV file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a CSV file');
      return;
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      alert('Backend URL is not configured (NEXT_PUBLIC_BACKEND_URL)');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('file', file);
    // these are optional for future use; backend will just ignore them for now
    formData.append('significantColumns', significantColumns);
    formData.append('significantRows', significantRows);

    try {
      const response = await fetch(`${backendUrl}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Backend error ${response.status}: ${text || response.statusText}`);
      }

      const data: AnalysisResult = await response.json();
      console.log('Analysis results:', data);
      setAnalysisResult(data);
    } catch (error: any) {
      console.error('Upload error:', error);
      setErrorMessage(error?.message ?? 'Failed to upload or analyze file');
      alert('Failed to upload or analyze file');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              CSV Data Analyzer
            </h1>
            <p className="text-lg text-gray-600">
              Upload your CSV file for automated analysis and visualization
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CSV File
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="file-upload"
                  />
                  
                  {!file ? (
                    <div className="space-y-2">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                        >
                          Click to upload
                        </label>
                        {' '}or drag and drop
                      </div>
                      <p className="text-xs text-gray-500">CSV files only</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <svg
                          className="h-8 w-8 text-indigo-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Significant Columns */}
              <div>
                <label
                  htmlFor="columns"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Significant Columns (optional)
                </label>
                <input
                  type="text"
                  id="columns"
                  value={significantColumns}
                  onChange={(e) => setSignificantColumns(e.target.value)}
                  placeholder="e.g., A, B, C or 1, 2, 3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Comma-separated column names or indices to prioritize
                </p>
              </div>

              {/* Significant Rows */}
              <div>
                <label
                  htmlFor="rows"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Significant Rows (optional)
                </label>
                <input
                  type="text"
                  id="rows"
                  value={significantRows}
                  onChange={(e) => setSignificantRows(e.target.value)}
                  placeholder="e.g., 1, 5, 10-20"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Row numbers or ranges to analyze closely
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!file || isUploading}
                className="w-full bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Analyze CSV'
                )}
              </button>
            </form>
            {/* Debug output (temporary) */}
            {errorMessage && (
              <div className="mt-4 text-sm text-red-600">
                {errorMessage}
              </div>
            )}
            {analysisResult && (
            <div className="mt-8 space-y-6">
              {/* High-level summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-indigo-700 uppercase tracking-wide">
                    Rows
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-indigo-900">
                    {analysisResult.row_count}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                    Columns
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-blue-900">
                    {analysisResult.column_count}
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">
                    Features detected
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-emerald-900">
                    {analysisResult.columns.length}
                  </p>
                </div>
              </div>

              {/* Columns overview table */}
              <div>
                <h2 className="text-sm font-semibold text-gray-800 mb-2">
                  Column overview
                </h2>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">
                          Type
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">
                          % Missing
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">
                          Unique values
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisResult.columns.map((col) => (
                        <tr
                          key={col.name}
                          className="border-t border-gray-100"
                        >
                          <td className="px-4 py-2 font-medium text-gray-900">
                            {col.name}
                          </td>
                          <td className="px-4 py-2 text-gray-700">
                            {col.type}
                          </td>
                          <td className="px-4 py-2 text-gray-700">
                            {col.missing_pct.toFixed(1)}%
                          </td>
                          <td className="px-4 py-2 text-gray-700">
                            {col.n_unique}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* LLM / narrative summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-sm font-semibold text-gray-800 mb-2">
                  AI summary
                </h2>

                {/* Main narrative */}
                <p className="text-sm text-gray-800 whitespace-pre-line">
                  {analysisResult.llm.dataset_summary}
                </p>

                {/* Key findings */}
                {analysisResult.llm.key_findings?.length > 0 && (
                  <div className="mt-3">
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                      Key findings
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                      {analysisResult.llm.key_findings.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Data quality issues */}
                {analysisResult.llm.data_quality_issues?.length > 0 && (
                  <div className="mt-3">
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                      Data quality issues
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                      {analysisResult.llm.data_quality_issues.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next questions */}
                {analysisResult.llm.next_questions?.length > 0 && (
                  <div className="mt-3">
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                      Next questions to explore
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                      {analysisResult.llm.next_questions.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {/* Optional: keep raw JSON for debugging */}
              <div>
                <h2 className="text-xs font-semibold text-gray-500 mb-1">
                  Raw analysis result (debug)
                </h2>
                <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto max-h-64">
                  {JSON.stringify(analysisResult, null, 2)}
                </pre>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
