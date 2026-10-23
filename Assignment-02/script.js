/**
 * CSC336 Web Technologies - Assignment 2
 * Interactive Quiz Application Logic
 * 
 * Student Name: Muhammad Sami Ullah
 * Registration No: FA24-BSE-080
 * Course: CSC336 Web Technologies
 * Instructor: Yasmeen Jana
 * Institution: COMSATS University Islamabad, Vehari Campus
 */

// =============================================================================
// Comprehensive Question Bank (Rich Web Technologies Content)
// =============================================================================
const QUESTION_BANK = [
    {
        question: "Which JS keyword declares a block-scoped variable?",
        options: ["const", "let", "var", "all of these"],
        correct: "let"
    },
    {
        question: "Which method selects element by ID in JavaScript?",
        options: ["getElementById()", "querySelector()", "getElement()", "selectId()"],
        correct: "getElementById()"
    },
    {
        question: "Which HTML attribute is used to link CSS?",
        options: ["rel", "src", "type", "link"],
        correct: "rel"
    },
    {
        question: "Which method removes the last element of an array?",
        options: ["pop()", "push()", "shift()", "splice()"],
        correct: "pop()"
    },
    {
        question: "Which JS array method adds element to end?",
        options: ["push()", "pop()", "unshift()", "shift()"],
        correct: "push()"
    },
    {
        question: "Which CSS property changes text color?",
        options: ["color", "font-color", "text-color", "foreground"],
        correct: "color"
    },
    {
        question: "What does HTML stand for?",
        options: [
            "HyperText Markup Language",
            "HighText Machine Language",
            "HyperTransfer Markup Language",
            "Hyperlink Text Management Language"
        ],
        correct: "HyperText Markup Language"
    },
    {
        question: "Which CSS display value enables a one-dimensional layout model?",
        options: ["flex", "grid", "block", "inline-block"],
        correct: "flex"
    },
    {
        question: "Which operator checks both value and type equality in JavaScript?",
        options: ["===", "==", "=", "!="],
        correct: "==="
    },
    {
        question: "Which HTML5 semantic element represents independent, self-contained content?",
        options: ["<article>", "<section>", "<div>", "<aside>"],
        correct: "<article>"
    },
    {
        question: "Which built-in method converts a JavaScript object into a JSON string?",
        options: ["JSON.stringify()", "JSON.parse()", "Object.toJSON()", "String.fromJSON()"],
        correct: "JSON.stringify()"
    },
    {
        question: "Which CSS property controls the inner spacing between content and border?",
        options: ["padding", "margin", "border-spacing", "outline"],
        correct: "padding"
    },
    {
        question: "How do you select all elements with class 'highlight' in CSS?",
        options: [".highlight", "#highlight", "*highlight", "highlight"],
        correct: ".highlight"
    },
    {
        question: "Which event occurs when a user clicks on an HTML element?",
        options: ["onclick", "onchange", "onhover", "onfocus"],
        correct: "onclick"
    },
    {
        question: "What is the default position value of an HTML element in CSS?",
        options: ["static", "relative", "absolute", "fixed"],
        correct: "static"
    }
];

// =============================================================================
// Application State
// =============================================================================
const QUIZ_CONFIG = {
    totalQuestions: 5,
    secondsPerQuestion: 15,
    candidateName: "Muhammad Sami Ullah",
    candidateReg: "FA24-BSE-080",
    courseCode: "CSC336 Web Technologies",
    instructor: "Yasmeen Jana",
    institution: "COMSATS University Islamabad, Vehari Campus"
};

let currentQuestionIndex = 0;
let score = 0;
let quizQuestions = [];
let userAnswers = []; // Records: { question, userAnswer, correctAnswer, isCorrect }
let timerInterval = null;
let timeLeft = QUIZ_CONFIG.secondsPerQuestion;
let isAnswerLocked = false;

// =============================================================================
// DOM Elements
// =============================================================================
const themeToggleBtn = document.getElementById("theme-toggle");

const startScreen = document.getElementById("start-screen");
const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const downloadPdfBtn = document.getElementById("download-pdf-btn");

const currentQuestionNumEl = document.getElementById("current-question-num");
const totalQuestionsNumEl = document.getElementById("total-questions-num");
const timerBadge = document.getElementById("timer-badge");
const timeLeftEl = document.getElementById("time-left");
const questionTextEl = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const feedbackAlert = document.getElementById("feedback-alert");
const feedbackIcon = document.getElementById("feedback-icon");
const feedbackMessage = document.getElementById("feedback-message");
const qStatusHint = document.getElementById("q-status-hint");

const segmentedBarEl = document.getElementById("segmented-bar");
const progressSegments = document.querySelectorAll(".progress-segment");

const finalScoreEl = document.getElementById("final-score");
const finalPercentageEl = document.getElementById("final-percentage");
const resultFeedbackText = document.getElementById("result-feedback-text");
const resultTableBody = document.getElementById("result-table-body");

// =============================================================================
// Initialization & Theme Handling
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    setupEventListeners();
});

function initTheme() {
    const savedTheme = localStorage.getItem("quiz_app_theme") || "dark";
    if (savedTheme === "light") {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
    } else {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
    }
}

function toggleTheme() {
    if (document.body.classList.contains("dark-theme")) {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        localStorage.setItem("quiz_app_theme", "light");
    } else {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
        localStorage.setItem("quiz_app_theme", "dark");
    }
}

function setupEventListeners() {
    themeToggleBtn.addEventListener("click", toggleTheme);
    startBtn.addEventListener("click", startQuiz);
    nextBtn.addEventListener("click", handleNextQuestion);
    restartBtn.addEventListener("click", restartQuiz);
    downloadPdfBtn.addEventListener("click", downloadResultPDF);
}

// =============================================================================
// Quiz Flow Logic
// =============================================================================

/**
 * Randomly pick N questions and shuffle their options
 */
function getRandomQuestions(num) {
    // Fisher-Yates shuffle on copy
    const shuffledPool = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
    const selected = shuffledPool.slice(0, num);

    return selected.map(item => {
        // Clone and shuffle options
        const shuffledOptions = [...item.options].sort(() => 0.5 - Math.random());
        return {
            question: item.question,
            options: shuffledOptions,
            correct: item.correct
        };
    });
}

function startQuiz() {
    // Reset state
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    quizQuestions = getRandomQuestions(QUIZ_CONFIG.totalQuestions);

    // Switch views
    startScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    questionScreen.classList.remove("hidden");

    totalQuestionsNumEl.textContent = QUIZ_CONFIG.totalQuestions;

    // Load first question
    loadQuestion(currentQuestionIndex);
}

function loadQuestion(index) {
    if (index >= quizQuestions.length) {
        showResults();
        return;
    }

    const qData = quizQuestions[index];
    isAnswerLocked = false;

    // Update Question Counter
    currentQuestionNumEl.textContent = index + 1;
    totalQuestionsNumEl.textContent = quizQuestions.length;

    // Update Progress Segments
    updateProgressBar(index);

    // Update Question text
    questionTextEl.textContent = qData.question;

    // Reset Options
    optionsContainer.innerHTML = "";
    const letters = ["A", "B", "C", "D"];

    qData.options.forEach((optText, i) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.setAttribute("role", "radio");
        btn.setAttribute("aria-checked", "false");
        btn.dataset.option = optText;

        btn.innerHTML = `
            <div class="option-content">
                <span class="option-letter">${letters[i] || (i + 1)}</span>
                <span class="option-text">${escapeHtml(optText)}</span>
            </div>
            <i class="option-icon bi"></i>
        `;

        btn.addEventListener("click", () => handleOptionSelect(optText, btn));
        optionsContainer.appendChild(btn);
    });

    // Reset Feedback and Next button
    feedbackAlert.className = "feedback-banner hidden";
    qStatusHint.innerHTML = `<i class="bi bi-info-circle"></i> Select an option to proceed`;
    nextBtn.disabled = true;
    nextBtn.querySelector("#next-btn-text").textContent = (index === quizQuestions.length - 1) ? "Finish Quiz" : "Next";

    // Start Countdown Timer
    startTimer();
}

// =============================================================================
// Countdown Timer Logic
// =============================================================================
function startTimer() {
    clearInterval(timerInterval);
    timeLeft = QUIZ_CONFIG.secondsPerQuestion;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeOut();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timeLeftEl.textContent = timeLeft;

    timerBadge.classList.remove("warning", "danger");
    if (timeLeft <= 5) {
        timerBadge.classList.add("danger");
    } else if (timeLeft <= 10) {
        timerBadge.classList.add("danger"); // Matches "Time Left: 10s" in red from Assignment Image 2
    }
}

function handleTimeOut() {
    if (isAnswerLocked) return;
    isAnswerLocked = true;

    const currentQ = quizQuestions[currentQuestionIndex];

    // Record as timeout / not answered
    userAnswers.push({
        questionNumber: currentQuestionIndex + 1,
        question: currentQ.question,
        userAnswer: "Not Answered",
        correctAnswer: currentQ.correct,
        isCorrect: false
    });

    // Dynamically highlight the correct answer in green
    highlightAnswers(null, currentQ.correct);

    // Show timeout alert
    feedbackAlert.className = "feedback-banner timeout";
    feedbackIcon.className = "feedback-icon bi bi-exclamation-triangle-fill";
    feedbackMessage.textContent = `Time's up! The correct answer was "${currentQ.correct}".`;
    feedbackAlert.classList.remove("hidden");

    qStatusHint.innerHTML = `<span class="text-danger"><i class="bi bi-clock"></i> Timed out</span>`;
    nextBtn.disabled = false;
}

// =============================================================================
// Answer Selection & Dynamic Highlighting
// =============================================================================
function handleOptionSelect(selectedOption, selectedBtn) {
    if (isAnswerLocked) return;
    isAnswerLocked = true;

    // Stop timer immediately
    clearInterval(timerInterval);

    const currentQ = quizQuestions[currentQuestionIndex];
    const isCorrect = (selectedOption === currentQ.correct);

    if (isCorrect) {
        score++;
    }

    // Save record
    userAnswers.push({
        questionNumber: currentQuestionIndex + 1,
        question: currentQ.question,
        userAnswer: selectedOption,
        correctAnswer: currentQ.correct,
        isCorrect: isCorrect
    });

    // Highlight options dynamically
    highlightAnswers(selectedOption, currentQ.correct);

    // Show Feedback Alert
    if (isCorrect) {
        feedbackAlert.className = "feedback-banner correct";
        feedbackIcon.className = "feedback-icon bi bi-check-circle-fill";
        feedbackMessage.textContent = "Excellent! Correct answer.";
        qStatusHint.innerHTML = `<span style="color: var(--seg-green); font-weight:700;"><i class="bi bi-check-circle"></i> Correct</span>`;
    } else {
        feedbackAlert.className = "feedback-banner incorrect";
        feedbackIcon.className = "feedback-icon bi bi-x-circle-fill";
        feedbackMessage.textContent = `Incorrect! The correct answer is "${currentQ.correct}".`;
        qStatusHint.innerHTML = `<span style="color: var(--seg-red); font-weight:700;"><i class="bi bi-x-circle"></i> Incorrect</span>`;
    }
    feedbackAlert.classList.remove("hidden");

    // Enable Next button
    nextBtn.disabled = false;
}

/**
 * Highlights correct answer green and selected incorrect red
 */
function highlightAnswers(selectedOption, correctOption) {
    const allButtons = optionsContainer.querySelectorAll(".option-btn");

    allButtons.forEach(btn => {
        btn.disabled = true;
        const optVal = btn.dataset.option;
        const icon = btn.querySelector(".option-icon");

        if (optVal === correctOption) {
            btn.classList.add("correct");
            icon.className = "option-icon bi bi-check-circle-fill";
        } else if (optVal === selectedOption && selectedOption !== correctOption) {
            btn.classList.add("incorrect");
            icon.className = "option-icon bi bi-x-circle-fill";
        }
    });
}

function handleNextQuestion() {
    clearInterval(timerInterval);
    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
        loadQuestion(currentQuestionIndex);
    } else {
        showResults();
    }
}

// =============================================================================
// Multi-colored Segmented Progress Bar Logic
// =============================================================================
function updateProgressBar(activeIdx) {
    progressSegments.forEach((segment, idx) => {
        segment.classList.remove("active", "completed");

        if (idx < activeIdx) {
            segment.classList.add("completed");
        } else if (idx === activeIdx) {
            segment.classList.add("active");
        }
    });
}

function completeAllSegments() {
    progressSegments.forEach(segment => {
        segment.classList.remove("active");
        segment.classList.add("completed");
    });
}

// =============================================================================
// Results View & Breakdown Table
// =============================================================================
function showResults() {
    clearInterval(timerInterval);
    completeAllSegments();

    questionScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    // Calculate score & percentage
    const total = quizQuestions.length;
    const percentage = Math.round((score / total) * 100);

    finalScoreEl.textContent = `${score} / ${total}`;
    finalPercentageEl.textContent = `${percentage}%`;

    // Dynamic feedback message based on score
    if (percentage === 100) {
        resultFeedbackText.textContent = "Flawless Performance! You scored full marks in Web Technologies!";
        triggerConfetti();
    } else if (percentage >= 80) {
        resultFeedbackText.textContent = "Outstanding Achievement! You have an excellent grasp of Web Technologies.";
        triggerConfetti();
    } else if (percentage >= 60) {
        resultFeedbackText.textContent = "Great job! A solid score with good conceptual understanding.";
        triggerConfetti();
    } else {
        resultFeedbackText.textContent = "Keep learning and practicing! Review your errors below.";
    }

    // Populate Detailed Answer Sheet (Matches Image 3)
    resultTableBody.innerHTML = "";

    userAnswers.forEach((record, i) => {
        const row = document.createElement("tr");

        const isAnswered = record.userAnswer !== "Not Answered";
        const answerDisplay = isAnswered 
            ? escapeHtml(record.userAnswer)
            : `<span class="not-answered">Not Answered</span>`;

        const statusBadge = record.isCorrect
            ? `<span class="status-badge correct">Correct</span>`
            : `<span class="status-badge incorrect">Incorrect</span>`;

        row.innerHTML = `
            <td class="col-num">${i + 1}</td>
            <td class="col-q">${escapeHtml(record.question)}</td>
            <td class="col-user">${answerDisplay}</td>
            <td class="col-correct">${escapeHtml(record.correctAnswer)}</td>
            <td class="col-status">${statusBadge}</td>
        `;

        resultTableBody.appendChild(row);
    });
}

function restartQuiz() {
    progressSegments.forEach(segment => {
        segment.classList.remove("active", "completed");
    });
    startQuiz();
}

function triggerConfetti() {
    if (typeof confetti === "function") {
        confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

// =============================================================================
// PDF Generation (Exact Match to Assignment Image 3 Specification)
// =============================================================================
function downloadResultPDF() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert("PDF generator library is loading. Please check your internet connection.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;

    // Header Title: "Quiz Result" (Matches Image 3 font style & size)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(24, 24, 27);
    doc.text("Quiz Result", margin, 60);

    // Score: "Score: 3 / 5"
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text(`Score: ${score} / ${quizQuestions.length}`, margin, 95);

    // Prepare Table Data (Exactly matching columns from Image 3: #, Question, Your Answer, Correct Answer, Status)
    const tableHeaders = [["#", "Question", "Your Answer", "Correct Answer", "Status"]];
    const tableBody = userAnswers.map((item, idx) => [
        (idx + 1).toString(),
        item.question,
        item.userAnswer,
        item.correctAnswer,
        item.isCorrect ? "Correct" : "Incorrect"
    ]);

    // Render Table using jsPDF-AutoTable
    doc.autoTable({
        head: tableHeaders,
        body: tableBody,
        startY: 125,
        margin: { left: margin, right: margin },
        theme: "plain",
        headStyles: {
            fillColor: [226, 232, 240], // Light grey background #e2e8f0 from Image 3
            textColor: [15, 23, 42],
            fontStyle: "bold",
            fontSize: 10,
            cellPadding: 8
        },
        bodyStyles: {
            fontSize: 9.5,
            textColor: [30, 41, 59],
            cellPadding: 8,
            lineColor: [226, 232, 240],
            lineWidth: 0.5
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252]
        },
        columnStyles: {
            0: { cellWidth: 26, halign: "center" },
            1: { cellWidth: "auto" },
            2: { cellWidth: 95 },
            3: { cellWidth: 95 },
            4: { cellWidth: 70, halign: "center", fontStyle: "bold" }
        },
        didParseCell: function(data) {
            // Apply Red/Green Status Cell Color exactly matching Image 3
            if (data.section === "body" && data.column.index === 4) {
                const cellText = data.cell.raw;
                if (cellText === "Correct") {
                    data.cell.styles.fillColor = [0, 135, 90]; // Green #00875a
                    data.cell.styles.textColor = [255, 255, 255];
                } else {
                    data.cell.styles.fillColor = [229, 57, 53]; // Red #e53935
                    data.cell.styles.textColor = [255, 255, 255];
                }
            }
        }
    });

    // Save and download PDF file
    doc.save("Quiz_Result.pdf");
}

// Utility function to escape HTML entities
function escapeHtml(text) {
    if (!text) return "";
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
