import { expect, test, describe, spyOn } from 'bun:test';
import { sendEmail } from '../email';

describe('email service', () => {
  test('sendEmail without API key (mock mode)', async () => {
    // Spy on console.log
    const logSpy = spyOn(console, 'log');
    logSpy.mockImplementation(() => {});

    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test HTML</p>'
    });

    expect(result.success).toBe(true);
    expect(result.id).toMatch(/^mock-id-\d+$/);

    // Verify mock logged correctly
    expect(logSpy).toHaveBeenCalled();
    const calls = logSpy.mock.calls;
    expect(calls.some(call => call[0] && call[0].includes('test@example.com'))).toBe(true);
    expect(calls.some(call => call[0] && call[0].includes('Test Subject'))).toBe(true);

    logSpy.mockRestore();
  });
});
