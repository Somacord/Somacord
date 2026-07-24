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
  .join(" or ");

export const homeFaqs: FaqItemData[] = [
  {
    question: "What is Somacord?",
    answer:
      "Somacord is a social club built around friendship. Enjoy guided conversations and local gatherings for a better social life instead of another app to swipe through.",
  },
  {
    question: "Do I have to pay to join?",
    answer:
      "No. Creating a Somacord account is free. You can browse gatherings. Build a profile. RSVP. Try Speed Connect without paying anything. Somacord Membership ($29/month) is an optional upgrade for later if you'd like to support Somacord as an early member.",
  },
  {
    question: "Is Somacord a dating app?",
    answer:
      "No. Somacord is built around friendship. It is not for dating or professional networking. There is no swiping or ranking or matching based on appearance anywhere on Somacord.",
  },
  {
    question: "What is Speed Connect?",
    answer:
      "Speed Connect is a short guided conversation experience that makes a first hello easy. It's free. No signup commitment is required to try.",
  },
  {
    question: "Where is Somacord available?",
    answer:
      "Somacord is currently live in Salt Lake City. We'll bring Somacord to more cities over time.",
  },
  {
    question: "When is the first event?",
    answer:
      "We're building the founding Salt Lake City community right now. Create your free account and we'll email you the moment the first event is announced.",
  },
  {
    question: "How much does membership cost?",
    answer: `The ${siteConfig.membership.name} is ${planSummary}. It is one flat price that directly supports Somacord as we grow. Browsing gatherings and RSVPing and trying Speed Connect are all free. None of that requires a membership.`,
  },
];

export const membershipFaqs: FaqItemData[] = [
  {
    question: "Do I need to become a member to use Somacord?",
    answer:
      "No. Creating an account is free. Browsing gatherings is free. RSVPing is free. Trying Speed Connect is free. Membership is an optional way to support Somacord once you've experienced it. It is never a requirement to join.",
  },
  {
    question: `What's included in the ${siteConfig.membership.name}?`,
    answer:
      "One flat price. No tiers. No extra fees. Membership directly supports Somacord as we grow. The core experience (gatherings and RSVPs and Speed Connect) is the same whether or not you're a member.",
  },
  {
    question: "Do Community Partners pay for a Somacord Membership?",
    answer:
      "No. Community Partners are organizations. They are not members. They do not purchase the Somacord Membership at all. They partner with Somacord differently. That can range from a single event to an ongoing relationship. See the Community Partners page for how that works.",
  },
  {
    question: "Do I need to be a member to try Speed Connect?",
    answer: "No. Speed Connect is free to try whether or not you have a membership.",
  },
  {
    question: "Can I create my own gatherings?",
    answer:
      "Yes. Any user who is signed in can create and host a gathering whether or not they have a membership. Community Partners can create their own events too.",
  },
];
