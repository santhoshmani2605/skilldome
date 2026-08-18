const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbze3nrtDKPvI-OIEWB_CqpU4kFJdS_loPZBIRUSsjFt5OV1b2cgEEdDTPls3Tf8lxVCLg/exec';

async function fetchQuestions() {
  const fetchUrl = `${DEFAULT_SCRIPT_URL}?action=getQuestions`;
  try {
    const response = await fetch(fetchUrl);
    const text = await response.text();
    let rawData = JSON.parse(text);
    
    console.log("Root keys:", Object.keys(rawData));
    if (rawData.mcqs) console.log("mcqs length:", rawData.mcqs.length);
    if (rawData.coding) console.log("coding length:", rawData.coding.length);
    if (rawData.questions) {
      console.log("questions length:", rawData.questions.length);
      let missingDomainCount = 0;
      let missingCategoryCount = 0;
      rawData.questions.forEach(q => {
         if (!q.Domain && !q.domain) missingDomainCount++;
         if (!q.Category && !q.category) missingCategoryCount++;
      });
      console.log("Missing Domain:", missingDomainCount);
      console.log("Missing Category:", missingCategoryCount);
      
      // Let's find one of the missing ones
      let missingOne = rawData.questions.find(q => !q.Domain && !q.domain);
      console.log("Example missing:", JSON.stringify(missingOne, null, 2));
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

fetchQuestions();
