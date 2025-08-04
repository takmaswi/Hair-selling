import NextAuth, { DefaultSession } from 'next-auth'

type UserRole = 'ADMIN' | 'CUSTOMER'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
    } & DefaultSession['user']
  }

  interface User {
    role: UserRole
  }
}