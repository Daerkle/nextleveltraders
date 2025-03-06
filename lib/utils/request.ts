import type { NextRequest } from "next/server";

interface RequestGeoData {
  country?: string | null;
  city?: string | null;
  region?: string | null;
}

/**
 * Extracts the client IP address from a Next.js request
 */
export function getRequestIp(request: NextRequest): string {
  // Try to get IP from Cloudflare headers
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;

  // Try to get IP from X-Forwarded-For header
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ips = forwardedFor.split(",").map((ip) => ip.trim());
    if (ips[0]) return ips[0];
  }

  // Try to get IP from X-Real-IP header
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  // Get IP from request connection
  const addr = request.nextUrl.hostname;
  return addr || "127.0.0.1";
}

/**
 * Extracts authentication token from request headers
 */
export function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

/**
 * Returns true if request is from a bot/crawler
 */
export function isBot(request: NextRequest): boolean {
  const ua = request.headers.get("user-agent") || "";
  return /bot|crawler|spider|crawling/i.test(ua);
}

/**
 * Returns true if request is an API request
 */
export function isApiRequest(request: NextRequest): boolean {
  return request.nextUrl.pathname.startsWith("/api/");
}

/**
 * Returns true if request accepts JSON response
 */
export function acceptsJson(request: NextRequest): boolean {
  const accept = request.headers.get("accept");
  return accept?.includes("application/json") || false;
}

/**
 * Returns request geolocation data from headers
 */
export function getRequestGeo(request: NextRequest): RequestGeoData {
  return {
    country: request.headers.get("cf-ipcountry") || 
             request.headers.get("x-vercel-ip-country") ||
             null,
    city: request.headers.get("cf-ipcity") ||
          request.headers.get("x-vercel-ip-city") ||
          null,
    region: request.headers.get("cf-region") ||
            request.headers.get("x-vercel-ip-region") ||
            null,
  };
}

/**
 * Returns true if request is a prefetch request
 */
export function isPrefetch(request: NextRequest): boolean {
  const purpose = request.headers.get("purpose") || 
                 request.headers.get("x-purpose") || 
                 request.headers.get("moz-purpose");
  
  return purpose === "prefetch";
}

/**
 * Returns true if request is from localhost
 */
export function isLocalhost(request: NextRequest): boolean {
  const host = request.headers.get("host") || "";
  return host.includes("localhost") || host.includes("127.0.0.1");
}

/**
 * Returns true if request is over HTTPS
 */
export function isSecure(request: NextRequest): boolean {
  const proto = request.headers.get("x-forwarded-proto") || 
                request.nextUrl.protocol;
  return proto === "https:";
}

/**
 * Returns the request method
 */
export function getRequestMethod(request: NextRequest): string {
  return request.method.toUpperCase();
}

/**
 * Returns true if request is from a mobile device
 */
export function isMobileRequest(request: NextRequest): boolean {
  const ua = request.headers.get("user-agent") || "";
  return /mobile|android|iphone|ipad|ipod/i.test(ua);
}

/**
 * Returns request language preferences
 */
export function getRequestLanguages(request: NextRequest): string[] {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return ["en"];

  return acceptLanguage
    .split(",")
    .map(lang => lang.split(";")[0].trim())
    .filter(Boolean);
}

/**
 * Returns the request referer if available
 */
export function getRequestReferer(request: NextRequest): string | null {
  return request.headers.get("referer");
}