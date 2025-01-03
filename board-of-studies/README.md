# About Next.js

Next.js is a powerful React framework used to build fast, scalable, and production-ready web applications. It provides a set of features like:

- **Server-Side Rendering (SSR)**: Pages are pre-rendered on the server and sent to the browser, improving performance and SEO.
- **Static Site Generation (SSG)**: Generate static pages at build time, which can be deployed to any static hosting provider.
- **API Routes**: Next.js allows you to create server-side logic in your application directly by defining API routes within the project.
- **File-based routing**: Automatically creates routes based on the file structure, reducing the need for manual configuration.

We chose Next.js for its ease of use, speed, and ability to optimize web performance, which is essential for the Board of Studies application.

# About Supabase

[Supabase](https://supabase.io/) is an open-source alternative to Firebase that provides backend-as-a-service (BaaS). It combines powerful tools for building applications, including:

- **Database**: Supabase uses PostgreSQL, a powerful and flexible relational database.
- **Authentication**: Provides simple user authentication, including email/password login, OAuth, and JWT support.
- **Realtime**: Allows you to subscribe to real-time changes in the database and instantly sync data across users.
- **Storage**: Manages file storage, including images, videos, and other assets.

For the Board of Studies website, Supabase handles authentication (for both superadmin and user roles) and manages the relational database that stores courses, syllabi, and internal changes. It simplifies the backend infrastructure while offering scalability and real-time capabilities.
