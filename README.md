
# Resume Selection App

The Resume Selection App is a web application built using Angular that enables users to upload a resume and receive insights on its chances of being selected for a job based on a provided job description. The application utilizes the OpenAI GPT-3.5 Turbo model for natural language processing.

## Table of Contents
1. [Features](#features)
2. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
3. [Usage](#usage)
4. [Configuration](#configuration)

## 1. Features

- **Upload Resume:** Users can upload their resume in supported formats (PDF, DOC, DOCX).
- **Enter Job Description:** Users can provide a job description in a text input.
- **OpenAI Integration:** The app integrates with the OpenAI GPT-3.5 Turbo model to analyze resumes and provide insights.
- **Response Formatting:** The app formats the AI response with line breaks for better readability.
- **Error Handling:** Error messages are displayed to users in case of API errors or missing information.

## 2. Getting Started

Follow these instructions to get the project up and running on your local machine.

### 2.1 Prerequisites

To run this project, you need to have the following software installed:

- **Node.js:** Ensure you have Node.js installed. You can download it from the [official website](https://nodejs.org/).
- **Angular CLI:** Install the Angular CLI globally using npm:

```bash
npm install -g @angular/cli
```

### 2.2 Installation

1. clone the project on your local machine.
2. Navigate to the project directory:

```bash
cd your-repo
```

3. Install the project dependencies:

```bash
npm install
```

## 3. Usage

1. Start the Angular development server:

```bash
ng serve
```

2. The app will be accessible at http://localhost:4200/ by default.
3. Open the app in your web browser.

**Example:**
- Create a text file with a basic resume:

```
Name: XYZ Kumar
Technical Skill: Java, Angular
Total Experience: 10 Years
Date of Birth: 29 March 1991

Job Description: Total Experience - 8 Years, Technical Skill - Java, Angular
```

- Upload your resume (text file), enter the job description, enter your GPT key, and click the "Upload" button.
- Wait for the AI response. The app will display insights on the chances of your resume being selected for the job.

## 4. Configuration

You need to set up your OpenAI API key. You can create it from the [openai website](https://platform.openai.com/api-keys).
```
