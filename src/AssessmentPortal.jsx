import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import TestHeader from './components/TestHeader';
import QuestionCard from './components/QuestionCard';
import QuestionPalette from './components/QuestionPalette';
import ResultSummaryModal from './components/ResultSummaryModal';
import RegistrationPage from './components/RegistrationPage';
import InterestTopicsPage from './components/InterestTopicsPage';
import ChooseTypePage from './components/ChooseTypePage';
import ProctorWarningModal from './components/ProctorWarningModal';

import { fetchQuestionsFromGoogleSheet, submitAnswersToGoogleSheet } from './services/googleSheetService';
import { evaluateCodeWithAIAgent } from './services/aiCodeEvaluatorService';


export default function App() {
  // Steps: REGISTRATION -> CONFIGURATION -> ASSESSMENT
  const [currentStep, setCurrentStep] = useState('REGISTRATION');

  const [candidateInfo, setCandidateInfo] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    batchId: '',
    interestType: ''
  });

  const [categoryConfigs, setCategoryConfigs] = useState({}); // { 'Java': 'Basic', 'Python': 'Advanced' }

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);

  // Navigation & Filtering inside assessment
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeType, setActiveType] = useState('ALL');
  const [activeSection, setActiveSection] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Assessment State
  const [userAnswers, setUserAnswers] = useState({});
  const [executionOutputs, setExecutionOutputs] = useState({});
  const [reviewFlags, setReviewFlags] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes

  // Submission guard
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Proctoring State
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

  // UI Modals
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [testResults, setTestResults] = useState(null);

  // Go to login / close after forced submit
  const handleCloseLogin = () => {
    setIsWarningModalOpen(false);
    setTabSwitchCount(0);
    setCurrentStep('REGISTRATION');
  };

  // Pre-fetch questions from Google Sheet
  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    const res = await fetchQuestionsFromGoogleSheet();
    if (res.success && res.questions.length > 0) {
      setAllQuestions(res.questions);
    } else {
      setErrorMsg(res.error || 'Failed to fetch questions from Google Apps Script Web App.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Dynamically filter categories based on selected domain ('coding' vs 'non-coding') from Google Sheet
  const availableTopics = useMemo(() => {
    if (!allQuestions.length) return [];

    const domainFilter = candidateInfo.interestType === 'coding' ? 'Coding' : 'Non-Coding';

    // Filter questions by Domain property from Google Sheet
    let matchingDomainQs = allQuestions.filter(q => {
      if (!q.domain) return true; // Fallback if Domain missing
      return q.domain.toLowerCase() === domainFilter.toLowerCase();
    });

    if (matchingDomainQs.length === 0) matchingDomainQs = allQuestions;

    const categories = Array.from(new Set(matchingDomainQs.map(q => q.category).filter(Boolean)));
    return categories;
  }, [allQuestions, candidateInfo.interestType]);

  // Step 1 -> Step 2
  const handleRegistrationNext = (info) => {
    setCandidateInfo(info);
    setCategoryConfigs({});
    setCurrentStep('CONFIGURATION');
  };

  // Hardcoded expert-level coding question (until added to Google Sheet)
  const EXPERT_CODING_QUESTION = {
    id: 'expert-coding-1',
    sNo: 'E1',
    question: `Given an array of integers, find the length of the Longest Increasing Subsequence (LIS).\n\nA subsequence is a sequence derived from the array by deleting some or no elements without changing the order of the remaining elements. An increasing subsequence is one in which each element is strictly greater than the previous one.\n\nWrite a function that takes an array of integers as input and returns the length of the longest strictly increasing subsequence.\n\nConstraints:\n• 1 ≤ n ≤ 10^5\n• -10^9 ≤ arr[i] ≤ 10^9\n\nExpected Time Complexity: O(n log n)\nExpected Space Complexity: O(n)`,
    domain: 'Coding',
    category: 'Coding',
    type: 'Expert',
    isMcq: false,
    options: [],
    correctAnswer: '4',
    sampleInput: '6\n10 9 2 5 3 7 101 18',
    marks: 10
  };

  // Step 2 Configuration -> Step 3 Assessment
  // Takes map configs: { 'Java': 'Basic', 'Python': 'Advanced', ... }
  // Picks 5 questions matching EACH category's SPECIFIC requested difficulty level
  const handleStartAssessment = (configs) => {
    setCategoryConfigs(configs);

    let finalAssessmentPool = [];
    let hasExpertCoding = false;

    Object.entries(configs).forEach(([cat, level]) => {
      // Filter questions matching category
      let catPool = allQuestions.filter(q => q.category === cat);

      // Filter by specific category difficulty level
      if (level) {
        const levelFiltered = catPool.filter(q =>
          q.type.toLowerCase() === level.toLowerCase() ||
          (level === 'Basic' && (q.type === 'Basic' || q.type === 'Easy')) ||
          (level === 'Intermediate' && (q.type === 'Intermediate' || q.type === 'Inter')) ||
          (level === 'Advanced' && (q.type === 'Advanced' || q.type === 'Advance' || q.type === 'Expert'))
        );
        if (levelFiltered.length > 0) catPool = levelFiltered;
      }

      // Check if this is an expert/advanced coding category
      if (candidateInfo.interestType === 'coding' &&
        (level === 'Advanced' || level === 'Expert')) {
        hasExpertCoding = true;
      }

      // Shuffle category pool and pick 5 random questions for this specific category and level
      const shuffledCat = [...catPool].sort(() => 0.5 - Math.random());
      const selected5ForCat = shuffledCat.slice(0, 5);
      finalAssessmentPool.push(...selected5ForCat);
    });

    // Inject the hardcoded expert coding question for coding + expert students
    if (hasExpertCoding) {
      // Check if there are any non-MCQ (coding) questions already
      const existingCodingQs = finalAssessmentPool.filter(q => !q.isMcq);
      if (existingCodingQs.length === 0) {
        // No coding questions from the sheet, inject the hardcoded one
        finalAssessmentPool.push(EXPERT_CODING_QUESTION);
      }
    }

    setQuestions(finalAssessmentPool);
    setCurrentIndex(0);
    setUserAnswers({});
    setExecutionOutputs({});
    setReviewFlags({});
    setTimeLeft(1800);
    setTabSwitchCount(0);
    setIsWarningModalOpen(false);
    setCurrentStep('ASSESSMENT');
  };

  // Timer Countdown (only during assessment)
  useEffect(() => {
    if (currentStep !== 'ASSESSMENT' || timeLeft <= 0 || isResultOpen) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStep, timeLeft, isResultOpen]);

  // ⛔ TESTING MODE: Proctoring DISABLED — say "LOCK" to re-enable
  // TODO: RE-ENABLE FOR PRODUCTION — uncomment the entire block below
  /*
  useEffect(() => {
    if (currentStep !== 'ASSESSMENT' || isResultOpen) return;

    const triggerTabSwitchWarning = () => {
      setTabSwitchCount(prev => {
        const newCount = prev + 1;
        setIsWarningModalOpen(true);
        if (newCount >= 3) {
          setTimeout(() => {
            handleSubmitTest();
          }, 600);
        }
        return newCount;
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        triggerTabSwitchWarning();
      }
    };

    const handlePreventCopy = (e) => { e.preventDefault(); };
    const handleContextMenu = (e) => { e.preventDefault(); };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handlePreventCopy);
    document.addEventListener('cut', handlePreventCopy);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handlePreventCopy);
      document.removeEventListener('cut', handlePreventCopy);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [currentStep, isResultOpen]);
  */



  // Filter questions based on secondary header controls
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      if (activeType !== 'ALL' && q.type !== activeType) return false;
      if (activeSection === 'MCQ' && !q.isMcq) return false;
      if (activeSection === 'CODING' && q.isMcq) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQuestion = q.question.toLowerCase().includes(query);
        const matchesCategory = q.category.toLowerCase().includes(query);
        const matchesId = q.id.toLowerCase().includes(query);
        if (!matchesQuestion && !matchesCategory && !matchesId) return false;
      }
      return true;
    });
  }, [questions, activeType, activeSection, searchQuery]);

  const currentQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];

  const answeredCount = useMemo(() => {
    return Object.keys(userAnswers).filter(k => Boolean(String(userAnswers[k]).trim())).length;
  }, [userAnswers]);

  const counts = useMemo(() => {
    return {
      all: questions.length,
      mcq: questions.filter(q => q.isMcq).length,
      coding: questions.filter(q => !q.isMcq).length
    };
  }, [questions]);

  const currentScoreInfo = useMemo(() => {
    let score = 0;
    let maxScore = 0;
    questions.forEach(q => {
      maxScore += q.marks;
      const uAns = (userAnswers[q.id] || '').toString().trim();
      const cAns = (q.correctAnswer || '').toString().trim();
      if (uAns && cAns) {
        if (q.isMcq) {
          if (cAns.startsWith(uAns) || uAns === cAns) score += q.marks;
        } else {
          const normU = uAns.toLowerCase().replace(/\s+/g, '');
          const normC = cAns.toLowerCase().replace(/\s+/g, '').replace(/<br>/g, '');
          if (normU === normC || normC.includes(normU)) score += q.marks;
        }
      }
    });
    return { score, maxScore };
  }, [questions, userAnswers]);

  // Handlers inside assessment
  const handleSelectOption = (optId) => {
    if (!currentQuestion) return;
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: optId }));
  };

  const handleTextAnswerChange = (val) => {
    if (!currentQuestion) return;
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: val }));
  };

  const handleClearAnswer = () => {
    if (!currentQuestion) return;
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    setReviewFlags(prev => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }));
  };

  const handleSubmitTest = async () => {
    // Prevent double submission
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const answers = await Promise.all(questions.map(async (q, idx) => {
        const answer = (userAnswers[q.id] || '').toString();
        let execOut = executionOutputs[q.id];

        // For coding questions: extract actual stdout / compilation output to store in Google Sheet Output column
        let codeOutput = '';
        if (!q.isMcq && answer.trim()) {
          if (!execOut) {
            execOut = await evaluateCodeWithAIAgent({
              language: q.category ? q.category.toLowerCase() : 'python',
              sourceCode: answer,
              questionPrompt: q.question,
              sampleInput: q.sampleInput || '',
              correctAnswer: q.correctAnswer || '',
              marks: q.marks || 10
            });
          }

          if (typeof execOut === 'object' && execOut !== null) {
            codeOutput = execOut.actualOutput || execOut.stdout || execOut.compileOutput || execOut.output || (execOut.isPassed ? 'Passed all test cases' : 'Build/Execution failed');
          } else {
            codeOutput = String(execOut || '');
          }
        }

        return {
          questionNumber: idx + 1,
          sNo: q.sNo || (idx + 1),
          qid: q.id,
          question: q.question,
          selectedAnswer: answer,
          answer: answer,
          codeOutput: codeOutput,
          actualOutput: codeOutput,
          OUTPUT: codeOutput,
          output: codeOutput,
          Output: codeOutput,
          category: q.category,
          type: q.type,
          isCoding: !q.isMcq,
          isPassed: typeof execOut === 'object' && execOut !== null ? Boolean(execOut.isPassed) : null,
          marksObtained: typeof execOut === 'object' && execOut !== null ? execOut.score : null
        };

      }));

      const userOutputs = {};
      const formattedUserAnswers = {};
      
      questions.forEach(q => {
        const out = executionOutputs[q.id];
        const outStr = out ? (typeof out === 'object' ? (out.actualOutput || out.stdout || out.compileOutput || out.output || '') : String(out)) : '';
        userOutputs[q.id] = outStr;
        
        // Google Apps Script requires userAnswers to be an object of { answer, output }
        formattedUserAnswers[q.id] = {
          code: (userAnswers[q.id] || '').toString(),
          answer: (userAnswers[q.id] || '').toString(),
          output: outStr
        };
      });

      const payload = {
        candidateName: candidateInfo.name,
        studentName: candidateInfo.name,
        name: candidateInfo.name,
        candidateEmail: candidateInfo.email,
        email: candidateInfo.email,
        password: candidateInfo.password,
        studentId: candidateInfo.studentId,
        batchId: candidateInfo.batchId,
        interestType: candidateInfo.interestType,
        categoryConfigs: JSON.stringify(categoryConfigs),
        selectedTopics: Object.keys(categoryConfigs).join(', '),
        answeredCount,
        totalQuestions: questions.length,
        answers,
        questions: answers,
        userAnswers: formattedUserAnswers,
        userOutputs,
        executionOutputs
      };

      const submitRes = await submitAnswersToGoogleSheet(payload);
      setTestResults({ syncStatus: submitRes });
      setIsResultOpen(true);

    } catch (err) {
      console.error('Submit error:', err);
      setTestResults({ syncStatus: { success: false, error: err.message } });
      setIsResultOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleRestart = () => {
    setUserAnswers({});
    setExecutionOutputs({});
    setReviewFlags({});
    setTimeLeft(1800);
    setCurrentIndex(0);
    setIsResultOpen(false);
  };

  // ========== RENDER PAGES BASED ON CURRENT STEP ==========

  // Step 1: Registration (Name, Email, Batch ID, Interest: Coding / Non-Coding)
  if (currentStep === 'REGISTRATION') {
    return (
      <RegistrationPage
        initialValues={candidateInfo}
        onNext={handleRegistrationNext}
      />
    );
  }

  // Step 2: Combined Configuration (Select Min 3 / Max 5 Categories + Per-Category Difficulty)
  if (currentStep === 'CONFIGURATION') {
    return (
      <InterestTopicsPage
        interestType={candidateInfo.interestType}
        availableTopics={availableTopics}
        allQuestions={allQuestions}
        initialSelectedCategoryConfigs={categoryConfigs}
        onStartAssessment={handleStartAssessment}
        onBack={() => setCurrentStep('REGISTRATION')}
      />
    );
  }

  // Step 3: Assessment Workspace
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Top Header */}
      <Header
        timeLeft={timeLeft}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        score={currentScoreInfo.score}
        totalPossibleMarks={currentScoreInfo.maxScore}
      />

      {/* Secondary Controls Bar */}
      <TestHeader
        activeType={activeType}
        setActiveType={setActiveType}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenPalette={() => setIsPaletteOpen(true)}
        onSubmitTest={handleSubmitTest}
        isSubmitting={isSubmitting}
        counts={counts}
      />

      {/* Main Content Workspace */}
      <main style={{ flex: 1, padding: '28px 24px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        {loading ? (
          <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
            <div className="pulse-dot" style={{ width: '20px', height: '20px', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Loading Questions...</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Fetching latest questions from the assessment bank
            </p>
          </div>
        ) : errorMsg ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderColor: 'var(--accent-danger)' }}>
            <h3 style={{ color: 'var(--accent-danger)', marginBottom: '8px' }}>Connection Error</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{errorMsg}</p>
            <button onClick={loadData} className="btn btn-primary">
              Retry Sync
            </button>
          </div>
        ) : (
          <>
            <QuestionCard
              question={currentQuestion}
              questionIndex={currentIndex}
              totalQuestions={filteredQuestions.length}
              userAnswer={currentQuestion ? userAnswers[currentQuestion.id] : ''}
              onSelectOption={handleSelectOption}
              onTextAnswerChange={handleTextAnswerChange}
              isFlagged={currentQuestion ? Boolean(reviewFlags[currentQuestion.id]) : false}
              onToggleFlag={handleToggleFlag}
              onPrev={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              onNext={() => setCurrentIndex(prev => Math.min(filteredQuestions.length - 1, prev + 1))}
              onClearAnswer={handleClearAnswer}
              onSubmitTest={handleSubmitTest}
              isSubmitting={isSubmitting}
              executionOutput={currentQuestion ? executionOutputs[currentQuestion.id] : null}
              onExecutionOutputChange={(out) => {
                if (currentQuestion) {
                  setExecutionOutputs(prev => ({ ...prev, [currentQuestion.id]: out }));
                }
              }}
            />
          </>
        )}
      </main>

      {/* Modals */}
      <ProctorWarningModal
        isOpen={isWarningModalOpen}
        warningCount={tabSwitchCount}
        maxWarnings={3}
        onDismiss={() => setIsWarningModalOpen(false)}
        onCloseLogin={handleCloseLogin}
      />

      <QuestionPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        questions={filteredQuestions}
        currentIndex={currentIndex}
        onSelectQuestion={(idx) => setCurrentIndex(idx)}
        userAnswers={userAnswers}
        reviewFlags={reviewFlags}
      />


      <ResultSummaryModal
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        results={testResults}
        onRestart={handleRestart}
      />
    </div>
  );
}
