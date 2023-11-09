# NestJS Backend Setup

This project is a backend service built with NestJS following the clean architecture principles.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before running the project, make sure you have Node.js and npm installed on your machine.

### Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the project dependencies by running:

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory of the project and fill it with the following environment variables:

```plaintext
APP_PORT=3000
APP_URL=http://localhost:3000
MOBILE_APP_SCHEME=
SESSION_SECRET=yourSessionSecret
JWT_SECRET=yourJWTSecret

DB_HOST=localhost
DB_PORT=3306
DB_USER=yourDBUser
DB_PASS=yourDBPassword
DB_NAME=yourDBName

SMTP_PROVIDER=smtp-relay.example.com
SMTP_PORT=587
SMTP_USER=youremail@example.com
SMTP_PASSWORD=yourSMTPPassword
SMTP_FROM_NAME=YourAppName
SMTP_FROM_EMAIL=youremail@example.com
```

Make sure to replace the placeholder values with your actual configuration details.

### Database Migration

Run the database migrations with the following command:

```bash
npm run migration:run
```

## Running the server

To start the server, run:

```bash
npm run start
```

The server should now be running on [http://localhost:3000](http://localhost:3000).

## Authors

* **Thomy Lorenzatti** - *Freelance Developper*

