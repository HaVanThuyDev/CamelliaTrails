import crypto from 'crypto';

// Standard JWT Secret Key
export const JWT_SECRET = process.env.JWT_SECRET || 'camellia_tours_jwt_secret_key_11032003_secure';

/**
 * Hash a password using SHA-256
 */
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Base64Url Encoding Helper
 */
function base64url(buf: Buffer): string {
  return buf.toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Base64Url Decoding Helper
 */
function base64urlDecode(str: string): string {
  // Add padding back if missing
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Sign payload to generate a standard JWT Access Token
 */
export function signToken(payload: any, secret: string = JWT_SECRET, expiresInSeconds: number = 86400): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds
  };

  const headerB64 = base64url(Buffer.from(JSON.stringify(header)));
  const payloadB64 = base64url(Buffer.from(JSON.stringify(fullPayload)));

  const signatureInput = `${headerB64}.${payloadB64}`;
  const signature = crypto.createHmac('sha256', secret)
    .update(signatureInput)
    .digest();
  
  const signatureB64 = base64url(signature);

  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

/**
 * Verify standard JWT Token and return the payload if valid
 */
export function verifyToken(token: string, secret: string = JWT_SECRET): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const signatureInput = `${headerB64}.${payloadB64}`;
    
    // Verify signature
    const expectedSignature = crypto.createHmac('sha256', secret)
      .update(signatureInput)
      .digest();
    const expectedSignatureB64 = base64url(expectedSignature);

    if (signatureB64 !== expectedSignatureB64) {
      return null; // Invalid signature
    }

    const payload = JSON.parse(base64urlDecode(payloadB64));
    
    // Verify expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Token expired
    }

    return payload;
  } catch (err) {
    return null; // Parsing or verification error
  }
}
