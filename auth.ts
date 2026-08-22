import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";
import {
  clearRateLimit,
  consumeRateLimit,
  getClientAddress,
} from "@/lib/security/rate-limit";
import { loginSchema } from "@/lib/validations/auth";

const DUMMY_PASSWORD_HASH =
  "$2b$12$yePPOCduFTZ9.xDeozcc2.Biec9ja/nu1uhie1X6RAV7Q1KJBv/Yy";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
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
        const clientAddress = getClientAddress(request.headers);

        const [accountLimit, addressLimit] = await Promise.all([
          consumeRateLimit({
            scope: "login-account",
            identifier: email,
            limit: 5,
            windowMs: 15 * 60 * 1_000,
          }),
          consumeRateLimit({
            scope: "login-address",
            identifier: clientAddress,
            limit: 20,
            windowMs: 15 * 60 * 1_000,
          }),
        ]);

        if (!accountLimit.allowed || !addressLimit.allowed) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        const passwordMatches = await compare(
          password,
          user?.passwordHash ?? DUMMY_PASSWORD_HASH,
        );

        if (!user || !passwordMatches) {
          return null;
        }

        await clearRateLimit("login-account", email);

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
