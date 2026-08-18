const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbze3nrtDKPvI-OIEWB_CqpU4kFJdS_loPZBIRUSsjFt5OV1b2cgEEdDTPls3Tf8lxVCLg/exec';
const SUBMIT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzJsGwDJtFbJ9MmJ9UyRbXswW1G4zVopf_Sw8XXjukfmHtrzD40sPh-5yLwIZi3sZitEg/exec';
const APPS_SCRIPT_URL_KEY = 'skilldome_apps_script_url';

export const getSavedAppsScriptUrl = () => {
  return DEFAULT_SCRIPT_URL;
};

export const saveAppsScriptUrl = (url) => {
  if (url) {
    localStorage.setItem(APPS_SCRIPT_URL_KEY, url.trim());
  } else {
    localStorage.removeItem(APPS_SCRIPT_URL_KEY);
  }
};

/**
 * Normalizes raw items fetched from Google Apps Script to uniform Question objects
 */
export const normalizeQuestions = (rawQuestions) => {
  if (!Array.isArray(rawQuestions)) return [];

  return rawQuestions.map((q, idx) => {
    const qid = q.QID || q.qid || q.id || `q-${idx + 1}`;
    const questionText = q.Questions || q.question || q.Question || '';
    
    let rawDomain = (q.Domain || q.domain || '').toString().trim().toLowerCase();
    let domain = '';
    if (rawDomain.includes('non')) {
      domain = 'Non-Coding';
    } else if (rawDomain.includes('coding')) {
      domain = 'Coding';
    }
    const category = q.Category || q.category || 'C++';
    const type = q.Type || q.type || 'Basic'; // Basic | Intermediate | Advanced
    const sampleInput = q.INPUT || q.input || '';
    const rawAnswer = String(q.Answer || q.answer || '').trim();

    // Check options
    const optionA = (q.A || q.a || q.optionA || '').toString().trim();
    const optionB = (q.B || q.b || q.optionB || '').toString().trim();
    const optionC = (q.C || q.c || q.optionC || '').toString().trim();
    const optionD = (q.D || q.d || q.optionD || '').toString().trim();

    const hasMcqOptions = Boolean(optionA || optionB || optionC || optionD);

    const options = [
      { id: 'A', text: optionA },
      { id: 'B', text: optionB },
      { id: 'C', text: optionC },
      { id: 'D', text: optionD }
    ].filter(o => Boolean(o.text));

    return {
      id: qid,
      sNo: q['S No'] || (idx + 1),
      question: questionText,
      domain,
      category,
      type,
      isMcq: hasMcqOptions && options.length > 0,
      options,
      correctAnswer: rawAnswer,
      sampleInput,
      marks: hasMcqOptions ? 2 : 5
    };
  }).filter(q => q.question.trim().length > 0);
};

/**
 * Fetch questions from Google Apps Script Web App
 */
export const fetchQuestionsFromGoogleSheet = async () => {
  const scriptUrl = getSavedAppsScriptUrl();

  try {
    const fetchUrl = `${scriptUrl}?action=getQuestions`;
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Verify content type before parsing as JSON
    const contentType = response.headers.get('content-type') || '';
    let rawData;
    if (contentType.includes('application/json')) {
      rawData = await response.json();
    } else {
      // Fallback to plain text handling
      const text = await response.text();
      try {
        rawData = JSON.parse(text);
      } catch (e) {
        throw new Error('Invalid JSON response from Google Apps Script');
      }
    }

    let rawList = [];

    if (Array.isArray(rawData)) {
      rawList = rawData;
    } else if (rawData && Array.isArray(rawData.data)) {
      rawList = rawData.data;
    } else if (rawData && Array.isArray(rawData.questions)) {
      rawList = rawData.questions;
    } else if (rawData && Array.isArray(rawData.mcqs)) {
      rawList = [...rawData.mcqs, ...(rawData.coding || [])];
    } else {
      throw new Error("Invalid payload format received from Apps Script");
    }

    const normalized = normalizeQuestions(rawList);

    return {
      success: true,
      scriptUrl,
      questions: normalized,
      mcqs: normalized.filter(q => q.isMcq),
      coding: normalized.filter(q => !q.isMcq)
    };
  } catch (error) {
    console.error('[GoogleSheetService] Error fetching questions:', error);
    return {
      success: false,
      error: error.message,
      scriptUrl,
      questions: [],
      mcqs: [],
      coding: []
    };
  }
};

/**
 * Submit candidate test results to Google Apps Script
 */
export const submitAnswersToGoogleSheet = async (payload) => {
  const scriptUrl = SUBMIT_SCRIPT_URL;

  try {
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    });

    return {
      success: true,
      message: 'Assessment submitted successfully to Google Sheet!'
    };
  } catch (error) {
    console.error('[GoogleSheetService] Submission Error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to record response to Google Apps Script.'
    };
  }
};

/**
 * Send OTP via Google Apps Script (Triggers MailApp on backend)
 */
export const sendOTPToGoogleSheet = async (email, otp) => {
  try {
    const payload = {
      email: email,
      otp: otp
    };

    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        message: 'OTP Sent successfully'
      };
    } else {
      throw new Error(data.message || 'Failed to send OTP');
    }
  } catch (error) {
    console.error('[OTP Service] OTP Send Error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send OTP request to backend.'
    };
  }
};
