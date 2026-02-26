/**
 * Email templates — inline HTML templates for transactional emails.
 *
 * Each function returns `{ subject, html, text }` ready to pass to `sendEmail`.
 * Uses simple inline styles for maximum email client compatibility.
 */

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "SaaS Starter"
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

interface EmailContent {
	subject: string
	html: string
	text: string
}

/** Shared wrapper for consistent email layout. */
function wrap(body: string): string {
	return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:24px 32px;background:#1a1a2e;text-align:center;">
              <a href="${appUrl}" style="color:#ffffff;font-size:20px;font-weight:bold;text-decoration:none;">${appName}</a>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:#f9fafb;text-align:center;font-size:12px;color:#6b7280;">
              <p style="margin:0;">&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
              <p style="margin:4px 0 0;"><a href="${appUrl}/privacy" style="color:#6b7280;">Privacy</a> &middot; <a href="${appUrl}/terms" style="color:#6b7280;">Terms</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim()
}

/** Primary CTA button. */
function button(text: string, url: string): string {
	return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr>
      <td align="center">
        <a href="${url}" style="display:inline-block;padding:12px 32px;background:#6366f1;color:#ffffff;font-weight:600;border-radius:8px;text-decoration:none;font-size:14px;">${text}</a>
      </td>
    </tr>
  </table>`
}

/* -------------------------------------------------------------------------- */
/*  Templates                                                                  */
/* -------------------------------------------------------------------------- */

/** Welcome email sent after registration. */
export function welcomeEmail(name: string): EmailContent {
	const greeting = name ? `Hi ${name},` : "Hi there,"

	return {
		subject: `Welcome to ${appName}!`,
		html: wrap(`
      <h2 style="margin:0 0 16px;font-size:20px;color:#1a1a2e;">${greeting}</h2>
      <p style="color:#374151;line-height:1.6;">
        Thanks for signing up for <strong>${appName}</strong>! We're excited to have you on board.
      </p>
      <p style="color:#374151;line-height:1.6;">
        Your account is ready. Click below to get started:
      </p>
      ${button("Go to Dashboard", `${appUrl}/app/dashboard`)}
      <p style="color:#6b7280;font-size:13px;">
        If you have any questions, just reply to this email — we're here to help.
      </p>
    `),
		text: `${greeting}\n\nThanks for signing up for ${appName}! Your account is ready.\n\nGo to your dashboard: ${appUrl}/app/dashboard\n\nIf you have questions, reply to this email.`,
	}
}

/** Password reset email. */
export function passwordResetEmail(
	name: string,
	resetUrl: string
): EmailContent {
	const greeting = name ? `Hi ${name},` : "Hi,"

	return {
		subject: `Reset your ${appName} password`,
		html: wrap(`
      <h2 style="margin:0 0 16px;font-size:20px;color:#1a1a2e;">${greeting}</h2>
      <p style="color:#374151;line-height:1.6;">
        We received a request to reset your password. Click the button below to choose a new one:
      </p>
      ${button("Reset Password", resetUrl)}
      <p style="color:#6b7280;font-size:13px;">
        This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
      </p>
    `),
		text: `${greeting}\n\nWe received a request to reset your password.\n\nReset your password: ${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`,
	}
}

/** Email verification. */
export function verificationEmail(
	name: string,
	verifyUrl: string
): EmailContent {
	const greeting = name ? `Hi ${name},` : "Hi,"

	return {
		subject: `Verify your ${appName} email`,
		html: wrap(`
      <h2 style="margin:0 0 16px;font-size:20px;color:#1a1a2e;">${greeting}</h2>
      <p style="color:#374151;line-height:1.6;">
        Please verify your email address by clicking the button below:
      </p>
      ${button("Verify Email", verifyUrl)}
      <p style="color:#6b7280;font-size:13px;">
        If you didn't create an account, you can safely ignore this email.
      </p>
    `),
		text: `${greeting}\n\nPlease verify your email: ${verifyUrl}\n\nIf you didn't create an account, ignore this email.`,
	}
}

/** Subscription confirmation. */
export function subscriptionConfirmationEmail(
	name: string,
	planName: string
): EmailContent {
	const greeting = name ? `Hi ${name},` : "Hi,"

	return {
		subject: `Subscription confirmed — ${planName}`,
		html: wrap(`
      <h2 style="margin:0 0 16px;font-size:20px;color:#1a1a2e;">${greeting}</h2>
      <p style="color:#374151;line-height:1.6;">
        Your subscription to <strong>${planName}</strong> has been confirmed! 🎉
      </p>
      <p style="color:#374151;line-height:1.6;">
        You now have access to all the features included in your plan. You can manage your subscription at any time from your account settings.
      </p>
      ${button("Manage Subscription", `${appUrl}/app/account/billing`)}
    `),
		text: `${greeting}\n\nYour subscription to ${planName} has been confirmed!\n\nManage your subscription: ${appUrl}/app/account/billing`,
	}
}

/** Payment failed notification. */
export function paymentFailedEmail(
	name: string,
	planName: string
): EmailContent {
	const greeting = name ? `Hi ${name},` : "Hi,"

	return {
		subject: `Payment failed for ${planName}`,
		html: wrap(`
      <h2 style="margin:0 0 16px;font-size:20px;color:#1a1a2e;">${greeting}</h2>
      <p style="color:#374151;line-height:1.6;">
        We were unable to process your payment for <strong>${planName}</strong>. Please update your payment method to continue using the service.
      </p>
      ${button("Update Payment Method", `${appUrl}/app/account/billing`)}
      <p style="color:#6b7280;font-size:13px;">
        If you have questions about your billing, please don't hesitate to contact us.
      </p>
    `),
		text: `${greeting}\n\nWe were unable to process your payment for ${planName}.\n\nUpdate your payment method: ${appUrl}/app/account/billing`,
	}
}

/** Contact form submission notification (sent to admin). */
export function contactFormEmail(params: {
	name: string
	email: string
	subject: string
	message: string
}): EmailContent {
	return {
		subject: `[Contact] ${params.subject}`,
		html: wrap(`
      <h2 style="margin:0 0 16px;font-size:20px;color:#1a1a2e;">New Contact Form Submission</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:13px;width:80px;">Name</td>
          <td style="padding:8px 0;color:#374151;">${params.name}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:13px;">Email</td>
          <td style="padding:8px 0;color:#374151;"><a href="mailto:${params.email}">${params.email}</a></td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:13px;">Subject</td>
          <td style="padding:8px 0;color:#374151;">${params.subject}</td>
        </tr>
      </table>
      <div style="margin-top:16px;padding:16px;background:#f9fafb;border-radius:8px;color:#374151;line-height:1.6;">
        ${params.message.replace(/\n/g, "<br />")}
      </div>
    `),
		text: `New Contact Form Submission\n\nName: ${params.name}\nEmail: ${params.email}\nSubject: ${params.subject}\n\nMessage:\n${params.message}`,
	}
}
