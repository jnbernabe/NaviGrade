# 🎓 NaviGrade

> **Your Personal Academic Command Center**  
> *Track schedules, crush assignments, and predict your success.*

![NaviGrade App](https://img.shields.io/badge/Status-Active-success?style=flat-square) ![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square) ![React](https://img.shields.io/badge/Built%20With-React-61dafb?style=flat-square&logo=react)

---

## 📖 Overview

**NaviGrade** is a comprehensive student productivity application designed to help you stay ahead of your coursework. It moves beyond simple to-do lists by integrating course schedules, grade weighting, assignment prioritization, and final grade prediction into a single, beautiful glass-morphism interface.

This application is **stateless and serverless**, simulating a full backend experience entirely in the browser. This means you can experience all features immediately without setting up a database.

👉 **[Live Demo](https://jnbernabe.github.io/NaviGrade/)**

---

## ✨ Key Features

### 🖥️ **Command Dashboard**
The central hub for your academic life.
*   **Smart Greetings**: Welcomes you based on the time of day.
*   **Progress Tracking**: Visual progress bars showing your overall completion rates.
*   **Next Due Alerts**: Automatically highlights the assignment with the closest deadline.
*   **Quick Actions**: Send email reminders (simulated) or jump to critical tasks.

### 📚 **Course Management**
Organize your semester with ease.
*   **Dynamic Scheduling**: Add courses with specific days and times.
*   **Color Coding**: Assign unique colors to courses for quick visual identification across the app.
*   **Professor & Memo Details**: Keep tracked of who keeps you busy.

### ✅ **Assignment Tracker**
Never miss a deadline again.
*   **Priority System**: Flag assignments as Low, Medium, or High priority.
*   **Status Workflow**: Track assignments from "Not Started" to "Completed".
*   **Filter & Sort**: View assignments by course, due date, or priority.

### 📅 **Smart Calendar**
Visualize your workload.
*   **Monthly View**: See all your due dates at a glance.
*   **Interactive Events**: Click on any date to see specific assignment details.
*   **Course Integration**: Assignments are color-coded matching their parent course.

### 📈 **Grade Prediction Engine**
Stop guessing your final grade.
*   **Weighted Calculation**: Input your syllabus weights (e.g., Midterm 30%, Final 40%).
*   **Hypothetical Scenarios**: Add "What-If" assignments to see how a 95% or a 70% on the final exam affects your overall GPA.
*   **Real-time Estimates**: Calculations update instantly as you adjust numbers.

### 👤 **Student Profile**
*   **Leveling System**: Earn "Levels" based on your assignment completion rate (e.g., "Freshman" to "Scholar").
*   **Avatar Selection**: Choose from a variety of profile avatars to personalize your experience.

---

## 🛠️ Technology Stack

*   **Frontend**: React.js (v18)
*   **Styling**: Custom CSS (Glassmorphism Theme), Bootstrap 5
*   **Routing**: React Router (HashRouter)
*   **State Management**: React Context API
*   **Build Tool**: Create React App
*   **Deployment**: GitHub Pages

---

## 🚀 Getting Started

To run this project locally:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/jnbernabe/NaviGrade.git
    cd NaviGrade
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start the Application**
    ```bash
    npm start
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

4.  **Deploy to GitHub Pages**
    ```bash
    npm run deploy
    ```

---

## 🧪 Testing

We use `jest` for unit testing.
```bash
npm test
```

---

*Built with ❤️ for students, by students.*
