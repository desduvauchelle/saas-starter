# Getting started

This starter pack is to start projects faster and easier. It is highly opinionated and comes with a lot of features out of the box.
I've tried vibe coding but it makes so many basic mistakes during the setup and I loose so much time, I thought it would be best to create a starter pack that has all the basic features and tools I need to start a project quickly, and then get AI to come in.
It has all the built in basic tools to connect to database, authentication, payment processing, email sending, blogging, admin pages, and more.

Here's the main gist of the setup:

- **Next.js**: A React framework for building server-rendered applications.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **DaisyUI**: A Tailwind CSS component library for prebuilt UI components.
- **MongoDB**: A NoSQL database for storing application data.
- **Stripe**: A payment processing platform for handling transactions.
- **Resend**: A service for sending emails.
- **FontAwesomeIcons**: A library for scalable vector icons.

## Getting Started

We are using NextJS with TypeScript, so make sure you have Node.js installed on your machine. You can check if you have Node.js installed by running:

```bash
node -v
```

If you don't have Node.js installed, you can download it from [nodejs.org](https://nodejs.org/).

Next, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd <repository-name>
npm install
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## App structure

The app is structured as follows:

```md
src/app/    # Main application directory
├── api/                # API routes
├── api/auth/           # Authentication routes
├── api/blog/           # Blog related API routes
├── admin/              # Admin dashboard pages
├── blog/               # Blog pages
├── setup/              # Setup pages for initial configuration like setting admin user, payment, and email settings
src/components/   # Reusable components
src/lib/         # Utility functions and libraries
├── db/            # Database connection and models
├── auth/          # Authentication logic and utilities
├── payment/       # Payment processing logic
├── email/         # Email sending logic
├── storage/    # File storage logic using either google cloud storage, aws s3, or local storage
src/hooks/       # Custom React hooks
src/tools/      # Utility tools and scripts
src/types/      # TypeScript types and interfaces
```

## Environment Variables

Copy the `.env.example` file to `.env` and fill in the required environment variables. The following variables are required:

- `MONGODB_URI`: MongoDB connection string.
- `STRIPE_SECRET_KEY`: Stripe secret key for payment processing.
- `RESEND_API_KEY`: Resend API key for sending emails.

Depending on which file storage service you are using, you will also need to set the following variables:

**For Google Cloud Storage:**

- `GOOGLE_CLOUD_STORAGE_BUCKET`: Google Cloud Storage bucket name.

**For AWS S3:**

- `AWS_S3_BUCKET`: AWS S3 bucket name.
- `AWS_ACCESS_KEY_ID`: AWS access key ID.
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key.

**For Local Storage:**

- `LOCAL_STORAGE_PATH`: Local storage path for file uploads.

## Styling

- We use [Tailwind CSS](https://tailwindcss.com/) for styling. The styles are defined in `app/globals.css`.
- Additionally, we use DaisyUI for component styling that is configured in `app/globals.css` as well. It has many prebuilt display units that can be used to quickly build UI components.
- For basic icons, we use [FontAwesomeIcons](https://fontawesome.com/) which are imported in `app/layout.tsx`.

## Pages

We are using Next.js's App Router, which allows us to create pages in the `src/app/` directory. The main pages are:

- `/`: The home page.
- `/blog`: The blog listing page.
- `/blog/[id]`: The blog post page.
- `/admin`: The admin dashboard.
- `/setup`: The setup page for initial configuration.

The rest will depend on the features you want to implement.
