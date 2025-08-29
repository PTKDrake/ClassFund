# Class Fund Management System

A modern web application for managing class fund payments with Google OAuth authentication for Vimaru University students.

## Features

- **Google OAuth Authentication**: Secure login with @st.vimaru.edu.vn domain emails
- **Student ID Extraction**: Automatically extracts student ID from email username
- **Role-based Access Control**: Admin and User roles with Better Auth
- **Payment Status Management**: Track student payment status with real-time updates
- **VietQR Integration**: Generate payment QR codes with Vietnam QR Pay
- **Admin Dashboard**: Comprehensive student management interface
- **CSV/Excel Import**: Bulk import student data from spreadsheets
- **Internationalization**: Multi-language support (Vietnamese/English)
- **Error Monitoring**: Sentry integration for production monitoring

## Tech Stack

- **Frontend**: Nuxt 4, Vue 3, Nuxt UI, TailwindCSS 4
- **Backend**: Nuxt 4 API routes with Nitro
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with Google OAuth
- **Payment**: Vietnam QR Pay integration
- **Internationalization**: Nuxt i18n
- **Error Monitoring**: Sentry
- **Package Manager**: pnpm

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials
- pnpm (recommended)

## Installation

1. Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd classfund
pnpm install
```

2. Create environment variables file:

```bash
# Create .env file with the following variables
```

3. Configure your environment variables in `.env`:

```env
# Database
NUXT_DATABASE_URL="postgresql://username:password@localhost:5432/classfund"

# Google OAuth (from Google Cloud Console)
NUXT_GOOGLE_CLIENT_ID="your_google_client_id"
NUXT_GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Better Auth (generate a random secret)
NUXT_BETTER_AUTH_SECRET="your_random_secret_key_here"

# App Configuration
NUXT_APP_URL="http://localhost:3000"
NUXT_APP_NAME="ClassFund"

# Payment Configuration (optional - defaults provided)
NUXT_BANK_KEY="hdbank"
NUXT_ACCOUNT_NUMBER="099704070058389"
NUXT_ACCOUNT_HOLDER="Phạm Trung Kiên"
NUXT_PAYMENT_AMOUNT="276000"

# Sentry (optional)
SENTRY_DSN="your_sentry_dsn"
SENTRY_ORG="mightyempire"
SENTRY_PROJECT="classfund"

# Deployment
NUXT_NITRO_PRESET="node-server" # or "vercel", "netlify", etc.
```

## Database Setup

1. Generate database migrations:

```bash
pnpm db:generate
```

2. Apply migrations to your database:

```bash
pnpm db:migrate
```

Or push schema directly (for development):

```bash
pnpm db:push
```

3. Generate auth schema (if needed):

```bash
pnpm auth:schema
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.com/api/auth/callback/google` (production)
6. Set domain restriction to `st.vimaru.edu.vn`

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Admin User Setup

To create an admin user, you need to manually update the database after the first login:

```sql
UPDATE "user" SET role = 'admin' WHERE email = 'your-admin-email@st.vimaru.edu.vn';
```

Or use Drizzle Studio:

```bash
pnpm db:studio
```

## Usage

### For Students (Users)

1. Visit the website and click "Login with Google"
2. Sign in with your @st.vimaru.edu.vn email
3. View your payment status:
   - If paid: See success message
   - If not paid: See QR code for payment
   - If not in list: See error message

### For Administrators

1. Login with admin account
2. Access admin dashboard via "Quản lý" button
3. Manage student records:
   - Add new students manually
   - Import students from CSV/Excel files
   - Edit student information
   - Update payment status
   - Delete students
   - View payment statistics

## Screenshots

### Login Page
Students authenticate using their @st.vimaru.edu.vn Google accounts:

![Login Screenshot](public/login_screenshot.jpeg)

### Payment Status - Paid
Students who have already paid see a success confirmation:

![Paid Status Screenshot](public/paid_screenshot.jpeg)

### Payment Status - Unpaid
Students who haven't paid yet see a QR code for payment:

![Unpaid Status Screenshot](public/unpaid_screenshot.jpeg)

## Database Schema

### User Table (Better Auth)
- `id`: Primary key
- `name`: User's display name
- `email`: User's email address
- `userName`: Username (extracted from email)
- `firstName`: User's first name
- `lastName`: User's last name
- `role`: User role ('admin' or 'user')
- `banned`: Ban status
- `banReason`: Reason for ban
- `banExpires`: Ban expiration date

### Students Table
- `studentId`: Primary key (5-digit student ID)
- `order`: Sequential order number
- `userName`: Student's username
- `fullName`: Student's full name
- `hasPaid`: Payment status (boolean)
- `createdAt`: Record creation timestamp
- `updatedAt`: Record update timestamp

### Settings Table
- `id`: Primary key
- `key`: Setting key
- `value`: Setting value
- `description`: Setting description
- `createdAt`: Record creation timestamp
- `updatedAt`: Record update timestamp

### QR Cache Table
- `id`: Primary key
- `cacheKey`: MD5 hash cache key
- `description`: Payment description
- `amount`: Payment amount
- `bankNumber`: Bank account number
- `qrCodeData`: Full QR response data (JSONB)
- `createdAt`: Record creation timestamp

## Payment Integration

The system integrates with Vietnam QR Pay to generate payment QR codes with:
- Fixed amount: 276,000 VND (configurable)
- Bank: HDBank (configurable)
- Account number: 099704070058389 (configurable)
- Account holder: Phạm Trung Kiên (configurable)
- Payment info: `<STT> <MSV> <NAME> Quy TTM63`

## Production Deployment

1. Build the application:

```bash
pnpm build
```

2. Set production environment variables
3. Deploy to your preferred hosting platform:
   - **Vercel**: Set `NUXT_NITRO_PRESET=vercel`
   - **Netlify**: Set `NUXT_NITRO_PRESET=netlify`
   - **Node.js**: Set `NUXT_NITRO_PRESET=node-server`
4. Configure your domain in Google OAuth settings

## Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm preview`: Preview production build
- `pnpm generate`: Generate static site
- `pnpm auth:schema`: Generate auth schema
- `pnpm db:generate`: Generate database migrations
- `pnpm db:migrate`: Apply database migrations
- `pnpm db:push`: Push schema to database
- `pnpm db:studio`: Open Drizzle Studio

## Project Structure

```
classfund/
├── app/                    # Nuxt 4 app directory
│   ├── components/         # Vue components
│   ├── composables/        # Composables
│   ├── layouts/           # Layout components
│   ├── middleware/        # Route middleware
│   ├── pages/             # Page components
│   └── types/             # TypeScript types
├── server/                # Server-side code
│   ├── api/               # API routes
│   ├── database/          # Database configuration
│   ├── middleware/        # Server middleware
│   ├── utils/             # Server utilities
│   └── validations/       # Validation schemas
├── shared/                # Shared utilities
├── i18n/                  # Internationalization
└── public/                # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Links

- **GitHub Repository**: [https://github.com/ptkdrake/classfund](https://github.com/ptkdrake/classfund)
- **Facebook**: [https://facebook.com/ptkdrake.real](https://facebook.com/ptkdrake.real)

## License

This project is for educational purposes for Vimaru University TTM63 class.
