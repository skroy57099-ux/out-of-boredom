export function getRandomResponse(
  type: keyof typeof responses
): string {
  const list = responses[type];
  return list[Math.floor(Math.random() * list.length)];
}

export const responses = {
  idle: [
    "Watching visitor activity...",
    "Reviewing portfolio...",
    "Keeping an eye on things...",
    "Standing by.",
  ],

  thinking: [
    "Thinking...",
    "Searching memory...",
    "Connecting information...",
    "Analyzing request...",
    "Reviewing knowledge...",
  ],

  searching: [
    "Scanning projects...",
    "Looking through repositories...",
    "Checking internal records...",
    "Searching portfolio...",
  ],

  project: [
    "Project located.",
    "Repository detected.",
    "Architecture identified.",
    "Analyzing implementation...",
  ],

  greeting: [
    "Systems online.",
    "Welcome.",
    "I keep an eye on this place while Shubham keeps building things.",
    "BORE online. What are you looking for?",
  ],

  thanks: [
    "You're welcome.",
    "Happy to help.",
    "No problem.",
  ],

  farewell: [
    "Returning to observation mode.",
    "Until next time.",
    "I'll still be here.",
  ],

  success: [
    "Analysis complete.",
    "Information located.",
    "Done.",
  ],

  warning: [
    "Partial match found.",
    "Information appears incomplete.",
    "Multiple matches detected.",
  ],

  unknown: [
    "I couldn't find anything matching that request.",
    "That isn't in my knowledge base yet.",
    "I don't have enough information to answer that.",
  ],
};
