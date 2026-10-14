// UAE Federal Tax Authority (FTA) - Tax Registration Number (TRN) Validation
// Rules:
// 1. TRN must be exactly 15 digits long
// 2. TRN must start with '100' (standard UAE FTA entity prefix)
// 3. Must be purely numeric with no alphabetic or special characters

export interface TrnValidationResult {
  isValid: boolean;
  formattedTrn?: string;
  error?: string;
}

export function validateUaeTrn(trn: string | null | undefined): TrnValidationResult {
  if (!trn || typeof trn !== "string") {
    return {
      isValid: false,
      error: "TRN is mandatory for UAE VAT-registered businesses.",
    };
  }

  // Strip hyphens, spaces, and formatting
  const sanitized = trn.replace(/[\s-]/g, "");

  if (!/^\d+$/.test(sanitized)) {
    return {
      isValid: false,
      error: "TRN must contain digits only.",
    };
  }

  if (sanitized.length !== 15) {
    return {
      isValid: false,
      error: `TRN must be exactly 15 digits long (received ${sanitized.length} digits).`,
    };
  }

  if (!sanitized.startsWith("100")) {
    return {
      isValid: false,
      error: "Valid UAE Tax Registration Numbers must start with prefix '100'.",
    };
  }

  // Format as standard UAE FTA grouping: 100-XXXX-XXXX-XXXX
  const formattedTrn = `${sanitized.slice(0, 3)}-${sanitized.slice(3, 7)}-${sanitized.slice(7, 11)}-${sanitized.slice(11, 15)}`;

  return {
    isValid: true,
    formattedTrn,
  };
}
