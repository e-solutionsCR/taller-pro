import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Credenciales incompletas");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.activo) {
                    throw new Error("Usuario no encontrado o inactivo");
                }

                const passwordMatch = await bcrypt.compare(credentials.password, user.password);

                if (!passwordMatch) {
                    throw new Error("Contraseña incorrecta");
                }

                return {
                    id: user.id.toString(),
                    name: user.nombre,
                    email: user.email,
                    role: user.rol,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
        error: '/login', // Error code passed in url query string as ?error=
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
