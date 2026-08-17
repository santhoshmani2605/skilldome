import React, { useState, useEffect } from 'react';
import initSqlJs from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

export default function SqlPlayground() {
  const [db, setDb] = useState(null);
  const [query, setQuery] = useState("SELECT * FROM employees;");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize the database when the component mounts
  useEffect(() => {
    const initDB = async () => {
      try {
        // Load the SQL.js WASM file from the public folder
        const SQL = await initSqlJs({
          locateFile: () => sqlWasmUrl
        });

        // Create a fresh in-memory database
        const database = new SQL.Database();

        // Seed the database with some dummy data for the assessment
        database.run(`
          CREATE TABLE employees (id INTEGER, name TEXT, department TEXT, salary INTEGER);
          INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 90000);
          INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 60000);
          INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 85000);
          INSERT INTO employees VALUES (4, 'Diana', 'HR', 70000);
        `);

        setDb(database);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load SQL.js", err);
        setError("Failed to initialize database engine.");
        setIsLoading(false);
      }
    };

    initDB();
  }, []);

  // Execute the user's query
  const handleRunQuery = () => {
    if (!db) return;
    
    try {
      setError(null);
      
      // db.exec() returns an array of results (one object per statement)
      const res = db.exec(query);
      
      if (res.length > 0) {
        setResult(res[0]); // We take the result of the first query
      } else {
        setResult(null); // Valid query, but returns no data (e.g., an INSERT or UPDATE)
      }
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  if (isLoading) return <div style={{ padding: '20px' }}>Loading Database Engine...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>SQL Assessment Playground</h2>
      <p>Write an SQL query to find all employees in 'Engineering'.</p>

      {/* Code Editor Area */}
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={5}
        style={{ width: '100%', padding: '10px', fontFamily: 'monospace', fontSize: '16px' }}
      />
      
      <br />
      <button 
        onClick={handleRunQuery}
        style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px' }}
      >
        Run Code
      </button>

      {/* Error Message */}
      {error && (
        <div style={{ color: 'red', marginTop: '15px', padding: '10px', backgroundColor: '#fee2e2', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results Table */}
      {result && !error && (
        <div style={{ marginTop: '20px', overflowX: 'auto' }}>
          <h3>Results:</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                {result.columns.map((colName, index) => (
                  <th key={index} style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'left' }}>
                    {colName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.values.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cellValue, cellIndex) => (
                    <td key={cellIndex} style={{ border: '1px solid #d1d5db', padding: '8px' }}>
                      {cellValue}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
