'use client';

import { useState } from 'react';

export default function HmemPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [graph, setGraph] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hmem');
      const data = await res.json();
      setLogs(data.logs || []);
      setGraph(data.graphSnapshot || '');
    } catch (err) {
      setLogs(['Error running simulation']);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">HMEM Engine Simulation</h1>
      <button
        onClick={runSimulation}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Running...' : 'Run Simulation'}
      </button>

      {logs.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Execution Logs</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
            {logs.join('\n')}
          </pre>
        </div>
      )}

      {graph && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Graph Snapshot</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
            {graph}
          </pre>
        </div>
      )}
    </div>
  );
}
