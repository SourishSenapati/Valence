import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { Adapter } from "next-auth/adapters";
import AzureADProvider from "next-auth/providers/azure-ad";
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      async profile(profile) {
        // Default role is EMPLOYEE
        let role: Role = Role.EMPLOYEE;

        // Extract groups from the profile (requires "groups" claim in Azure AD token)
        const groups = (profile as { groups?: string[] }).groups || [];

        if (groups.includes(process.env.AZURE_AD_HR_ADMIN_GROUP_ID ?? "")) {
          role = Role.HR_ADMIN;
        } else if (groups.includes(process.env.AZURE_AD_PLANT_HEAD_GROUP_ID ?? "")) {
          role = Role.PLANT_HEAD;
        } else if (groups.includes(process.env.AZURE_AD_SHIFT_MANAGER_GROUP_ID ?? "")) {
          role = Role.SHIFT_MANAGER;
        }

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
};
