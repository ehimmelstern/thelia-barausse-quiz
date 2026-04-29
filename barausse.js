/* ── Configuration ────────────────────────────────────────────────────────────
   Edit QUESTIONS below to add your Barausse quiz content.
   Each question needs: id, question, options (array), correct (must match one option exactly).
   Edit PASS_THRESHOLD to change the pass mark percentage.
   ─────────────────────────────────────────────────────────────────────────── */

const QUIZ_TITLE = 'Barausse Knowledge Quiz';
const PASS_THRESHOLD = 80;

const QUESTIONS = [
  {
    id: 'bq1',
    question: 'What is the maximum width and height for flush aluminum hinged doors?',
    options: [
      '3ft x 11ft',
      '4ft x 12ft',
      '3ft x 13ft',
      '4ft x 14ft'
    ],
    correct: '3ft x 13ft'
  },
  {
    id: 'bq2',
    question: 'What is the maximum width and height for standard wooden hinged doors?',
    options: [
      '3ft x 10ft',
      '3ft x 11ft',
      '4ft x 10ft',
      '4ft x 11ft'
    ],
    correct: '4ft x 10ft'
  },
  {
    id: 'bq3',
    question: 'What door thicknesses are available?',
    options: [
      '1 5/8 in (41mm)',
      '1 3/4 in (45mm)',
      '2 3/8 in (60mm)',
      'All of the Above'
    ],
    correct: 'All of the Above'
  },
  {
    id: 'bq4',
    question: 'True or False: Magnetic Locks and hidden hinges are extra and you must request them?',
    options: [
      'True',
      'False'
    ],
    correct: 'False'
  },
  {
    id: 'bq5',
    question: 'True or False: Barausse offers the option to match any Benjamin Moore color?',
    options: [
      'True',
      'False',
    ],
    correct: 'True'
  },
  {
    id: 'bq6',
    question: 'True or False: Barausse doors can be fully customised in both size and finish to suit individual projects.',
    options: [
      'True',
      'False'
    ],
    correct: 'True'
  },
  {
    id: 'bq7',
    question: 'How tall can glass doors be with the TAP VVV frame?',
    options: [
      '5ft x 12ft>',
      '5ft x 13ft',
      '6ft x 12ft',
      '6ft x 13ft'
    ],
    correct: '6ft x 13ft'
  },
  {
    id: 'bq8',
    question: 'True or False: Barausse has created over 20 standard options for glass door models?',
    options: [
      'True',
      'False',
    ],
    correct: 'True'
  },
  {
    id: 'bq9',
    question: 'True or False: Barausse does NOT offer leather doors?',
    options: [
      'True',
      'False'
    ],
    correct: 'False'
  },
  {
    id: 'bq10',
    question: 'True or False: Barausse offers both single-structure leaf models and assembled leaf models?',
    options: [
      'True',
      'False',
    ],
    correct: 'True'
  }
];

/* ── State ────────────────────────────────────────────────────────────────────
   Stored in localStorage under key: quiz_progress_barausse_{email}
   ─────────────────────────────────────────────────────────────────────────── */

let state = {
  name: '',
  email: '',
  questions: [],
  answers: {},
  currentIndex: 0
};

// ── DOM refs ──────────────────────────────────────────────────────────────────

const screens = {
  start:   document.getElementById('screen-start'),
  quiz:    document.getElementById('screen-quiz'),
  results: document.getElementById('screen-results')
};

const el = {
  // start
  inputName:        document.getElementById('input-name'),
  inputEmail:       document.getElementById('input-email'),
  resumeBanner:     document.getElementById('resume-banner'),
  btnResume:        document.getElementById('btn-resume'),
  btnStartFresh:    document.getElementById('btn-start-fresh'),
  startError:       document.getElementById('start-error'),
  btnStart:         document.getElementById('btn-start'),
  // quiz
  questionCounter:  document.getElementById('question-counter'),
  progressFill:     document.getElementById('progress-fill'),
  questionText:     document.getElementById('question-text'),
  optionsList:      document.getElementById('options-list'),
  btnPrev:          document.getElementById('btn-prev'),
  btnNext:          document.getElementById('btn-next'),
  btnSaveExit:      document.getElementById('btn-save-exit'),
  // results
  resultPass:       document.getElementById('result-pass'),
  resultFail:       document.getElementById('result-fail'),
  resultPassMsg:    document.getElementById('result-pass-msg'),
  resultFailMsg:    document.getElementById('result-fail-msg'),
  ringFill:         document.getElementById('ring-fill'),
  scorePct:         document.getElementById('score-pct'),
  scoreLabel:       document.getElementById('score-label'),
  scoreCorrect:     document.getElementById('score-correct'),
  scoreTotal:       document.getElementById('score-total'),
  scoreThreshold:   document.getElementById('score-threshold'),
  certSection:      document.getElementById('cert-section'),
  btnDownloadCert:  document.getElementById('btn-download-cert'),
  btnReviewToggle:  document.getElementById('btn-review-toggle'),
  reviewToggleText: document.getElementById('review-toggle-text'),
  reviewList:       document.getElementById('review-list'),
  btnRetake:        document.getElementById('btn-retake'),
};

// ── Screen Navigation ─────────────────────────────────────────────────────────

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  try {
    window.parent.postMessage({ type: 'quiz-height', height: document.body.scrollHeight }, '*');
  } catch (_) {}
}

// ── LocalStorage Progress ─────────────────────────────────────────────────────

function progressKey(email) {
  return `quiz_progress_barausse_${email.toLowerCase().trim()}`;
}

function saveProgress() {
  if (!state.email) return;
  localStorage.setItem(progressKey(state.email), JSON.stringify({
    name: state.name,
    email: state.email,
    answers: state.answers,
    currentIndex: state.currentIndex,
    questions: state.questions
  }));
}

function loadProgress(email) {
  const raw = localStorage.getItem(progressKey(email));
  return raw ? JSON.parse(raw) : null;
}

function clearProgress(email) {
  localStorage.removeItem(progressKey(email));
}

// ── Start Screen ──────────────────────────────────────────────────────────────

el.inputEmail.addEventListener('blur', () => {
  const email = el.inputEmail.value.trim();
  if (!isValidEmail(email)) return;
  const saved = loadProgress(email);
  if (saved && Object.keys(saved.answers).length > 0) {
    el.resumeBanner.classList.remove('hidden');
  } else {
    el.resumeBanner.classList.add('hidden');
  }
});

el.inputEmail.addEventListener('input', () => {
  el.resumeBanner.classList.add('hidden');
});

el.btnResume.addEventListener('click', () => {
  const email = el.inputEmail.value.trim();
  const saved = loadProgress(email);
  if (!saved) return;
  state = { ...saved };
  el.inputName.value = state.name;
  showScreen('quiz');
  renderQuestion();
});

el.btnStartFresh.addEventListener('click', () => {
  const email = el.inputEmail.value.trim();
  clearProgress(email);
  el.resumeBanner.classList.add('hidden');
  startQuiz();
});

el.btnStart.addEventListener('click', () => {
  const name  = el.inputName.value.trim();
  const email = el.inputEmail.value.trim();

  if (!name) {
    showStartError('Please enter your full name.');
    el.inputName.classList.add('input-error');
    el.inputName.focus();
    return;
  }
  if (!isValidEmail(email)) {
    showStartError('Please enter a valid email address.');
    el.inputEmail.classList.add('input-error');
    el.inputEmail.focus();
    return;
  }

  clearStartError();
  el.inputName.classList.remove('input-error');
  el.inputEmail.classList.remove('input-error');

  const saved = loadProgress(email);
  if (saved && Object.keys(saved.answers).length > 0) {
    clearProgress(email);
  }

  startQuiz(name, email);
});

function showStartError(msg) {
  el.startError.textContent = msg;
  el.startError.classList.remove('hidden');
}

function clearStartError() {
  el.startError.classList.add('hidden');
}

function startQuiz(nameOverride, emailOverride) {
  const name  = nameOverride  || el.inputName.value.trim();
  const email = emailOverride || el.inputEmail.value.trim();

  state.name = name;
  state.email = email;
  state.questions = QUESTIONS.map(q => ({ ...q, options: [...q.options] }));
  state.answers = {};
  state.currentIndex = 0;

  saveProgress();
  showScreen('quiz');
  renderQuestion();
}

// ── Quiz Screen ───────────────────────────────────────────────────────────────

function renderQuestion() {
  const q     = state.questions[state.currentIndex];
  const total = state.questions.length;
  const idx   = state.currentIndex;

  el.questionCounter.textContent = `Question ${idx + 1} of ${total}`;
  el.progressFill.style.width = `${((idx) / total) * 100}%`;
  el.questionText.textContent = q.question;

  const optionLabels = ['A', 'B', 'C', 'D', 'E'];
  el.optionsList.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    if (state.answers[q.id] === opt) btn.classList.add('selected');

    btn.innerHTML = `
      <span class="option-label">${optionLabels[i] || i + 1}</span>
      <span class="option-text">${escapeHtml(opt)}</span>
    `;
    btn.addEventListener('click', () => selectOption(q.id, opt));
    el.optionsList.appendChild(btn);
  });

  el.btnPrev.disabled = idx === 0;
  updateNextButton();
}

function selectOption(questionId, option) {
  state.answers[questionId] = option;
  saveProgress();

  const q = state.questions[state.currentIndex];
  const optionBtns = el.optionsList.querySelectorAll('.option-btn');
  optionBtns.forEach((btn, i) => {
    const isSelected = q.options[i] === option;
    btn.classList.toggle('selected', isSelected);
    const label = btn.querySelector('.option-label');
    const optLabels = ['A', 'B', 'C', 'D', 'E'];
    label.textContent = isSelected ? '✓' : (optLabels[i] || i + 1);
  });

  updateNextButton();
}

function updateNextButton() {
  const q = state.questions[state.currentIndex];
  const answered = !!state.answers[q.id];
  el.btnNext.disabled = !answered;

  const isLast = state.currentIndex === state.questions.length - 1;
  el.btnNext.textContent = isLast ? 'Submit' : 'Next';
}

el.btnPrev.addEventListener('click', () => {
  if (state.currentIndex > 0) {
    state.currentIndex--;
    saveProgress();
    renderQuestion();
  }
});

el.btnNext.addEventListener('click', () => {
  const isLast = state.currentIndex === state.questions.length - 1;
  if (isLast) {
    gradeQuiz();
  } else {
    state.currentIndex++;
    saveProgress();
    renderQuestion();
  }
});

el.btnSaveExit.addEventListener('click', () => {
  saveProgress();
  showScreen('start');
  el.inputName.value  = state.name;
  el.inputEmail.value = state.email;
  el.resumeBanner.classList.remove('hidden');
});

// ── Grade ─────────────────────────────────────────────────────────────────────

function gradeQuiz() {
  let correct = 0;
  const breakdown = QUESTIONS.map(q => {
    const selected = state.answers[q.id] || null;
    const isCorrect = selected === q.correct;
    if (isCorrect) correct++;
    return { id: q.id, question: q.question, selected, correct: q.correct, isCorrect };
  });

  const total = QUESTIONS.length;
  const percentage = Math.round((correct / total) * 100);
  const passed = percentage >= PASS_THRESHOLD;

  clearProgress(state.email);
  showResults({ correct, total, percentage, passed, threshold: PASS_THRESHOLD, breakdown });
}

// ── Results Screen ────────────────────────────────────────────────────────────

function showResults(result) {
  const { correct, total, percentage, passed, threshold, breakdown } = result;

  showScreen('results');

  el.resultPass.classList.toggle('hidden', !passed);
  el.resultFail.classList.toggle('hidden', passed);
  el.resultPassMsg.textContent =
    `You scored ${percentage}% — above the ${threshold}% pass mark.`;
  el.resultFailMsg.textContent =
    `You scored ${percentage}% — the pass mark is ${threshold}%. Try again!`;

  el.scoreCorrect.textContent   = correct;
  el.scoreTotal.textContent     = total;
  el.scoreThreshold.textContent = `${threshold}%`;
  el.scorePct.textContent       = `${percentage}%`;

  const circumference = 314;
  const offset = circumference - (percentage / 100) * circumference;
  el.ringFill.classList.toggle('pass', passed);
  setTimeout(() => {
    el.ringFill.style.strokeDashoffset = offset;
  }, 100);

  el.certSection.classList.toggle('hidden', !passed);
  el.btnDownloadCert.onclick = () => downloadCertificate(state.name, percentage);

  el.reviewList.innerHTML = '';
  if (breakdown && breakdown.length) {
    breakdown.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = `review-item ${item.isCorrect ? 'correct' : 'incorrect'}`;

      let body = '';
      if (!item.isCorrect && item.selected) {
        body = `
          <div class="selected-ans">Your answer: <strong>${escapeHtml(item.selected)}</strong></div>
          <div class="correct-ans">Correct answer: <strong>${escapeHtml(item.correct)}</strong></div>
        `;
      } else if (!item.isCorrect && !item.selected) {
        body = `<div class="correct-ans">Not answered. Correct: <strong>${escapeHtml(item.correct)}</strong></div>`;
      }

      div.innerHTML = `
        <div class="review-item-header">
          <span class="review-icon">${item.isCorrect ? '✓' : '✗'}</span>
          <span>Q${i + 1}: ${escapeHtml(item.question)}</span>
        </div>
        ${body ? `<div class="review-item-body">${body}</div>` : ''}
      `;
      el.reviewList.appendChild(div);
    });
  }
}

el.btnReviewToggle.addEventListener('click', () => {
  const open = el.reviewList.classList.toggle('hidden');
  el.reviewToggleText.innerHTML = open
    ? 'Show Answer Review &#9660;'
    : 'Hide Answer Review &#9650;';
});

el.btnRetake.addEventListener('click', () => {
  clearProgress(state.email);
  state.answers = {};
  state.currentIndex = 0;
  showScreen('start');
});

// ── Certificate PDF ───────────────────────────────────────────────────────────

function downloadCertificate(name, percentage) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

  const W = 841.89;
  const H = 595.28;
  const pad = 40;

  // Background
  doc.setFillColor(34, 30, 28);
  doc.rect(0, 0, W, H, 'F');

  // Outer border
  doc.setDrawColor(195, 182, 171);
  doc.setLineWidth(3);
  doc.rect(pad, pad, W - pad * 2, H - pad * 2, 'S');

  // Inner border
  doc.setLineWidth(1);
  doc.rect(pad + 8, pad + 8, W - (pad + 8) * 2, H - (pad + 8) * 2, 'S');

  // Top decorative lines
  doc.setDrawColor(195, 182, 171);
  doc.setLineWidth(0.5);
  doc.line(pad + 30, pad + 40, W - pad - 30, pad + 40);
  doc.line(pad + 30, pad + 44, W - pad - 30, pad + 44);

  // "CERTIFICATE OF COMPLETION"
  doc.setTextColor(195, 182, 171);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICATE OF COMPLETION', W / 2, 125, { align: 'center' });

  // Divider
  doc.setDrawColor(195, 182, 171);
  doc.setLineWidth(1);
  doc.line(W / 2 - 120, 155, W / 2 + 120, 155);

  // "This certifies that"
  doc.setTextColor(235, 224, 212);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('This certifies that', W / 2, 182, { align: 'center' });

  // Recipient name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(40);
  doc.setFont('helvetica', 'bolditalic');
  doc.text(name, W / 2, 235, { align: 'center' });

  // Name underline
  const nameWidth = doc.getTextWidth(name);
  const nameX = (W - nameWidth) / 2;
  doc.setLineWidth(1);
  doc.setDrawColor(195, 182, 171);
  doc.line(nameX, 243, nameX + nameWidth, 243);

  // "has successfully completed"
  doc.setTextColor(235, 224, 212);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('has successfully completed', W / 2, 272, { align: 'center' });

  // Quiz title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('the Barausse Knowledge Quiz', W / 2, 305, { align: 'center' });

  // Score
  doc.setTextColor(195, 182, 171);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`with a score of  ${percentage}%`, W / 2, 345, { align: 'center' });

  // Date
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  doc.setTextColor(235, 224, 212);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Issued on ${dateStr}`, W / 2, 378, { align: 'center' });

  // Bottom decorative lines
  doc.setDrawColor(195, 182, 171);
  doc.setLineWidth(0.5);
  doc.line(pad + 30, H - pad - 44, W - pad - 30, H - pad - 44);
  doc.line(pad + 30, H - pad - 40, W - pad - 30, H - pad - 40);

  // Company name
  doc.setTextColor(195, 182, 171);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Thelia Group', W / 2, H - pad - 18, { align: 'center' });

  doc.save(`Certificate - ${name} - Barausse.pdf`);
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Iframe auto-resize ────────────────────────────────────────────────────────

const resizeObserver = new ResizeObserver(() => {
  try {
    window.parent.postMessage({ type: 'quiz-height', height: document.body.scrollHeight }, '*');
  } catch (_) {}
});
resizeObserver.observe(document.body);

// ── Init ──────────────────────────────────────────────────────────────────────

(function init() {
  const titleEl = document.getElementById('quiz-title-start');
  if (titleEl) titleEl.textContent = QUIZ_TITLE;
  showScreen('start');
})();
