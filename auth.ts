import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";
import { getServerEnv } from "@/lib/env";
import {
  clearAuthRateLimit,
  consumeAuthRateLimit,
} from "@/lib/security/auth-rate-limit";
import { getClientIp } from "@/lib/security/client-ip";
import { loginSchema } from "@/lib/validations/auth";

const DUMMY_PASSWORD_HASH =
  "$2b$12$p.dWFseQ/vV1p9egTrDoFOkhBYAInx56j/Nrdi2zi/s91dHfDgq2y";

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: getServerEnv().AUTH_SECRET,
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },

  providers: [
    Credentials({
      credentials: {
        email: {
          label: "E-mail",
          type: "email",
        },
        password: {
          label: "Senha",
          type: "password",
        },
      },

      async authorize(credentials, request) {
        const validation = loginSchema.safeParse(credentials);

        if (!validation.success) {
          return null;
        }

        const { email, password } = validation.data;
        const clientIp = getClientIp(request.headers);
        const rateLimit = await consumeAuthRateLimit({
          action: "login",
          identifier: clientIp,
          maxAttempts: 5,
          windowMs: 15 * 60 * 1000,
        });

        if (!rateLimit.allowed) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          await compare(password, DUMMY_PASSWORD_HASH);
          return null;
        }

        const passwordMatches = await compare(password, user.passwordHash);

        if (!passwordMatches) {
          return null;
        }

        await clearAuthRateLimit("login", clientIp);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (!token.sub) {
        return session;
      }

      const currentUser = await prisma.user.findUnique({
        where: {
          id: token.sub,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      if (currentUser) {
        session.user.id = currentUser.id;
        session.user.name = currentUser.name;
        session.user.email = currentUser.email;
      }

      return session;
    },
  },
});
