<b>Backend Project</b>
<p>This is a backend project built with Nest.js, PostgreSQL, Prisma, and GraphQL.</p>

<h3>Setup</h3>
<p>Follow the steps below to set up the project locally:</p>

<h4>1. Install Dependencies</h4>
<p>Create a <code>.env</code> file containing the following environment variable:</p>
<ul>
  <li><code>DATABASE_URL="postgresql://username:password@localhost:5432/db_name"</code></li>
</ul>

<p>Install the necessary dependencies:</p>
<ul>
  <li><code>npm i</code></li>
</ul>

<p>Set up the database by running the Prisma migration:</p>
<ul>
  <li><code>npx prisma migrate dev --name init</code></li>
  <li><code>npx prisma generate</code></li>
</ul>

<b>Frontend Project</b><br>
<p>To set up the frontend project, run the following command to install all the necessary dependencies:</p>
<ul>
  <li><code>npm i</code></li>
</ul>
