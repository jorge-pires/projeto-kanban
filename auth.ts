import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";

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

      async authorize(credentials) {
        const validation = loginSchema.safeParse(credentials);

        if (!validation.success) {
          return null;
        }

        const { email, password } = validation.data;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          return null;
        }

        const passwordMatches = await compare(password, user.passwordHash);

        if (!passwordMatches) {
          return null;
        }

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
