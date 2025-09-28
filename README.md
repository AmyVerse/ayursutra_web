# AyurSutra Web Application

A modern web application for Ayurvedic healthcare management with OTP-based authentication and separate dashboards for patients and doctors.

## Features

- 🔐 **OTP Authentication** - Secure login using Resend API
- 👨‍⚕️ **Doctor Dashboard** - Complete management interface for healthcare providers
- 🤒 **Patient Dashboard** - Simple interface for patients (placeholder)
- 🏥 **HPR/ABHA Integration** - Doctor verification using health registries
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API Routes
- **Authentication**: NextAuth.js with custom OTP provider
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Email**: Resend API for OTP delivery

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## Environment Setup

Update `.env.local` with your API keys:

```env
# Database (Already configured)
DATABASE_URL="your_neon_database_url"

# Auth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate_a_random_secret_key_here"

# Resend API
RESEND_API_KEY="your_resend_api_key_here"

# JWT Secret for OTP
JWT_SECRET="generate_another_random_secret_here"
```

## Authentication Flow

### For Patients:

1. Enter mobile/email → Get OTP → Verify → `/dashboard/patient`

### For Doctors:

1. Click "Sign up as Doctor" → Enter HPR/ABHA ID → Get OTP → Verify → `/dashboard/doctor`

## Dashboard Status

- ✅ **Doctor Dashboard**: Full implementation with appointments, patients, schedule
- 🔄 **Patient Dashboard**: Placeholder ready for implementation

## Database Commands

```bash
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open database studio
```

## Project Structure

```
src/
├── app/
│   ├── api/auth/           # NextAuth & OTP endpoints
│   ├── dashboard/
│   │   ├── doctor/         # Complete doctor interface
│   │   └── patient/        # Patient placeholder
│   └── page.tsx            # Landing page with auth
├── lib/
│   ├── db/                 # Database schema & connection
│   ├── auth.ts             # NextAuth config
│   └── otp.ts              # OTP utilities
└── components/
    └── Providers.tsx       # Session provider
```

Ready for development! 🚀
