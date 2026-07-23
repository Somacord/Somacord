"use server";

import type { PartnerInquiryActionState } from "@/lib/actions/partner-inquiry-state";
import { siteConfig } from "@/config/site";
import { EMAIL_FROM, getResendClient } from "@/lib/resend";

/**
 * Sends a Community Partner inquiry to the team via Resend. Deliberately
 * does not touch the database — no `organizations` or
 * `organization_managers` row is created here, and no account of any
 * kind. Staff review the inquiry by email and create those rows
 * manually if it's a fit — the concierge model this milestone is built
 * around. See docs/business/community-partners.md and
 * docs/business/launch-strategy.md.
 */
export async function submitPartnerInquiryAction(
  _prevState: PartnerInquiryActionState,
  formData: FormData,
): Promise<PartnerInquiryActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const organizationName = String(formData.get("organizationName") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !organizationName) {
    return {
      status: "error",
      message: "Please fill in your name, email, and organization name.",
    };
  }

  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: EMAIL_FROM,
      to: siteConfig.contactEmail,
      replyTo: email,
      subject: `Community Partner inquiry: ${organizationName}`,
      text: `Name: ${name}\nEmail: ${email}\nOrganization: ${organizationName}\n\n${message || "(no additional message)"}`,
    });
  } catch {
    return {
      status: "error",
      message: "Couldn't send your inquiry right now. Please try again shortly.",
    };
  }

  return {
    status: "success",
    message: "Thanks for reaching out — we'll be in touch soon about partnering with Somacord.",
  };
}
