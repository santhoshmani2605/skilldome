/**
 * Piston API Service for compiling and running code in 40+ programming languages.
 * 100% Free Public Endpoint provided by EMKC.
 */

const PISTON_API_ENDPOINTS = [
  '/api/execute',
  'https://emkc.org/api/v2/piston/execute',
  'https://piston.engineer/api/v2/execute'
];


// Map common category/language names to Piston language aliases & recommended versions
const LANGUAGE_MAP = {
  'python': { language: 'python', version: '3.10.0' },
  'python3': { language: 'python', version: '3.10.0' },
  'py': { language: 'python', version: '3.10.0' },
  'c++': { language: 'cpp', version: '10.2.0' },
  'cpp': { language: 'cpp', version: '10.2.0' },
  'c': { language: 'c', version: '10.2.0' },
  'java': { language: 'java', version: '15.0.2' },
  'javascript': { language: 'javascript', version: '18.15.0' },
  'js': { language: 'javascript', version: '18.15.0' },
  'node': { language: 'javascript', version: '18.15.0' },
  'typescript': { language: 'typescript', version: '5.0.3' },
  'ts': { language: 'typescript', version: '5.0.3' },
  'c#': { language: 'csharp', version: '6.12.0' },
  'csharp': { language: 'csharp', version: '6.12.0' },
  'go': { language: 'go', version: '1.16.2' },
  'golang': { language: 'go', version: '1.16.2' },
  'rust': { language: 'rust', version: '1.68.2' },
  'rs': { language: 'rust', version: '1.68.2' },
  'bash': { language: 'bash', version: '5.2.0' },
  'shell': { language: 'bash', version: '5.2.0' },
  'sh': { language: 'bash', version: '5.2.0' },
  'linux': { language: 'bash', version: '5.2.0' },
  'ruby': { language: 'ruby', version: '3.0.1' },
  'rb': { language: 'ruby', version: '3.0.1' },
  'php': { language: 'php', version: '8.2.3' },
  'kotlin': { language: 'kotlin', version: '1.8.20' },
  'kt': { language: 'kotlin', version: '1.8.20' },
  'swift': { language: 'swift', version: '5.3.3' },
  'perl': { language: 'perl', version: '5.36.0' },
  'r': { language: 'r', version: '4.1.1' },
  'lua': { language: 'lua', version: '5.4.4' },
  'dart': { language: 'dart', version: '2.19.6' },
  'scala': { language: 'scala', version: '3.2.2' },
  'haskell': { language: 'haskell', version: '9.0.1' },
  'sql': { language: 'sqlite3', version: '3.36.0' }
};

/**
 * Normalizes language string to Piston language object
 */
export const getPistonLanguageConfig = (langInput = 'python') => {
  const clean = String(langInput).toLowerCase().trim();
  if (LANGUAGE_MAP[clean]) return LANGUAGE_MAP[clean];
  
  // Fuzzy match
  for (const key of Object.keys(LANGUAGE_MAP)) {
    if (clean.includes(key) || key.includes(clean)) {
      return LANGUAGE_MAP[key];
    }
  }

  // Fallback default to python
  return { language: 'python', version: '3.10.0' };
};

/**
 * Executes code using Piston API
 * @param {Object} params
 * @param {string} params.language - Language name (e.g. 'python', 'cpp', 'java', 'js')
 * @param {string} params.sourceCode - The source code to compile/run
 * @param {string} [params.stdin] - Input data to feed to stdin
 */
export const executeCodeWithPiston = async ({ language = 'python', sourceCode = '', stdin = '' }) => {
  if (!sourceCode.trim()) {
    return {
      success: false,
      error: 'Please type code before running execution.'
    };
  }

  const langConfig = getPistonLanguageConfig(language);
  let fileName = 'main';
  if (langConfig.language === 'java') fileName = 'Main.java';
  else if (langConfig.language === 'python') fileName = 'main.py';
  else if (langConfig.language === 'cpp' || langConfig.language === 'c++') fileName = 'main.cpp';
  else if (langConfig.language === 'c') fileName = 'main.c';
  else if (langConfig.language === 'csharp') fileName = 'Main.cs';
  else if (langConfig.language === 'javascript') fileName = 'main.js';
  else if (langConfig.language === 'typescript') fileName = 'main.ts';

  let lastError = null;

  for (const endpoint of PISTON_API_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          language: langConfig.language,
          version: langConfig.version,
          files: [
            {
              name: fileName,
              content: sourceCode
            }
          ],
          stdin: stdin || ''
        })
      });

      if (!response.ok) {
        throw new Error(`Execution endpoint HTTP ${response.status}`);
      }

      const data = await response.json();
      const compileResult = data.compile || {};
      const runResult = data.run || {};
      
      const compileStderr = (compileResult.stderr || compileResult.output || '').trim();
      const compileExit = compileResult.code;

      const output = (runResult.output || '').trim();
      const stdout = (runResult.stdout || '').trim();
      const stderr = (runResult.stderr || '').trim();
      const exitCode = compileExit !== undefined && compileExit !== 0 ? compileExit : runResult.code;

      const finalStderr = compileStderr ? compileStderr : stderr;

      return {
        success: exitCode === 0 && !compileStderr,
        language: langConfig.language,
        output: output || (finalStderr ? `Error:\n${finalStderr}` : 'No output produced.'),
        stdout,
        stderr: finalStderr,
        exitCode
      };
    } catch (err) {
      lastError = err;
      console.warn(`[PistonService] Endpoint ${endpoint} failed:`, err.message);
    }
  }

  return {
    success: false,
    error: lastError ? lastError.message : 'All compiler endpoints unavailable.'
  };

};
