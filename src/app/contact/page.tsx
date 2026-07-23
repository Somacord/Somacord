import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/contact-form";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the Somacord team — general questions, Community Partner inquiries, or press.`,
};

/** Contact — new page, built following the same design system as the rest of the site. */
export default function ContactPage() {
  return (
    <Section>
      <Container className="max-w-2xl">
        <div className="mb-10 text-center">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mb-3 text-[34px]">Get in touch</h1>
          <p className="text-ink-muted">
            Questions about membership, becoming a Community Partner, or anything else — send us a
            note, or email{" "}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-cord-blue font-medium underline"
            >
              {siteConfig.contactEmail}
            </a>{" "}
            directly.
          </p>
        </div>
        <ContactForm />
      </Container>
    </Section>
  );
}
