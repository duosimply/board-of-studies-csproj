

# Board of Studies - University Course Management

## Project Overview

**Board of Studies** is a web application developed for managing university courses. It utilizes **Supabase** and **Next.js** to handle user interactions and backend operations. The application features two different authorities based on login roles:

- **Superadmin**: Has full administrative access to manage courses, syllabi, and internal updates.
- **User**: Regular users can view course structures and syllabi but cannot make changes.

The platform displays the course structures, syllabi, and internal changes implemented to the website for both administrators and users.



## Key Folders and Files

### 1. **board-of-studies**
This folder contains the main application code built with **Next.js** and integrated with **Supabase**. It provides functionalities for managing courses, syllabi, and viewing internal updates. Key features include:
- **Superadmin login** for full administrative access.
- **User login** for regular users with read-only access to courses and syllabi.
- Displays dynamic updates regarding internal changes.

### 2. **tests**
This folder includes the Selenium tests for the application. It contains 10 test cases covering the core functionalities of the **Board of Studies** website. These tests are crucial for verifying the application's stability and user experience.
- **Test cases**: Ensures all main features work correctly from the user's and superadmin's perspective.

### 3. **.gitignore**
This file contains a list of files and directories that should be ignored by Git to prevent unnecessary files from being added to the repository (e.g., node_modules, build artifacts, and sensitive information).

## Technologies Used
- **Next.js**: For building the frontend of the web application.
- **Supabase**: For database management and authentication.
- **Selenium**: For testing the functionalities of the application.

---
--- 
