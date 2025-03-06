import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  // Öffentlich zugängliche Routen
  publicRoutes: [
    '/',
    '/pricing',
    '/sign-in*',
    '/sign-up*',
    '/api/webhooks/clerk',
    '/api/webhooks/stripe',
  ],
  // Ignoriere bestimmte Routen
  ignoredRoutes: [
    '/_next',
    '/favicon.ico',
    '/api/health',
  ],
  debug: true
});

export const config = {
  matcher: [
    // Vereinfachte Matcher-Syntax ohne Capturing Groups
    '/((?!_next|api|trpc).*)',
    '/',
    '/api/:path*',
    '/trpc/:path*'
  ],
};