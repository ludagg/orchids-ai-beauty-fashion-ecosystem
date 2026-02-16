import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  if (!resend) {
    console.log('---------------------------------------------------');
    console.log('📧 [MOCK EMAIL SERVICE] - No API Key provided');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('--- HTML Content ---');
    console.log(html);
    console.log('---------------------------------------------------');
    return { success: true, id: 'mock-id' };
  }

  try {
    const from = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });

    if (data.error) {
        console.error('Error sending email:', data.error);
        return { success: false, error: data.error };
    }

    return { success: true, id: data.data?.id };
  } catch (error) {
    console.error('Exception sending email:', error);
    return { success: false, error };
  }
}
