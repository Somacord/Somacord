/**
 * FAQ copy for the Homepage and Membership page.
 *
 * Every answer is grounded directly in already-approved facts from
 * /somacord-docs (vision, pricing, membership) — nothing here states a
 * policy, statistic, or feature that isn't documented elsewhere.
 */

import type { FaqItemData } from "@/components/ui/faq";
import { siteConfig } from "@/config/site";

const planSummary = siteConfig.membership.plans
  .map((plan) => `${plan.label.toLowerCase()} ($${plan.price}/${plan.interval})`)
  .join(", ");

export const homeFaqs: FaqItemData[] = [
  {
    question: "What is Somacord?",
    answer:
      "Somacord is a friendship-first social club — guided conversations and local gatherings for adults who want a better social life, not another app to swipe through.",
  },
  {
    question: "Is Somacord a dating app?",
    answer:
      "No. Somacord is built around friendship, not dating or professional networking. There's no swiping, ranking, or appearance-based matching anywhere on Somacord.",
  },
  {
    question: "What is Speed Connect?",
    answer:
      "Speed Connect is a short, guided conversation experience that makes a first hello easy. It's free, with no signup commitment required to try.",
  },
  {
    question: "Where is Somacord available?",
    answer:
      "Somacord is currently live in Salt Lake City. We'll bring Somacord to more cities over time.",
  },
  {
    question: "How much does membership cost?",
    answer: `The ${siteConfig.membership.name} is ${planSummary}. It includes unlimited RSVPs, unlimited Speed Connect, member discounts on Official Somacord Events, and the ability to create your own gatherings. Browsing gatherings and trying Speed Connect don't require a membership at all.`,
  },
];

export const membershipFaqs: FaqItemData[] = [
  {
    question: `What's included in the ${siteConfig.membership.name}?`,
    answer:
      "Community access, local experiences (gatherings), ongoing Speed Connect access, member discovery & conversations, and the ability to create your own gatherings — the same benefits on every plan.",
  },
  {
    question: "Do Community Partners pay for a Somacord Membership?",
    answer:
      "No — Community Partners are organizations, not members, so they don't purchase the Somacord Membership at all. They partner with Somacord differently, from a one-time event to an ongoing relationship. See the Community Partners page for how that works.",
  },
  {
    question: "Do I need to be a member to try Speed Connect?",
    answer:
      "No. Free accounts get limited Speed Connect access at no cost — membership gets you unlimited sessions.",
  },
  {
    question: "Can I create my own gatherings?",
    answer: `Yes — creating gatherings is included in the ${siteConfig.membership.name}, and Community Partners can create their own events too.`,
  },
];
