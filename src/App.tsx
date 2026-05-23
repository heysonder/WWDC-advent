import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import confetti from "canvas-confetti";

type Phase = "setup" | "rumors" | "stretch" | "keynote";

type PredictionInput =
  | { type: "textarea"; label: string }
  | { type: "fields"; fields: string[] };

type Source = {
  title: string;
  publisher: string;
  url: string;
};

type CalendarDay = {
  day: number;
  date: string;
  phase: Phase;
  title: string;
  body: string;
  sources?: Source[];
  input?: PredictionInput;
  link?: string;
  youtube?: string;
  video?: string;
};

type PhaseMeta = {
  label: string;
  title: string;
  range: string;
  color: string;
  description: string;
};

const storagePrefix = "wwdc-2026-advent";

const phaseMeta: Record<Phase, PhaseMeta> = {
  setup: {
    label: "Phase 1",
    title: "Setup",
    range: "Days 21–15",
    color: "#74c7ec",
    description: "Apple history that frames the week.",
  },
  rumors: {
    label: "Phase 2",
    title: "Rumors",
    range: "Days 14–8",
    color: "#cba6f7",
    description: "What the leaks point at.",
  },
  stretch: {
    label: "Phase 3",
    title: "Home Stretch",
    range: "Days 7–1",
    color: "#a6e3a1",
    description: "Lock in predictions before the keynote.",
  },
  keynote: {
    label: "Day 0",
    title: "Keynote",
    range: "Jun 8",
    color: "#f9e2af",
    description: "Watch live. Grade your bets.",
  },
};

const days: CalendarDay[] = [
  {
    day: 21,
    date: "2026-05-18",
    phase: "setup",
    title: "Coming bright up",
    body:
      "Apple's WWDC 2026 tagline, revealed today with media invites. Cryptic, but the glowing invite art is widely read as a tease of the new Siri interface. First door of the calendar is the teaser Apple just dropped — fitting.",
    video: "/coming-bright-up.mp4",
    sources: [
      {
        title: "Apple kicks off Worldwide Developers Conference on June 8",
        publisher: "Apple Newsroom",
        url: "https://www.apple.com/newsroom/2026/05/apple-kicks-off-worldwide-developers-conference-on-june-8/",
      },
      {
        title: "WWDC 2026 media invites read 'Coming bright up' as the June 8 conference approaches",
        publisher: "AppleInsider",
        url: "https://appleinsider.com/articles/26/05/18/wwdc-2026-media-invites-read-coming-bright-up-as-the-june-8-conference-approaches",
      },
      {
        title: "Apple's WWDC 26 invitation features the tagline 'Coming bright up'",
        publisher: "Macworld",
        url: "https://www.macworld.com/article/3142700/apples-wwdc-26-invitation-features-the-tagline-coming-bright-up.html",
      },
      {
        title: "Apple sends invites for WWDC26 keynote, unveils schedule",
        publisher: "9to5Mac",
        url: "https://9to5mac.com/2026/05/18/apple-sends-invites-for-wwdc26-keynote-unveils-schedule/",
      },
    ],
  },
  {
    day: 20,
    date: "2026-05-19",
    phase: "setup",
    title: "The Intel switch (2005)",
    body:
      "At WWDC 2005, Jobs announced Macs would move from PowerPC to Intel. Twenty-one years later, this WWDC closes that arc: macOS 26 Tahoe was the final Intel release, and macOS 27 is Apple Silicon only. Intel Macs keep getting security updates for a few more years, but the major-version era ends here. A full-circle moment most people won't notice.",
    sources: [
      {
        title: "Apple to use Intel microprocessors beginning in 2006",
        publisher: "Apple Newsroom",
        url: "https://www.apple.com/newsroom/2005/06/06Apple-to-Use-Intel-Microprocessors-Beginning-in-2006/",
      },
      {
        title: "Apple to drop Intel Mac support with macOS 27; Tahoe 26 becomes final release",
        publisher: "VideoCardz",
        url: "https://videocardz.com/newz/apple-to-drop-intel-mac-support-with-macos-27-tahoe-26-becomes-final-release",
      },
      {
        title: "Mac transition to Intel processors",
        publisher: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Mac_transition_to_Intel_processors",
      },
    ],
  },
  {
    day: 19,
    date: "2026-05-20",
    phase: "setup",
    title: "1997: The Microsoft check",
    body:
      "August 1997. Macworld Boston. Jobs — back at Apple eight months — announced Bill Gates was investing $150M. The crowd booed Gates on the screen. Apple was that close to bankrupt. Twenty-nine years later, Apple's market cap is around $4.5 trillion and it's paying ~$1B/year to Google for Gemini access. The dependency hasn't changed — just the dollar amounts and the partner.",
    sources: [
      {
        title: "August 6, 1997 — the day Apple and Microsoft made peace",
        publisher: "AppleInsider",
        url: "https://appleinsider.com/articles/18/08/06/august-6-1997----the-day-apple-and-microsoft-made-peace",
      },
      {
        title: "Steve Jobs and Bill Gates: what happened when Microsoft saved Apple",
        publisher: "CNBC",
        url: "https://www.cnbc.com/2017/08/29/steve-jobs-and-bill-gates-what-happened-when-microsoft-saved-apple.html",
      },
      {
        title: "Apple market capitalization",
        publisher: "Companies Market Cap",
        url: "https://companiesmarketcap.com/apple/marketcap/",
      },
    ],
  },
  {
    day: 18,
    date: "2026-05-21",
    phase: "setup",
    title: "1987: Knowledge Navigator",
    body:
      "39 years ago, John Sculley showed a 6-minute concept video of \"Phil\" — an AI assistant on a foldable tablet who searched papers, joined calls, and answered questions in plain English. Set in September 2011. Siri shipped a few weeks after that fictional date. Everything Apple is about to demo for the new Siri was promised in 1987. They've been late to their own future for four decades.",
    sources: [
      {
        title: "Knowledge Navigator",
        publisher: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Knowledge_Navigator",
      },
      {
        title: "25 years before Siri, Apple had the Knowledge Navigator",
        publisher: "NBC News",
        url: "https://www.nbcnews.com/tech/tech-news/25-years-siri-apple-had-knowledge-navigator-flna120157",
      },
    ],
  },
  {
    day: 17,
    date: "2026-05-22",
    phase: "setup",
    title: "The version number jump",
    body:
      "Last year Apple jumped everything to 26 to unify naming. This year: 27 across the board — iOS, watchOS, macOS, iPadOS, tvOS, visionOS, and possibly homeOS (still a rumored new platform, branding unconfirmed). homeOS is the one to watch.",
    sources: [
      {
        title: "Apple introduces iOS 26 and macOS 26 in major operating system rebrand",
        publisher: "TechCrunch",
        url: "https://techcrunch.com/2025/06/09/at-wwdc-apple-introduces-ios-26-and-macos-26-in-major-operating-system-rebrand/",
      },
      {
        title: "WWDC 2026 schedule and invites",
        publisher: "MacRumors",
        url: "https://www.macrumors.com/2026/05/18/wwdc-2026-schedule-invites/",
      },
      {
        title: "Apple's homeOS platform is coming — all the rumors and what you need to know",
        publisher: "AppleInsider",
        url: "https://appleinsider.com/articles/25/05/09/apples-homeos-platform-is-coming-all-the-rumors-and-what-you-need-to-know",
      },
    ],
  },
  {
    day: 16,
    date: "2026-05-23",
    phase: "setup",
    title: "2024: The Bella Ramsey ad",
    body:
      "September 2024. Apple runs a TV spot: Bella Ramsey asks Siri the name of someone she met at a cafe. Siri pulls it from her calendar. The feature didn't exist. The ad ran anyway. Apple quietly unlisted the video in March 2025; a class-action settled for $250M earlier this month. Whatever Federighi promises about Siri on June 8, the legal department has been over every word.",
    sources: [
      {
        title: "Apple pulls Bella Ramsey ad that promoted vaporware personalized Siri feature",
        publisher: "Daring Fireball",
        url: "https://daringfireball.net/linked/2025/03/08/apple-pulls-bella-ramsey-ad-that-promoted-vaporware-personalized-siri-feature",
      },
      {
        title: "Apple is delaying the 'more personalized Siri' Apple Intelligence features",
        publisher: "Daring Fireball",
        url: "https://daringfireball.net/2025/03/apple_is_delaying_the_more_personalized_siri_apple_intelligence_features",
      },
      {
        title: "Apple agrees to $250M settlement over 'smarter Siri' claims",
        publisher: "Fortune",
        url: "https://fortune.com/2026/05/08/apple-smarter-siri-95-class-action-refund/",
      },
    ],
  },
  {
    day: 15,
    date: "2026-05-24",
    phase: "setup",
    title: "Cook's last keynote",
    body:
      "WWDC 2026 is expected to be Tim Cook's last event as Apple CEO, with John Ternus taking over on September 1, 2026. Open question: does Cook do a full handoff moment on stage, or does Ternus stay invisible until September? Place your bet now and check it on Day 0.",
    sources: [
      {
        title: "Tim Cook to become Apple Executive Chairman; John Ternus to become Apple CEO",
        publisher: "Apple Newsroom",
        url: "https://www.apple.com/newsroom/2026/04/tim-cook-to-become-apple-executive-chairman-john-ternus-to-become-apple-ceo/",
      },
      {
        title: "Apple names John Ternus CEO, replacing Tim Cook who becomes chairman",
        publisher: "CNBC",
        url: "https://www.cnbc.com/2026/04/20/apple-names-john-ternus-ceo-replacing-tim-cook-who-becomes-chairman.html",
      },
      {
        title: "Apple's final Tim Cook keynote is on June 8",
        publisher: "Gizchina",
        url: "https://www.gizchina.com/apple/apples-final-tim-cook-keynote-is-on-june-8",
      },
    ],
  },
  {
    day: 14,
    date: "2026-05-25",
    phase: "rumors",
    title: "Siri's new look",
    body:
      "Per Mark Gurman, the WWDC 2026 invite graphic is a glimpse of the revamped Siri interface coming in iOS 27. Gurman reports the Dynamic Island will show a \"Search or Ask\" prompt with a glowing cursor when Siri is triggered. The invite art basically is this feature.",
    sources: [
      {
        title: "WWDC 2026 graphic teases iOS 27 Siri feature",
        publisher: "MacRumors",
        url: "https://www.macrumors.com/2026/04/19/wwdc-2026-graphic-teases-ios-27-feature/",
      },
      {
        title: "Apple's WWDC 2026 teaser hints at a major Siri redesign in iOS 27",
        publisher: "MacDailyNews",
        url: "https://macdailynews.com/2026/04/20/apples-wwdc-2026-teaser-hints-at-a-major-siri-redesign-in-ios-27/",
      },
      {
        title: "Apple teases major iOS 27 Siri feature",
        publisher: "MacRumors",
        url: "https://www.macrumors.com/2026/04/22/apple-teases-major-ios-27-feature/",
      },
    ],
  },
  {
    day: 13,
    date: "2026-05-26",
    phase: "rumors",
    title: "The standalone Siri app",
    body:
      "MacRumors reports Apple may introduce a standalone Siri app across iOS 27, iPadOS 27, and macOS 27 — text and voice modes, past conversations, third-party Extensions, uploads, and privacy controls that can auto-delete chats after 30 days or a year. The caution sign: Gurman says internal iOS 27 builds still label the personalized Siri experience as beta. This is the ChatGPT-app-shaped hole in Apple's lineup, but Apple may frame it as unfinished on day one.",
    sources: [
      {
        title: "iOS 27's Biggest New Feature Has 'Beta' Label",
        publisher: "MacRumors",
        url: "https://www.macrumors.com/2026/05/19/ios-27-biggest-feature-has-beta-label/",
      },
      {
        title: "iOS 27: Dedicated Siri App to Include Auto-Deleting Chats Feature",
        publisher: "MacRumors",
        url: "https://www.macrumors.com/2026/05/18/ios-27-siri-app-auto-deleting-chats-feature/",
      },
      {
        title: "iOS 27 Getting Major Siri Redesign With Chat Interface and Dedicated App",
        publisher: "MacRumors",
        url: "https://www.macrumors.com/2026/05/12/ios-27-siri-redesign/",
      },
      {
        title: "iOS 27: standalone Siri app with Extensions rumored",
        publisher: "MacRumors",
        url: "https://www.macrumors.com/2026/03/29/ios-27-siri-app-with-extensions-rumor/",
      },
      {
        title: "iOS 27 Siri overhaul: full breakdown",
        publisher: "MacRumors",
        url: "https://www.macrumors.com/2026/03/24/ios-27-siri-overhaul/",
      },
      {
        title: "Apple's AI platform bet explained",
        publisher: "Gadget Hacks",
        url: "https://apple.gadgethacks.com/news/wwdc-2026-announcement-apples-ai-platform-bet-explained/",
      },
    ],
  },
  {
    day: 12,
    date: "2026-05-27",
    phase: "rumors",
    title: "Liquid Glass, take 2",
    body:
      "The next OS cycle looks less like another giant redesign and more like cleanup. Per Gurman, macOS 27 should tweak Tahoe's Liquid Glass interface for readability, while iOS 27 is being framed as a Snow Leopard-style release: stability, efficiency, foldable prep, satellite features, and Siri. Translation: Apple shipped a loud design language last year; this year it needs the software to feel calmer and more reliable.",
    sources: [
      {
        title: "iOS 27: Everything We Know",
        publisher: "MacRumors",
        url: "https://www.macrumors.com/roundup/ios-27/",
      },
      {
        title: "iOS 27 release date, features, compatibility, Siri & Apple Intelligence rumors",
        publisher: "Macworld",
        url: "https://www.macworld.com/article/2986799/ios-27-features-compatiblity-apple-intelligence-release-date-rumors.html",
      },
      {
        title: "Report: macOS 27 to feature UI tweaks to address Tahoe design complaints",
        publisher: "9to5Mac",
        url: "https://9to5mac.com/2026/05/10/report-macos-27-to-feature-ui-tweaks-to-address-some-tahoe-design-complaints/",
      },
      {
        title: "Two macOS 27 changes rumored",
        publisher: "MacRumors",
        url: "https://www.macrumors.com/2026/05/10/two-macos-27-changes-rumored/",
      },
      {
        title: "Apple reportedly cleaning up macOS 27 after Tahoe's not-quite-baked UI",
        publisher: "The Mac Observer",
        url: "https://www.macobserver.com/news/apple-reportedly-cleaning-up-macos-27-after-tahoes-not-completely-baked-ui/",
      },
    ],
  },
  {
    day: 11,
    date: "2026-05-28",
    phase: "rumors",
    title: "Gemini lives inside Siri",
    body:
      "This moved from rumor to confirmed strategy: Apple and Google announced a multi-year Gemini collaboration in January, after Bloomberg reported a roughly $1B/year custom 1.2-trillion-parameter model for the new Siri. Apple says Gemini will help power future Apple Intelligence features while Apple keeps its privacy story around Private Cloud Compute. Watch how loudly Federighi says the word \"Gemini\" — or doesn't.",
    sources: [
      {
        title: "Apple Confirms Google Gemini Will Power Next-Generation Siri This Year",
        publisher: "MacRumors",
        url: "https://www.macrumors.com/2026/01/12/google-gemini-next-generation-siri/",
      },
      {
        title: "Google Gemini Partnership With Apple Will Go Beyond Siri Revamp",
        publisher: "MacRumors",
        url: "https://www.macrumors.com/2026/01/12/google-gemini-future-apple-intelligence-features/",
      },
      {
        title: "Apple plans to use 1.2-trillion-parameter Google Gemini model to power new Siri",
        publisher: "Bloomberg",
        url: "https://www.bloomberg.com/news/articles/2025-11-05/apple-plans-to-use-1-2-trillion-parameter-google-gemini-model-to-power-new-siri",
      },
      {
        title: "Google's Gemini to power Apple's AI features like Siri",
        publisher: "TechCrunch",
        url: "https://techcrunch.com/2026/01/12/googles-gemini-to-power-apples-ai-features-like-siri/",
      },
      {
        title: "Apple could have used Claude to power a future Siri, but Anthropic got greedy",
        publisher: "AppleInsider",
        url: "https://appleinsider.com/articles/26/01/30/apple-could-have-used-claude-to-power-a-future-siri-but-anthropic-got-greedy",
      },
      {
        title: "Apple selects Gemini for Apple Intelligence",
        publisher: "Unite.AI",
        url: "https://www.unite.ai/apple-selects-gemini-apple-intelligence/",
      },
    ],
  },
  {
    day: 10,
    date: "2026-05-29",
    phase: "rumors",
    title: "The hardware gate",
    body:
      "iOS 27 itself is rumored to support iPhone 12 and newer, but the Apple Intelligence floor remains much higher: Apple's own support page still lists iPhone 15 Pro or newer for the AI features. Quietly the most consequential split: a lot of phones may get iOS 27 while still missing the keynote feature set.",
    sources: [
      {
        title: "Apple to Unveil iOS 27 and macOS 27 Next Month With These Features",
        publisher: "MacRumors",
        url: "https://www.macrumors.com/2026/05/07/ios-27-and-macos-27-rumored-features/",
      },
      {
        title: "iOS 27 will drop support for four iPhone models, says leaker",
        publisher: "9to5Mac",
        url: "https://9to5mac.com/2026/04/20/ios-27-will-drop-support-for-four-iphone-models-says-leaker/",
      },
      {
        title: "Apple Intelligence system requirements",
        publisher: "Apple Support",
        url: "https://support.apple.com/en-us/121115",
      },
      {
        title: "iOS 27 features, compatibility, and Apple Intelligence release-date rumors",
        publisher: "Macworld",
        url: "https://www.macworld.com/article/2986799/ios-27-features-compatiblity-apple-intelligence-release-date-rumors.html",
      },
    ],
  },
  {
    day: 9,
    date: "2026-05-30",
    phase: "rumors",
    title: "Health & readiness on the Watch",
    body:
      "The Apple Watch story looks less like a full AI coach now and more like practical health surfaces. Bloomberg said Apple scaled back Project Mulberry in February, while the freshest watchOS 27 reporting is more modest: new faces, including a simplified Modular Ultra-style option. For watchOS, the believable bet is smaller: better at-a-glance health context and readiness-style insights, not a doctor in your wrist.",
    sources: [
      {
        title: "watchOS 27 to Offer New Watch Faces, Including 'Modular Ultra' Variant",
        publisher: "MacRumors",
        url: "https://www.macrumors.com/2026/05/04/watchos-27-expected-to-have-new-watch-faces/",
      },
      {
        title: "Apple unveils new accessibility features, and updates with Apple Intelligence",
        publisher: "Apple Newsroom",
        url: "https://www.apple.com/newsroom/2026/05/apple-unveils-new-accessibility-features-and-updates-with-apple-intelligence/",
      },
      {
        title: "Apple is scaling back plans for new AI-based health coach service",
        publisher: "Bloomberg",
        url: "https://www.bloomberg.com/news/articles/2026-02-05/apple-is-scaling-back-plans-for-new-ai-based-health-coach-service",
      },
      {
        title: "WWDC 2026: Everything to Expect",
        publisher: "MacRumors",
        url: "https://www.macrumors.com/roundup/wwdc/",
      },
    ],
  },
  {
    day: 8,
    date: "2026-05-31",
    phase: "rumors",
    title: "The $250M settlement",
    body:
      "Apple agreed to a $250M class action in early May over the Bella Ramsey \"more personal Siri\" ad — iPhone 16 and iPhone 15 Pro buyers can claim $25–$95 each. The settlement landed five weeks before this keynote. Whatever Siri demo Federighi gives on June 8, every Apple lawyer in the building has signed off on it. The marketing will be unusually careful.",
    sources: [
      {
        title: "Apple agrees to $250M settlement over 'smarter Siri' claims",
        publisher: "Fortune",
        url: "https://fortune.com/2026/05/08/apple-smarter-siri-95-class-action-refund/",
      },
      {
        title: "Apple agrees to $250M Siri AI promises settlement",
        publisher: "Washington Times",
        url: "https://www.washingtontimes.com/news/2026/may/7/apple-agrees-250m-settlement-siri-ai-promises/",
      },
      {
        title: "Apple agrees to $250M settlement over claims it overhyped iPhone AI features",
        publisher: "Top Class Actions",
        url: "https://topclassactions.com/lawsuit-settlements/lawsuit-news/apple-agrees-to-250m-settlement-over-claims-it-overhyped-iphone-ai-features/",
      },
    ],
  },
  {
    day: 7,
    date: "2026-06-01",
    phase: "stretch",
    title: "Your base case",
    body:
      "Write down your three most confident predictions today. Lock them in. Grade on Day 0. Format: one Siri prediction, one design prediction, one wildcard.",
    input: { type: "textarea", label: "Three confident predictions" },
  },
  {
    day: 6,
    date: "2026-06-02",
    phase: "stretch",
    title: "The developer API question",
    body:
      "The whole AI story collapses or succeeds on one question: do third-party devs get real Foundation Models and Core AI hooks with system-level intent routing, or just App Intents glue tied to a fee schedule Apple hasn't ruled out? Apple's May accessibility preview showed natural-language Voice Control moving around the system, and the current iOS 27 roundup now points to a Core AI framework replacing Core ML. Watch the Platforms State of the Union right after the keynote, not just the keynote itself.",
    sources: [
      {
        title: "iOS 27: Everything We Know",
        publisher: "MacRumors",
        url: "https://www.macrumors.com/roundup/ios-27/",
      },
      {
        title: "Apple unveils new accessibility features, and updates with Apple Intelligence",
        publisher: "Apple Newsroom",
        url: "https://www.apple.com/newsroom/2026/05/apple-unveils-new-accessibility-features-and-updates-with-apple-intelligence/",
      },
      {
        title: "Foundation Models framework",
        publisher: "Apple Developer",
        url: "https://developer.apple.com/documentation/FoundationModels",
      },
      {
        title: "Apple wants apps to integrate with Siri in iOS 27, but one fear holds some back",
        publisher: "9to5Mac",
        url: "https://9to5mac.com/2026/05/13/apple-wants-apps-integrate-siri-ios-27-one-fear-holds-some-back/",
      },
      {
        title: "Apple's Foundation Models framework unlocks new intelligent app experiences",
        publisher: "Apple Newsroom",
        url: "https://www.apple.com/newsroom/2025/09/apples-foundation-models-framework-unlocks-new-intelligent-app-experiences/",
      },
    ],
  },
  {
    day: 5,
    date: "2026-06-03",
    phase: "stretch",
    title: "Cook → Ternus choreography",
    body:
      "Refine your Day 15 bet. The current counter-signal is that WWDC 2026 looks software-heavy: recent reporting says not to expect new Macs, even though Ternus is a hardware executive about to inherit the CEO job. If he appears anyway, it probably isn't to introduce a laptop — it's to frame Apple's next decade around AI hardware, home devices, and post-iPhone categories.",
    sources: [
      {
        title: "Will there be new Macs at WWDC 2026?",
        publisher: "AppleInsider",
        url: "https://appleinsider.com/articles/26/05/18/dont-expect-new-macs-at-wwdc-2026",
      },
      {
        title: "No new Macs or iPads before September",
        publisher: "AppleInsider",
        url: "https://appleinsider.com/articles/26/05/01/tim-cooks-remarks-strongly-suggest-that-there-are-no-new-macs-or-ipads-before-september",
      },
      {
        title: "Tim Cook to become Apple Executive Chairman; John Ternus to become Apple CEO",
        publisher: "Apple Newsroom",
        url: "https://www.apple.com/newsroom/2026/04/tim-cook-to-become-apple-executive-chairman-john-ternus-to-become-apple-ceo/",
      },
    ],
  },
  {
    day: 4,
    date: "2026-06-04",
    phase: "stretch",
    title: "Codename Charismatic",
    body:
      "A smart home hub and a tabletop robot with a 7-inch swiveling display remain on the rumor board, but the near-term hardware story has slipped: reports now point to a HomePad-style hub later in 2026, tied to the new Siri/tvOS 27 timeline, while the robot is still a 2027-ish idea. WWDC is more likely to reveal the software flag than the device. Listen for \"Home,\" \"tvOS,\" and \"homeOS\" in any sentence Federighi or Ternus speaks.",
    sources: [
      {
        title: "Apple's Smart Home Hub Won't Launch Until September as Siri Remains Unfinished",
        publisher: "MacRumors",
        url: "https://www.macrumors.com/2026/03/09/apple-smart-home-hub-september/",
      },
      {
        title: "HomePad reportedly delayed (again), and it's all Siri's fault (again)",
        publisher: "Macworld",
        url: "https://www.macworld.com/article/3083918/homepad-reportedly-delayed-again-and-its-all-siris-fault-again.html",
      },
      {
        title: "Apple's smart home hub delayed again because modernizing Siri is hard",
        publisher: "AppleInsider",
        url: "https://appleinsider.com/articles/26/03/09/apples-smart-home-hub-delayed-again-because-updating-siri-is-hard",
      },
      {
        title: "Apple homeOS 'Charismatic' smart hub and tabletop robot",
        publisher: "iGeeksBlog",
        url: "https://www.igeeksblog.com/apple-homeos-charismatic-smart-hub-tabletop-robot/",
      },
      {
        title: "homeOS — everything we know",
        publisher: "MacRumors",
        url: "https://www.macrumors.com/guide/homeos/",
      },
    ],
  },
  {
    day: 3,
    date: "2026-06-05",
    phase: "stretch",
    title: "Wildest case",
    body:
      "Pure speculation day. What would make this keynote genuinely shocking? A real ChatGPT-tier assistant demo that works live? Apple Intelligence opening to external models? A surprise hardware tease? Write your \"if this happens I lose my mind\" item.",
    input: { type: "textarea", label: "Wildest-case prediction" },
  },
  {
    day: 2,
    date: "2026-06-06",
    phase: "stretch",
    title: "Pre-keynote leak window",
    body:
      "The last 48 hours before any keynote is when the final big leaks land — Gurman's Sunday Power On is basically a spoiler. Read it Sunday morning, update your bets.",
    input: { type: "textarea", label: "Leak-window update" },
  },
  {
    day: 1,
    date: "2026-06-07",
    phase: "stretch",
    title: "Lock it in",
    body:
      "Final predictions. Pick: most-hyped feature, feature that gets quietly killed, and one thing nobody's predicting. Tomorrow you find out.",
    input: {
      type: "fields",
      fields: ["Most-hyped feature", "Feature that gets quietly killed", "One thing nobody's predicting"],
    },
  },
  {
    day: 0,
    date: "2026-06-08",
    phase: "keynote",
    title: "Keynote",
    body: "10:00 AM Pacific. Stream on apple.com, the Apple TV app, the Apple Developer app, or YouTube. Watch live, then grade your predictions during the post-show.",
    link: "https://www.apple.com/apple-events/",
    youtube: "https://www.youtube.com/@Apple/streams",
  },
];

const shortFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago",
  month: "short",
  day: "numeric",
});

const fullFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago",
  weekday: "long",
  month: "long",
  day: "numeric",
});

function chicagoDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${lookup.year}-${lookup.month}-${lookup.day}`;
}

function dateFromIso(iso: string) {
  return new Date(`${iso}T12:00:00-05:00`);
}

function isUnlocked(day: CalendarDay, today: string) {
  return day.date <= today;
}

function predictionKey(day: number, field = "main") {
  return `${storagePrefix}:prediction:${day}:${field}`;
}

function readStorage(key: string) {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(key) ?? "";
}

function readRevealed(day: number) {
  return readStorage(`${storagePrefix}:revealed:${day}`) === "true";
}

export default function App() {
  const [today] = useState(() => chicagoDateString());
  const [revealedDays, setRevealedDays] = useState<Set<number>>(
    () => new Set(days.filter((day) => readRevealed(day.day)).map((day) => day.day)),
  );

  const keynote = days.find((d) => d.day === 0)!;
  const forceKeynote =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).has("keynote");
  const isKeynoteDay = forceKeynote || today >= keynote.date;

  useEffect(() => {
    if (!isKeynoteDay) return;
    const colors = ["#f9e2af", "#fab387", "#cba6f7", "#89b4fa", "#a6e3a1", "#f5c2e7"];
    const end = Date.now() + 1800;
    const burst = (originX: number) =>
      confetti({
        particleCount: 60,
        spread: 70,
        startVelocity: 55,
        origin: { x: originX, y: 0.6 },
        colors,
        scalar: 1.05,
        ticks: 220,
      });
    burst(0.15);
    burst(0.85);
    const interval = window.setInterval(() => {
      if (Date.now() > end) {
        window.clearInterval(interval);
        return;
      }
      confetti({
        particleCount: 30,
        angle: 60 + Math.random() * 60,
        spread: 80,
        origin: { x: Math.random(), y: Math.random() * 0.3 },
        colors,
        ticks: 200,
      });
    }, 220);
    return () => window.clearInterval(interval);
  }, [isKeynoteDay]);

  useEffect(() => {
    const target = days.find(
      (day) => day.day > 0 && isUnlocked(day, today) && !revealedDays.has(day.day),
    );
    if (!target) return;
    const timer = window.setTimeout(() => {
      const el = document.getElementById(`day-${target.day}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
    return () => window.clearTimeout(timer);
    // intentionally only on first mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function revealDay(day: CalendarDay) {
    if (day.day === 0 || !isUnlocked(day, today)) return;
    window.localStorage.setItem(`${storagePrefix}:revealed:${day.day}`, "true");
    setRevealedDays((current) => new Set(current).add(day.day));
  }

  return (
    <main className="mx-auto w-full max-w-[1100px] px-5 pb-20 pt-8 sm:px-8 lg:px-10">
      <div className="flex justify-end text-sm text-ctp-subtext0">
        {fullFormatter.format(dateFromIso(today))}
      </div>
      <div className="mt-6">
        <Hero today={today} />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {days.map((day) =>
          day.day === 0 ? (
            <KeynoteTile key={day.day} day={day} today={today} />
          ) : !isUnlocked(day, today) ? (
            <LockedDoor key={day.day} day={day} />
          ) : (
            <RevealDoor
              key={day.day}
              day={day}
              revealed={revealedDays.has(day.day)}
              onReveal={() => revealDay(day)}
            />
          ),
        )}
      </div>

      <footer className="mt-16 border-t border-ctp-surface0 pt-6 text-xs text-ctp-overlay0">
        Predictions are saved locally in your browser. Source links open in a new tab.
      </footer>
    </main>
  );
}

function Hero({ today }: { today: string }) {
  const keynote = days.find((d) => d.day === 0)!;
  const keynoteDate = dateFromIso(keynote.date);
  const todayDate = dateFromIso(today);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.max(
    0,
    Math.round((keynoteDate.getTime() - todayDate.getTime()) / msPerDay),
  );

  const headline =
    daysLeft === 0 ? (
      <>WWDC is <span className="text-ctp-mauve">today</span>.</>
    ) : (
      <>
        <span className="text-ctp-mauve">{daysLeft}</span>{" "}
        {daysLeft === 1 ? "day" : "days"} until WWDC.
      </>
    );

  return (
    <header className="grid gap-5">
      <h1 className="text-[clamp(2.4rem,7vw,4.5rem)] font-semibold leading-[1.02] tracking-tight text-ctp-text">
        {headline}
      </h1>
      <p className="max-w-[560px] text-base leading-relaxed text-ctp-subtext0">
        Open one door a day until June 8.
      </p>
    </header>
  );
}

function phaseStyle(day: CalendarDay) {
  return { "--phase": phaseMeta[day.phase].color } as React.CSSProperties;
}

function LockedDoor({ day }: { day: CalendarDay }) {
  const date = shortFormatter.format(dateFromIso(day.date));

  return (
    <article
      id={`day-${day.day}`}
      className="door door-locked"
      style={phaseStyle(day)}
      aria-label={`Day ${day.day} locked until ${date}`}
    >
      <DoorHeader day={day} />
      <div className="mt-6 flex-1">
        <h3 className="text-base font-medium text-ctp-subtext1">Sealed until {date}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ctp-overlay0">
          Come back on this date to open.
        </p>
      </div>
      <div className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ctp-overlay0">
        <LockIcon />
        Locked
      </div>
    </article>
  );
}

function RevealDoor({
  day,
  revealed,
  onReveal,
}: {
  day: CalendarDay;
  revealed: boolean;
  onReveal: () => void;
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onReveal();
  }

  return (
    <article
      id={`day-${day.day}`}
      className="door door-unlocked"
      style={phaseStyle(day)}
      role="button"
      tabIndex={0}
      aria-expanded={revealed}
      aria-label={`Day ${day.day}: ${revealed ? day.title : "tap to reveal"}`}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a, textarea, input")) return;
        if (!revealed) onReveal();
      }}
      onKeyDown={handleKeyDown}
    >
      <DoorHeader day={day} />
      <div className="mt-6 flex-1">
        {revealed ? (
          <>
            {day.video ? (
              <video
                src={day.video}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="mb-4 aspect-square w-full rounded-lg border border-ctp-surface0 bg-ctp-crust object-cover"
              />
            ) : null}
            <h3 className="text-base font-semibold leading-snug text-ctp-text">{day.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-ctp-subtext0">{day.body}</p>
            {day.sources && day.sources.length > 0 ? <SourcesButton day={day} /> : null}
            {day.input ? <PredictionInputBlock day={day} input={day.input} /> : null}
          </>
        ) : (
          <>
            <h3 className="text-base font-medium text-ctp-subtext1">Tap to reveal</h3>
            <p className="mt-2 text-sm leading-relaxed text-ctp-overlay0">
              Day {day.day} is unlocked.
            </p>
          </>
        )}
      </div>
      {!revealed ? (
        <div
          className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em]"
          style={{ color: "var(--phase)" }}
        >
          <SparkIcon />
          Open
        </div>
      ) : null}
    </article>
  );
}

function KeynoteTile({ day }: { day: CalendarDay; today: string }) {
  return (
    <article
      id={`day-${day.day}`}
      className="door door-keynote sm:col-span-2 lg:col-span-3"
      style={phaseStyle(day)}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <DoorHeader day={day} large />
          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-ctp-text">
            {day.title}
          </h3>
          <p className="mt-2 max-w-[480px] text-sm leading-relaxed text-ctp-subtext0">
            {day.body}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <KeynoteLink href={day.link} primary>
            Apple Events
          </KeynoteLink>
          <KeynoteLink href={day.youtube}>YouTube Live</KeynoteLink>
        </div>
      </div>
    </article>
  );
}

function DoorHeader({ day, large = false }: { day: CalendarDay; large?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div
        className={[
          "font-mono font-semibold tabular-nums leading-none text-ctp-text",
          large ? "text-5xl" : "text-3xl",
        ].join(" ")}
      >
        {String(day.day).padStart(2, "0")}
      </div>
      <div className="text-right text-[11px] uppercase tracking-[0.14em] text-ctp-overlay0">
        <div style={{ color: "var(--phase)" }}>{phaseMeta[day.phase].title}</div>
        <div className="mt-0.5">{shortFormatter.format(dateFromIso(day.date))}</div>
      </div>
    </div>
  );
}

function SourcesButton({ day }: { day: CalendarDay }) {
  const [open, setOpen] = useState(false);
  const count = day.sources?.length ?? 0;
  const label = count === 1 ? "Source" : "Sources";

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen(true);
        }}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-ctp-subtext1 underline decoration-ctp-surface1 underline-offset-4 transition-colors hover:text-ctp-text hover:decoration-ctp-overlay0"
      >
        {label}
        <ArrowIcon />
      </button>
      {open ? <SourcesModal day={day} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function SourcesModal({ day, onClose }: { day: CalendarDay; onClose: () => void }) {
  useEffect(() => {
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const sources = day.sources ?? [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`sources-${day.day}-title`}
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="modal-panel relative w-full max-w-lg rounded-2xl border border-ctp-surface0 bg-ctp-mantle p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:p-7"
        style={phaseStyle(day)}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-ctp-overlay0 transition-colors hover:bg-ctp-surface0 hover:text-ctp-text"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <div className="pr-8">
          <div
            className="text-[11px] font-medium uppercase tracking-[0.16em]"
            style={{ color: "var(--phase)" }}
          >
            Day {day.day} · {sources.length} {sources.length === 1 ? "source" : "sources"}
          </div>
          <h3
            id={`sources-${day.day}-title`}
            className="mt-1 text-xl font-semibold leading-tight text-ctp-text"
          >
            {day.title}
          </h3>
        </div>

        <ul className="mt-5 space-y-2">
          {sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="source-row group"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-ctp-text">
                    {source.title}
                  </div>
                  <div className="mt-0.5 text-xs text-ctp-subtext0">{source.publisher}</div>
                </div>
                <span className="text-ctp-overlay0 transition-colors group-hover:text-ctp-text">
                  <ArrowIcon />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

function KeynoteLink({
  href,
  primary = false,
  children,
}: {
  href?: string;
  primary?: boolean;
  children: React.ReactNode;
}) {
  if (!href) return null;
  return (
    <a className={primary ? "btn-primary" : "btn"} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function PredictionInputBlock({ day, input }: { day: CalendarDay; input: PredictionInput }) {
  const [savedMessage, setSavedMessage] = useState("");

  function save(field: string, value: string) {
    window.localStorage.setItem(predictionKey(day.day, field), value);
    setSavedMessage("Saved");
    window.setTimeout(() => setSavedMessage(""), 1400);
  }

  if (input.type === "fields") {
    return (
      <div className="mt-5 grid gap-3 border-t border-ctp-surface0 pt-4">
        {input.fields.map((field, index) => {
          const fieldKey = `field-${index}`;
          return (
            <label key={fieldKey} className="grid gap-1.5 text-xs font-medium text-ctp-subtext0">
              {field}
              <input
                className="field"
                defaultValue={readStorage(predictionKey(day.day, fieldKey))}
                onChange={(event: ChangeEvent<HTMLInputElement>) => save(fieldKey, event.target.value)}
                autoComplete="off"
              />
            </label>
          );
        })}
        <div className="min-h-4 text-[11px] text-ctp-green" aria-live="polite">
          {savedMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 grid gap-2 border-t border-ctp-surface0 pt-4">
      <label className="grid gap-1.5 text-xs font-medium text-ctp-subtext0">
        {input.label}
        <textarea
          className="field min-h-[96px] resize-y leading-relaxed"
          defaultValue={readStorage(predictionKey(day.day))}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => save("main", event.target.value)}
        />
      </label>
      <div className="min-h-4 text-[11px] text-ctp-green" aria-live="polite">
        {savedMessage}
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
      <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
