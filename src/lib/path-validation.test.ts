import { describe, it, expect } from 'vitest';
import { validateSafePathSegment } from './path-validation';

describe('validateSafePathSegment', () => {
  it('should accept valid alphanumeric IDs', () => {
    expect(() => validateSafePathSegment('abc', 'id')).not.toThrow();
    expect(() => validateSafePathSegment('123', 'id')).not.toThrow();
    expect(() => validateSafePathSegment('abc123', 'id')).not.toThrow();
  });

  it('should accept IDs with hyphens and underscores', () => {
    expect(() => validateSafePathSegment('foo-bar', 'id')).not.toThrow();
    expect(() => validateSafePathSegment('foo_bar', 'id')).not.toThrow();
    expect(() => validateSafePathSegment('foo-bar_baz', 'id')).not.toThrow();
  });

  it('should reject IDs with dots (directory traversal attempt)', () => {
    expect(() => validateSafePathSegment('..', 'id')).toThrow(/Invalid id/);
    expect(() => validateSafePathSegment('.', 'id')).toThrow(/Invalid id/);
    expect(() => validateSafePathSegment('foo.bar', 'id')).toThrow(/Invalid id/);
  });

  it('should reject IDs with slashes (directory traversal attempt)', () => {
    expect(() => validateSafePathSegment('foo/bar', 'id')).toThrow(/Invalid id/);
    expect(() => validateSafePathSegment('/foo', 'id')).toThrow(/Invalid id/);
    expect(() => validateSafePathSegment('foo/', 'id')).toThrow(/Invalid id/);
  });

  it('should reject IDs with backslashes', () => {
    expect(() => validateSafePathSegment('foo\\bar', 'id')).toThrow(/Invalid id/);
  });

  it('should reject empty IDs', () => {
    expect(() => validateSafePathSegment('', 'id')).toThrow(/id is required/);
  });

  it('should reject IDs with special characters', () => {
    expect(() => validateSafePathSegment('foo@bar', 'id')).toThrow(/Invalid id/);
    expect(() => validateSafePathSegment('foo bar', 'id')).toThrow(/Invalid id/); // Space
  });
});
