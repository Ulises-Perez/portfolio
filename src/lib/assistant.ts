/**
 * The assistant of the Connect desk.
 *
 * A small, deterministic conversation: every answer is a template over the
 * site config and the GitHub snapshot, so nothing is invented and nothing
 * leaves the browser. An intent is a list of words the visitor might use; the
 * best-scoring intent wins, and when nothing scores the assistant says so and
 * offers the real channels instead of guessing.
 *
 * The engine is pure: the component reads `reply()` and draws it.
 */

import { site } from "../data/site.config.ts";
import { languages, repoCount, totalBytes, yearsOnGitHub } from "./github.ts";
import { formatBytes } from "./utils.ts";

export type QuickReply = string;

export type Answer = {
  /** The id of the intent that answered, for tests and for the transcript. */
  id: string;
  /** The body, one paragraph per line. */
  lines: string[];
  /** Follow-up questions the visitor can press. */
  quick?: QuickReply[];
  /** The channels to open, when the answer is "talk to me". */
  links?: { label: string; href: string }[];
};

type Intent = {
  id: string;
  /** Words that point at this intent. Matched as substrings, not exact. */
  words: string[];
  answer: () => Answer;
};

const stack = languages
  .slice(0, 5)
  .map((language) => language.name)
  .join(", ");

const channels = [
  ...(site.contact.email
    ? [{ label: "email", href: `mailto:${site.contact.email}` }]
    : []),
  { label: "github", href: site.contact.github },
];

const INTENTS: Intent[] = [
  {
    id: "greeting",
    words: ["hello", "hi", "hey", "hola", "buenas", "buenos", "saludos"],
    answer: () => ({
      id: "greeting",
      lines: [
        "Hello. I'm the assistant for this portfolio. Ask me what you need built.",
      ],
      quick: ["Can you build a landing page?", "What do you charge?", "Are you available?"],
    }),
  },
  {
    id: "landing",
    words: ["landing", "one page", "onepage", "single page", "promo", "launch page"],
    answer: () => ({
      id: "landing",
      lines: [
        "Yes, a landing page is the usual first job. One page, one promise, one action.",
        "You get the copy structure, the design, the build, the deployment and the form or booking wired to wherever you collect leads.",
        "Typical shape: a week of shaping, then a week of build. Small ones land faster.",
      ],
      quick: ["How long does it take?", "What do you charge?", "How do we start?"],
    }),
  },
  {
    id: "website",
    words: ["website", "web site", "site", "web", "page", "portfolio", "frontend", "front-end"],
    answer: () => ({
      id: "website",
      lines: [
        "Yes. Sites are the core of the work: marketing pages, product sites, catalogues and small apps.",
        "Front end, back end and the pipeline that ships it: one person, one stack, no handoffs.",
      ],
      quick: ["Can you build a landing page?", "Which technologies?", "How do we start?"],
    }),
  },
  {
    id: "ecommerce",
    words: ["shop", "store", "ecommerce", "e-commerce", "cart", "checkout", "payments", "stripe"],
    answer: () => ({
      id: "ecommerce",
      lines: [
        "Yes, storefronts, catalogues and checkouts. Payments through a provider you already use, or one I set up.",
        "For a small catalogue the site can be lighter than a full platform; for a real shop with stock and orders, the stack changes. Tell me the volume.",
      ],
      quick: ["What do you charge?", "Which technologies?", "How do we start?"],
    }),
  },
  {
    id: "automation",
    words: ["automation", "automate", "bot", "scrape", "scraping", "script", "pipeline", "ci", "tooling", "integration", "api"],
    answer: () => ({
      id: "automation",
      lines: [
        "Yes. That is the second half of the work: the parts that keep running when nobody is watching.",
        "Scrapers, scheduled jobs, internal tools, API integrations, CI pipelines and the services behind them.",
      ],
      quick: ["Can you integrate an API?", "What do you charge?", "How do we start?"],
    }),
  },
  {
    id: "ai",
    words: ["ai", "llm", "gpt", "claude", "chatbot", "machine learning"],
    answer: () => ({
      id: "ai",
      lines: [
        "Yes, assistants and LLM features wired into a product: a chat on a site, a summariser, a search that answers.",
        "The integration is the easy part. The work is the prompts, the guardrails, the cost per request and the fallback when the model is wrong.",
      ],
      quick: ["Can you build a landing page?", "How do we start?", "What do you charge?"],
    }),
  },
  {
    id: "stack",
    words: ["stack", "technolog", "tech", "framework", "language", "vue", "react", "php", "rust", "typescript", "laravel", "next"],
    answer: () => ({
      id: "stack",
      lines: [
        `The stack I work in most: ${stack}.`,
        `${languages.length} languages and ${formatBytes(totalBytes)} of committed code on the public account, measured by bytes. The numbers come from a snapshot of GitHub, not from a brochure.`,
        "If your project already has a stack, I work in it rather than rewriting it.",
      ],
      quick: ["Can you build a landing page?", "Can you maintain an existing site?", "How do we start?"],
    }),
  },
  {
    id: "price",
    words: [
      "price", "pricing", "cost", "cuesta", "cuanto", "precio", "charge",
      "rate", "budget", "how much", "vale", "tarifa",
    ],
    answer: () => ({
      id: "price",
      lines: [
        "A landing page usually starts around a few hundred; a full site with a backend is in the low thousands. It depends on the pages, the integrations and whether there is a design already.",
        "I quote after a short call, in writing, with what is included and what is not. No hourly surprises.",
      ],
      quick: ["How long does it take?", "Are you available?", "How do we start?"],
    }),
  },
  {
    id: "time",
    words: ["how long", "timeline", "deadline", "when", "weeks", "days", "urgent", "rush"],
    answer: () => ({
      id: "time",
      lines: [
        "A landing page: about a week to two, depending on the copy and the feedback loop.",
        "A site with a backend: two to four weeks. An integration or an automation: days, not weeks.",
        "If the date is fixed, say it at the start: scope is what moves, not the date.",
      ],
      quick: ["What do you charge?", "How do we start?", "Are you available?"],
    }),
  },
  {
    id: "availability",
    words: ["available", "availability", "hire", "free", "open", "start", "when can", "disponible"],
    answer: () => ({
      id: "availability",
      lines: [
        `Open to contracts, freelance projects and full-time work. ${site.roles.join(", ")}.`,
        `Based ${"remote"}, working across time zones.`,
      ],
      quick: ["How do we start?", "What do you charge?", "Where can I see your work?"],
      links: channels,
    }),
  },
  {
    id: "maintenance",
    words: ["maintain", "maintenance", "support", "fix", "bug", "update", "existing"],
    answer: () => ({
      id: "maintenance",
      lines: [
        "Yes, I take on existing sites: a fix, a migration, a dependency that has to move, or a monthly retainer to keep it alive.",
        "For an inherited codebase I start by reading it and telling you what is worth keeping.",
      ],
      quick: ["Can you build a landing page?", "What do you charge?", "How do we start?"],
    }),
  },
  {
    id: "work",
    words: ["work", "project", "portfolio", "example", "case", "show me", "trabajos"],
    answer: () => ({
      id: "work",
      lines: [
        `Six featured repositories are open in Project Hub. ${repoCount} public in total, ${yearsOnGitHub} years of commits.`,
        "Open Project Hub from the dock to see each one with its stack and a drawn screen of the product.",
      ],
      quick: ["Can you build a landing page?", "Which technologies?", "How do we start?"],
    }),
  },
  {
    id: "contact",
    words: ["contact", "email", "mail", "reach", "talk", "whatsapp", "discord", "github", "linkedin", "redes"],
    answer: () => ({
      id: "contact",
      lines: [
        "Fastest is email: one line about what you are building and the date you need it. I answer honestly, including when I am not the right person.",
        "GitHub is where the code lives, and the handle is on this screen.",
      ],
      links: channels,
      quick: ["Are you available?", "What do you charge?", "How do we start?"],
    }),
  },
  {
    id: "start",
    words: ["start", "begin", "process", "next step", "how do we", "proposal", "quote"],
    answer: () => ({
      id: "start",
      lines: [
        "Three steps. First, a short call or an email with the goal and the date. Second, a written scope with the price and what is out of it. Third, a deposit and the first build.",
        "You get a working link from the first week, not at the end.",
      ],
      links: channels,
      quick: ["What do you charge?", "How long does it take?", "Are you available?"],
    }),
  },
  {
    id: "remote",
    words: [
      "remote", "remoto", "where", "location", "timezone", "time zone",
      "country", "based", "españa", "spain", "ubicacion",
    ],
    answer: () => ({
      id: "remote",
      lines: [
        "Remote, worldwide. No office, no commute, no time-zone ceremony. I overlap with the client's hours where it matters.",
      ],
      quick: ["Are you available?", "How do we start?"],
    }),
  },
  {
    id: "language",
    words: ["language", "english", "spanish", "español", "hablas", "idioma"],
    answer: () => ({
      id: "language",
      lines: ["Spanish and English, written and spoken. The code and the commits are in English."],
      quick: ["Are you available?", "How do we start?"],
    }),
  },
];

/** The words that carry no meaning of their own in a question. */
const NOISE = new Set([
  "a", "an", "the", "do", "does", "can", "could", "would", "you", "your", "me",
  "my", "i", "we", "is", "are", "to", "for", "of", "and", "or", "with", "how",
  "what", "when", "where", "who", "why", "it", "this", "that", "please", "hi",
  "que", "qué", "como", "cómo", "me", "puedes", "hacer", "una", "un", "el",
  "la", "de", "y", "o", "para", "por", "con", "mi", "tu", "tus", "tiene",
]);

export const tokens = (text: string): string[] =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9-]+/)
    .filter((word) => word.length > 0 && !NOISE.has(word));

/**
 * How well an intent answers a question. Higher is better; 0 means no match.
 *
 * A short word ("ai", "api") is matched as a whole token: "available" ends in
 * the letters of "ai" but has nothing to do with it, and a desk that answers
 * an availability question with a lecture on models is broken. Longer words
 * are matched inside a token, so "landing" finds "landings".
 */
export function score(intent: Intent, question: string): number {
  const text = question
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  const words = new Set(tokens(question));

  return intent.words.reduce((total, word) => {
    const needle = word.toLowerCase();

    if (needle.includes(" ")) {
      return total + (text.includes(needle) ? 3 : 0);
    }

    if (needle.length <= 3) {
      return total + (words.has(needle) ? 2 : 0);
    }

    return total + (text.includes(needle) ? 2 : 0);
  }, 0);
}

/** The answer to a question. Always an answer: never an empty screen. */
export function reply(question: string): Answer {
  const clean = question.trim();

  if (!clean) {
    return {
      id: "empty",
      lines: ["Ask me anything about the work: a landing page, a store, an integration."],
      quick: ["Can you build a landing page?", "What do you charge?", "Are you available?"],
    };
  }

  const ranked = INTENTS.map((intent) => ({
    intent,
    points: score(intent, clean),
  })).sort((a, b) => b.points - a.points);

  if (ranked[0].points === 0) {
    // Nothing matched: answer with the truth and the way out, not a guess.
    return {
      id: "fallback",
      lines: [
        "I could not match that to anything on this desk. I would rather say so than invent an answer.",
        "Ask about a landing page, a site, a store, an integration, price, timing or availability, or write directly.",
      ],
      links: channels,
      quick: ["Can you build a landing page?", "What do you charge?", "How do we start?"],
    };
  }

  return ranked[0].intent.answer();
}

/** The questions the desk offers before the visitor types anything. */
export const OPENERS: QuickReply[] = [
  "Can you build a landing page?",
  "How much does a site cost?",
  "How long does it take?",
  "Are you available?",
  "Which technologies?",
  "How do we start?",
];

/** Exported for the tests: the intents themselves, without their answers. */
export const INTENT_IDS = INTENTS.map((intent) => intent.id);
