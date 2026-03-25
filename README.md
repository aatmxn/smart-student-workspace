<h1 align="center"> Smart Student Workspace </h1>

<p> 🚀 🚀 The Ultimate AI-Powered Academic Hub: Bridging JEE Preparation and Professional AI Help. </p>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)

---

## 📖 Table of Contents

- [🔭 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack & Architecture](#-tech-stack--architecture)
- [🎯 Modules Breakdown](#-modules-breakdown)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔧 Usage](#-usage)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

---

## 🔭 Overview

**Smart Student Workspace** is a full-stack web application built for JEE aspirants who need more than just notes. It brings together AI-powered doubt solving, topic-wise quizzes across Physics, Chemistry, and Mathematics, performance analytics, a Pomodoro study timer, formula flashcards, and a personal to-do manager — all under a single authenticated dashboard.

Built entirely with vanilla HTML/CSS/JS on the frontend and a Node.js + Express + MongoDB backend, with 3D animations powered by Three.js, smooth transitions via GSAP, and performance charts via Chart.js.

### Architecture Overview

The system is built upon a robust **RESTful API** architecture powered by **Express.js**. This design ensures low-latency communication between the AI analysis engine and the user interface, providing real-time documentation generation and secure authentication handling.

---

## ✨ Key Features

Smart Student Workspace is packed with features designed to maximize user productivity and documentation quality:

- 🤖 **AI-Driven Chat Interface:** Interact directly with an intelligent documentation assistant through a dedicated chat endpoint. The AI understands context and helps tailor README content to specific project needs.
- 🚀 **Automated Structure Analysis:** The system identifies repository patterns and file hierarchies to automatically populate the technical sections of your documentation, ensuring 100% accuracy in your project tree.
- 🔒 **Secure Identity Management:** Integrated authentication protocols ensure that your documentation history and project workspace remain private and accessible only to authorized users.
- ⚡ **Rapid Documentation Delivery:** What traditionally takes hours of manual writing and formatting is now reduced to seconds. Get a complete, well-structured README file in a single click.
- 📱 **Intuitive User Workspace:** A unified environment where users can track their documentation progress, view history, and manage multiple repository projects simultaneously.
- 🔍 **OCR Integration Readiness:** Prepared with backend capabilities to handle visual data processing, potentially allowing for documentation generation from screenshots or whiteboards.

---

## 🛠️ Tech Stack & Architecture

The project utilizes a curated selection of modern technologies to ensure stability, scalability, and high performance.

| Package      | Purpose                             |
| ------------ | ----------------------------------- |
| express      | Backend REST API framework          |
| mongoose     | MongoDB object modeling             |
| bcrypt       | Password hashing                    |
| jsonwebtoken | JWT generation & verification       |
| cors         | Cross-origin request handling       |
| dotenv       | Environment variable management     |
| axios        | HTTP requests to Groq API           |
| three.js     | 3D animated UI elements             |
| gsap         | Scroll & entrance animations        |
| chart.js     | Analytics & progress visualizations |

---

## 📁 Project Structure

The project is organized into a clean, modular structure following industry best practices for separating concerns between the backend logic and the frontend presentation.

```
aatmxn-smart-student-workspace-15fc358/
├── 📄 README.md                    # Core project documentation
├── 📄 .gitignore                   # Version control exclusion rules
├── 📁 .vscode/                     # Editor-specific configurations
│   └── 📄 settings.json            # VS Code workspace settings
├── 📁 backend/                     # Server-side application logic
│   ├── 📄 package.json             # Backend dependencies and scripts
│   ├── 📄 package-lock.json        # Locked dependency versions
│   ├── 📄 server.js                # Main application entry point
│   ├── 📄 debug-user.js            # Utility for debugging user accounts
│   ├── 📄 eng.traineddata          # Tesseract OCR language data
│   ├── 📁 middleware/              # Custom request handlers
│   │   └── 📄 authMiddleware.js    # JWT and session authentication logic
│   ├── 📁 models/                  # Database schema definitions
│   │   └── 📄 User.js              # User account and profile data model
│   └── 📁 routes/                  # API endpoint definitions
│       └── 📄 auth.js              # Authentication and login routes
└── 📁 frontend/                    # Client-side user interface
    ├── 📄 index.html               # Application landing page
    ├── 📄 login.html               # User authentication portal
    ├── 📄 vercel.json              # Deployment configuration for Vercel
    ├── 📁 css/                     # Visual styling assets
    │   ├── 📄 home.css             # Landing page aesthetics
    │   ├── 📄 progress.css         # Progress tracking UI styles
    │   └── 📄 style.css            # Global application styles
    ├── 📁 assets/                  # Static media files
    │   └── 📄 earth_texture.jpg    # 3D visualization textures
    ├── 📁 js/                      # Core frontend scripts
    │   ├── 📄 config.js            # Frontend environment configuration
    │   ├── 📄 earth.js             # 3D interactive elements logic
    │   ├── 📄 script.js            # Main frontend orchestrator
    │   └── 📁 pages/               # Page-specific functional logic
    │       ├── 📄 dashboard.js     # User dashboard orchestration
    │       ├── 📄 flashcards.js    # Flashcard interaction logic
    │       ├── 📄 login.js         # Login form processing
    │       ├── 📄 openAIChat.js    # AI chat interface integration
    │       ├── 📄 profile.js       # User profile management
    │       ├── 📄 progress.js      # Documentation progress tracking
    │       ├── 📄 quiz.js          # Interactive quiz functionality
    │       ├── 📄 signup.js        # New user registration logic
    │       ├── 📄 study_timer.js   # Productivity timer utility
    │       └── 📄 todo.js          # Task management logic
    └── 📁 pages/                   # HTML templates for sub-pages
        ├── 📄 dashboard.html       # Documentation management hub
        ├── 📄 flashcards.html      # Study aid interface
        ├── 📄 openAIChat.html      # AI assistant interface
        ├── 📄 profile.html         # Account settings page
        ├── 📄 progress.html        # Generation history and status
        ├── 📄 quiz.html            # Knowledge testing module
        ├── 📄 signup.html          # Registration interface
        ├── 📄 study_timer.html     # Focus sessions module
        └── 📄 todo.html            # Project task tracking interface
```

---

## 🎯 Modules Breakdown

| Module          | Description                                                 |
| --------------- | ----------------------------------------------------------- |
| **Auth**        | JWT-based registration & login, bcrypt password hashing     |
| **Dashboard**   | Central hub, animated with Three.js + GSAP                  |
| **JEE Quiz**    | Chapter-wise MCQs for Physics, Chemistry, Mathematics       |
| **Analytics**   | Chart.js graphs tracking performance over time              |
| **AI Chat**     | Groq LLaMA tutor — accepts text questions and image uploads |
| **Study Timer** | Pomodoro timer with session tracking                        |
| **Flashcards**  | Formula quick-reference cards for PCM topics                |
| **To-Do**       | Daily task planner for study goals                          |

---

## 🚀 Getting Started

To get a local instance of the Smart Student Workspace up and running, follow these implementation steps.

### Prerequisites

Before beginning, ensure you have the following installed on your local machine:

- **Node.js**: Version 16.x or higher is recommended.
- **npm**: Node Package Manager (usually bundled with Node.js).

### Installation

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/your-username/smart-student-workspace.git
    cd aatmxn-smart-student-workspace-15fc358
    ```

2.  **Install Backend Dependencies**
    Navigate to the backend directory and install the required modules.

    ```bash
    cd backend
    npm install
    ```

3.  **Start the Server**
    Initialize the Express backend to begin serving the API.

    ```bash
    node server.js
    ```

4.  **Launch the Interface**
    Since the project uses a standard HTML/JS structure, you can open `frontend/index.html` in your preferred web browser or use a live server extension.

---

## 🔧 Usage

The Smart Student Workspace operates primarily through its intelligent API. Below is the core interaction method for generating content.

### AI Chat Endpoint

The heart of the documentation engine is the `/api/ai/chat` endpoint. This allows users to send project context and receive structured documentation output.

**Endpoint:** `POST /api/ai/chat`

**Request Example:**

```json
{
  "message": "Generate a detailed README overview for a project that uses Express.js and provides an AI chat interface.",
  "context": {
    "projectName": "Smart Student Workspace",
    "techStack": ["Express", "Node.js"]
  }
}
```

**Response Example:**

```json
{
  "reply": "## Project Overview\n\nThis project is a high-performance workspace designed to...",
  "status": "success"
}
```

### Key Workflow

1.  **Authentication:** Users sign up or log in via the `auth.js` routes to establish a secure session.
2.  **Context Input:** Provide details about your GitHub repository or codebase structure.
3.  **Generation:** The AI processes the input and generates Markdown sections.
4.  **Refinement:** Use the Chat interface to ask for specific modifications or additional sections like "Installation" or "License."

---

## 🤝 Contributing

We welcome contributions to improve the Smart Student Workspace! Your input helps make this project better for students and developers worldwide.

### How to Contribute

1.  **Fork the repository** - Click the 'Fork' button at the top right of this page.
2.  **Create a feature branch**
    ```bash
    git checkout -b feature/amazing-feature
    ```
3.  **Make your changes** - Improve code, documentation, or design.
4.  **Test thoroughly** - Ensure all API endpoints and UI components function correctly.
5.  **Commit your changes** - Write clear, descriptive commit messages.
    ```bash
    git commit -m 'Add: Implementation of repository analysis logic'
    ```
6.  **Push to your branch**
    ```bash
    git push origin feature/amazing-feature
    ```
7.  **Open a Pull Request** - Submit your changes for review by the maintainers.

### Development Guidelines

- ✅ Follow the existing code style and conventions used in `server.js` and `script.js`.
- 📝 Add comments for complex logic, especially in the AI interaction handlers.
- 🧪 Ensure that any new API routes are properly documented and secured.
- 📚 Update the project tree in the README if you add new files or directories.
- 🎯 Keep your pull requests focused on a single feature or bug fix.

### Ideas for Contributions

- 🐛 **Bug Fixes:** Help us identify and squash bugs in the authentication flow.
- ✨ **New Features:** Implement more granular repository analysis templates.
- 📖 **Documentation:** Enhance the inline code comments and helper guides.
- 🎨 **UI/UX:** Improve the responsiveness of the dashboard and chat interface.

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.

### What this means:

- ✅ **Commercial use:** You can use this project commercially.
- ✅ **Modification:** You can modify the code to suit your specific needs.
- ✅ **Distribution:** You can distribute this software to others.
- ✅ **Private use:** You can use this project privately within your organization.
- ⚠️ **Liability:** The software is provided "as is", without warranty of any kind.
- ⚠️ **Trademark:** This license does not grant any trademark rights.

---
