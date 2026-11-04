import { SITE_CONFIG, SITE_META, baseUrl } from '../data/site.js';
import { PROJECTS } from '../data/projects.js';
import { setupSkillsExplorer } from './skills-explorer.js';
import { galleryMarkup, visualMarkup } from './visuals.js';

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lastFocused = null;

function setText(selector, value) {
  $$(selector).forEach((element) => { element.textContent = value; });
}

function setMeta() {
  document.title = SITE_META.title;
  document.querySelector('meta[name="description"]').content = SITE_META.description;
  document.querySelector('meta[name="keywords"]')?.setAttribute('content', SITE_META.keywords);
  const canonical = $('[data-canonical]');
  if (canonical?.href !== baseUrl) console.warn('Static canonical does not match data/site.js');
}

function setupTheme() {
  const button = $('[data-theme-toggle]');
  const apply = (theme) => {
    const set = () => {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem('ak-theme', theme);
      button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    };
    if (document.startViewTransition && !reduceMotion) document.startViewTransition(set);
    else set();
  };
  button.addEventListener('click', () => apply(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
}

function emailMarkup(email) {
  const [user, domain] = email.split('@');
  return `<span>${user}</span><span aria-hidden="true">&#64;</span><span>${domain}</span>`;
}

function setupIdentity() {
  setText('[data-availability]', SITE_CONFIG.availability || '');
  $$('[data-email]').forEach((element) => {
    element.innerHTML = emailMarkup(SITE_CONFIG.email);
    if (element.tagName === 'A') element.href = `mailto:${SITE_CONFIG.email}`;
  });
  $$('[data-github]').forEach((element) => { element.href = SITE_CONFIG.github; });
  $$('[data-linkedin]').forEach((element) => { element.href = SITE_CONFIG.linkedin; });
  $$('[data-mailto]').forEach((element) => { element.href = `mailto:${SITE_CONFIG.email}`; });
  const resume = $('[data-resume]');
  if (SITE_CONFIG.resumePath) { resume.hidden = false; resume.href = SITE_CONFIG.resumePath; resume.download = ''; }
  const optional = $('[data-optional-sections]');
  const optionalItems = [];
  if (SITE_CONFIG.optional.hindi) optionalItems.push('<span>Spoken language · Hindi</span>');
  if (SITE_CONFIG.optional.dockerCi) optionalItems.push('<span>Currently exploring Docker & CI/CD</span>');
  if (SITE_CONFIG.optional.research) optionalItems.push('<span>Research interest · AI companions and student emotional decision-making</span>', '<span>Research interest · Adolescent anxiety and parent–child communication in South Asia</span>');
  if (optionalItems.length) { optional.hidden = false; optional.innerHTML = optionalItems.join(''); }
  setText('[data-year]', new Date().getFullYear());
}

function setupClock() {
  const target = $('[data-dhaka-time]');
  const formatter = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZoneName: 'short' });
  const tick = () => { target.textContent = formatter.format(new Date()); };
  tick();
  window.setInterval(tick, 1000);
}

function projectCard(project, index) {
  const featured = index < 2 ? ' project-card-featured' : '';
  return `<article class="project-card${featured} reveal" data-project-card="${project.slug}">
    <div class="project-card-top"><span>0${index + 1} / ${project.type}</span><span>${project.date}</span></div>
    ${project.team ? '<span class="team-badge">Team project</span>' : ''}
    <div class="project-cover">${visualMarkup(project)}</div>
    <div class="project-card-body"><div class="project-copy"><h3>${project.title}</h3><p>${project.outcome}</p><p class="project-role">${project.team ? 'Team project; contribution details are intentionally unlisted until provided.' : project.role}</p></div><div class="project-card-footer"><div class="project-stack">${project.stack.map((item) => `<span>${item}</span>`).join('')}</div><button class="project-open" type="button" data-open-project="${project.slug}">Read system <span aria-hidden="true">↗</span></button></div></div>
    <div class="project-link-row">${projectLinksMarkup(project)}</div>
  </article>`;
}

function projectLinksMarkup(project) {
  const labels = {
    live: ['Live Demo', `Live demo of ${project.title} (opens in new tab)`],
    backend: ['Backend API', `Backend API for ${project.title} (opens in new tab)`],
    github: ['GitHub', `GitHub repository for ${project.title} (opens in new tab)`],
  };
  return Object.entries(labels).filter(([key]) => project.links?.[key]).map(([key, [label, accessibleLabel]]) => `<a class="button button-secondary project-link" href="${project.links[key]}" target="_blank" rel="noopener noreferrer" aria-label="${accessibleLabel}">${label} <span aria-hidden="true">↗</span></a>`).join('');
}

function openProject(project) {
  lastFocused = document.activeElement;
  const dialog = document.createElement('dialog');
  dialog.className = 'project-dialog';
  dialog.dataset.projectDialog = project.slug;
  dialog.setAttribute('aria-labelledby', `dialog-title-${project.slug}`);
  const { caseStudy } = project;
  const links = projectLinksMarkup(project);
  const roleCopy = project.contribution || (project.team ? 'Team project; contribution details are intentionally unlisted until provided.' : project.role);
  const note = caseStudy.note ? `<p class="dialog-note">${caseStudy.note}</p>` : '';
  const linksSection = links ? `<section class="dialog-section"><h3>Links</h3><div class="dialog-links">${links}</div></section>` : '';
  dialog.innerHTML = `<div class="dialog-inner"><div><div class="dialog-meta"><span class="dialog-kicker">${project.date} · ${project.type}</span><button class="dialog-close" type="button" data-close-dialog aria-label="Close case study">×</button></div>${project.team ? '<span class="team-badge">Team project</span>' : ''}<h2 class="dialog-title" id="dialog-title-${project.slug}">${project.title}</h2><p class="dialog-summary">${project.outcome}</p><div class="dialog-cover">${galleryMarkup(project)}</div></div><div class="dialog-copy"><section class="dialog-section"><h3>Problem</h3><p>${caseStudy.problem}</p></section><section class="dialog-section"><h3>My role</h3><p>${roleCopy}</p></section><section class="dialog-section"><h3>Approach / architecture</h3><p>${caseStudy.approach}</p><p class="muted">${caseStudy.architecture}</p>${note}</section><section class="dialog-section"><h3>Key features</h3><ul>${caseStudy.features.map((feature) => `<li>${feature}</li>`).join('')}</ul></section><section class="dialog-section"><h3>Stack</h3><div class="project-stack">${project.stack.map((item) => `<span>${item}</span>`).join('')}</div></section><section class="dialog-section"><h3>What I would improve</h3><p>${caseStudy.improve}</p></section>${linksSection}</div></div>`;
  $('[data-dialog-layer]').append(dialog);
  const close = () => { dialog.close(); dialog.remove(); if (location.hash === `#${project.slug}`) history.replaceState(null, '', `${location.pathname}${location.search}`); lastFocused?.focus(); };
  dialog.addEventListener('click', (event) => { if (event.target === dialog) close(); });
  $('[data-close-dialog]', dialog).addEventListener('click', close);
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); close(); });
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusable = $$('button, a[href], input, textarea, select', dialog).filter((element) => !element.disabled);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  const show = () => { dialog.showModal(); $('[data-close-dialog]', dialog).focus(); };
  if (document.startViewTransition && !reduceMotion) document.startViewTransition(show);
  else show();
  history.replaceState(null, '', `#${project.slug}`);
}

function setupProjects() {
  const target = $('[data-projects]');
  target.innerHTML = PROJECTS.map(projectCard).join('');
  $$('[data-open-project]').forEach((button) => button.addEventListener('click', () => openProject(PROJECTS.find((project) => project.slug === button.dataset.openProject))));
  const hash = location.hash.slice(1);
  const linkedProject = PROJECTS.find((project) => project.slug === hash);
  if (linkedProject) window.setTimeout(() => openProject(linkedProject), 0);
}

function setupContact() {
  const area = $('[data-contact-area]');
  const copyButton = $('[data-copy-email]');
  const status = $('[data-copy-status]');
  copyButton.addEventListener('click', async () => {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(SITE_CONFIG.email);
      else throw new Error('Clipboard API unavailable');
      status.textContent = 'Email copied';
    } catch {
      const fallback = document.createElement('textarea');
      fallback.value = SITE_CONFIG.email;
      fallback.className = 'clipboard-fallback';
      fallback.setAttribute('readonly', '');
      document.body.append(fallback);
      fallback.select();
      const copied = document.execCommand('copy');
      fallback.remove();
      status.textContent = copied ? 'Email copied' : 'Select the email above to copy';
    }
    window.setTimeout(() => { status.textContent = ''; }, 2500);
  });
  if (!SITE_CONFIG.formEndpoint) {
    area.innerHTML = `<div class="email-first"><div><span class="mono-label">Email first</span><h3>Keep it direct.</h3><p>Email is the quickest way to start a useful conversation.</p></div><a class="button button-secondary" href="mailto:${SITE_CONFIG.email}">Open mail client <span aria-hidden="true">↗</span></a></div>`;
    return;
  }
  area.innerHTML = `<form data-contact-form novalidate><span class="mono-label">Message</span><h3>Start a conversation.</h3><p>Fields marked required keep the request useful.</p><div class="form-grid"><div class="form-field"><label for="contact-name">Name</label><input id="contact-name" name="name" required autocomplete="name" /><span class="field-error" data-error-for="name"></span></div><div class="form-field"><label for="contact-email">Email</label><input id="contact-email" type="email" name="email" required autocomplete="email" /><span class="field-error" data-error-for="email"></span></div><div class="form-field"><label for="contact-message">Message</label><textarea id="contact-message" name="message" required></textarea><span class="field-error" data-error-for="message"></span></div><label class="honeypot" aria-hidden="true">Company<input name="company" tabindex="-1" autocomplete="off" /></label><button class="button button-primary" type="submit">Send message <span aria-hidden="true">↗</span></button><p class="form-status" aria-live="polite" data-form-status></p></div></form>`;
  const form = $('[data-contact-form]');
  const formStatus = $('[data-form-status]', form);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = $$('[required]', form);
    let valid = true;
    fields.forEach((field) => { const error = $(`[data-error-for="${field.name}"]`, form); error.textContent = field.validity.valid ? '' : field.name === 'email' ? 'Enter a valid email.' : 'This field is required.'; valid &&= field.validity.valid; });
    if (!valid) { formStatus.textContent = 'Check the highlighted fields.'; formStatus.className = 'form-status error'; return; }
    formStatus.textContent = 'Sending…'; formStatus.className = 'form-status';
    try { const response = await fetch(SITE_CONFIG.formEndpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } }); if (!response.ok) throw new Error('Request failed'); form.reset(); formStatus.textContent = 'Message sent. Thank you.'; formStatus.className = 'form-status success'; }
    catch { formStatus.innerHTML = `Could not send here. <a href="mailto:${SITE_CONFIG.email}">Use email instead ↗</a>`; formStatus.className = 'form-status error'; }
  });
}

function setupNavigation() {
  const menu = $('[data-mobile-menu]');
  const toggle = $('[data-menu-toggle]');
  const closeButton = $('[data-menu-close]');
  const setMenu = (open) => { menu.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); document.body.style.overflow = open ? 'hidden' : ''; (open ? closeButton : toggle).focus(); };
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  closeButton.addEventListener('click', () => setMenu(false));
  $$('a', menu).forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (menu.hidden) return;
    if (event.key === 'Escape') { setMenu(false); return; }
    if (event.key !== 'Tab') return;
    const focusable = $$('button, a[href]', menu);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
}

function setupMotion() {
  const revealItems = $$('.reveal');
  if (reduceMotion) { revealItems.forEach((item) => item.classList.add('is-visible')); $('[data-reveal-lines]')?.classList.add('is-visible'); return; }
  const observer = new IntersectionObserver((entries, instance) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); instance.unobserve(entry.target); } }), { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
  const heroTitle = $('[data-reveal-lines]');
  requestAnimationFrame(() => heroTitle.classList.add('is-visible'));
  const magnetic = $('.magnetic');
  if (window.matchMedia('(pointer: fine)').matches) magnetic.addEventListener('pointermove', (event) => { const rect = magnetic.getBoundingClientRect(); magnetic.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.1}px, ${(event.clientY - rect.top - rect.height / 2) * 0.1 - 2}px)`; });
  if (window.matchMedia('(pointer: fine)').matches) magnetic.addEventListener('pointerleave', () => { magnetic.style.transform = ''; });
  $$('[data-project-card]').forEach((card) => { if (window.matchMedia('(pointer: fine)').matches) { card.addEventListener('pointermove', (event) => { const rect = card.getBoundingClientRect(); card.style.transform = `perspective(1200px) rotateX(${(event.clientY - rect.top - rect.height / 2) * -0.015}deg) rotateY(${(event.clientX - rect.left - rect.width / 2) * 0.015}deg)`; }); card.addEventListener('pointerleave', () => { card.style.transform = ''; }); } });
}

function setupScrollState() {
  const progress = $('[data-scroll-progress]');
  const sections = $$('main > section[id]');
  const links = $$('[data-index-link]');
  const update = () => { const max = document.documentElement.scrollHeight - window.innerHeight; progress.style.width = `${max ? (window.scrollY / max) * 100 : 0}%`; };
  window.addEventListener('scroll', update, { passive: true }); update();
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) links.forEach((link) => link.classList.toggle('active', link.dataset.indexLink === entry.target.id)); }), { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach((section) => observer.observe(section));
}

setMeta();
setupTheme();
setupIdentity();
setupClock();
setupProjects();
setupContact();
setupNavigation();
setupSkillsExplorer(PROJECTS);
setupMotion();
setupScrollState();
