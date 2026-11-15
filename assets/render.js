/* ============================================================
   MOTORE DI RENDERING
   Prende i dati dai file in /data e li trasforma in HTML.
   NON serve modificare questo file per aggiungere contenuti.
   Ogni renderXxx(dati, contenitore, sezione, sotto) disegna dentro una
   finestra della scacchiera; "sotto" e' la parte dopo la / nell'indirizzo
   (#blog/id-del-post, #foto/nome-serie).
   ============================================================ */

const MESI = ["gen", "feb", "mar", "apr", "mag", "giu",
              "lug", "ago", "set", "ott", "nov", "dic"];

/* "2026-06-07" -> "7 giu 2026" */
function formatDate(iso) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return parseInt(d, 10) + " " + MESI[parseInt(m, 10) - 1] + " " + y;
}

/* crea un id-ancora pulito dal testo ("Città vecchia" -> "citta-vecchia") */
function slug(s) {
    return (s || "").toLowerCase()
        .normalize("NFD").replace(/[̀-ͯ]/g, "")
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
        `<br><a href="${url}" target="_blank" rel="noopener">${url}</a>`);
}

function vuoto(root) {
    root.innerHTML = '<div class="empty"><p>ancora niente qui.</p></div>';
}

/* riga di un elenco: titolo a sinistra, data a destra, nota sotto */
function riga(titolo, data, nota, href) {
    const inner = `<span class="t">${titolo}</span><span class="d">${data}</span>${nota ? `<span class="n">${nota}</span>` : ""}`;
    return href ? `<a class="item" href="${href}">${inner}</a>` : `<div class="item">${inner}</div>`;
}

/* --- BLOG: elenco di righe; un clic apre il post nella stessa finestra --- */
function renderBlog(entries, root, sect, sub) {
    if (!entries || !entries.length) return vuoto(root);
    const list = entries.slice().sort(byDateDesc);
    const idOf = e => e.id || slug(e.date + "-" + e.title);
    const e = list.find(x => idOf(x) === sub);

    if (e) {
        root.innerHTML = `<article class="post">
            <a class="back" href="#${sect}">&larr; ${sect}</a>
            <h2>${escapeHtml(e.title)}</h2>
            ${e.date ? `<p class="meta">${formatDate(e.date)}</p>` : ""}
            <p class="text">${linkify(e.body)}</p>
        </article>`;
        return;
    }
    root.innerHTML = `<ul class="rows">` + list.map(x =>
        `<li>${riga(escapeHtml(x.title), formatDate(x.date), "", "#" + sect + "/" + encodeURIComponent(idOf(x)))}</li>`).join("") + `</ul>`;
}

/* --- APPUNTI: voci brevi, il testo sta gia' nella riga --- */
function renderAppunti(entries, root) {
    if (!entries || !entries.length) return vuoto(root);
    root.innerHTML = `<ul class="rows">` + entries.map(e =>
        `<li>${riga(escapeHtml(e.title), formatDate(e.date), e.body ? linkify(e.body).replace(/^<br>/, "") : "")}</li>`).join("") + `</ul>`;
}

/* --- MUSICA ---
   i link di YouTube diventano anteprime che si ascoltano qui; gli altri restano "link" */
function renderMusica(entries, root) {
    if (!entries || !entries.length) return vuoto(root);
    const list = entries.slice().sort(byDateDesc);

    root.innerHTML = `<ul class="rows">` + list.map(e => {
        const yt = (e.links || []).filter(u => /youtu/.test(u));
        const links = (e.links || []).filter(u => !/youtu/.test(u)).map(u =>
            `<a href="${u}" target="_blank" rel="noopener">link</a>`).join(" ");
        return `<li><div class="item">
            <span class="t">${escapeHtml(e.title)}</span><span class="d">${formatDate(e.date)}</span>
            ${e.note ? `<span class="n">${escapeHtml(e.note)}</span>` : ""}
            ${yt.length ? `<span class="vids">${yt.map(u => ytEmbed(youtubeId(u))).join("")}</span>` : ""}
            ${links ? `<span class="n">${links}</span>` : ""}
        </div></li>`;
    }).join("") + `</ul>`;
    hookYt(root);
}

/* --- SCACCHI (progetti / repo): la riga e' il link --- */
function renderScacchi(entries, root) {
    if (!entries || !entries.length) return vuoto(root);

    root.innerHTML = `<ul class="rows">` + entries.map(e => {
        const url = e.link ? escapeHtml(e.link.replace(/^https?:\/\//, "")) : "";
        const nota = [e.body ? escapeHtml(e.body) : "", url ? `<span class="url">${url}</span>` : ""].filter(Boolean).join("<br>");
        const inner = `<span class="t">${escapeHtml(e.title)}</span><span class="d"></span>${nota ? `<span class="n">${nota}</span>` : ""}`;
        return `<li>${e.link ? `<a class="item" href="${e.link}" target="_blank" rel="noopener">${inner}</a>` : `<div class="item">${inner}</div>`}</li>`;
    }).join("") + `</ul>`;
}

/* --- FOTO: singole e in serie ---
   le foto con la stessa "serie" diventano un gruppo (copertina = la prima caricata);
   nell'elenco una serie e' una voce sola, datata alla sua foto piu' recente.
   #foto/nome-serie mostra la serie intera. */
function renderFoto(entries, root, sect, sub) {
    if (!entries || !entries.length) return vuoto(root);

    if (sub) {
        const list = entries.filter(e => e.serie && slug(e.serie) === sub);
        root.innerHTML = `<a class="back" href="#${sect}">&larr; tutte le foto</a>` + (list.length
            ? `<h2 class="serie-title">${escapeHtml(list[0].serie)}</h2>
               <div class="foto-grid foto-serie">${list.map((e, i) => fotoItem(e, i, true)).join("")}</div>`
            : '<p class="empty-txt">questa serie non esiste.</p>');
        return hookLightbox(root, list);
    }

    const singole = [], serie = {};
    entries.forEach(e => {
        if (!e.serie) return singole.push(e);
        const s = serie[e.serie] = serie[e.serie] || { date: "", foto: [] };
        s.foto.push(e);
        if ((e.date || "") > s.date) s.date = e.date;
    });
    singole.sort(byDateDesc);

    const voci = singole.map((e, i) => ({ date: e.date, html: fotoItem(e, i) }))
        .concat(Object.keys(serie).map(nome => ({ date: serie[nome].date, html: serieItem(nome, serie[nome].foto, sect) })))
        .sort(byDateDesc);
    root.innerHTML = `<div class="foto-grid foto-indice">${voci.map(v => v.html).join("")}</div>`;
    hookLightbox(root, singole);
}

/* src = foto grande, mini = miniatura; w/h evitano che la pagina "salti" mentre carica */
function fotoImg(e, grande) {
    const size = e.w ? ` width="${e.w}" height="${e.h}"` : "";
    return `<img src="${grande ? e.src : e.mini || e.src}"${size} alt="${escapeHtml(e.caption || "")}" loading="lazy">`;
}

function fotoItem(e, i, grande) {
    return `<figure class="foto-item">
        <a href="${e.src}" data-i="${i}">${fotoImg(e, grande)}</a>
        ${e.caption ? `<figcaption>${escapeHtml(e.caption)}</figcaption>` : ""}
    </figure>`;
}

function serieItem(nome, foto, sect) {
    const href = `#${sect}/${slug(nome)}`;
    return `<figure class="foto-item">
        <a href="${href}">${fotoImg(foto[0])}</a>
        <figcaption><a href="${href}">${escapeHtml(nome)}</a> &middot; ${foto.length} foto</figcaption>
    </figure>`;
}

function hookLightbox(root, list) {
    root.querySelectorAll("a[data-i]").forEach(a => a.onclick = ev => {
        ev.preventDefault();
        lightbox(list, +a.dataset.i);
    });
}

/* foto a schermo intero con il <dialog> del browser:
   click sulla meta' destra/sinistra o frecce = avanti/indietro, Esc o click fuori = chiudi */
function lightbox(list, i) {
    let d = document.getElementById("lightbox");
    if (!d) {
        d = document.body.appendChild(document.createElement("dialog"));
        d.id = "lightbox";
        d.setAttribute("aria-label", "foto");
    }
    const show = j => {
        i = (j + list.length) % list.length;
        const e = list[i];
        d.innerHTML = `<img src="${e.src}" alt="${escapeHtml(e.caption || "")}">` +
            (e.caption ? `<p>${escapeHtml(e.caption)}</p>` : "");
    };
    d.onclick = ev => {
        if (ev.target.tagName !== "IMG" || list.length < 2) return d.close();
        const r = ev.target.getBoundingClientRect();
        show(i + (ev.clientX > r.left + r.width / 2 ? 1 : -1));
    };
    d.onkeydown = ev => {
        if (ev.key === "ArrowRight") show(i + 1);
        if (ev.key === "ArrowLeft") show(i - 1);
    };
    show(i);
    d.showModal();
}

/* --- VIDEO (youtube) ---
   si vede solo la miniatura: il player di YouTube si carica quando premi play
   (pagina piu' leggera, e niente cookie di YouTube finche' non lo avvii) */
function renderVideo(entries, root) {
    if (!entries || !entries.length) return vuoto(root);
    const list = entries.slice().sort(byDateDesc);

    root.innerHTML = `<div class="video-list">` + list.map(e => `
        <div class="video-item">
            ${ytEmbed(youtubeId(e.youtube))}
            <p class="t">${escapeHtml(e.title || "")}</p>
            ${e.date ? `<p class="meta">${formatDate(e.date)}</p>` : ""}
        </div>`).join("") + `</div>`;
    hookYt(root);
}

/* miniatura col tasto play (usata da video e musica) */
function ytEmbed(id) {
    return `<a class="video-embed" href="https://youtu.be/${id}" data-id="${id}" aria-label="guarda il video">
        <img src="https://i.ytimg.com/vi/${id}/maxresdefault.jpg" alt="" loading="lazy"
            onload="ytThumb(this)" onerror="ytThumb(this)">
    </a>`;
}

/* al click la miniatura diventa il player vero */
function hookYt(root) {
    root.querySelectorAll("a[data-id]").forEach(a => a.onclick = ev => {
        ev.preventDefault();
        a.outerHTML = `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${a.dataset.id}?autoplay=1"
            title="video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`;
    });
}

/* non tutti i video hanno la miniatura grande (YouTube da' un'immagine minuscola): ripiego su quella media */
function ytThumb(img) {
    if (img.naturalWidth < 200 && img.src.includes("maxres")) img.src = img.src.replace("maxres", "hq");
}
