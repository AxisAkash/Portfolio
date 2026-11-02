const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);

const box = (x, y, width, height, label, accent = false) => `<rect class="${accent ? 'cover-box-accent' : 'cover-box'}" x="${x}" y="${y}" width="${width}" height="${height}" /><text x="${x + 10}" y="${y + height / 2 + 3}" class="${accent ? 'cover-accent' : ''}">${esc(label)}</text>`;
const arrow = (x1, y1, x2, y2) => `<path class="cover-line" marker-end="url(#arrow)" d="M${x1} ${y1} H${x2}" />`;

export function diagramMarkup(kind, title) {
  const defs = `<defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="none" stroke="currentColor" stroke-width="1" /></marker></defs>`;
  let body = '';
  if (kind === 'roles') {
    body = `${box(18, 46, 120, 32, 'Farmer')} ${box(174, 46, 120, 32, 'Field Officer', true)} ${box(330, 46, 120, 32, 'Bank Officer')} ${box(486, 46, 120, 32, 'Admin')} ${arrow(138, 62, 168, 62)} ${arrow(294, 62, 324, 62)} ${arrow(450, 62, 480, 62)} <path class="cover-line" d="M294 78 V158 H370" /><path class="cover-line" d="M450 78 V158 H370" /> ${box(270, 158, 200, 38, 'Express.js / RBAC', true)} <path class="cover-line" d="M370 196 V236" /> ${box(270, 236, 200, 32, 'Supabase / PostgreSQL')}`;
  } else if (kind === 'mvc') {
    body = `${box(22, 118, 116, 40, 'Browser')} ${box(190, 48, 116, 40, 'Controller', true)} ${box(190, 118, 116, 40, 'RBAC gate')} ${box(190, 188, 116, 40, 'Session')} ${box(392, 118, 116, 40, 'Model')} ${box(526, 118, 92, 40, 'MySQL')} ${arrow(138, 138, 184, 68)} ${arrow(138, 138, 184, 138)} ${arrow(138, 138, 184, 208)} ${arrow(306, 138, 386, 138)} ${arrow(508, 138, 520, 138)}`;
  } else if (kind === 'nlp') {
    body = `${box(18, 118, 126, 42, '20% of 350')} ${box(188, 118, 126, 42, 'NLP parser', true)} ${box(358, 118, 126, 42, 'TensorFlow')} ${box(528, 118, 90, 42, '700')} ${arrow(144, 139, 182, 139)} ${arrow(314, 139, 352, 139)} ${arrow(484, 139, 522, 139)} <text x="18" y="86" class="cover-title">natural-language math</text>`;
  } else {
    body = `${box(22, 55, 130, 38, 'Tenant', true)} ${box(22, 164, 130, 38, 'Lease')} ${box(255, 55, 130, 38, 'Unit')} ${box(255, 164, 130, 38, 'Invoice', true)} ${box(488, 109, 130, 38, 'Payment')} <path class="cover-line" d="M152 74 H208 V184 H249" /><path class="cover-line" d="M152 183 H249" /><path class="cover-line" d="M385 74 H440 V128 H482" /><path class="cover-line" d="M385 183 H440 V128 H482" />`;
  }
  return `<div class="system-cover" role="img" aria-label="${esc(title)} system diagram"><svg viewBox="0 0 640 300" preserveAspectRatio="xMidYMid meet">${defs}<text x="18" y="24" class="cover-title">SYSTEM MAP / ${esc(kind.toUpperCase())}</text>${body}</svg></div>`;
}

export function visualMarkup(project) {
  if (project.visual?.type === 'screenshot' && project.visual.files?.length) {
    const first = project.visual.files[0];
    return `<img src="${esc(first.src)}" width="${first.width}" height="${first.height}" alt="${esc(first.alt)}" loading="lazy" />`;
  }
  return diagramMarkup(project.visual?.diagram || 'roles', project.title);
}

export function galleryMarkup(project) {
  if (project.visual?.type === 'screenshot' && project.visual.files?.length) {
    return `<div class="visual-gallery">${project.visual.files.map((file) => `<img src="${esc(file.src)}" width="${file.width}" height="${file.height}" alt="${esc(file.alt)}" loading="lazy" />`).join('')}</div>`;
  }
  return diagramMarkup(project.visual?.diagram || 'roles', project.title);
}
