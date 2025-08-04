import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        // For now, using a simple check - replace with D1 database query when needed
        // You would typically query your D1 database here
        // const db = await getDb()
        // const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(credentials.email).first()
        
        // Temporary mock user for development
        if (credentials.email === 'admin@truthhair.com' && credentials.password === 'admin123') {
          return {
            id: '1',
            email: 'admin@truthhair.com',
            name: 'Admin User',
            role: 'ADMIN',
          }
        }

        throw new Error('Invalid credentials')
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role || 'CUSTOMER'
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
}