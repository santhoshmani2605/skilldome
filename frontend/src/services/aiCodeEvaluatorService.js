// ─────────────────────────────────────────────────────────────
// 1. COMPLEXITY & CODE ANALYZER
// ─────────────────────────────────────────────────────────────
export function analyzeCodeStructure(code = '', language = 'python') {
  const cleanCode = code || '';
  const lines = cleanCode.split('\n');

  let loopDepth = 0;
  let maxLoopDepth = 0;
  let hasRecursion = false;
  let hasSorting = false;
  let hasBinarySearch = false;
  let hasTwoPointers = false;
  let hasHashMap = false;
  let hasStackQueue = false;
  let hasDP = false;

  const fnMatch = cleanCode.match(/(?:def|function|public\s+(?:static\s+)?[a-zA-Z0-9_<>[\]]+\s+|void\s+)([a-zA-Z0-9_]+)\s*\(/);
  const fnName = fnMatch ? fnMatch[1] : null;

  if (fnName && fnName !== 'main') {
    const fnRegex = new RegExp(`\\b${fnName}\\s*\\(`, 'g');
    const matches = cleanCode.match(fnRegex);
    if (matches && matches.length > 1) {
      hasRecursion = true;
    }
  }

  lines.forEach(line => {
    const trimmed = line.trim();
    if (/^(for|while)\b|\bfor\s*\(|\bwhile\s*\(/.test(trimmed)) {
      loopDepth++;
      if (loopDepth > maxLoopDepth) maxLoopDepth = loopDepth;
    }
    if (trimmed.includes('}') || (/^[a-zA-Z0-9_]/.test(trimmed) && !trimmed.startsWith('for') && !trimmed.startsWith('while'))) {
      if (loopDepth > 0 && trimmed.includes('}')) loopDepth--;
    }

    if (/\.sort\(|sorted\(|Arrays\.sort|std::sort|sort\(/i.test(trimmed)) hasSorting = true;
    if (/binary_search|bisect|lower_bound|binarySearch|mid\s*=\s*(?:left|l|low)\s*\+/i.test(trimmed)) hasBinarySearch = true;
    if (/(?:left|low|l)\s*\+\+|(?:\bright|high|r)\s*--/i.test(trimmed)) hasTwoPointers = true;
    if (/Map<|HashMap|dict\(|\bset\(|\bSet<|unordered_map|\bobj\b|\{\s*\}/i.test(trimmed)) hasHashMap = true;
    if (/Stack<|Queue<|deque|ArrayDeque|\.push\(|\.pop\(/i.test(trimmed)) hasStackQueue = true;
    if (/dp\[|memo\[|memoization|tabulation/i.test(trimmed)) hasDP = true;
  });

  let timeComplexity = 'O(1)';
  if (hasDP) {
    timeComplexity = maxLoopDepth >= 2 ? 'O(N²)' : 'O(N)';
  } else if (hasRecursion && !hasDP) {
    timeComplexity = 'O(2^N) / O(N log N)';
  } else if (hasBinarySearch && maxLoopDepth >= 1) {
    timeComplexity = 'O(N log N)';
  } else if (hasSorting) {
    timeComplexity = 'O(N log N)';
  } else if (maxLoopDepth === 1) {
    timeComplexity = 'O(N)';
  } else if (maxLoopDepth === 2) {
    timeComplexity = 'O(N²)';
  } else if (maxLoopDepth >= 3) {
    timeComplexity = 'O(N³)';
  }

  let spaceComplexity = 'O(1)';
  if (hasDP || hasHashMap || cleanCode.includes('new int[') || cleanCode.includes('new Array(') || /\[0\]\s*\*\s*n/.test(cleanCode)) {
    spaceComplexity = 'O(N)';
  } else if (hasRecursion) {
    spaceComplexity = 'O(N) (call stack)';
  }

  return {
    timeComplexity,
    spaceComplexity,
    maxLoopDepth,
    hasRecursion,
    hasSorting,
    hasBinarySearch,
    hasDP,
    hasHashMap
  };
}

// ─────────────────────────────────────────────────────────────
// 2. NORMALIZATION HELPER
// ─────────────────────────────────────────────────────────────
export function normalizeOutput(raw) {
  if (raw === null || raw === undefined) return '';
  return String(raw)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

export function compareOutput(actual, expected) {
  if (!actual && !expected) return true;
  return normalizeOutput(actual) === normalizeOutput(expected);
}

// ─────────────────────────────────────────────────────────────
// 3. SEMANTIC STATIC CODE ANALYZER (Detects syntax & symbol errors)
// ─────────────────────────────────────────────────────────────
function validateProgramSemantics(code = '', language = 'python') {
  const lang = (language || 'python').toLowerCase();
  const errors = [];

  const lines = code.split('\n');

  // Check 1: Bracket & Brace Matching
  const stack = [];
  for (let lNum = 0; lNum < lines.length; lNum++) {
    const line = lines[lNum];
    for (let col = 0; col < line.length; col++) {
      const char = line[col];
      if (char === '{' || char === '(' || char === '[') {
        stack.push({ char, line: lNum + 1, col: col + 1 });
      } else if (char === '}' || char === ')' || char === ']') {
        if (stack.length === 0) {
          errors.push(`Line ${lNum + 1}: Unexpected closing '${char}' with no matching opening delimiter.`);
          break;
        }
        const last = stack.pop();
        const matches = (last.char === '{' && char === '}') ||
                        (last.char === '(' && char === ')') ||
                        (last.char === '[' && char === ']');
        if (!matches) {
          errors.push(`Line ${lNum + 1}: Mismatched closing '${char}', expected matching for '${last.char}' from line ${last.line}.`);
          break;
        }
      }
    }
  }

  if (stack.length > 0) {
    const unclosed = stack.pop();
    errors.push(`Line ${unclosed.line}: Unclosed '${unclosed.char}' reached end of file.`);
  }

  // Check 2: Java-specific compiler checks
  if (lang.includes('java')) {
    if (!code.includes('class ')) {
      errors.push('Java syntax error: class declaration not found.');
    }
    if (!code.includes('public static void main') && !code.includes('void main')) {
      errors.push('Java runtime error: Main method not found in class. Please define public static void main(String[] args).');
    }

    // Check for undeclared variable usage in function calls e.g. findCommonElements(A, B, C); without declaring A, B, C
    const mainMatch = code.match(/main\s*\([^)]*\)\s*\{([\s\S]*?)\}/);
    if (mainMatch) {
      const mainBody = mainMatch[1];
      // Look for function invocations with identifiers
      const callMatch = mainBody.match(/([a-zA-Z0-9_]+)\s*\(([^)]+)\)/);
      if (callMatch) {
        const args = callMatch[2].split(',').map(a => a.trim());
        args.forEach(arg => {
          if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(arg) && !/^(true|false|null)$/.test(arg)) {
            // Check if declared in mainBody
            const declPattern = new RegExp(`(?:int|String|boolean|double|float|long|char|\\[\\]|List|Map|Set)\\s+(?:\\[\\]\\s+)?${arg}\\b`);
            if (!declPattern.test(mainBody) && !code.includes(`static ${arg}`) && !code.includes(`static int[] ${arg}`)) {
              errors.push(`Main.java: error: cannot find symbol\n  symbol:   variable ${arg}\n  location: class Main`);
            }
          }
        });
      }
    }
  }

  // Check 3: Python-specific checks
  if (lang.includes('python') || lang.includes('py')) {
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i].trim();
      if (/^(def|class|if|elif|else|for|while|try|except|finally)\b/.test(l) && !l.endsWith(':')) {
        errors.push(`File "main.py", line ${i + 1}: SyntaxError: expected ':' at end of statement`);
      }
    }
  }

  // Check 4: C/C++ checks
  if (lang.includes('cpp') || lang.includes('c++') || lang === 'c') {
    if (!code.includes('main(')) {
      errors.push('C/C++ link error: undefined reference to `main`');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// ─────────────────────────────────────────────────────────────
// 4. MAIN EVALUATION CONTROLLER
// ─────────────────────────────────────────────────────────────
import initSqlJs from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { executeCodeWithPiston } from './pistonService';

export const evaluateCodeWithAIAgent = async ({
  language = 'python',
  sourceCode = '',
  questionPrompt = '',
  sampleInput = '',
  correctAnswer = '',
  marks = 10
}) => {
  const lang = (language || 'python').toLowerCase();

  if (!sourceCode || !sourceCode.trim()) {
    return {
      success: false,
      isPassed: false,
      score: 0,
      maxScore: marks,
      percentage: 0,
      verdict: 'NO_CODE',
      status: 'No Code Submitted',
      language,
      actualOutput: '',
      compileOutput: '',
      testCases: [],
      timeComplexity: 'N/A',
      aiFeedback: '⚠️ Please write your code before running.'
    };
  }

  // 0. NATIVE SQL HANDLING (USING SQL.JS)
  if (lang === 'sql') {
    try {
      const SQL = await initSqlJs({
        locateFile: () => sqlWasmUrl
      });
      const db = new SQL.Database();
      
      // Setup DB Context: Use provided sampleInput (if it contains DDL) or default seed
      if (sampleInput && sampleInput.toLowerCase().includes('create table')) {
        db.run(sampleInput);
      } else {
        db.run(`
          CREATE TABLE employees (id INTEGER, name TEXT, department TEXT, salary INTEGER);
          INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 90000);
          INSERT INTO employees VALUES (2, 'Bob', 'Marketing', 60000);
          INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 85000);
          INSERT INTO employees VALUES (4, 'Diana', 'HR', 70000);
        `);
      }

      // Execute User Query
      const res = db.exec(sourceCode);
      let actualOutput = '';
      
      if (res.length > 0) {
        const columns = res[0].columns.join(' | ');
        const rows = res[0].values.map(row => row.join(' | ')).join('\\n');
        actualOutput = `${columns}\\n${'-'.repeat(columns.length)}\\n${rows}`;
      } else {
        actualOutput = 'Query executed successfully (no data returned).';
      }

      // Validate result
      const expectedClean = (correctAnswer || '').toLowerCase().replace(/\s/g, '');
      const actualClean = actualOutput.toLowerCase().replace(/\s/g, '');
      let isPassed = !correctAnswer || actualClean.includes(expectedClean) || actualOutput.includes(correctAnswer);
      
      // Fallback for descriptive answers (like "Nested subqueries with MAX and AVG...")
      if (!isPassed && correctAnswer.length > 10 && !correctAnswer.includes('|')) {
         const sqlKeywords = ['max', 'min', 'avg', 'sum', 'count', 'group by', 'order by', 'join', 'where', 'having', 'select', 'nested', 'subquery', 'subqueries'];
         const requiredKeywords = sqlKeywords.filter(kw => correctAnswer.toLowerCase().includes(kw));
         
         if (requiredKeywords.length > 0) {
            const srcLower = sourceCode.toLowerCase();
            // Pass if the source code contains the SQL keywords mentioned in the description
            // Map "nested"/"subquery" to checking for multiple SELECTs
            let matches = true;
            for (let kw of requiredKeywords) {
               if (kw === 'nested' || kw === 'subquery' || kw === 'subqueries') {
                  if (srcLower.split('select').length < 3) matches = false;
               } else if (!srcLower.includes(kw)) {
                  matches = false;
               }
            }
            if (matches) isPassed = true;
         } else if (actualOutput.includes('|')) {
            isPassed = true;
         }
      }

      return {
        success: true,
        isPassed,
        score: isPassed ? marks : 0,
        maxScore: marks,
        percentage: isPassed ? 100 : 0,
        verdict: isPassed ? 'ACCEPTED' : 'WRONG_ANSWER',
        status: isPassed ? '✅ Accepted' : '❌ Wrong Answer',
        language: 'sql',
        actualOutput,
        compileOutput: '',
        testCases: [{
          id: 1, name: 'Query Execution Check', input: sourceCode, expected: correctAnswer || '(Valid Table Output)', actual: actualOutput, passed: isPassed, hidden: false
        }],
        timeComplexity: 'N/A',
        spaceComplexity: 'N/A',
        aiFeedback: isPassed ? '### ✅ SQL Execution Passed\\n\\nYour query executed successfully and returned the expected dataset.' : '### ❌ Unexpected Result\\n\\nYour query ran successfully, but the returned dataset did not match the expected results.'
      };

    } catch (err) {
      return {
        success: false,
        isPassed: false,
        score: 0,
        maxScore: marks,
        percentage: 0,
        verdict: 'COMPILATION_ERROR',
        status: '🔴 SQL Syntax Error',
        language: 'sql',
        actualOutput: '',
        compileOutput: err.message,
        testCases: [{ id: 1, name: 'Query Syntax Check', input: sourceCode, expected: 'Valid SQL Syntax', actual: 'Syntax Error', passed: false, hidden: false }],
        timeComplexity: 'N/A',
        spaceComplexity: 'N/A',
        aiFeedback: `### 🔴 SQL Syntax Error\\n\\n\`\`\`\\n${err.message}\\n\`\`\`\\nPlease check your query syntax and try again.`
      };
    }
  }
  // 1. NON-SQL: USE PISTON TO EXECUTE ACTUAL CODE
  const pistonResult = await executeCodeWithPiston({
    language: lang,
    sourceCode,
    stdin: sampleInput
  });

  const structure = analyzeCodeStructure(sourceCode, lang);

  if (!pistonResult.success) {
    return {
      success: false,
      isPassed: false,
      score: 0,
      maxScore: marks,
      percentage: 0,
      verdict: 'COMPILATION_ERROR',
      status: '🔴 Compilation / Execution Error',
      language: lang,
      actualOutput: '',
      compileOutput: pistonResult.error || pistonResult.stderr || pistonResult.output || 'Unknown Execution Error',
      testCases: [
        {
          id: 1,
          name: 'Execution Check',
          input: sampleInput || '(Standard Test Input)',
          expected: correctAnswer || '(Expected Result)',
          actual: pistonResult.output || pistonResult.stderr || 'Error/Crash',
          passed: false,
          hidden: false
        }
      ],
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      aiFeedback: `### 🔴 Execution Error\n\n\`\`\`\n${pistonResult.error || pistonResult.stderr || pistonResult.output}\n\`\`\`\n\nPlease fix the errors above.`
    };
  }

  // 2. VALIDATE OUTPUT
  const actualOutput = pistonResult.output || '';
  const expectedClean = (correctAnswer || '').trim();
  const actualClean = actualOutput.trim();

  // We consider it passed if it exactly matches, or if actualOutput includes expectedAnswer
  const isPassed = !expectedClean || actualClean === expectedClean || actualClean.includes(expectedClean);
  
  const score = isPassed ? marks : 0;
  const percentage = Math.round((score / marks) * 100);
  const verdict = isPassed ? 'ACCEPTED' : 'WRONG_ANSWER';

  const testCases = [
    {
      id: 1,
      name: 'Sample Test Case',
      input: sampleInput || '(Standard Test Input)',
      expected: correctAnswer || '(Expected Result)',
      actual: actualOutput,
      passed: isPassed,
      hidden: false
    }
  ];

  let aiFeedback = '';
  if (isPassed) {
    aiFeedback = `### ✅ Code Evaluation Passed!\n\nYour **${lang.toUpperCase()}** program compiled cleanly, ran successfully, and passed the test cases.`;
  } else {
    aiFeedback = `### ❌ Wrong Answer\n\n- **Expected Output:** \`${correctAnswer}\`\n- **Actual Output:** \`${actualOutput}\`\n\nYour code compiled and ran, but produced incorrect results.`;
  }

  return {
    success: true,
    isPassed,
    score,
    maxScore: marks,
    percentage,
    passedTests: isPassed ? 1 : 0,
    totalTests: 1,
    verdict,
    status: isPassed ? '✅ Accepted' : '❌ Wrong Answer',
    language: lang,
    actualOutput,
    compileOutput: '',
    testCases,
    timeComplexity: isPassed ? structure.timeComplexity : 'N/A',
    spaceComplexity: isPassed ? structure.spaceComplexity : 'N/A',
    aiFeedback
  };
};

export const runCodeOnce = async ({ language, sourceCode, stdin = '' }) => {
  return evaluateCodeWithAIAgent({
    language,
    sourceCode,
    sampleInput: stdin
  });
};



