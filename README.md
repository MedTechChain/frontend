
# MedTech Chain Interface Documentation

Welcome to the MedTech Chain platform documentation. This guide is designed for developers and users who wish to understand the functionality and underlying code of the MedTech Chain interface.

## Overview

The interface consists of several key components:

- **Authentication and User Management**: Allows users to sign up, log in, change passwords, and manage user profiles.
- **Device Data Analysis**: Provides functionalities for analyzing medical metadata, including calculating averages, counts, and generating histograms based on specific criteria.
- **Dashboard Management**: For admins, a dashboard is available to view, add, edit, and delete researchers.

## Key Components

### 1. Authentication and User Management

The platform supports basic authentication functionalities such as login, change password, and logout. These operations are handled through API requests to the backend server, with user credentials and session tokens managed securely.

- **Login**: Users can log in using their username and password. Upon successful authentication, a JWT token is generated and stored in the console log for session management.
- **Change Password**: Allows users to change their passwords by providing the current and new passwords. The system performs various checks, including password strength and matching confirmation passwords. The system also does field validation for both null values and inconsistent formatting.

### 2. Device Data Analysis (Available for Researchers)

The platform provides a set of tools for analyzing medical device data. Users can select device types, specify analysis criteria, and choose hospitals to generate reports such as averages, counts, and histograms.

- **Average Calculation**: Users can calculate the average value of a specified parameter for a selected device type over a given period.
- **Count**: Allows users to count the occurrences of specified criteria within the device data, useful for understanding device distribution or usage patterns.
- **Histogram**: Generates a histogram based on a selected parameter, providing a visual representation of data distribution.

For more details about the available queries, look at the Metadata and Queries page.

### 3. Dashboard Management (Admin Only)

Admin users have access to a dashboard for managing researcher profiles. This includes adding new researchers, editing existing profiles, and deleting researchers. The dashboard also provides functionalities for managing encryption schemes and logging out.

- **Add Researcher**: Admins can add new researchers by providing necessary details such as name, email, and affiliation.
- **Edit Researcher**: Existing researcher profiles can be edited to update their information.
- **Delete Researcher**: Admins can remove researchers from the system.

## Code Structure

The application is built using Next.js, leveraging React hooks for state management and functional components for UI rendering. Each major functionality (login, change password, dashboard, data analysis) is encapsulated within its component, ensuring modularity and ease of maintenance.

Key aspects of the code include:

- **Environment Variables**: API URLs and other configurations are managed via environment variables, making the app adaptable to different deployment environments.
- **State Management**: `useState` hook is extensively used for managing component states, whereas `useEffect` is utilized for handling side effects, such as API calls on component mount.
- **Form Handling**: Forms for login, password change, and data analysis inputs use controlled components, with state variables bound to input fields, ensuring a single source of truth for form data.
- **Error Handling**: The application provides user-friendly error messages for various scenarios, such as login failures, validation errors, and API request issues.

## Development and Deployment

For development, the application requires Node.js and npm/yarn installed on your system. To run the application locally:

1. Clone the repository to your local machine.
2. Install dependencies using `npm install` or `yarn`.
3. Start the development server using `npm run dev` or `yarn dev`.
4. Access the application at `http://localhost:3000`.

____________________________________________________________________________________________________________________________________

# Default Instructions

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Run in Docker

```shell
docker-compose -p medtechchain-ums-fe up -d --build
```