// Rendering for the trophy checklist and the detail panel: filtering,
// spoiler hiding, and the per-trophy guide with its sources.
export const KIND_LABELS = {
  story: 'Story',
  mission: 'Named mission',
  stranger: 'Strangers',
  collectible: 'Collectibles',
  activity: 'Activities',
  partner: 'Partner',
  combat: 'Combat',
  world: 'World & robberies',
  money: 'Money',
  completion: 'Completion',
  misc: 'Secrets & misc',
  platinum: 'Platinum',
};

export function trophyMatchesFilters(trophy, filters, earnedNames) {
  if (filters.kind !== 'all' && trophy.kind !== filters.kind) return false;
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.status === 'earned' && !earnedNames.has(trophy.name)) return false;
  if (filters.status === 'missing' && earnedNames.has(trophy.name)) return false;
  if (filters.missableOnly && !trophy.missable) return false;
  if (filters.search) {
    const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!haystack.includes(filters.search.toLowerCase())) return false;
  }
  return true;
}

export function isSpoilerHidden(trophy, spoilersHidden, earnedNames) {
  if (!spoilersHidden) return false;
  if (earnedNames.has(trophy.name)) return false;
  return trophy.kind === 'story' || trophy.kind === 'mission';
}

export function buildGradeBadge(grade) {
  const badge = document.createElement('span');
  badge.className = `badge ${grade}`;
  badge.textContent = grade;
  return badge;
}

export function renderTrophyList(listElement, trophies, filters, earnedNames, onSelect, selectedName) {
  listElement.replaceChildren();
  const visible = trophies.filter((t) => trophyMatchesFilters(t, filters, earnedNames));
  for (const trophy of visible) {
    const hidden = isSpoilerHidden(trophy, filters.spoilersHidden, earnedNames);
    const card = document.createElement('li');
    card.className = 'trophy-card' + (earnedNames.has(trophy.name) ? ' earned' : '') + (selectedName === trophy.name ? ' selected' : '');
    const top = document.createElement('div');
    top.className = 'trophy-top';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earnedNames.has(trophy.name);
    box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
    box.addEventListener('change', () => {
      if (box.checked) earnedNames.add(trophy.name);
      else earnedNames.delete(trophy.name);
      onSelect(trophy.name, { toggleOnly: true });
    });
    const text = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'trophy-name';
    name.textContent = hidden ? 'Hidden story trophy — earn it to reveal' : trophy.name;
    const desc = document.createElement('p');
    desc.className = 'trophy-desc';
    desc.textContent = hidden ? 'Spoilers hidden. The name and description stay hidden until this trophy is earned.' : trophy.description;
    text.append(name, desc);
    top.append(box, text);
    const badges = document.createElement('div');
    badges.className = 'trophy-badges';
    badges.append(buildGradeBadge(trophy.grade));
    const kind = document.createElement('span');
    kind.className = 'badge kind';
    kind.textContent = KIND_LABELS[trophy.kind] ?? trophy.kind;
    badges.append(kind);
    if (trophy.missable) {
      const flag = document.createElement('span');
      flag.className = 'badge missable';
      flag.textContent = 'Missable';
      badges.append(flag);
    }
    if (hidden) {
      const spoiler = document.createElement('span');
      spoiler.className = 'badge spoiler';
      spoiler.textContent = 'Spoiler hidden';
      badges.append(spoiler);
    }
    if (trophy.count) {
      const count = document.createElement('span');
      count.className = 'badge';
      count.textContent = `Count: ${trophy.count.toLocaleString('en-US')}`;
      badges.append(count);
    }
    const preview = document.createElement('p');
    preview.className = 'trophy-guide-preview';
    preview.textContent = hidden ? '' : trophy.guide;
    card.append(top, badges, preview);
    card.addEventListener('click', (event) => {
      if (event.target === box) return;
      onSelect(trophy.name, { toggleOnly: false });
    });
    listElement.append(card);
  }
  return visible.length;
}

export function renderDetailPanel(panel, trophy, earnedNames, onToggleEarned) {
  const empty = panel.querySelector('#detailEmpty');
  const card = panel.querySelector('#detailCard');
  if (!trophy) {
    empty.hidden = false;
    card.hidden = true;
    return;
  }
  empty.hidden = true;
  card.hidden = false;
  panel.querySelector('#detailGrade').replaceChildren(buildGradeBadge(trophy.grade));
  panel.querySelector('#detailName').textContent = trophy.name;
  panel.querySelector('#detailDesc').textContent = trophy.description;
  const metaBits = [`Kind: ${KIND_LABELS[trophy.kind] ?? trophy.kind}`, `Roadmap stage ${trophy.stage}`];
  if (trophy.missable) metaBits.push('Missable — do it when it comes up');
  if (trophy.count) metaBits.push(`Tracked count: ${trophy.count.toLocaleString('en-US')}`);
  panel.querySelector('#detailMeta').textContent = metaBits.join(' · ');
  panel.querySelector('#detailGuide').textContent = trophy.guide;
  const steps = panel.querySelector('#detailSteps');
  steps.replaceChildren();
  for (const step of trophy.steps ?? []) {
    const item = document.createElement('li');
    item.textContent = step;
    steps.append(item);
  }
  const sources = panel.querySelector('#detailSources');
  sources.replaceChildren();
  for (const source of trophy.sources ?? []) {
    const item = document.createElement('li');
    item.textContent = source;
    sources.append(item);
  }
  const earnedBox = panel.querySelector('#detailEarned');
  earnedBox.checked = earnedNames.has(trophy.name);
  earnedBox.onchange = () => onToggleEarned(trophy.name, earnedBox.checked);
}
