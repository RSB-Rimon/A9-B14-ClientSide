# SalonBook – Client

SalonBook is a salon appointment booking platform built with Next.js and TypeScript. Customers can explore salon services, book appointments, track booking status, and make payments. Administrators can manage salon services, appointments, customers, and transactions through a dedicated dashboard.

## Live Website

(https://salonbook-client-beryl.vercel.app/)

## Features

### Customer
- Browse and search available salon services.
- Explore services by category.
- View service details, prices, and duration.
- Submit appointment requests.
- View appointment history and booking status.
- Cancel pending appointment requests.
- Pay for confirmed appointments using Stripe.
- Manage personal profile.
- Access a role-based customer dashboard.

### Admin
- Access a dedicated admin dashboard.
- Add, update, and delete salon services.
- Upload service images using ImgBB.
- View and manage appointment requests.
- Confirm or cancel appointments.
- Manage registered customers.
- View payment transactions.

### Additional Features
- Email and GitHub authentication with Better Auth.
- Role-based dashboard access.
- Responsive user interface.
- Protected routes.
- Stripe payment integration.
- Environment-based configuration.

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Better Auth
- MongoDB
- Express.js REST API
- Stripe
- ImgBB

## Installation

Clone the repository:

```bash
git clone <CLIENT_REPOSITORY_URL>
```

Navigate to the project directory:

```bash
cd salonbook-client
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env.local` file in the project root and configure the following variables:

```env
NEXT_PUBLIC_API_URL=
MONGODB_URI=
BETTER_AUTH_URL=
BETTER_AUTH_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
IMGBB_API_KEY=
```

Use your own credentials and URLs. Never commit `.env.local` or expose secret values.

## Run Locally

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Related Repository

**Server Repository:** `<SERVER_REPOSITORY_URL>`

## Security

- Sensitive credentials are stored in environment variables.
- Protected pages require authentication.
- User access is controlled by roles.
- Payment confirmation is handled through verified Stripe webhook events.
