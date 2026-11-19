// The roadmap to the platinum, built from the official trophy descriptions:
// which story chapters and missions come first, which collectibles and counts
// follow, and what the cleanup stage holds. Stage numbers match the "stage"
// field on every trophy in data/trophies.json.
export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Stage 1 — Play the story',
    body: 'Chapters 1 to 4, the six named missions (Breakfast Run, The Cartel Heist, Child\u2019s Play, Headliners, VCIA Takedown, Operation Savage Glory), then the final mission. That is 13 trophies, both golds included, and the choices count (500) builds along the way. Do the missable mission trophies when they come up.',
    trophies: 13,
  },
  {
    stage: 2,
    title: 'Stage 2 — Strangers and side missions',
    body: 'Finish the five named stranger strands — Andy, Kenton, Billy, Randy, Tyrone — plus Bret\u2019s hunt and the partner moment Personal Best, then find three more strands to reach 8 for the silver Strangers & Freaks.',
    trophies: 8,
  },
  {
    stage: 3,
    title: 'Stage 3 — Collectibles and the map',
    body: 'Meditate at all 18 spots, complete 3 card sets, WAiNK at 100 locations, discover 100 vehicles, and explore all 52 areas of Leonida. Tour the map region by region so the counts climb together instead of one grind at a time.',
    trophies: 5,
  },
  {
    stage: 4,
    title: 'Stage 4 — Activities, combat and robberies',
    body: 'Gold all 42 Shooting Range challenges, win the 14 drone races and 20 different races, beat Cal at fishing, finish an arcade game and a bowling game, try every activity type, then the combat and robbery set: 250 stunts, 5 enemies in one Combat Focus, 5 bank vaults, an armored truck, one illegal operation per gang (9), the partner pair Hot Together and Retail Therapy, and the single-moment stunts at VCIA, the showroom and Ocean Beach.',
    trophies: 20,
  },
  {
    stage: 5,
    title: 'Stage 5 — Cleanup and the platinum',
    body: 'Finish 50 challenges, launder $250,000 of marked bills, spend $100,000 across shops, buy all 8 garages, register 10 vehicles in the Scooter Bros app, and let the two vague ones pop in normal play (Bad Luck, I Guess; The Truth Is Out There). Then reach 100% completion for the second gold — and the platinum, Vice Got a Price!, pops with the last trophy.',
    trophies: 9,
  },
];

export function renderRoadmapSteps(listElement, earnedNames, trophies) {
  listElement.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const stageTrophies = trophies.filter((t) => t.stage === stage.stage);
    const earned = stageTrophies.filter((t) => earnedNames.has(t.name)).length;
    const item = document.createElement('li');
    const heading = document.createElement('strong');
    heading.textContent = `${stage.title} — ${earned}/${stageTrophies.length} earned`;
    const body = document.createElement('p');
    body.textContent = stage.body;
    item.append(heading, body);
    listElement.append(item);
  }
}

export function renderMissableList(listElement, trophies) {
  listElement.replaceChildren();
  for (const trophy of trophies.filter((t) => t.missable)) {
    const item = document.createElement('li');
    const name = document.createElement('strong');
    name.textContent = trophy.name;
    const rest = document.createElement('span');
    rest.textContent = ` — ${trophy.description} Do it when it comes up; confirm mission replay after release.`;
    item.append(name, rest);
    listElement.append(item);
  }
}
