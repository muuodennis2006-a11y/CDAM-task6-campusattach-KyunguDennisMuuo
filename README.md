
# CampusAttach — Student Attachment and Internship Opportunity Platform

**Developer:** Kyungu Dennis Muuo  
**Programme:** CDAM Internship  
**Project:** Task 6 — Deployment  
**Project Type:** Full-Stack Web Application  
**Status:** Deployed; improvements and troubleshooting ongoing

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Live Demo](#2-live-demo)
- [3. Project Objectives](#3-project-objectives)
- [4. Features](#4-features)
- [5. Technology Stack](#5-technology-stack)
- [6. System Architecture](#6-system-architecture)
- [7. Repository Structure](#7-repository-structure)
- [8. Local Setup and Installation](#8-local-setup-and-installation)
- [9. Deployment](#9-deployment)
- [10. Testing and Verification](#10-testing-and-verification)
- [11. Challenges and Solutions](#11-challenges-and-solutions)
- [12. Future Improvements](#12-future-improvements)
- [13. Skills Demonstrated](#13-skills-demonstrated)
- [14. Known Limitations](#14-known-limitations)
- [15. Conclusion](#15-conclusion)
- [16. Author](#16-author)

---

## 1. Project Overview

CampusAttach is a web-based platform designed to connect students with attachment and internship opportunities.

The platform provides separate portals for students and organizations. Students can explore opportunities, submit applications, and monitor application statuses. Organizations can publish opportunities and review applications submitted by students.

This project was developed as part of the CDAM internship to demonstrate practical skills in full-stack software development, database integration, API development, version control, and cloud deployment.

## 2. Live Demo

| Component | Technology / Platform | URL |
|---|---|---|
| Frontend | Angular / Vercel | [Open CampusAttach](https://cdam-task6-campusattach-kyungu-denn.vercel.app/) |
| Backend API | NestJS / Render | [Open Backend API](https://campusattach-backend.onrender.com/api) |
| API Documentation | Swagger / OpenAPI | [View API Documentation](https://campusattach-backend.onrender.com/api) |
| Source Code | GitHub | [View Repository](https://github.com/muuodennis2006-a11y/CDAM-task6-campusattach-KyunguDennisMuuo) |

> **Deployment architecture:** The Angular frontend is hosted on Vercel, while the NestJS backend API is hosted separately on Render. The backend uses Prisma ORM to communicate with PostgreSQL.

**Current status:** The application is deployed, but the organization Applicants page and dashboard statistics have experienced loading inconsistencies that are still being investigated.

## 3. Project Objectives

The main objectives of CampusAttach are to:

- Provide a central platform for discovering attachment and internship opportunities.
- Allow students to create accounts and manage their profiles.
- Enable students to submit applications and track their progress.
- Allow organizations to publish and manage opportunities.
- Help organizations review applications and update their statuses.
- Apply full-stack development skills in a real deployment environment.

## 4. Features

### 4.1 Student Portal

- Student registration and login.
- Student profile management.
- Browsing available opportunities.
- Viewing opportunity details.
- Submitting applications.
- Viewing submitted applications and their statuses.

### 4.2 Organization Portal

- Organization authentication.
- Creating and managing opportunities.
- Viewing organization opportunities.
- Reviewing student applications.
- Updating application statuses:
  - Pending
  - Shortlisted
  - Accepted
  - Rejected

**Known issue:** The Applicants page may remain on its loading message even when the related API requests return successful HTTP responses. Dashboard statistics have also shown inconsistent values during testing.

### 4.3 Backend API

- REST API developed with NestJS.
- Database integration using Prisma ORM.
- PostgreSQL database support.
- Authentication and protected endpoints.
- API documentation through Swagger / OpenAPI.

Feature availability should be verified against the current deployed application.

## 5. Technology Stack

| Category | Technology |
|---|---|
| Frontend framework | Angular |
| Frontend language | TypeScript |
| User interface | HTML and CSS |
| Backend framework | NestJS |
| Backend language | TypeScript |
| API architecture | REST |
| ORM | Prisma |
| Database | PostgreSQL |
| Version control | Git |
| Source code hosting | GitHub |
| Frontend deployment | Vercel |
| Backend deployment | Render |
| API documentation | Swagger / OpenAPI |

## 6. System Architecture

CampusAttach uses a frontend–backend architecture.

```text
                    USERS
                      |
                      v
                 Web Browser
                      |
                      v
              Angular Frontend
                   (Vercel)
                      |
                 HTTPS / REST
                      |
                      v
                NestJS Backend
                   (Render)
                      |
                      v
                  Prisma ORM
                      |
                      v
                  PostgreSQL
```

### Request Flow

1. A student or organization interacts with the Angular frontend.
2. The frontend sends HTTP requests to the NestJS backend.
3. The backend processes requests and applies the relevant business logic.
4. Prisma ORM handles database operations.
5. PostgreSQL stores and retrieves application data.
6. The backend returns responses to the frontend for display.

## 7. Repository Structure

The repository contains the frontend and backend as separate applications.

```text
CDAM-task6-campusattach-KyunguDennisMuuo/
├── campusattach-frontend/
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── ...
├── campusattach-backend/
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   ├── prisma.config.ts
│   └── ...
└── README.md
```

Each application has its own dependencies, configuration, and build process.

## 8. Local Setup and Installation

### 8.1 Prerequisites

Install the following tools:

- [Node.js and npm](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- PostgreSQL or access to a configured PostgreSQL database

### 8.2 Clone the Repository

```bash
git clone https://github.com/muuodennis2006-a11y/CDAM-task6-campusattach-KyunguDennisMuuo.git
cd CDAM-task6-campusattach-KyunguDennisMuuo
```

### 8.3 Configure the Backend

```bash
cd campusattach-backend
npm install
```

Configure the environment variables required by the backend, including the database connection string and authentication secrets.

Do not commit production credentials or `.env` files to GitHub.

Generate the Prisma client:

```bash
npx prisma generate
```

If the project's migrations are configured and the database is accessible, apply them using the appropriate migration command for the project.

For example:

```bash
npx prisma migrate deploy
```

Start the backend in development mode:

```bash
npm run start:dev
```

Check the backend configuration for the port and startup instructions used by the current version.

### 8.4 Configure the Frontend

Open a second terminal from the repository root:

```bash
cd campusattach-frontend
npm install
```

Ensure the frontend API configuration points to the correct backend URL for the environment you are using.

Start the Angular development server:

```bash
npx ng serve
```

Open the local URL shown in the terminal, commonly `http://localhost:4200`.

### 8.5 Build Verification

From the frontend directory, run:

```bash
npx ng build
```

The Angular frontend build has completed successfully during development. A successful build confirms that the frontend compiles, but it does not guarantee that every production workflow works correctly.

## 9. Deployment

### 9.1 Frontend Deployment — Vercel

The Angular frontend is deployed on Vercel.

Deployment checklist:

- Configure the frontend project root as `campusattach-frontend`.
- Set the build command and output directory according to the Angular configuration.
- Configure the production API URL to point to the Render backend.
- Deploy the latest committed code.
- Verify the live application after deployment.

### 9.2 Backend Deployment — Render

The NestJS backend is deployed on Render.

Deployment checklist:

- Configure the backend service root as `campusattach-backend`.
- Set the build and start commands according to the backend's `package.json`.
- Configure the required environment variables.
- Ensure the PostgreSQL database is reachable.
- Configure CORS to permit requests from the deployed frontend.
- Verify API responses after deployment.

### 9.3 Database Configuration

The backend uses PostgreSQL through Prisma ORM.

Database connection details and credentials must be stored in the deployment environment, not in public source code.

### 9.4 Deployment Verification

After every deployment:

1. Confirm the hosting platform reports a successful deployment.
2. Open the live frontend.
3. Check browser Console and Network tools for errors.
4. Verify that API requests return the expected data.
5. Test important student and organization workflows.

## 10. Testing and Verification

Testing should cover the frontend, backend, database integration, and deployed user workflows.

| Test Area | Expected Verification |
|---|---|
| Frontend build | Angular production build completes |
| API availability | Relevant endpoints return expected responses |
| Authentication | Users can sign in and access permitted routes |
| Opportunity management | Organizations can retrieve their opportunities |
| Student applications | Applications can be submitted and retrieved |
| Applicant management | Organizations can retrieve applications for their opportunities |
| Dashboard statistics | Counts remain consistent after refresh |
| Deployment | Frontend communicates with the production API |

### Observations During Troubleshooting

During browser testing, the opportunities endpoint and application endpoints returned HTTP 200 responses, and application data was available in the responses.

However, the Applicants page continued to display its loading message, while dashboard statistics sometimes appeared inconsistent.

This indicates that successful API responses alone have not yet resolved the issue. Further investigation is needed into the Angular component's subscriptions, response processing, state updates, and deployed JavaScript version.

## 11. Challenges and Solutions

### 11.1 Separate Frontend and Backend Deployments

**Challenge:** The frontend and backend use different hosting platforms and URLs.

**Approach:** Separate the deployment configuration and verify that the frontend communicates with the correct backend API.

**Lesson learned:** Full-stack deployment requires consistent configuration across hosting platforms, API endpoints, environment variables, and CORS settings.

### 11.2 Applicant Data Loading

**Challenge:** The Applicants page can remain in a loading state even when application endpoints return HTTP 200.

**Investigation:** Browser Network tools were used to inspect requests and response data.

**Next step:** Trace the Angular observable subscriptions, response mapping, and loading-state updates to identify why the interface does not finish loading.

### 11.3 Dashboard Statistics

**Challenge:** Dashboard values have sometimes displayed correctly and then returned to zero or appeared inconsistent after refreshing.

**Next step:** Compare displayed values with API responses, handle failed requests explicitly, and ensure that statistics are recalculated consistently.

### 11.4 Production Debugging

**Challenge:** A successful local build does not guarantee that the deployed application is functioning correctly.

**Approach:** Compare local build results, GitHub commits, deployment status, browser Network responses, and live application behaviour.

**Lesson learned:** Build verification, deployment verification, API testing, and end-to-end testing are separate activities.


## 12. Future Improvements

Although CampusAttach provides a foundation for managing student attachment and internship opportunities, several improvements are planned to make the platform smarter, more user-friendly, and more efficient.

### 12.1 AI-Powered Opportunity Recommendations

Integrate Artificial Intelligence (AI) to help students discover opportunities that match their academic background, skills, interests, and career goals.

- Recommend attachment and internship opportunities based on the student's course, skills, and qualifications.
- Help students discover relevant opportunities without relying only on manual searching and filtering.
- Provide personalised suggestions to help students identify opportunities that align with their career interests.
- Allow students to browse and filter opportunities manually whenever they prefer.
- Explain why a particular opportunity may be relevant to a student's profile.

### 12.2 CV Upload and Student Portfolio Management

Introduce a digital profile and document management system that allows students to present their qualifications and experience professionally.

- Allow students to upload, update, and manage their CVs and resumes.
- Enable students to maintain digital portfolios containing their academic background, skills, projects, certifications, achievements, and previous experience.
- Allow students to update their profiles as they gain new skills and experience.
- Enable authorised organizations to view relevant student profiles and portfolios during the recruitment process.
- Support secure document storage and appropriate access controls to protect students' personal information.

### 12.3 Organization Profiles and Company Information

Improve the platform by allowing organizations to create detailed profiles that students can view before applying.

- Display organization names, descriptions, locations, industries, and contact information where appropriate.
- Allow organizations to showcase their activities, work environments, and areas of specialization.
- Help students research organizations and understand the opportunities they offer.
- Enable organizations to manage their profiles and keep their information up to date.

### 12.4 Fully Digital Application and Attachment Process

Develop CampusAttach into a more complete digital system that reduces paperwork and makes the attachment process easier to manage.

- Allow students to submit applications and supporting documents online.
- Enable students to track application progress and receive status updates.
- Allow organizations to review applications, shortlist candidates, and accept or reject applicants through the platform.
- Provide notifications for important application updates and deadlines.
- Introduce digital communication between students and organizations where appropriate.
- Maintain application records to improve transparency, organization, and accountability.

### 12.5 Enhanced Organization Recruitment Tools

Provide organizations with better tools for identifying and managing suitable candidates.

- Allow organizations to view student profiles and portfolios relevant to their opportunities.
- Support searching and filtering candidates by course, skills, qualifications, and other relevant criteria.
- Provide a centralized dashboard for managing opportunities, reviewing applicants, and updating application statuses.
- Introduce recruitment analytics to help organizations monitor applications and recruitment progress.

### 12.6 Improved Student Dashboard and Tracking

Enhance the student dashboard to provide a clearer view of the student's attachment and internship journey.

- Display application statistics and current application statuses.
- Show recommended opportunities based on the student's profile.
- Provide reminders for application deadlines and important activities.
- Allow students to monitor their progress from application submission to placement.

### 12.7 Notifications and Communication

Introduce a notification system to improve communication between students and organizations.

- Send notifications when application statuses change.
- Notify students about relevant new opportunities and upcoming deadlines.
- Inform organizations when new applications are submitted.
- Explore email notifications and in-platform messaging.

### 12.8 Security, Privacy, and Performance

Continue improving the platform to ensure it remains reliable as more students and organizations join.

- Strengthen authentication, authorization, and role-based access controls.
- Protect uploaded CVs, student portfolios, and other sensitive documents.
- Validate uploaded files and restrict access to authorized users.
- Improve API performance, error handling, and application reliability.
- Introduce automated testing and monitoring to identify problems early.
- Ensure AI recommendations support fair opportunity discovery and do not replace an organization's recruitment decisions.

### 12.9 Future Vision

The long-term goal is to develop CampusAttach into an intelligent, secure, and fully digital platform that connects students with organizations offering attachment and internship opportunities.

By combining AI-powered recommendations, digital student portfolios, organization profiles, and online application management, CampusAttach aims to simplify the transition from academic learning to practical workplace experience.

## 13. Skills Demonstrated

This project provides practical experience in:

- Angular and TypeScript development.
- NestJS REST API development.
- PostgreSQL database integration.
- Prisma ORM.
- Frontend-to-backend communication.
- Git and GitHub version control.
- Environment-based configuration.
- Cloud deployment with Vercel and Render.
- API testing and browser debugging.
- Troubleshooting production issues.
- Technical documentation and iterative improvement.

## 14. Known Limitations

CampusAttach is an internship learning project that continues to undergo testing and improvement.

The organization Applicants page and dashboard statistics have shown inconsistent loading behaviour. These issues remain under investigation and require additional end-to-end verification.

The project should be assessed based on the features that can be demonstrated and verified in the current deployment.

## 15. Conclusion

CampusAttach demonstrates the development and deployment of a full-stack web application for managing student attachment and internship opportunities.

The project brings together Angular, NestJS, Prisma ORM, PostgreSQL, GitHub, Vercel, and Render. It has also provided practical experience in deployment configuration, API integration, debugging asynchronous requests, and validating production workflows.

The next priority is to resolve the remaining organization-side loading and statistics issues, followed by further testing, performance improvements, and enhanced reliability.

## 16. Author

**Kyungu Dennis Muuo**

CDAM Internship Project — CampusAttach

- **GitHub:** [CampusAttach Repository](https://github.com/muuodennis2006-a11y/CDAM-task6-campusattach-KyunguDennisMuuo)
- **Frontend:** [CampusAttach on Vercel](https://cdam-task6-campusattach-kyungu-denn.vercel.app/)
- **Backend:** [CampusAttach API on Render](https://campusattach-backend.onrender.com/api)