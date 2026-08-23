# Deploy to Vercel with Neon

Both services provide free plans suitable for this portfolio project.

## 1. Create the database

1. Create a Neon project.
2. Copy the pooled connection string for application runtime.
3. Copy the direct connection string for Prisma migrations.
4. Keep `sslmode=require` enabled.

## 2. Configure Vercel

Add these environment variables to Production, Preview and Development:

- `DATABASE_URL`: pooled Neon URL;
- `DIRECT_URL`: direct Neon URL;
- `AUTH_SECRET`: random value containing at least 32 characters.

Never paste their values into source files, issues, commits or build logs.

## 3. Apply migrations

From a trusted local machine with production variables loaded:

```bash
npm ci
npm run db:deploy
```

`db:deploy` applies reviewed migration files and does not create a new migration.

## 4. Deploy

Import the GitHub repository in Vercel and keep the standard Next.js settings.
The `npm run build` script generates Prisma Client before the Next.js build.

## 5. Verify

- register a temporary account;
- create a project and task;
- move the task and reload the page;
- sign out and back in;
- inspect response security headers;
- confirm CI and CodeQL are green.

Delete the temporary account directly from the Neon console if it should not
remain in the portfolio database.
