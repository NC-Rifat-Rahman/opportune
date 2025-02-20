<b>Backend Project</b>
This is a backend project built with Nest.js, PostgreSQL, Prisma, and GraphQL.

Setup
Follow the steps below to set up the project locally:

1. Install Dependencies
Create a .env file containing the following environment variable:
- DATABASE_URL="postgresql://username:password@localhost:5432/db_name"

Install the necessary dependencies:<br>

- npm i<br>
Set up the database by running the Prisma migration:

- npx prisma migrate dev --name init
- npx prisma generate

<b>Frontend Project<b><br>
To set up the frontend project, run the following command to install all the necessary dependencies:<br>

- npm i
