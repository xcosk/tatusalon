import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  if (!resend) {
    console.info("[email skipped]", { to, subject });
    return false;
  }

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "INK Studio <noreply@inkstudio.ru>",
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("[email error]", error);
    return false;
  }
}
