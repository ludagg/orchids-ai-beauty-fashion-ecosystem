/**
 * Validates that a path segment (like an ID) is safe for use in a file path.
 * It must only contain alphanumeric characters, underscores, or hyphens.
 * This prevents directory traversal attacks.
 *
 * @param segment The string to validate (e.g., salonId, productId)
 * @param paramName The name of the parameter for error messages
 * @throws Error if the segment is invalid
 */
export function validateSafePathSegment(segment: string, paramName: string): void {
  if (!segment) {
    throw new Error(`${paramName} is required`);
  }

  // Allow only alphanumeric, underscore, and hyphen.
  // This covers UUIDs, Nanoids, and typical database IDs.
  // It explicitly rejects '.', '/', '\', etc.
  const isValid = /^[a-zA-Z0-9_-]+$/.test(segment);

  if (!isValid) {
    throw new Error(`Invalid ${paramName}: contains unsafe characters`);
  }
}
