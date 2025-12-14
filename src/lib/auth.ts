import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/api/auth/signin",
  },
  callbacks: {
    async session({ session }: { session: any }) {
      return session;
    },
  },
};


