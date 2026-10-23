# CSC336 Web Technologies — Assignment 2
## Responsive & Interactive Quiz Application

**Student Information:**
- **Name:** Muhammad Sami Ullah
- **Registration No:** FA24-BSE-080
- **Class:** BSSE
- **Course:** CSC336 Web Technologies
- **Instructor:** Yasmeen Jana
- **Institution:** COMSATS University Islamabad, Vehari Campus
- **Semester:** Fall-2026

---

## 📌 Project Overview
An interactive and responsive web-based quiz application engineered with modern client-side technologies (**HTML5**, **CSS3**, and **JavaScript ES6+**), adhering strictly to the assignment specifications and visual designs.

---

## ✨ Key Features Implemented

1. **5 Randomized Multiple-Choice Questions:**
   - Dynamically selects 5 questions from a curated question bank covering HTML, CSS, JavaScript, and Web APIs.
   - Both question order and option choices are randomized on each attempt.

2. **Multi-Colored Segmented Progress Bar:**
   - 5 distinct visual segments representing progress milestones with custom colors matching the assignment requirements:
     - **Segment 1:** `#0066FF` (Blue)
     - **Segment 2:** `#00875A` (Green)
     - **Segment 3:** `#FFB800` (Yellow)
     - **Segment 4:** `#E53935` (Red)
     - **Segment 5:** `#7B4DFF` (Purple)
   - Real-time active glowing indicators and completed states.

3. **Countdown Timer:**
   - Enforces a 15-second timer per question.
   - At $\le 10$ seconds remaining, the badge dynamically shifts to an alert danger state with red styling and subtle pulse animation.
   - If time expires, the question is marked as *"Not Answered"*, the correct answer is highlighted, and options are locked.

4. **Dynamic Answer Highlighting:**
   - **Correct Answer:** Highlighted in emerald green with checkmark icon (`✓`).
   - **Incorrect Answer:** Selected wrong option highlighted in crimson red with cross icon (`✗`), while immediately showing the correct answer in green.
   - Disables all options after answering to prevent tampering.

5. **Dark & Light Mode:**
   - High-contrast, sleek modern dark theme and clean light theme.
   - Easy toggle via top-right sun/moon button with persistent preference saved in `localStorage`.

6. **Results Summary & PDF Download:**
   - Displays final score, percentage, performance message, and student credentials.
   - Detailed review table with columns: `#`, `Question`, `Your Answer`, `Correct Answer`, `Status`.
   - Built-in PDF generator (`jsPDF` + `AutoTable`) that exports `Quiz_Result.pdf` formatted exactly to the teacher's specification (`image3.png`).

---

## 📁 File Structure
```
Assignment-02/
├── index.html                 # Main HTML structure with semantic elements
├── style.css                  # Custom CSS design system, dark/light themes, animations
├── script.js                  # Quiz engine, timer, randomized bank, dynamic highlighting, PDF export
├── image1.jpeg                # COMSATS University Islamabad Logo
├── image2.png                 # Reference question screenshot from assignment
├── image3.png                 # Reference PDF screenshot from assignment
├── Quiz_Result_Downloaded.pdf # Sample generated result PDF
├── README.md                  # Project documentation
└── screenshots/               # High-resolution screenshots for report submission
    ├── screenshot_1_welcome_dark.png
    ├── screenshot_2_welcome_light.png
    ├── screenshot_3_question_active.png
    ├── screenshot_4_question_answered.png
    ├── screenshot_question5_match.png
    ├── screenshot_results_screen.png
    └── screenshot_pdf_page.png
```

---

## 🚀 How to Run
1. Double-click or open [index.html](index.html) in any modern web browser (Edge, Chrome, Firefox).
2. Or serve locally with Python:
   ```bash
   python -m http.server 8080
   ```
   and navigate to `http://localhost:8080/index.html`.
