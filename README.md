# CareConnect

A modern healthcare platform connecting patients with verified doctors.

## Features

- **Patient Portal**: Browse doctors, book appointments, manage health records
- **Doctor Portal**: Manage appointments, patient records, and professional profile
- **Admin Dashboard**: Verify doctor applications, manage platform users
- **Authentication**: Email/password and Google OAuth via Supabase
- **Role-Based Access**: Secure authorization for patients, doctors, and admins
- **Doctor Verification**: Admin approval workflow for new doctor applications

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Zustand (state management)
- Supabase Auth
- Tailwind CSS

### Backend
- Node.js
- Express
- Supabase (PostgreSQL)
- In-app notifications and Supabase Realtime

## Getting Started

### Prerequisites

- Node.js 22.x
- Supabase account

### Environment Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

**Frontend (.env.local)**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000
```

**Backend (backend/.env)**
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ADMIN_PASSKEY=replace-with-a-long-random-passkey
ACCEPTABLE_DOCTOR_LICENSE_NUMBERS=MDC/RN/15623,MDC/RN/15461
DOCTOR_EMAIL=your_doctor_email@example.com
```

### Database Setup

Run these SQL files in the Supabase SQL editor, in this order:

1. `backend/migrations/add_doctor_verification.sql`
2. `backend/migrations/create_notifications.sql`

The repository contains incremental migrations only; the base `users`, `doctors`, `patients`, `appointments`, and `ratings` tables must already exist.

### Running the Application

1. Start the backend:
```bash
cd backend
npm install
npm start
```

2. Start the frontend:
```bash
npm run dev
```

3. Open http://localhost:5173

## Deployment

### Vercel (Frontend)

1. Connect your repository to Vercel
2. Set the project root directory to the repository root.
3. Add these environment variables in Vercel:
	- `VITE_SUPABASE_URL`
	- `VITE_SUPABASE_ANON_KEY`
	- `VITE_API_URL=https://YOUR-RAILWAY-DOMAIN`
4. Deploy and verify that direct navigation to application routes works.

### Railway (Backend)

1. Create a Railway service from this repository.
2. Set the service root directory to `backend`.
3. Railway uses `npm start` and the assigned `PORT` automatically.
4. Add the variables from `backend/.env.example` in Railway. Never add `SUPABASE_SERVICE_ROLE_KEY` or `ADMIN_PASSKEY` to Vercel.
5. Set `FRONTEND_URL` to the exact deployed Vercel URL.
6. Confirm `https://YOUR-RAILWAY-DOMAIN/api/health` returns a successful response.

## Security

- All API endpoints protected with JWT authentication
- Role-based authorization enforced on backend
- Doctor verification workflow prevents unapproved doctors from appearing to patients
- Supabase Row Level Security (RLS) recommended for additional protection
- Backend secrets belong only in Railway environment variables; frontend variables must use the `VITE_` prefix and contain public values only

## License

MIT
