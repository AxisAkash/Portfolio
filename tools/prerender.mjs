import { readFile, writeFile } from 'node:fs/promises';
import { PROJECTS } from '../data/projects.js';
import { SITE_CONFIG } from '../data/site.js';
import { SKILL_GROUPS } from '../data/skills.js';
import { visualMarkup } from '../js/visuals.js';

const filePath = new URL('../index.html', import.meta.url);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);

function projectLinksMarkup(project) {
  const labels = {
    live: ['Live Demo', `Live demo of ${project.title} (opens in new tab)`],
    backend: ['Backend API', `Backend API for ${project.title} (opens in new tab)`],
    github: ['GitHub', `GitHub repository for ${project.title} (opens in new tab)`],
  };
  return Object.entries(labels)
    .filter(([key]) => project.links?.[key])
    .map(([key, [label, accessibleLabel]]) => `<a class="button button-secondary project-link" href="${escapeHtml(project.links[key])}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(accessibleLabel)}">${label} <span aria-hidden="true">↗</span></a>`)
    .join('');
}

function projectCard(project, index) {
  const featured = index < 2 ? ' project-card-featured' : '';
  const teamBadge = project.team ? '<span class="team-badge">Team project</span>' : '';
  return `<article class="project-card${featured} reveal" data-project-card="${escapeHtml(project.slug)}">
    <div class="project-card-top"><span>0${index + 1} / ${escapeHtml(project.type)}</span><span>${escapeHtml(project.date)}</span></div>${teamBadge}
    <div class="project-cover">${visualMarkup(project)}</div>
    <div class="project-card-body"><div class="project-copy"><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.outcome)}</p><p class="project-role">${project.team ? 'Team project; contribution details are intentionally unlisted until provided.' : escapeHtml(project.role)}</p></div><div class="project-card-footer"><div class="project-stack">${project.stack.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div><button class="project-open" type="button" data-open-project="${escapeHtml(project.slug)}">Read system <span aria-hidden="true">↗</span></button></div></div>
    <div class="project-link-row">${projectLinksMarkup(project)}</div>
  </article>`;
}

function skillsMarkup() {
  const projectNames = Object.fromEntries(PROJECTS.map((project) => [project.slug, project.title]));
  const projectFilters = PROJECTS.map((project) => `<button class="project-filter" type="button" data-project-filter="${escapeHtml(project.slug)}" aria-pressed="false">${escapeHtml(project.title)}</button>`).join('');
  const cards = SKILL_GROUPS.map((group) => `<article class="skill-card reveal" data-skill-card="${escapeHtml(group.id)}"><div class="skill-card-top"><span class="skill-index">${escapeHtml(group.index)}</span><span class="skill-card-count">${group.skills.length} skills</span></div><h3>${escapeHtml(group.title)}</h3><p>${escapeHtml(group.description)}</p><div class="skill-chip-list">${group.skills.map((skill) => { const evidence = skill.projectIds.length ? skill.projectIds.map((id) => projectNames[id]).join(' · ') : skill.evidenceLabel; const accessible = skill.projectIds.length ? `${skill.label}; used in ${evidence}` : `${skill.label}; ${evidence}`; return `<button class="skill-chip" type="button" data-skill-id="${escapeHtml(skill.id)}" aria-pressed="false" aria-label="${escapeHtml(accessible)}"><span>${escapeHtml(skill.label)}</span><small>${escapeHtml(evidence)}</small></button>`; }).join('')}</div></article>`).join('');
  return `<div class="skill-explorer-toolbar"><div><span class="mono-label">Project filter</span><div class="project-filter-row">${projectFilters}</div></div><span class="skill-selection" data-skill-selection>Focus a skill or project</span></div><div class="skill-card-grid">${cards}</div>`;
}

function skillStats() {
  const technologyCount = new Set(SKILL_GROUPS.flatMap((group) => group.skills.map((skill) => skill.label))).size;
  const roleBasedCount = new Set(SKILL_GROUPS.flatMap((group) => group.skills).find((skill) => skill.id === 'rbac')?.projectIds || []).size;
  return `${PROJECTS.length} projects · ${technologyCount} technologies · ${roleBasedCount} role-based systems`;
}

function replaceMarkedContent(source, name, content) {
  const pattern = new RegExp(`(<!-- prerender:${name}:start -->)[\\s\\S]*?(<!-- prerender:${name}:end -->)`);
  if (!pattern.test(source)) throw new Error(`Missing prerender markers for ${name}`);
  return source.replace(pattern, `$1\n${content}\n$2`);
}

let html = await readFile(filePath, 'utf8');
html = replaceMarkedContent(html, 'projects', `<noscript><p class="no-script-note">Project details are available below without JavaScript. Links open in a new tab.</p></noscript>${PROJECTS.map(projectCard).join('')}`);
html = replaceMarkedContent(html, 'skills', skillsMarkup());
html = replaceMarkedContent(html, 'contact', `<div class="email-first"><div><span class="mono-label">Email first</span><h3>Keep it direct.</h3><p>Email is the quickest way to start a useful conversation.</p></div><a class="button button-secondary" href="mailto:${escapeHtml(SITE_CONFIG.email)}">Open mail client <span aria-hidden="true">↗</span></a></div>`);
html = html.replace(/(<p data-skill-stats>)[^<]*(<\/p>)/, `$1${skillStats()}$2`);
await writeFile(filePath, html);
console.log(`Prerendered ${PROJECTS.length} projects and ${SKILL_GROUPS.length} skill groups into index.html`);
