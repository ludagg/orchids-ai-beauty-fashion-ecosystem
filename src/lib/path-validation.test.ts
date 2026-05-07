import { expect, test, describe } from "bun:test";
import { validateSafePathSegment } from "./path-validation";

describe("validateSafePathSegment", () => {
    test("should accept valid alphanumeric IDs", () => {
        expect(() => validateSafePathSegment("abc123DEF", "id")).not.toThrow();
    });

    test("should accept IDs with hyphens and underscores", () => {
        expect(() => validateSafePathSegment("abc-123_DEF", "id")).not.toThrow();
    });

    test("should reject IDs with dots (directory traversal attempt)", () => {
        expect(() => validateSafePathSegment("..", "id")).toThrow();
        expect(() => validateSafePathSegment("abc.123", "id")).toThrow();
    });

    test("should reject IDs with slashes (directory traversal attempt)", () => {
        expect(() => validateSafePathSegment("abc/123", "id")).toThrow();
    });

    test("should reject IDs with backslashes", () => {
        expect(() => validateSafePathSegment("abc\\123", "id")).toThrow();
    });

    test("should reject empty IDs", () => {
        expect(() => validateSafePathSegment("", "id")).toThrow();
    });

    test("should reject IDs with special characters", () => {
        expect(() => validateSafePathSegment("abc!123", "id")).toThrow();
    });
});
