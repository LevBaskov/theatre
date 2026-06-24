import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "src/lib/prisma";


// Схема валидации для входа
const loginSchema = z.object({
  login: z.string().min(3, "Логин должен содержать минимум 3 символа"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        login: { label: "Логин", type: "text" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) {
          throw new Error("Введите логин и пароль");
        }

        // Валидация через Zod
        const validated = loginSchema.safeParse(credentials);
        if (!validated.success) {
          throw new Error("Неверный формат данных");
        }

        // Поиск пользователя в БД
        const user = await prisma.viewer.findUnique({
          where: { viewer_login: validated.data.login },
        });

        if (!user) {
          throw new Error("Пользователь не найден");
        }

        // Проверка пароля (в продакшене пароли должны быть хешированы!)
        const isValid = await bcrypt.compare(
          validated.data.password,
          user.viewer_password
        );

        if (!isValid) {
          throw new Error("Неверный пароль");
        }

        // Возвращаем данные для сессии
        return {
          id: user.ID_viewer.toString(),
          login: user.viewer_login,
          email: user.viewer_email,
          fullName: user.viewer_full_name,
          role: user.viewer_login === "admin" ? "ADMIN" : "USER", // Простая проверка роли
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.fullName = user.fullName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.fullName = token.fullName as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login", // Кастомная страница входа
  },
  session: {
    strategy: "jwt",
  },
});