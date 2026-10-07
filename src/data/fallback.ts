import { RawPhrasalVerbEntry } from '../types';

export const FALLBACK_DATA: RawPhrasalVerbEntry[] = [
  {
    phrasal_verb: "wrap up",
    sense: "to finish or conclude something successfully",
    keywords: ["finish", "conclude", "end", "complete", "finalize"],
    separable: true,
    separable_pattern: "separable: wrap it up",
    example: "Let's wrap up this meeting before lunch."
  },
  {
    phrasal_verb: "put off",
    sense: "to postpone or delay something until a later time",
    keywords: ["delay", "postpone", "defer", "procrastinate", "reschedule"],
    separable: true,
    separable_pattern: "separable: put it off",
    example: "Never put off until tomorrow what you can do today."
  },
  {
    phrasal_verb: "put up with",
    sense: "to tolerate or endure an unpleasant situation or person",
    keywords: ["tolerate", "endure", "bear", "stand", "handle"],
    separable: false,
    example: "I refuse to put up with this unbearable noise any longer."
  },
  {
    phrasal_verb: "eat out",
    sense: "to eat a meal at a restaurant instead of at home",
    keywords: ["eat", "dine", "restaurant", "food"],
    separable: false,
    example: "Let's eat out tonight instead of cooking."
  },
  {
    phrasal_verb: "eat up",
    sense: "to eat all of something until nothing is left",
    keywords: ["eat", "finish", "consume", "devour"],
    separable: true,
    separable_pattern: "separable: eat it up",
    example: "Eat up all your broccoli before having dessert."
  },
  {
    phrasal_verb: "turn down",
    sense: "to refuse or reject an offer, invitation, or request",
    keywords: ["refuse", "reject", "decline", "dismiss"],
    separable: true,
    separable_pattern: "separable: turn it down",
    example: "She had to turn down the job offer because of the long commute."
  },
  {
    phrasal_verb: "drop by",
    sense: "to pay an informal, brief, or unexpected visit",
    keywords: ["visit", "stop by", "call on", "pop in"],
    separable: false,
    example: "Feel free to drop by my office whenever you are in town."
  },
  {
    phrasal_verb: "call off",
    sense: "to cancel a planned event or arrangement",
    keywords: ["cancel", "abort", "abandon", "revoke"],
    separable: true,
    separable_pattern: "separable: call it off",
    example: "The organizers had to call off the football match due to heavy snow."
  },
  {
    phrasal_verb: "give up",
    sense: "to stop trying or surrender",
    keywords: ["quit", "surrender", "abandon", "stop"],
    separable: true,
    separable_pattern: "separable: give it up",
    example: "Don't give up on your dreams no matter how tough it gets."
  },
  {
    phrasal_verb: "look into",
    sense: "to investigate or examine a problem or situation",
    keywords: ["investigate", "examine", "check", "research"],
    separable: false,
    example: "The security team promised to look into the data breach immediately."
  },
  {
    phrasal_verb: "pig out",
    sense: "to eat an unusually large amount of food greedily",
    keywords: ["eat", "binge", "gorge", "overeat"],
    separable: false,
    example: "We pigged out on pizza and wings during the championship game."
  },
  {
    phrasal_verb: "figure out",
    sense: "to solve a problem or understand something",
    keywords: ["understand", "solve", "deduce", "resolve", "decipher"],
    separable: true,
    separable_pattern: "separable: figure it out",
    example: "It took hours to figure out what was wrong with the calculation."
  }
];
