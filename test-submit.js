const url = 'https://script.google.com/macros/s/AKfycbzJsGwDJtFbJ9MmJ9UyRbXswW1G4zVopf_Sw8XXjukfmHtrzD40sPh-5yLwIZi3sZitEg/exec';

const payload = {
  candidateName: "Test User",
  candidateEmail: "test@example.com",
  score: 10,
  maxScore: 10,
  answeredCount: 5,
  totalQuestions: 5,
  userAnswers: { "q1": "A", "q2": "B" }
};

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain;charset=utf-8',
  },
  body: JSON.stringify(payload)
})
  .then(res => res.text())
  .then(text => console.log('Response text:', text))
  .catch(err => console.error('Fetch error:', err));