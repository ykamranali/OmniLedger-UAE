// OmniInvoice UAE - RFC 6238 Standard Time-Based One-Time Password (TOTP)
// Native Node.js crypto implementation for Google Authenticator / Microsoft Authenticator
import crypto from "crypto";

const BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Encodes a buffer into RFC 4648 Base32 string (without padding)
 */
export function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += BASE32_CHARS[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_CHARS[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Decodes an RFC 4648 Base32 string into a Buffer
 */
export function base32Decode(base32Str: string): Buffer {
  const cleaned = base32Str.toUpperCase().replace(/=+$/, "").replace(/[^A-Z2-7]/g, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < cleaned.length; i++) {
    const val = BASE32_CHARS.indexOf(cleaned[i]);
    if (val === -1) continue;

    value = (value << 5) | val;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

/**
 * Generates a random cryptographic 20-byte secret for TOTP (160-bit key)
 */
export function generateRandomTotpSecret(): string {
  const randomBytes = crypto.randomBytes(20);
  return base32Encode(randomBytes);
}

/**
 * Generates an RFC 6238 TOTP token for a given timestamp
 * @param secret Base32-encoded secret key
 * @param timestamp Epoch milliseconds (default: Date.now())
 * @param step Window in seconds (default: 30)
 * @param digits Number of digits in token (default: 6)
 */
export function generateTotpToken(
  secret: string,
  timestamp: number = Date.now(),
  step: number = 30,
  digits: number = 6
): string {
  const key = base32Decode(secret);
  const counter = Math.floor(timestamp / 1000 / step);

  // 8-byte big-endian buffer for counter
  const counterBuf = Buffer.alloc(8);
  counterBuf.writeBigInt64BE(BigInt(counter));

  // HMAC-SHA1 as per RFC 6238 / RFC 4226
  const hmac = crypto.createHmac("sha1", key);
  hmac.update(counterBuf);
  const digest = hmac.digest();

  // Dynamic truncation
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const otp = binary % Math.pow(10, digits);
  return otp.toString().padStart(digits, "0");
}

/**
 * Verifies a given TOTP token allowing a +/- 1 step time-drift window (90s tolerance)
 */
export function verifyTotpToken(
  token: string,
  secret: string,
  options?: { window?: number; step?: number; digits?: number; timestamp?: number }
): boolean {
  if (!token || typeof token !== "string") return false;
  const cleanToken = token.trim();
  const digits = options?.digits ?? 6;
  if (cleanToken.length !== digits || !/^\d+$/.test(cleanToken)) return false;

  const window = options?.window ?? 1; // +/- 1 step drift
  const step = options?.step ?? 30;
  const now = options?.timestamp ?? Date.now();

  for (let offset = -window; offset <= window; offset++) {
    const checkTime = now + offset * step * 1000;
    const expected = generateTotpToken(secret, checkTime, step, digits);
    if (crypto.timingSafeEqual(Buffer.from(cleanToken), Buffer.from(expected))) {
      return true;
    }
  }

  return false;
}

/**
 * Constructs an otpauth:// URI for QR code generation
 */
export function getTotpAuthUri(
  accountName: string,
  secret: string,
  issuer: string = "OmniLedger UAE"
): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedAccount = encodeURIComponent(accountName);
  return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

/**
 * Deterministically derives a secret for a user if an external TOTP secret is not yet stored
 * Ensures that privileged users always have a consistent TOTP secret without requiring migration
 */
export function getUserTotpSecret(userId: string, email: string): string {
  const masterKey = process.env.APP_SECRET || "omni-totp-master-seed-uae-salt-2025";
  const hmac = crypto.createHmac("sha256", masterKey);
  hmac.update(`totp:${userId}:${email.toLowerCase().trim()}`);
  return base32Encode(hmac.digest().subarray(0, 20));
}
