import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/auth/login',
  },
})

export const config = {
  matcher: [
    '/((?!auth|_next/static|_next/image|favicon.ico|sentry-example-page|api/sentry-example-api).*)',
  ],
}
