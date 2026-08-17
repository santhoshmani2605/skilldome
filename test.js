const url = 'https://script.google.com/macros/s/AKfycbze3nrtDKPvI-OIEWB_CqpU4kFJdS_loPZBIRUSsjFt5OV1b2cgEEdDTPls3Tf8lxVCLg/exec?action=getQuestions';
fetch(url)
  .then(res => res.json())
  .then(data => {
    if (Array.isArray(data)) console.log('Sample item:', data[0]);
    else if (data && data.questions) console.log('Sample item:', data.questions[0]);
    else console.log('Data keys:', Object.keys(data));
  })
  .catch(err => {
    console.error('Error:', err);
  });
