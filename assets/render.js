/* ============================================================
   MOTORE DI RENDERING
   Prende i dati dai file in /data e li trasforma in HTML.
   NON serve modificare questo file per aggiungere contenuti.
   ============================================================ */

const MESI = ["gen", "feb", "mar", "apr", "mag", "giu",
              "lug", "ago", "set", "ott", "nov", "dic"];

/* "2026-06-07" -> "7 giu 2026" */
function formatDate(iso) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return parseInt(d, 10) + " " + MESI[parseInt(m, 10) - 1] + " " + y;
}

/* crea un id-ancora pulito dal testo */
function slug(s) {
    return (s || "").toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/* mette i piu' recenti per primi (per data, se presente) */
function byDateDesc(a, b) {
    return (b.date || "").localeCompare(a.date || "");
}

/* estrae l'ID da un qualsiasi link youtube (o accetta gia' l'id) */
function youtubeId(url) {
    if (!url) return "";
    const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : url.trim();
}

function escapeHtml(s) {
    return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* escapa l'html e trasforma i link in <a> cliccabili, su una nuova riga */
function linkify(s) {
    return escapeHtml(s).replace(/(https?:\/\/[^\s]+)/g, url =>
        `<br><a href="${url}" target="_blank">${url}</a>`);
}

/* --- BLOG e APPUNTI (stessa struttura) --- */
function renderBlog(entries, root) {
    if (!entries || !entries.length) { root.innerHTML = '<p class="empty">ancora niente qui.</p>'; return; }
    const list = entries.slice().sort(byDateDesc);

    const strip = list.map(e => {
        const id = e.id || slug(e.date + "-" + e.title);
        return `<a href="#${id}">${formatDate(e.date) || escapeHtml(e.title)}</a>`;
    }).join("");

    const articles = list.map(e => {
        const id = e.id || slug(e.date + "-" + e.title);
        return `<article id="${id}">
            <h2>${escapeHtml(e.title)}</h2>
            ${e.date ? `<p class="meta">${formatDate(e.date)}</p>` : ""}
            <p>${linkify(e.body)}</p>
        </article>`;
    }).join("");

    root.innerHTML = `<div class="dates-strip">${strip}</div>${articles}`;
}

/* --- MUSICA --- */
function renderMusica(entries, root) {
    if (!entries || !entries.length) { root.innerHTML = '<p class="empty">ancora niente qui.</p>'; return; }
    const list = entries.slice().sort(byDateDesc);

    root.innerHTML = list.map(e => {
        const links = (e.links || []).map(u =>
            `<a href="${u}" target="_blank">link</a>`).join(" ");
        const note = e.note ? " " + escapeHtml(e.note) : "";
        return `<div class="song-block">
            ${e.date ? `<p class="meta">${formatDate(e.date)}</p>` : ""}
            <p>${escapeHtml(e.title)}${note}</p>
            ${links}
        </div>`;
    }).join("");
}

/* --- SCACCHI (progetti / repo) --- */
function renderScacchi(entries, root) {
    if (!entries || !entries.length) { root.innerHTML = '<p class="empty">ancora niente qui.</p>'; return; }

    root.innerHTML = entries.map(e => {
        const body = e.body ? `<p>${escapeHtml(e.body)}</p>` : "";
        const link = e.link
            ? `<a href="${e.link}" class="repo-link" target="_blank">${escapeHtml(e.link.replace(/^https?:\/\//, ""))} ↗</a>`
            : "";
        return `<div class="repo-container">
            <h2 class="repo-title">${escapeHtml(e.title)}</h2>
            ${body}
            ${link}
        </div>`;
    }).join("");
}

/* --- FOTO --- */
function renderFoto(entries, root) {
    if (!entries || !entries.length) { root.innerHTML = '<p class="empty">ancora niente qui.</p>'; return; }
    const list = entries.slice().sort(byDateDesc);

    root.innerHTML = `<div class="foto-grid">` + list.map(e => `
        <div class="foto-item">
            <img src="${e.src}" alt="${escapeHtml(e.caption || "")}" loading="lazy">
            ${e.caption ? `<div class="caption">${escapeHtml(e.caption)}</div>` : ""}
        </div>`).join("") + `</div>`;
}

/* --- VIDEO (youtube) --- */
function renderVideo(entries, root) {
    if (!entries || !entries.length) { root.innerHTML = '<p class="empty">ancora niente qui.</p>'; return; }
    const list = entries.slice().sort(byDateDesc);

    root.innerHTML = list.map(e => {
        const id = youtubeId(e.youtube);
        return `<div class="video-item">
            ${e.title ? `<h2>${escapeHtml(e.title)}</h2>` : ""}
            <div class="video-embed">
                <iframe src="https://www.youtube.com/embed/${id}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
            </div>
        </div>`;
    }).join("");
}
