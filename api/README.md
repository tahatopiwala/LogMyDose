# PeptideRx API

Express.js backend API for the PeptideRx peptide therapy tracking platform.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL via Prisma ORM
- **Authentication**: JWT (access + refresh tokens)
- **Validation**: Zod schemas
- **AI**: Anthropic Claude API

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (or Docker for local development)
- pnpm (recommended) or npm

### Installation

```bash
cd api
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
ANTHROPIC_API_KEY=your-api-key
```

### Running Locally

```bash
# Development with hot reload
pnpm dev

# Production build
pnpm build
pnpm start
```

## API Documentation

Base URL: `/api/v1`

### Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

**Authorization Levels:**
- **Public**: No authentication required
- **Patient**: Requires patient authentication
- **Admin**: Requires clinic admin authentication
- **Super Admin**: Requires super admin privileges

---

## Routes

### Health Routes

Base path: `/api/v1/health`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Public | Health check with database connectivity status |
| GET | `/ready` | Public | Readiness probe - checks database connection |
| GET | `/live` | Public | Liveness probe - always returns `{live: true}` |

---

### Authentication Routes

Base path: `/api/v1/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register/patient` | Public | Register a new patient (D2C user) |
| POST | `/register/user` | Admin | Register a new clinic user (provider/admin) |
| POST | `/login` | Public | User login (supports both patient and user types) |
| POST | `/refresh` | Public | Refresh authentication tokens |
| POST | `/logout` | Required | Logout and invalidate refresh token |
| GET | `/me` | Required | Get current user/patient profile |

#### Register Patient

```bash
POST /api/v1/auth/register/patient
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password",
  "type": "patient" // or "user" for clinic staff
}
```

**Response:**
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "expiresIn": 900
}
```

---

### Patients Routes

Base path: `/api/v1/patients`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/me` | Patient | Get patient profile |
| PUT | `/me` | Patient | Update patient profile |
| POST | `/link-clinic` | Patient | Link patient to clinic using invite code |
| POST | `/unlink-clinic` | Patient | Unlink patient from clinic |
| GET | `/protocols` | Patient | Get patient's active protocols |
| GET | `/doses` | Patient | Get patient's dose logs with pagination |
| GET | `/alerts` | Patient | Get patient's alerts |

#### Link to Clinic

```bash
POST /api/v1/patients/link-clinic
Content-Type: application/json
Authorization: Bearer <token>

{
  "inviteCode": "CLINIC-ABC123"
}
```

---

### Tenants Routes

Base path: `/api/v1/tenants`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/me` | Admin | Get clinic/tenant details |
| PUT | `/me` | Admin | Update clinic/tenant details |
| GET | `/me/patients` | Admin | Get clinic's patients with search/pagination |
| POST | `/me/invitations` | Admin | Create invitation for clinic users |
| GET | `/me/invitations` | Admin | Get pending invitations |
| GET | `/` | Super Admin | List all tenants |
| POST | `/` | Super Admin | Create new tenant |
| GET | `/:id` | Super Admin | Get specific tenant with users |

#### Get Clinic Patients

```bash
GET /api/v1/tenants/me/patients?page=1&limit=20&search=john
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "patients": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

### Protocols Routes

Base path: `/api/v1/protocols`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/templates` | Public | List protocol templates with filtering |
| GET | `/templates/:id` | Public | Get specific protocol template |
| POST | `/` | Patient | Create protocol from template or custom |
| GET | `/:id` | Required | Get protocol details |
| PUT | `/:id` | Required | Update protocol |
| GET | `/:id/schedule` | Required | Get protocol schedule for date range |

#### List Protocol Templates

```bash
GET /api/v1/protocols/templates?category=peptide&page=1&limit=10
```

#### Create Protocol

```bash
POST /api/v1/protocols
Content-Type: application/json
Authorization: Bearer <token>

{
  "templateId": "uuid-of-template",
  "startDate": "2024-01-15",
  "customizations": {
    "dosageAmount": 250,
    "frequency": "daily"
  }
}
```

#### Get Protocol Schedule

```bash
GET /api/v1/protocols/:id/schedule?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

---

### Doses Routes

Base path: `/api/v1/doses`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Patient | Log a dose |
| GET | `/` | Patient | Get patient's dose history with filtering |
| GET | `/today` | Patient | Get doses scheduled for today |
| GET | `/side-effects` | Patient | Get logged side effects with pagination |
| GET | `/stats` | Patient | Get dose statistics for date range |
| GET | `/:id` | Patient | Get specific dose details |
| PUT | `/:id` | Patient | Update dose record |
| POST | `/side-effects` | Patient | Log a side effect |

#### Log a Dose

```bash
POST /api/v1/doses
Content-Type: application/json
Authorization: Bearer <token>

{
  "protocolId": "uuid-of-protocol",
  "substanceId": "uuid-of-substance",
  "amount": 250,
  "unit": "mcg",
  "administeredAt": "2024-01-15T08:00:00Z",
  "site": "abdomen",
  "notes": "Felt good, no issues"
}
```

#### Get Dose Statistics

```bash
GET /api/v1/doses/stats?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalDoses": 28,
  "adherenceRate": 0.93,
  "missedDoses": 2,
  "bySubstance": [
    {
      "substanceId": "...",
      "name": "BPC-157",
      "count": 14
    }
  ]
}
```

#### Log Side Effect

```bash
POST /api/v1/doses/side-effects
Content-Type: application/json
Authorization: Bearer <token>

{
  "doseId": "uuid-of-dose",
  "type": "injection_site_reaction",
  "severity": "mild",
  "description": "Slight redness at injection site",
  "occurredAt": "2024-01-15T10:00:00Z"
}
```

---

### Substances Routes

Base path: `/api/v1/substances`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/categories` | Public | Get substance categories |
| GET | `/` | Public | List substances with filtering/pagination |
| GET | `/:id` | Public | Get substance details |
| POST | `/` | Super Admin | Create new substance |
| PUT | `/:id` | Super Admin | Update substance details |

#### List Substances

```bash
GET /api/v1/substances?category=peptide&search=bpc&page=1&limit=20
```

**Response:**
```json
{
  "substances": [
    {
      "id": "...",
      "name": "BPC-157",
      "category": "peptide",
      "description": "Body Protection Compound...",
      "defaultUnit": "mcg",
      "halfLife": "4 hours"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - validation error |
| 401 | Unauthorized - missing or invalid token |
| 403 | Forbidden - insufficient permissions |
| 404 | Not Found |
| 429 | Too Many Requests - rate limited |
| 500 | Internal Server Error |
| 503 | Service Unavailable - database connection issue |

---

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Authentication endpoints**: 10 requests per minute
- **General endpoints**: 100 requests per minute
- **Public endpoints**: 200 requests per minute

---

## Security Features

- **JWT Authentication**: Short-lived access tokens (15 min) with refresh tokens
- **Role-Based Access Control**: Patient, Admin, Super Admin levels
- **Request Validation**: All inputs validated with Zod schemas
- **Audit Logging**: All mutations are logged for HIPAA compliance
- **Rate Limiting**: Protection against brute force attacks

---

## Development

### Database Migrations

```bash
# Generate migration
pnpm prisma migrate dev --name migration_name

# Apply migrations
pnpm prisma migrate deploy

# Reset database
pnpm prisma migrate reset
```

### Testing

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```
