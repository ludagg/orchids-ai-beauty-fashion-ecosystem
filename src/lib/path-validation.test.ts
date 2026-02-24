import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { validateSafePathSegment } from './path-validation';

describe('validateSafePathSegment', () => {
  it('should accept valid alphanumeric IDs', () => {
    assert.doesNotThrow(() => validateSafePathSegment('abc', 'id'));
    assert.doesNotThrow(() => validateSafePathSegment('123', 'id'));
    assert.doesNotThrow(() => validateSafePathSegment('abc123', 'id'));
  });

  it('should accept IDs with hyphens and underscores', () => {
    assert.doesNotThrow(() => validateSafePathSegment('foo-bar', 'id'));
    assert.doesNotThrow(() => validateSafePathSegment('foo_bar', 'id'));
    assert.doesNotThrow(() => validateSafePathSegment('foo-bar_baz', 'id'));
  });

  it('should reject IDs with dots (directory traversal attempt)', () => {
    assert.throws(() => validateSafePathSegment('..', 'id'), /Invalid id/);
    assert.throws(() => validateSafePathSegment('.', 'id'), /Invalid id/);
    assert.throws(() => validateSafePathSegment('foo.bar', 'id'), /Invalid id/);
  });

  it('should reject IDs with slashes (directory traversal attempt)', () => {
    assert.throws(() => validateSafePathSegment('foo/bar', 'id'), /Invalid id/);
    assert.throws(() => validateSafePathSegment('/foo', 'id'), /Invalid id/);
    assert.throws(() => validateSafePathSegment('foo/', 'id'), /Invalid id/);
  });

  it('should reject IDs with backslashes', () => {
    assert.throws(() => validateSafePathSegment('foo\\bar', 'id'), /Invalid id/);
  });

  it('should reject empty IDs', () => {
    assert.throws(() => validateSafePathSegment('', 'id'), /id is required/);
  });

  it('should reject IDs with special characters', () => {
    assert.throws(() => validateSafePathSegment('foo@bar', 'id'), /Invalid id/);
    assert.throws(() => validateSafePathSegment('foo bar', 'id'), /Invalid id/); // Space
  });
});
