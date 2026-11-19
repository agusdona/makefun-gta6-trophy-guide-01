// Vice Trophy Guide — boot: load the trophy data, wire the filters, the
// spoiler setting, the roadmap and missable views, and the tracker state.
// Everything runs offline: the only fetch is the guide's own data file.
import { loadEarnedNames, saveEarnedNames, downloadProgressFile, readProgressFile } from './storage.js';
import { ROADMAP_STAGES, renderRoadmapSteps, renderMissableList } from './roadmap.js';
import { renderTrophyList, renderDetailPanel, KIND_LABELS } from './trophy-list.js';

const DATA_URL = 'data/trophies.json';
const GRADE_TOTALS = { platinum: 1, gold: 2, silver: 6, bronze: 46 };

const params = new URLSearchParams(location.search);
const filters = {
  search: params.get('search') ?? '',
  kind: params.get('kind') ?? 'all',
  grade: params.get('grade') ?? 'all',
  status: params.get('status') ?? 'all',
  missableOnly: params.get('missable') === '1',
  spoilersHidden: params.get('spoiler') === '1',
};
let view = params.get('view') ?? 'checklist';
let selectedName = null;

const earnedNames = loadEarnedNames();
// ?demo=1 seeds a sample playthrough so a screenshot shows real progress.
if (params.get('demo') === '1' && earnedNames.size === 0) {
  for (const name of ['Just Like Paradise', 'Paradise Lost', 'T**s Ass Drug Money', 'Vice City, Baby!', 'Top Of The World, Ma', 'Trust', 'Break the Bank', 'Family Matters', 'DWNFALL', 'Hi-Jacked', 'Snow Storm', 'Stick Fiddler']) earnedNames.add(name);
  saveEarnedNames(earnedNames);
}

const response = await fetch(DATA_URL);
const doc = await response.json();
const trophies = doc.trophies ?? doc;
const byName = new Map(trophies.map((t) => [t.name, t]));
if (params.get('trophy')) {
  const wanted = params.get('trophy');
  selectedName = byName.has(wanted) ? wanted : (trophies[Number(wanted) - 1]?.name ?? null);
}

const $ = (id) => document.getElementById(id);
const listElement = $('trophyList');
const detailPanel = $('detailPanel');

function refreshProgress() {
  const total = trophies.length;
  $('progressCount').textContent = `${earnedNames.size} of ${total} earned`;
  $('progressFill').style.width = `${Math.round((earnedNames.size / total) * 100)}%`;
  const perGrade = Object.entries(GRADE_TOTALS)
    .map(([grade, totalForGrade]) => {
      const got = trophies.filter((t) => t.grade === grade && earnedNames.has(t.name)).length;
      return `${grade[0].toUpperCase()}${grade.slice(1)} ${got}/${totalForGrade}`;
    })
    .join(' · ');
  $('progressDetail').textContent = perGrade;
  const nextMissing = trophies.find((t) => t.grade !== 'platinum' && !earnedNames.has(t.name));
  $('progressNext').textContent = nextMissing ? `Next up: ${nextMissing.name}` : 'Platinum earned — Leonida Legend!';
}

function refreshAll() {
  const shown = renderTrophyList(listElement, trophies, filters, earnedNames, handleSelect, selectedName);
  $('listCount').textContent = `Showing ${shown} of ${trophies.length} trophies`;
  $('filterNote').textContent = [
    filters.kind !== 'all' ? `Kind: ${KIND_LABELS[filters.kind] ?? filters.kind}` : '',
    filters.grade !== 'all' ? `Grade: ${filters.grade}` : '',
    filters.status !== 'all' ? `Status: ${filters.status}` : '',
    filters.missableOnly ? 'Missable only' : '',
    filters.spoilersHidden ? 'Story spoilers hidden until earned' : '',
    filters.search ? `Search: “${filters.search}”` : '',
  ].filter(Boolean).join(' · ') || 'All 55 trophies, in the official order.';
  renderRoadmapSteps($('roadmapSteps'), earnedNames, trophies);
  renderMissableList($('missableList'), trophies);
  renderDetailPanel(detailPanel, selectedName ? byName.get(selectedName) : null, earnedNames, handleToggleEarned);
  refreshProgress();
}

function handleSelect(name, { toggleOnly }) {
  selectedName = name;
  if (toggleOnly) {
    saveEarnedNames(earnedNames);
    refreshAll();
    return;
  }
  document.querySelector('.trophy-card.selected')?.scrollIntoView({ block: 'nearest' });
  refreshAll();
}

function handleToggleEarned(name, earned) {
  if (earned) earnedNames.add(name);
  else earnedNames.delete(name);
  saveEarnedNames(earnedNames);
  refreshAll();
}

function setView(nextView) {
  view = nextView;
  document.querySelectorAll('#viewTabs button').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === view);
  });
  $('roadmapSection').hidden = view !== 'roadmap';
  $('missableSection').hidden = view !== 'missable';
  $('listHeading').textContent = view === 'roadmap' ? 'Trophy checklist — roadmap stage order below' : view === 'missable' ? 'Trophy checklist — missable ones flagged' : 'Trophy checklist';
  refreshAll();
}

document.querySelectorAll('#viewTabs button').forEach((button) => {
  button.addEventListener('click', () => setView(button.dataset.view));
});

const searchInput = $('search');
searchInput.value = filters.search;
searchInput.addEventListener('input', () => { filters.search = searchInput.value; refreshAll(); });
const kindFilter = $('kindFilter');
kindFilter.value = KIND_LABELS[filters.kind] ? filters.kind : 'all';
kindFilter.addEventListener('change', () => { filters.kind = kindFilter.value; refreshAll(); });
const gradeFilter = $('gradeFilter');
gradeFilter.value = filters.grade in GRADE_TOTALS ? filters.grade : 'all';
gradeFilter.addEventListener('change', () => { filters.grade = gradeFilter.value; refreshAll(); });
const statusFilter = $('statusFilter');
statusFilter.value = ['all', 'earned', 'missing'].includes(filters.status) ? filters.status : 'all';
statusFilter.addEventListener('change', () => { filters.status = statusFilter.value; refreshAll(); });
const missableOnly = $('missableOnly');
missableOnly.checked = filters.missableOnly;
missableOnly.addEventListener('change', () => { filters.missableOnly = missableOnly.checked; refreshAll(); });
const spoilerToggle = $('spoilerToggle');
spoilerToggle.checked = filters.spoilersHidden;
spoilerToggle.addEventListener('change', () => { filters.spoilersHidden = spoilerToggle.checked; refreshAll(); });

$('exportBtn').addEventListener('click', () => downloadProgressFile(earnedNames));
$('importFile').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = await readProgressFile(file);
    earnedNames.clear();
    for (const name of imported) if (byName.has(name)) earnedNames.add(name);
    saveEarnedNames(earnedNames);
    refreshAll();
  } catch (error) {
    alert(`Could not import that file: ${error.message}`);
  }
});
$('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all earned marks?')) return;
  earnedNames.clear();
  saveEarnedNames(earnedNames);
  selectedName = null;
  refreshAll();
});

setView(['checklist', 'roadmap', 'missable'].includes(view) ? view : 'checklist');
