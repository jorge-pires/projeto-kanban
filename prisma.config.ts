import "dotenv/config";

import { defineConfig } from "prisma/config";

const databaseUrl =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  "postgresql://placeholder:placeholder@localhost:5432/taskflow";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: databaseUrl,
  },
});
