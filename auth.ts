import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const USERS = [
  {
    id: "1",
    email: "magtash68@gmail.com",
    password: "05082025",
    name: "Mateus",
    role: "mateus",
  },
  {
    id: "2",
    email: "bellachamon@gmail.com",
    password: "05082025",
    name: "Isabella",
    role: "isabella",
  },
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "seven-months-secret-key-hardcoded-2025",
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const user = USERS.find(
          (u) =>
            u.email === credentials?.email &&
            u.password === credentials?.password
        );
        if (!user) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
