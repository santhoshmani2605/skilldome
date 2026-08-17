import React, { useState, useEffect } from 'react';
import { 
  Bookmark, ChevronLeft, ChevronRight, 
  RefreshCw, Send, Play, Terminal, Cpu
} from 'lucide-react';
import { evaluateCodeWithAIAgent } from '../services/aiCodeEvaluatorService';

export default function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  userAnswer,
  onSelectOption,
  onTextAnswerChange,
  isFlagged,
  onToggleFlag,
  onPrev,
  onNext,
  onClearAnswer,
  onSubmitTest,
  isSubmitting,
  executionOutput,
  onExecutionOutputChange
}) {
  const [selectedLang, setSelectedLang] = useState('python');
  const [isRunning, setIsRunning] = useState(false);
  const [evalStage, setEvalStage] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  // Execution Evaluation Output State
  const [evaluationResult, setEvaluationResult] = useState(executionOutput || null);

  useEffect(() => {
    // Restore or reset output state when question changes
    setEvaluationResult(executionOutput || null);
    setEvalStage('');
    setCustomInput(question?.sampleInput || '');
    if (question?.sampleInput) {
      setShowCustomInput(true);
    }
    if (question && question.category) {
      const catLower = question.category.toLowerCase();
      if (catLower.includes('python')) setSelectedLang('python');
      else if (catLower.includes('c++') || catLower.includes('cpp')) setSelectedLang('cpp');
      else if (catLower.includes('java')) setSelectedLang('java');
      else if (catLower.includes('js') || catLower.includes('javascript') || catLower.includes('react') || catLower.includes('web')) setSelectedLang('javascript');
      else if (catLower.includes('sql')) setSelectedLang('sql');
      else if (catLower.includes('c#')) setSelectedLang('csharp');
      else if (catLower.includes('go') || catLower.includes('golang')) setSelectedLang('go');
      else if (catLower.includes('rust')) setSelectedLang('rust');
      else if (catLower.includes('bash') || catLower.includes('shell')) setSelectedLang('bash');
    }
  }, [question?.id, executionOutput]);



  if (!question) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No question selected or matches current filter criteria.</p>
      </div>
    );
  }

  const { id, sNo, question: questionText, category, type, isMcq, options, correctAnswer, sampleInput, marks } = question;

  // Handle Code Execution & Testing via Piston (real sandbox)
  const handleRunCode = async () => {
    if (!userAnswer || !userAnswer.trim()) return;
    setIsRunning(true);
    setEvaluationResult(null);

    setEvalStage('Analyzing syntax & code structure...');
    await new Promise(r => setTimeout(r, 120));
    setEvalStage('Evaluating test cases & algorithmic complexity...');

    const res = await evaluateCodeWithAIAgent({
      language: selectedLang,
      sourceCode: userAnswer,
      questionPrompt: questionText,
      sampleInput: customInput || sampleInput || '',
      correctAnswer: correctAnswer || '',
      marks: marks || 10
    });


    setEvaluationResult(res);
    setEvalStage('');
    setIsRunning(false);

    if (onExecutionOutputChange) {
      onExecutionOutputChange(res);
    }
  };

  const isAnswered = isMcq ? Boolean(userAnswer) : Boolean((userAnswer || '').trim());
  const cleanQuestionText = questionText.replace(/^\d+[\.\)\-\s]+\s*/, '');

  const getBadgeClass = (lvl) => {
    if (lvl === 'Basic') return 'badge-basic';
    if (lvl === 'Advance') return 'badge-advance';
    return 'badge-inter';
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '28px', minHeight: '520px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      
      {/* Question Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              color: '#fff',
              fontWeight: 800,
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}>
              Question {questionIndex + 1} of {totalQuestions}
            </span>

            <span className={`badge ${getBadgeClass(type)}`}>
              {type}
            </span>

            <span className="badge badge-mcq">
              {category}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

            <button
              onClick={onToggleFlag}
              style={{
                background: isFlagged ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: isFlagged ? '1px solid var(--accent-warning)' : '1px solid var(--border-color)',
                color: isFlagged ? 'var(--accent-warning)' : 'var(--text-muted)',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                transition: 'var(--transition)'
              }}
            >
              <Bookmark size={15} fill={isFlagged ? 'var(--accent-warning)' : 'none'} />
              <span>{isFlagged ? 'Flagged' : 'Flag for Review'}</span>
            </button>
          </div>
        </div>

        {/* Question Text */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '1.2rem',
            lineHeight: '1.6',
            fontWeight: 600,
            color: 'var(--text-main)',
            whiteSpace: 'pre-wrap'
          }}>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{questionIndex + 1}. </span>
            {cleanQuestionText}
          </h2>
        </div>

        {/* Sample Input */}
        {sampleInput && (
          <div style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '24px'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Sample Input / Context
            </span>
            <pre style={{ color: 'var(--text-main)', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{sampleInput}</pre>
          </div>
        )}

        {/* Options (For MCQ) */}
        {isMcq ? (
          <div style={{ marginBottom: '24px' }}>
            {options.map((opt) => {
              const isSelected = userAnswer === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => onSelectOption(opt.id)}
                  className={`option-card ${isSelected ? 'selected' : ''}`}
                >
                  <div className="option-badge">
                    {opt.id}
                  </div>
                  <div style={{ flex: 1, fontSize: '0.98rem', color: isSelected ? 'var(--accent-primary)' : 'var(--text-main)', fontWeight: isSelected ? 600 : 400, paddingTop: '4px' }}>
                    {opt.text}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Coding Response Box with Professional IDE Compiler Styling */
          <div style={{ marginBottom: '24px' }}>
            
            {/* Top Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>

              {/* Comprehensive Coding & Scripting Language Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <select
                  disabled={true}
                  title="Language locked for this question"
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                >
                  <optgroup label="Popular Languages">
                    <option value="python">Python 3</option>
                    <option value="javascript">JavaScript (Node 18)</option>
                    <option value="typescript">TypeScript 5</option>
                    <option value="java">Java 15</option>
                    <option value="cpp">C++ (GCC 10)</option>
                    <option value="c">C (GCC 10)</option>
                    <option value="csharp">C# (.NET 6)</option>
                  </optgroup>

                  <optgroup label="Systems & Modern">
                    <option value="go">Go (Golang 1.20)</option>
                    <option value="rust">Rust (1.68)</option>
                    <option value="kotlin">Kotlin 1.8</option>
                    <option value="swift">Swift 5.3</option>
                    <option value="dart">Dart 2.19</option>
                    <option value="scala">Scala 3</option>
                  </optgroup>

                  <optgroup label="Scripting & Shell">
                    <option value="bash">Bash / Linux Shell</option>
                    <option value="powershell">PowerShell</option>
                    <option value="python2">Python 2.7</option>
                    <option value="ruby">Ruby 3.0</option>
                    <option value="php">PHP 8.2</option>
                    <option value="perl">Perl 5.36</option>
                    <option value="lua">Lua 5.4</option>
                  </optgroup>

                  <optgroup label="Database & Data Science">
                    <option value="sql">SQL (SQLite / PostgreSQL)</option>
                    <option value="r">R Language 4.1</option>
                    <option value="julia">Julia 1.8</option>
                    <option value="haskell">Haskell 9.0</option>
                  </optgroup>
                </select>

                {/* Standard Run & Test Button */}
                <button
                  type="button"
                  onClick={handleRunCode}
                  disabled={isRunning || !userAnswer}
                  className="btn btn-primary btn-sm"
                  style={{
                    padding: '7px 18px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #4f46e5, #0284c7)',
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                    opacity: (!userAnswer || isRunning) ? 0.6 : 1
                  }}
                >
                  {isRunning ? (
                    <>
                      <div className="pulse-dot" style={{ width: '8px', height: '8px' }} />
                      <span>Compiling & Testing...</span>
                    </>
                  ) : (
                    <>
                      <Play size={14} fill="#fff" />
                      <span>Run & Test Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Professional IDE Editor & Terminal Wrapper */}
            <div style={{
              borderRadius: '12px',
              border: '1px solid #1e293b',
              background: '#0f172a',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(15, 23, 42, 0.3)'
            }}>
              
              {/* Editor Tab Chrome */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: '#1e293b',
                borderBottom: '1px solid #334155'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginRight: '12px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
                  </div>
                  <span style={{
                    fontSize: '0.8rem',
                    color: '#8b949e',
                    fontFamily: 'var(--font-code)',
                    fontWeight: 600
                  }}>
                    solution.{selectedLang === 'python' ? 'py' : selectedLang === 'java' ? 'java' : selectedLang === 'cpp' ? 'cpp' : 'js'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#8b949e', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                    UTF-8
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#58a6ff', fontWeight: 600 }}>
                    {selectedLang.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Code Textarea */}
              <textarea
                rows={11}
                value={userAnswer || ''}
                onChange={(e) => onTextAnswerChange(e.target.value)}
                placeholder={`Write your ${selectedLang.toUpperCase()} code solution here...\n\nExample:\npublic class Main {\n    public static void main(String[] args) {\n        // Your implementation here\n    }\n}`}
                style={{
                  width: '100%',
                  background: '#0f172a',
                  border: 'none',
                  padding: '20px 24px',
                  color: '#f8fafc',
                  fontFamily: 'var(--font-code), Consolas, "Fira Code", monospace',
                  fontSize: '0.96rem',
                  outline: 'none',
                  resize: 'vertical',
                  lineHeight: '1.7',
                  tabSize: 4
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = e.target.selectionStart;
                    const end = e.target.selectionEnd;
                    const val = e.target.value;
                    const newVal = val.substring(0, start) + '    ' + val.substring(end);
                    onTextAnswerChange(newVal);
                    setTimeout(() => {
                      e.target.selectionStart = e.target.selectionEnd = start + 4;
                    }, 0);
                  }
                }}
              />

              {/* Terminal Running Progress Bar */}
              {isRunning && evalStage && (
                <div style={{
                  padding: '12px 18px',
                  background: 'rgba(14, 165, 233, 0.1)',
                  borderTop: '1px solid rgba(14, 165, 233, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Cpu className="spin-slow" size={16} color="#38bdf8" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8', fontFamily: 'var(--font-code)' }}>
                    {evalStage}
                  </span>
                </div>
              )}

              {/* ===== PROFESSIONAL COMPILER TERMINAL CONSOLE ===== */}
              {evaluationResult && (
                <div style={{
                  borderTop: '1px solid #1e293b',
                  background: '#020617'
                }}>

                  {/* Terminal Tab Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: '#0f172a',
                    borderBottom: '1px solid #1e293b',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: evaluationResult.verdict === 'ACCEPTED' ? 'rgba(46, 160, 67, 0.2)' : 'rgba(248, 81, 73, 0.2)',
                        border: `1px solid ${evaluationResult.verdict === 'ACCEPTED' ? 'rgba(46, 160, 67, 0.4)' : 'rgba(248, 81, 73, 0.4)'}`,
                        color: evaluationResult.verdict === 'ACCEPTED' ? '#3fb950' : '#f85149',
                        fontSize: '0.8rem',
                        fontWeight: 700
                      }}>
                        <Terminal size={14} />
                        <span>{evaluationResult.status}</span>
                      </div>

                      {evaluationResult.timeComplexity && evaluationResult.timeComplexity !== 'N/A' && (
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#8b949e',
                          background: '#21262d',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontFamily: 'var(--font-code)'
                        }}>
                          Time: <strong style={{ color: '#58a6ff' }}>{evaluationResult.timeComplexity}</strong>
                        </span>
                      )}
                    </div>

                    {/* Removed score display */}
                  </div>

                  {/* Terminal Console Content */}
                  <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

                    {/* Compilation Errors Output */}
                    {evaluationResult.compileOutput && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f85149', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Compilation Diagnostics:
                          </span>
                        </div>
                        <pre style={{
                          background: 'rgba(248, 81, 73, 0.08)',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          color: '#ff7b72',
                          fontSize: '0.82rem',
                          fontFamily: 'Consolas, "Fira Code", monospace, var(--font-code)',
                          whiteSpace: 'pre-wrap',
                          border: '1px solid rgba(248, 81, 73, 0.25)',
                          lineHeight: '1.5'
                        }}>
                          {evaluationResult.compileOutput}
                        </pre>
                      </div>
                    )}

                    {/* Standard Output Console */}
                    {!evaluationResult.compileOutput && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Standard Output (stdout):
                          </span>
                        </div>
                        <pre style={{
                          background: '#0f172a',
                          padding: '14px 18px',
                          borderRadius: '8px',
                          color: evaluationResult.verdict === 'ACCEPTED' ? '#4ade80' : '#f8fafc',
                          fontSize: '0.9rem',
                          fontFamily: 'var(--font-code), Consolas, monospace',
                          whiteSpace: 'pre-wrap',
                          maxHeight: '140px',
                          overflowY: 'auto',
                          border: '1px solid #1e293b',
                          lineHeight: '1.6'
                        }}>
                          {evaluationResult.actualOutput || '(no standard output produced)'}
                        </pre>
                      </div>
                    )}

                    {/* Test Cases Pill Bar */}
                    {evaluationResult.testCases && evaluationResult.testCases.length > 0 && (
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8b949e', textTransform: 'uppercase', display: 'block', marginBottom: '8px', letterSpacing: '0.05em' }}>
                          Test Suite Results:
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {evaluationResult.testCases.map(tc => (
                            <div key={tc.id} style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              background: tc.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              border: `1px solid ${tc.passed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '0.9rem' }}>{tc.passed ? '✅' : '❌'}</span>
                                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc' }}>
                                  {tc.name}
                                </span>
                              </div>

                              <div style={{ fontSize: '0.82rem' }}>
                                {!tc.hidden && !tc.passed ? (
                                  <span style={{ color: '#94a3b8' }}>
                                    Expected: <code style={{ color: '#4ade80', background: '#020617', padding: '2px 6px', borderRadius: '4px', border: '1px solid #1e293b' }}>{tc.expected}</code> &nbsp;|&nbsp; 
                                    Got: <code style={{ color: '#f87171', background: '#020617', padding: '2px 6px', borderRadius: '4px', border: '1px solid #1e293b' }}>{tc.actual || '(empty)'}</code>
                                  </span>
                                ) : (
                                  <span style={{ color: tc.passed ? '#4ade80' : '#f87171', fontWeight: 600 }}>
                                    {tc.passed ? 'Passed' : 'Failed'}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Feedback / Summary */}
                    {evaluationResult.aiFeedback && (
                      <div style={{
                        padding: '14px 16px',
                        borderRadius: '8px',
                        background: '#0f172a',
                        border: '1px solid #1e293b',
                        fontSize: '0.9rem',
                        color: '#cbd5e1',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {evaluationResult.aiFeedback}
                      </div>
                    )}

                  </div>
                </div>
              )}

            </div>


          </div>
        )}

      </div>

      {/* Navigation Footer */}
      <div className="question-footer-nav" style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        paddingTop: '20px',
        borderTop: '1px solid var(--border-color)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>

        <button
          onClick={onClearAnswer}
          disabled={!isAnswered}
          className="btn btn-outline btn-sm"
          style={{ opacity: isAnswered ? 1 : 0.4 }}
        >
          <RefreshCw size={14} />
          <span>Clear Response</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onPrev}
            disabled={questionIndex === 0}
            className="btn btn-secondary"
            style={{ opacity: questionIndex === 0 ? 0.4 : 1 }}
          >
            <ChevronLeft size={18} />
            <span>Previous</span>
          </button>

          {questionIndex === totalQuestions - 1 ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={onSubmitTest}
                disabled={isSubmitting || (!isMcq && Boolean(userAnswer?.trim()) && !evaluationResult)}
                className="btn btn-success"
                style={{
                  padding: '10px 24px',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                  opacity: (isSubmitting || (!isMcq && Boolean(userAnswer?.trim()) && !evaluationResult)) ? 0.5 : 1,
                  cursor: (!isMcq && Boolean(userAnswer?.trim()) && !evaluationResult) ? 'not-allowed' : 'pointer'
                }}
                title={(!isMcq && Boolean(userAnswer?.trim()) && !evaluationResult) ? 'Please Run & Test your code before final submission.' : ''}
              >
                {isSubmitting ? (
                  <>
                    <div className="pulse-dot" style={{ width: '8px', height: '8px' }} />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Assessment</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {!isMcq && Boolean(userAnswer?.trim()) && !evaluationResult && (
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-warning)', fontWeight: 600 }}>
                  ⚠️ Run & test code to unlock Next
                </span>
              )}
              <button
                onClick={onNext}
                disabled={!isMcq && Boolean(userAnswer?.trim()) && !evaluationResult}
                className="btn btn-primary"
                style={{
                  opacity: (!isMcq && Boolean(userAnswer?.trim()) && !evaluationResult) ? 0.5 : 1,
                  cursor: (!isMcq && Boolean(userAnswer?.trim()) && !evaluationResult) ? 'not-allowed' : 'pointer'
                }}
                title={(!isMcq && Boolean(userAnswer?.trim()) && !evaluationResult) ? 'Please click "Run & Test Code" first before moving to next question.' : ''}
              >
                <span>Next</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

