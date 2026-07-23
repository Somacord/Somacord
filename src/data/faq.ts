/**
 * FAQ copy for the Homepage and Membership page.
 *
 * Every answer is grounded directly in already-approved facts from
 * /somacord-docs (vision, pricing, membership) — nothing here states a
 * policy, statistic, or feature that isn't documented elsewhere.
 */

import type { FaqItemData } from "@/components/ui/faq";

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
    answer:
      "$39/month for the Founding Membership — one price for every member and Community Partner. It includes community access, local gatherings, ongoing Speed Connect, member discovery, and the ability to create your own gatherings.",
  },
];

export const membershipFaqs: FaqItemData[] = [
  {
    question: "What's included in the Founding Membership?",
    answer:
      "Community access, local experiences (gatherings), ongoing Speed Connect access, member discovery & conversations, and the ability to create your own gatherings.",
  },
  {
    question: "Do Community Partners pay a different price?",
    answer:
      "No — Community Partners pay the same $39/month Founding Membership as every member. The difference is role and ability, not price: partners get gathering-organizing tools and can invite their existing community into Somacord.",
  },
  {
    question: "Do I need to be a member to try Speed Connect?",
    answer:
      "No. Speed Connect is free with no signup commitment required — it's the entry point into Somacord for every new visitor.",
  },
  {
    question: "Can I create my own gatherings?",
    answer:
      "Yes — creating gatherings is included in the Founding Membership, for members and Community Partners alike.",
  },
];
