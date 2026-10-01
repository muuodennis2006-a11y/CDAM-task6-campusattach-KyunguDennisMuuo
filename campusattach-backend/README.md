# CampusAttach — Task 5: Database Integration

## 1. Project Overview

**CampusAttach** is a student attachment and internship opportunity platform designed to connect students with organizations offering practical attachment and internship opportunities.

The system supports three main user roles:

* **Student**
* **Organization**
* **Admin**

Task 5 focuses on integrating the CampusAttach backend with a persistent PostgreSQL database using Prisma ORM.

---

## 2. Technology Stack

| Technology      | Purpose                       |
| --------------- | ----------------------------- |
| NestJS          | Backend framework             |
| TypeScript      | Backend programming language  |
| PostgreSQL 17   | Relational database           |
| Prisma 7.10.0   | ORM and database access       |
| JWT             | Authentication                |
| bcrypt          | Password hashing              |
| Passport        | Authentication strategy       |
| Swagger/OpenAPI | API documentation and testing |
| Git/GitHub      | Version control               |

---

## 3. Database Architecture

CampusAttach uses a relational PostgreSQL database.

The main database entities are:

```text
User
 ├── StudentProfile
 └── Organization

Organization
 └── Opportunity

StudentProfile
 └── Application

Opportunity
 └── Application
```

The database structure is managed through Prisma.

---

## 4. Database Entities

### User

Stores authentication and account information.

Main fields include:

* `id`
* `fullName`
* `email`
* `passwordHash`
* `role`
* `isActive`
* `createdAt`
* `updatedAt`

---

### StudentProfile

Stores additional student information.

Main fields include:

* `id`
* `userId`
* `university`
* `course`
* `yearOfStudy`
* `phone`
* `skills`
* `bio`

---

### Organization

Stores organization information.

Main fields include:

* `id`
* `userId`
* `name`
* `description`
* `location`
* `phone`
* `website`

---

### Opportunity

Stores attachment and internship opportunities.

Main fields include:

* `id`
* `organizationId`
* `title`
* `type`
* `location`
* `description`
* `requirements`
* `deadline`
* `status`
* `postedDate`
* `createdAt`
* `updatedAt`

---

### Application

Stores student applications for opportunities.

Main fields include:

* `id`
* `studentProfileId`
* `opportunityId`
* `status`
* `appliedDate`
* `coverLetter`
* `createdAt`
* `updatedAt`

---

## 5. User Roles

The database supports the following roles:

```text
STUDENT
ORGANIZATION
ADMIN
```

The roles are defined using the Prisma `UserRole` enum.

---

## 6. Opportunity Types

The system supports:

```text
ATTACHMENT
INTERNSHIP
```

These values are represented using the Prisma `OpportunityType` enum.

---

## 7. Opportunity Statuses

Opportunities can have the following statuses:

```text
OPEN
CLOSED
PENDING
REJECTED
```

These values are represented using the Prisma `OpportunityStatus` enum.

---

## 8. Application Statuses

Applications support the following statuses:

```text
PENDING
SHORTLISTED
ACCEPTED
REJECTED
```

These values are represented using the Prisma `ApplicationStatus` enum.

---

## 9. Database Relationships

The database uses foreign-key relationships to maintain data integrity.

| Relationship                 | Description                               |
| ---------------------------- | ----------------------------------------- |
| User → StudentProfile        | A student profile belongs to a user       |
| User → Organization          | An organization profile belongs to a user |
| Organization → Opportunity   | An organization can create opportunities  |
| StudentProfile → Application | A student can submit applications         |
| Opportunity → Application    | An opportunity can receive applications   |

---

## 10. Foreign Keys and Referential Integrity

The database uses foreign keys for related records.

Examples include:

```text
student_profiles.userId → users.id
organizations.userId → users.id
opportunities.organizationId → organizations.id
applications.studentProfileId → student_profiles.id
applications.opportunityId → opportunities.id
```

The Prisma schema also defines cascading delete behaviour where appropriate.

This helps prevent orphaned related records.

---

## 11. Unique Constraints

The database uses unique constraints to protect data integrity.

### User Email

```prisma
email String @unique
```

This prevents duplicate user email addresses.

### Duplicate Applications

The `Application` model uses:

```prisma
@@unique([studentProfileId, opportunityId])
```

This prevents the same student from applying to the same opportunity more than once.

The duplicate application rule was also tested through the API and returned:

```text
HTTP 409 Conflict
```

---

## 12. Database Indexes

Indexes have been added to commonly queried fields.

### Opportunity Indexes

```prisma
@@index([organizationId])
@@index([status])
@@index([type])
@@index([deadline])
```

### Application Indexes

```prisma
@@index([studentProfileId])
@@index([opportunityId])
@@index([status])
```

These indexes support common operations such as:

* Filtering opportunities
* Searching opportunities
* Finding opportunities by organization
* Finding applications by student
* Finding applications by opportunity
* Filtering applications by status

---

## 13. Prisma Configuration

The project uses Prisma for database access.

The Prisma schema is located at:

```text
prisma/schema.prisma
```

The Prisma configuration is located at:

```text
prisma.config.ts
```

The database connection is configured using the environment variable:

```text
DATABASE_URL
```

---

## 14. Environment Variables

Database credentials are stored in a local `.env` file.

Example configuration is documented in:

```text
.env.example
```

The real `.env` file must not be committed to GitHub.

### Important

Never commit:

```text
.env
```

The `.gitignore` file excludes sensitive and generated files such as:

```text
.env
node_modules/
dist/
```

Prisma migration files are **not** ignored because they are part of the database version history.

---

## 15. Database Setup

### Install Dependencies

From the backend project directory:

```bash
npm install
```

### Validate Prisma

```bash
npx prisma validate
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Check Migration Status

```bash
npx prisma migrate status
```

### Apply/Create Development Migration

```bash
npx prisma migrate dev
```

---

## 16. Database Migrations

Prisma migrations are used to manage database schema changes.

Migration files are stored in:

```text
prisma/migrations/
```

Migrations provide:

* Database schema history
* Reproducible database changes
* Version-controlled database structure
* A consistent development database setup

---

## 17. Seed Data

Sample development data is provided through:

```text
prisma/seed.ts
```

The seed data contains sample:

* Admin user
* Student user
* Student profile
* Organization
* Opportunities
* Application

The seed script can be executed using:

```bash
npx prisma db seed
```

The seed data is intended for local development, testing and demonstration.

Sample credentials must not be reused as production credentials.

---

## 18. Database Inspection

### Prisma Studio

The database can be inspected using:

```bash
npx prisma studio
```

Prisma Studio provides a visual interface for viewing and inspecting database records.

### pgAdmin

PostgreSQL can also be inspected using **pgAdmin** to verify:

* Tables
* Columns
* Primary keys
* Foreign keys
* Unique constraints
* Indexes
* Stored records

---

## 19. Backend API

The backend runs locally on:

```text
http://localhost:3000
```

Swagger API documentation is available at:

```text
http://localhost:3000/api
```

Swagger was used during Task 5 to test database-backed API operations.

---

## 20. Database-Backed API Features

The backend provides database-backed functionality for:

### Authentication

```text
POST /auth/register
POST /auth/login
GET /auth/profile
```

### Opportunities

```text
GET /opportunities
GET /opportunities/:id
POST /opportunities
PATCH /opportunities/:id
DELETE /opportunities/:id
```

### Applications

```text
POST /opportunities/:id/applications
GET /applications/my
GET /opportunities/:id/applications
PATCH /applications/:id/status
```

### Administration

```text
GET /admin/users
PATCH /admin/users/:id/status
GET /admin/opportunities
PATCH /admin/opportunities/:id/status
```

The exact available endpoints can also be viewed through Swagger.

---

## 21. Search, Filtering and Pagination

The opportunity API supports database-backed querying.

Supported operations include:

* Search
* Location filtering
* Opportunity type filtering
* Status filtering
* Pagination

Example:

```text
GET /opportunities
```

Query parameters can be used to retrieve a smaller and more relevant set of records.

---

## 22. CRUD Operations

The database integration supports CRUD operations.

### Create

Examples:

* Register a user
* Create an organization
* Create an opportunity
* Submit an application

### Read

Examples:

* Retrieve users
* Retrieve opportunities
* Retrieve applications
* Retrieve authenticated user profile

### Update

Examples:

* Update opportunities
* Update application status
* Update account status

### Delete

Examples:

* Delete opportunities

All database operations are performed through Prisma.

---

## 23. Database Testing

Database integration was tested through:

* Prisma schema validation
* Prisma migration checks
* Backend startup
* Swagger API testing
* cURL requests
* Prisma Studio
* pgAdmin
* CRUD operations
* Relationship verification
* Foreign-key verification
* Unique constraint verification
* Duplicate application testing
* Search and filtering
* Pagination

Detailed evidence is available in:

```text
TASK-5-DATABASE-TEST-EVIDENCE.md
```

---

## 24. Important Database Integrity Rules

The database helps enforce the following rules:

1. User email addresses must be unique.
2. A student profile must belong to a valid user.
3. An organization profile must belong to a valid user.
4. An opportunity must belong to a valid organization.
5. An application must belong to a valid student profile.
6. An application must belong to a valid opportunity.
7. A student cannot apply to the same opportunity more than once.
8. User roles are restricted to the defined role values.
9. Opportunity types are restricted to the defined opportunity types.
10. Application statuses are restricted to the defined application statuses.

---

## 25. Security Considerations

The application follows several basic security practices:

* Passwords are hashed using bcrypt.
* Authentication uses JWT.
* Protected endpoints require authentication.
* Role-based authorization is implemented.
* Database credentials are stored in environment variables.
* `.env` is excluded from Git.
* Secrets are not included in source code or documentation.

---

## 26. Project Structure

```text
campusattach-backend/
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   ├── auth/
│   ├── users/
│   ├── opportunities/
│   ├── applications/
│   ├── admin/
│   └── ...
│
├── test/
│   └── database/
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── prisma.config.ts
├── README.md
└── TASK-5-DATABASE-TEST-EVIDENCE.md
```

---

## 27. Running the Backend

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npx prisma generate
```

Check the database migration status:

```bash
npx prisma migrate status
```

Start the development server:

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3000
```

Swagger documentation:

```text
http://localhost:3000/api
```

---

## 28. Build Verification

The backend can be compiled using:

```bash
npm run build
```

A successful build confirms that the NestJS/TypeScript backend compiles successfully.

---

## 29. Task 5 Deliverables

The Task 5 implementation includes:

* PostgreSQL database integration
* Prisma ORM integration
* Prisma schema
* Database migrations
* Seed data
* Entity relationships
* Foreign keys
* Unique constraints
* Database indexes
* CRUD persistence
* Search and filtering
* Pagination
* Database integrity rules
* Environment configuration
* Database testing
* Database test evidence
* Updated project documentation

---

## 30. Database Integration Summary

The CampusAttach backend now uses PostgreSQL as its persistent data store.

Prisma provides the connection between the NestJS application and PostgreSQL while also managing:

* Database models
* Relationships
* Migrations
* Constraints
* Indexes
* Database queries

This database integration allows CampusAttach data to persist beyond individual application sessions and provides the foundation required for the complete student attachment and internship platform.

---

## 31. Task 5 Status

**Task 5: Database Integration**

The implementation covers the required database integration areas, including PostgreSQL, Prisma, schema design, migrations, relationships, constraints, indexes, CRUD persistence, querying, seed data, testing, environment configuration and documentation.

Final testing evidence is documented in:

```text
TASK-5-DATABASE-TEST-EVIDENCE.md
```