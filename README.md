# E-Learning Platform

Web application for online education, built with five other students as a team project.

## My role

I worked on the frontend part of the course management. Specifically, the Courses page, course enrollment and unenrollment, and adding images to courses. I also contributed to the profile page where enrolled courses are displayed.

## User roles

Students enroll in courses, complete assignments, take tests, and track their progress. Teachers create courses, upload materials, and grade students. Administrators approve teachers and oversee the platform as a whole.

## Features

- Course management, with enrollment for students and content control for teachers
- Assignments and tests with deadlines and grading
- Certificates issued on successful course completion
- Live chat and voice communication under individual courses
- Free and premium courses, with ads on the free tier
- Czech and English language support

## Tech stack

- Frontend: React, Next.js
- Backend: Node.js, Express
- Database: PostgreSQL, MongoDB
- Auth: Firebase, OAuth
- Hosting: Vercel, AWS, DigitalOcean

## Development process

We used two-week sprints, feature branches with pull requests, and kept documentation in the repository.

## Installation

```sh
git clone https://github.com/mk-forge/e-learning-platform.git
cd e-learning-platform
npm install
npm run dev      # frontend
npm run start    # backend
```