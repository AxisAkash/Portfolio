import { SKILL_GROUPS } from '../data/skills.js';

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);

export function setupSkillsExplorer(projects) {
  const target = $('[data-skills-explorer]');
  if (!target) return;
  const projectNames = Object.fromEntries(projects.map((project) => [project.slug, project.title]));
  const projectCount = projects.length;
  const technologyCount = new Set(SKILL_GROUPS.flatMap((group) => group.skills.map((skill) => skill.label))).size;
  const roleBasedCount = new Set(SKILL_GROUPS.flatMap((group) => group.skills).find((skill) => skill.id === 'rbac')?.projectIds || []).size;
  $('[data-skill-stats]').textContent = `${projectCount} projects · ${technologyCount} technologies · ${roleBasedCount} role-based systems`;
  const projectFilters = projects.map((project) => `<button class="project-filter" type="button" data-project-filter="${project.slug}" aria-pressed="false">${escapeHtml(project.title)}</button>`).join('');
  const cards = SKILL_GROUPS.map((group) => `<article class="skill-card reveal" data-skill-card="${group.id}"><div class="skill-card-top"><span class="skill-index">${group.index}</span><span class="skill-card-count">${group.skills.length} skills</span></div><h3>${escapeHtml(group.title)}</h3><p>${escapeHtml(group.description)}</p><div class="skill-chip-list">${group.skills.map((skill) => { const evidence = skill.projectIds.length ? skill.projectIds.map((id) => projectNames[id]).join(' · ') : skill.evidenceLabel; const accessible = skill.projectIds.length ? `${skill.label}; used in ${evidence}` : `${skill.label}; ${evidence}`; return `<button class="skill-chip" type="button" data-skill-id="${skill.id}" aria-pressed="false" aria-label="${escapeHtml(accessible)}"><span>${escapeHtml(skill.label)}</span><small>${escapeHtml(evidence)}</small></button>`; }).join('')}</div></article>`).join('');
  target.innerHTML = `<div class="skill-explorer-toolbar"><div><span class="mono-label">Project filter</span><div class="project-filter-row">${projectFilters}</div></div><span class="skill-selection" data-skill-selection>Focus a skill or project</span></div><div class="skill-card-grid">${cards}</div>`;
  const announcement = $('[data-skill-announcement]');
  const projectCards = $$('[data-project-card]');
  const allSkillButtons = $$('.skill-chip');
  const allProjectButtons = $$('.project-filter');
  let selectedSkill = null;
  let selectedProject = null;
  let hoverSkill = null;
  let hoverProject = null;

  const selectedProjects = () => {
    if (selectedSkill) return new Set(SKILL_GROUPS.flatMap((group) => group.skills).find((skill) => skill.id === selectedSkill)?.projectIds || []);
    if (hoverSkill) return new Set(SKILL_GROUPS.flatMap((group) => group.skills).find((skill) => skill.id === hoverSkill)?.projectIds || []);
    if (selectedProject || hoverProject) return new Set([selectedProject || hoverProject]);
    return null;
  };

  const selectedSkills = () => {
    if (selectedProject || hoverProject) return new Set(SKILL_GROUPS.flatMap((group) => group.skills).filter((skill) => skill.projectIds.includes(selectedProject || hoverProject)).map((skill) => skill.id));
    return new Set([selectedSkill || hoverSkill].filter(Boolean));
  };

  const updateState = (announcementText = '') => {
    const activeProjects = selectedProjects();
    const activeSkills = selectedSkills();
    projectCards.forEach((card) => {
      const active = !activeProjects || activeProjects.has(card.dataset.projectCard);
      card.classList.toggle('skill-highlight', Boolean(activeProjects && active));
      card.classList.toggle('skill-dim', Boolean(activeProjects && !active));
    });
    allSkillButtons.forEach((button) => button.classList.toggle('skill-active', activeSkills.has(button.dataset.skillId)));
    allSkillButtons.forEach((button) => button.setAttribute('aria-pressed', String(activeSkills.has(button.dataset.skillId) && Boolean(selectedSkill || selectedProject))));
    allProjectButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.projectFilter === selectedProject)));
    const selectedLabel = selectedSkill ? `Used in ${[...selectedProjects() || []].map((id) => projectNames[id]).join(' · ') || 'no project evidence'}` : selectedProject ? `${projectNames[selectedProject]} uses ${[...selectedSkills()].length} skills` : 'Focus a skill or project';
    $('[data-skill-selection]').textContent = selectedLabel;
    if (announcementText) announcement.textContent = announcementText;
  };

  const skillById = (id) => SKILL_GROUPS.flatMap((group) => group.skills).find((skill) => skill.id === id);
  allSkillButtons.forEach((button) => {
    const activate = () => { const skill = skillById(button.dataset.skillId); hoverSkill = button.dataset.skillId; updateState(`${skill.label} uses ${skill.projectIds.length} projects`); };
    const clearHover = () => { hoverSkill = null; if (!selectedSkill && !selectedProject) updateState(); };
    button.addEventListener('pointerenter', activate);
    button.addEventListener('pointerleave', clearHover);
    button.addEventListener('focus', activate);
    button.addEventListener('blur', clearHover);
    button.addEventListener('click', () => { selectedSkill = selectedSkill === button.dataset.skillId ? null : button.dataset.skillId; selectedProject = null; hoverSkill = null; const skill = skillById(button.dataset.skillId); updateState(selectedSkill ? `${skill.label} uses ${skill.projectIds.length} projects` : 'Skill filter cleared'); });
  });
  allProjectButtons.forEach((button) => {
    const activate = () => { hoverProject = button.dataset.projectFilter; updateState(`${projectNames[button.dataset.projectFilter]} uses ${[...selectedSkills()].length} skills`); };
    const clearHover = () => { hoverProject = null; if (!selectedSkill && !selectedProject) updateState(); };
    button.addEventListener('pointerenter', activate);
    button.addEventListener('pointerleave', clearHover);
    button.addEventListener('focus', activate);
    button.addEventListener('blur', clearHover);
    button.addEventListener('click', () => { selectedProject = selectedProject === button.dataset.projectFilter ? null : button.dataset.projectFilter; selectedSkill = null; hoverProject = null; updateState(selectedProject ? `${projectNames[selectedProject]} uses ${[...selectedSkills()].length} skills` : 'Project filter cleared'); });
  });
  $$('.skill-card').forEach((card) => card.addEventListener('pointermove', (event) => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
    card.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
  }));
  updateState();
}
