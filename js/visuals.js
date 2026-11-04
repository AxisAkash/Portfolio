const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);

const node = (label, accent = false) => `<span class="diagram-node${accent ? ' diagram-node-accent' : ''}">${esc(label)}</span>`;
const arrow = '<span class="diagram-arrow" aria-hidden="true">→</span>';
const textAlternative = {
  roles: 'Farmer connects to Field Officer, Bank Officer, and Admin through an Express.js role-based access layer backed by Supabase and PostgreSQL.',
  mvc: 'Browser requests pass through a PHP MVC controller and role/session gate to a MySQL model.',
  nlp: 'Natural-language math passes through an NLP parser and TensorFlow pipeline to produce a result.',
  entities: 'Tenant connects to Lease, Lease connects to Unit, and Invoice and Payment record the financial workflow.',
};

export function diagramMarkup(kind, title) {
  let body = '';
  if (kind === 'roles') {
    body = `<div class="diagram-flow diagram-flow-roles">${node('Farmer')}${arrow}${node('Field Officer', true)}${arrow}${node('Bank Officer')}${arrow}${node('Admin')}</div><div class="diagram-connector" aria-hidden="true">↓</div><div class="diagram-layer">${node('Express.js / RBAC', true)}</div><div class="diagram-connector" aria-hidden="true">↓</div><div class="diagram-layer">${node('Supabase / PostgreSQL')}</div>`;
  } else if (kind === 'mvc') {
    body = `<div class="diagram-flow diagram-flow-mvc">${node('Browser')}${arrow}${node('Controller', true)}${arrow}${node('RBAC / Session')}${arrow}${node('Model')}${arrow}${node('MySQL')}</div><p class="diagram-caption">PHP MVC request path</p>`;
  } else if (kind === 'nlp') {
    body = `<div class="diagram-flow diagram-flow-nlp">${node('20% of 350')}${arrow}${node('NLP parser', true)}${arrow}${node('TensorFlow')}${arrow}${node('Result')}</div><p class="diagram-caption">Natural-language math pipeline</p>`;
  } else {
    body = `<div class="entity-map"><div class="entity-column">${node('Tenant', true)}${node('Lease')}${node('Unit')}</div><div class="entity-column entity-column-accent">${node('Invoice', true)}${node('Payment')}</div></div><p class="diagram-caption">Tenant → Lease → Unit · Invoice ↔ Payment</p>`;
  }
  return `<div class="system-cover system-cover-${esc(kind)}" role="img" aria-label="${esc(title)} system diagram"><div class="diagram-title">SYSTEM MAP / ${esc(kind.toUpperCase())}</div>${body}<p class="sr-only">${textAlternative[kind]}</p></div>`;
}

export function visualMarkup(project) {
  if (project.visual?.type === 'screenshot' && project.visual.files?.length) {
    const first = project.visual.files[0];
    const liveBadge = project.links?.live ? '<span class="preview-badge">Live</span>' : '';
    return `<div class="preview-frame"><div class="preview-chrome"><span></span><span></span><span></span>${liveBadge}</div><img src="${esc(first.src)}" width="${first.width}" height="${first.height}" alt="${esc(first.alt)}" loading="lazy" /></div>`;
  }
  return diagramMarkup(project.visual?.diagram || 'roles', project.title);
}

export function galleryMarkup(project) {
  if (project.visual?.type === 'screenshot' && project.visual.files?.length) {
    const liveBadge = project.links?.live ? '<span class="preview-badge">Live</span>' : '';
    return `<div class="visual-gallery">${project.visual.files.map((file) => `<div class="preview-frame"><div class="preview-chrome"><span></span><span></span><span></span>${liveBadge}</div><img src="${esc(file.src)}" width="${file.width}" height="${file.height}" alt="${esc(file.alt)}" loading="lazy" /></div>`).join('')}</div>`;
  }
  return diagramMarkup(project.visual?.diagram || 'roles', project.title);
}
