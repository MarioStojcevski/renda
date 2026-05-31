export type SolutionStep = {
  badge: string;
  title: string;
  body: string;
};

export const solutionSteps: SolutionStep[] = [
  {
    badge: "1",
    title: "Describe",
    body: 'Type what you want in plain English. "Make a 60-second LinkedIn video about my product launch with my logo, upbeat music, and captions." No software learning curve.',
  },
  {
    badge: "2",
    title: "Generate",
    body: "Renda's AI reads your description and builds a full video composition in 30 seconds. Boom — draft complete.",
  },
  {
    badge: "3",
    title: "Refine",
    body: "Don't like the music? Swap it. Want your own B-roll? Drop it in the timeline. Need to trim a clip? One click. You stay in control.",
  },
];

export type WorkStep = {
  step: string;
  title: string;
  body: string;
};

export const workSteps: WorkStep[] = [
  {
    step: "Step 1",
    title: "AI Panel",
    body: "Open the chat sidebar. Describe your video in natural language — no special syntax.",
  },
  {
    step: "Step 2",
    title: "Instant Draft",
    body: "Renda generates a composition with clips, transitions, music suggestions, and captions. Ready to use or ready to refactor.",
  },
  {
    step: "Step 3",
    title: "Timeline Editor",
    body: "Drag clips around. Change transitions. Add text overlays. Swap audio. All the control of Premiere with none of the complexity.",
  },
  {
    step: "Step 4",
    title: "Export",
    body: "1080p (Pro) or 720p (Free). Download and upload. Done.",
  },
];

export type Feature = {
  title: string;
  body: string;
  badge?: string;
};

export const features: Feature[] = [
  {
    title: "AI-Powered Generation",
    body: "Start with an idea, not a blank canvas. Describe what you want and get a full composition in 30 seconds. Your co-pilot handles the boring stuff.",
  },
  {
    title: "Real Timeline Control",
    body: "Not a template prison. A real, drag-and-drop timeline with full control. Transitions, text, timing, effects — all at your fingertips.",
  },
  {
    title: "BYOK (Bring Your Own Key)",
    body: "Use your own Claude or OpenAI API key. No vendor lock-in. No surprise bills. You stay in control of your AI costs.",
  },
  {
    title: "Brand Kit",
    body: "One-click brand consistency. Set your fonts, colors, and logo once. Every video uses them automatically. Save 10 minutes per edit.",
    badge: "Pro",
  },
  {
    title: "Auto-Captions",
    body: "Your audio is automatically transcribed and timed to the video. No manual syncing. Turn viewers on and reach more people.",
  },
  {
    title: "Template Library",
    body: "Don't start from scratch. Pick a template — explainer, product demo, testimonial, course intro — and describe your variation. Renda fills in the rest.",
  },
];

export type Plan = {
  name: string;
  price: string;
  period: string;
  features: string[];
  bestFor: string;
  cta: string;
  ctaTo: string;
  highlighted?: boolean;
};

export const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: [
      "Timeline editor",
      "Upload media + text",
      "Basic transitions",
      "5 projects",
      "720p export",
      "Watermark on exports",
    ],
    bestFor: "Testing, personal videos, students",
    cta: "Start free",
    ctaTo: "/editor",
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    features: [
      "Everything in Free",
      "Unlimited projects",
      "1080p export",
      "No watermark",
      "AI panel (your API key)",
      "Auto-captions",
    ],
    bestFor: "Solopreneurs, course creators, serious hobbyists",
    cta: "Start free trial",
    ctaTo: "/waitlist",
    highlighted: true,
  },
  {
    name: "Studio",
    price: "$29",
    period: "/month",
    features: [
      "Everything in Pro",
      "4K export",
      "Team seats (invite 2 others)",
      "Hosted AI panel (we pay the API costs)",
      "AI voiceover generation",
      "Priority support",
    ],
    bestFor: "Agencies, productized service providers, teams",
    cta: "Request early access",
    ctaTo: "/waitlist",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "I used to spend 3 hours editing a LinkedIn video. Now I spend 20 minutes. The AI panel gets the boring stuff done, I just make it look good.",
    name: "Sarah Chen",
    title: "LinkedIn Creator (15k followers)",
  },
  {
    quote:
      "As a course creator, I was drowning in video editing. Renda cut my editing time by 60%. I'm actually shipping videos on schedule now.",
    name: "Marcus Johnson",
    title: "Course Creator, edtech startup",
  },
  {
    quote:
      "We tested 5 different editors for our marketing team. Renda is the only one where our team doesn't need training. They just... use it.",
    name: "Lisa Rodriguez",
    title: "Marketing Manager, B2B SaaS",
  },
];

export type Faq = {
  q: string;
  a: string;
};

export const faqs: Faq[] = [
  {
    q: "Do I need to be tech-savvy?",
    a: "Nope. If you can describe a video, you can use Renda. The interface is intentionally simple. Most users never touch preferences.",
  },
  {
    q: "Can I use my own media (photos, videos, music)?",
    a: "Yes. Upload your own files, or search our built-in library. Renda works with both.",
  },
  {
    q: "What if I don't like the AI's first draft?",
    a: "Regenerate it. Describe it differently. Or start from scratch in the timeline editor. You're always in control.",
  },
  {
    q: "Do you store my videos?",
    a: "Videos are stored in your project until you export. Exports are downloaded to your computer. We never store your final videos on our servers. You own everything you create.",
  },
  {
    q: "What's the BYOK thing?",
    a: '"Bring Your Own Key." You paste your OpenAI or Claude API key into Renda. We use it to generate video compositions. You pay OpenAI/Anthropic directly, not us. No middleman markup. Total transparency.',
  },
  {
    q: "Can I export to TikTok/Instagram sizes?",
    a: "100%. Choose your export size: 1080p vertical, 1920x1080, 4K, TikTok, Instagram Reels — whatever you need.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. The Free plan is forever free. Try it risk-free. If you like it, upgrade anytime.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes. 30-day money-back guarantee on Pro. No questions asked. If it's not working for you, we'll refund it.",
  },
];
