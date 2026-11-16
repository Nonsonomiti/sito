/* ============================================================
   LA SCACCHIERA: una posizione legale a caso a ogni caricamento
   (posizione.js), disegnata a punti in 1 bit. I pezzi sono la
   navigazione: i pezzi aprono le sette sezioni.
   Indirizzi: index.html#blog, #blog/id-del-post, #foto/nome-serie
   (blog.html, musica.html ... rimandano qui).
   ============================================================ */
/* pixel art 32x32, un carattere per pixel (vedi sprite()) */
const SPRITES = {
    pawn: [
        "................................",
        "................................",
        "................................",
        "..............rrrr..............",
        "............rr####rr............",
        "...........r##oooo##r...........",
        "..........r#oooooooo#r..........",
        "..........r#oooooooo#r..........",
        "..........r#xooooooo#r..........",
        "..........r#xooooooo#r..........",
        "..........r#oooooooo#r..........",
        "..........r#oooooooo#r..........",
        "...........r#oooooo#r...........",
        "............r#oooo#r............",
        "..........rrr#oooo#rrr..........",
        ".........r###oooooo###r.........",
        ".........r##oooooooo##r.........",
        "..........rr#oooooo#rr..........",
        "...........r#oooooo#r...........",
        "...........r#oooooo#r...........",
        "..........r#oooooooo#r..........",
        "..........r#oxxxxxxo#r..........",
        ".........r#oooooooooo#r.........",
        ".........r#oooooooooo#r.........",
        "........r#oooooooooooo#r........",
        ".......rr#oooooooooooo#rr.......",
        ".....rr##oooooooooooooo##rr.....",
        "....r##oooooooooooooooooo##r....",
        "...r#oooooooooooooooooooooo#r...",
        "...r#oooooooooooooooooooooo#r...",
        "...r########################r...",
        "....rrrrrrrrrrrrrrrrrrrrrrrr...."
    ],
    knight: [
        "................................",
        "............rr..................",
        "...........r##r.rr..............",
        "...........r#o#r##r.............",
        "..........r#ooo#o#rrr...........",
        ".........r#ooooooo###r..........",
        "........r#oooooooooo#r..........",
        "........r#oooooooooo#r..........",
        ".......r#oooooooooo#rrr.........",
        "......r#oxxooooooooo###r........",
        ".....r#ooxxoooooooooo#r.........",
        "....r#oooooooooooooox#rr........",
        "...r#ooooooooooooooooo##r.......",
        "..r#oooooxooooooooooooo#r.......",
        ".r#oooooooxooooooooooxo#r.......",
        ".r#xooooooxoooooooooooo#r.......",
        ".r#xooooooooooooooooooo#r.......",
        ".r#ooooooooooooooooooox#r.......",
        ".r#ooooo###ooooooooooooo#r......",
        "..r#####rrr#oooooooooooo#r......",
        "...rrrrr..r#oooooooooooo#r......",
        "..........r#oooooooooooo#r......",
        "..........r#oooooooooooo#r......",
        ".........r#ooooooooooooo#r......",
        "........r#oooooooooooooo#r......",
        ".......r#ooooooooooooooo#r......",
        ".....rr#oooooooooooooooo#rr.....",
        "....r##oooooooooooooooooo##r....",
        "...r#oooooooooooooooooooooo#r...",
        "...r#oooooooooooooooooooooo#r...",
        "...r########################r...",
        "....rrrrrrrrrrrrrrrrrrrrrrrr...."
    ],
    bishop: [
        "................................",
        "...............rr...............",
        "..............r##r..............",
        "..............r##r..............",
        ".............r#oo#r.............",
        "............r#oooo#r............",
        "...........r#ooooox#r...........",
        "...........r#ooooxo#r...........",
        "..........r#oooooxoo#r..........",
        "..........r#ooooxooo#r..........",
        "..........r#oooxoooo#r..........",
        "...........r#oooooo#r...........",
        "..........r#oooooooo#r..........",
        "...........r#oooooo#r...........",
        "............r#oooo#r............",
        "............r#oooo#r............",
        "............r#oooo#r............",
        "............r#oooo#r............",
        "...........r#oooooo#r...........",
        "...........r#oooooo#r...........",
        "...........r#oooooo#r...........",
        "..........r#oooooooo#r..........",
        "..........r#oooooooo#r..........",
        ".........r#oooooooooo#r.........",
        "........r#ooxxxxxxxxoo#r........",
        ".......rrr#oooooooooo#rrr.......",
        ".....rr###oooooooooooo###rr.....",
        "....r##oooooooooooooooooo##r....",
        "...r#oooooooooooooooooooooo#r...",
        "...r#oooooooooooooooooooooo#r...",
        "...r########################r...",
        "....rrrrrrrrrrrrrrrrrrrrrrrr...."
    ],
    rook: [
        "................................",
        "................................",
        "........rrrr..rrrr..rrrr........",
        ".......r####rr####rr####r.......",
        ".......r#oo#rr#oo#rr#oo#r.......",
        ".......r#oo#rr#oo#rr#oo#r.......",
        "......r#oooo##oooo##oooo#r......",
        "......r#oooooooooooooooo#r......",
        "......r##oooooooooooooo##r......",
        ".......rr#oooooooooooo#rr.......",
        "........r#oooooooooooo#r........",
        ".........r#oooooooooo#r.........",
        ".........r#oooooooooo#r.........",
        ".........r#ooooxxoooo#r.........",
        ".........r#ooooxxoooo#r.........",
        ".........r#ooooxxoooo#r.........",
        ".........r#ooooxxoooo#r.........",
        "........r#oooooooooooo#r........",
        "........r#oooooooooooo#r........",
        "........r#oooooooooooo#r........",
        "........r#oooooooooooo#r........",
        "........r#oooooooooooo#r........",
        ".......rr#oooxxooxxooo#rr.......",
        "......r##oooooooooooooo##r......",
        "......r#oooooooooooooooo#r......",
        ".....r#oooooooooooooooooo#r.....",
        ".....rr#oooooooooooooooo#rr.....",
        "....r##oooooooooooooooooo##r....",
        "...r#oooooooooooooooooooooo#r...",
        "...r#oooooooooooooooooooooo#r...",
        "...r########################r...",
        "....rrrrrrrrrrrrrrrrrrrrrrrr...."
    ],
    queen: [
        "................................",
        "...............rr...............",
        "..............r##r..............",
        ".............r#oo#r.............",
        ".............r#oo#r.............",
        "..............r##r..............",
        ".........rr.rrr##rrr.rr.........",
        "........r##r##r##r##r##r........",
        "........r#o#oo#oo#oo#o#r........",
        ".........r#oxxxxxxxxo#r.........",
        "..........r#oooooooo#r..........",
        "...........r#oooooo#r...........",
        "..........r#oooooooo#r..........",
        "...........r#oooooo#r...........",
        "............r#oooo#r............",
        "............r#oooo#r............",
        "............r#oooo#r............",
        "............r#oooo#r............",
        "...........r#oooooo#r...........",
        "...........r#oooooo#r...........",
        "...........r#oooooo#r...........",
        "..........r#oooooooo#r..........",
        "..........r#oooooooo#r..........",
        ".........r#oooooooooo#r.........",
        "........r#ooxxxxxxxxoo#r........",
        ".......rrr#oooooooooo#rrr.......",
        ".....rr###oooooooooooo###rr.....",
        "....r##oooooooooooooooooo##r....",
        "...r#oooooooooooooooooooooo#r...",
        "...r#oooooooooooooooooooooo#r...",
        "...r########################r...",
        "....rrrrrrrrrrrrrrrrrrrrrrrr...."
    ],
    king: [
        "...............rr...............",
        ".............rr##rr.............",
        "............r##oo##r............",
        "............r##oo##r............",
        ".............rr##rr.............",
        "..............r##r..............",
        "..........rrrr#oo#rrrr..........",
        ".........r####oooo####r.........",
        ".........r#oooooooooo#r.........",
        "..........r#xxxxxxxx#r..........",
        "..........r#oooooooo#r..........",
        "...........r#oooooo#r...........",
        "..........r#oooooooo#r..........",
        "...........r#oooooo#r...........",
        "............r#oooo#r............",
        "............r#oooo#r............",
        "............r#oooo#r............",
        "............r#oooo#r............",
        "...........r#oooooo#r...........",
        "...........r#oooooo#r...........",
        "...........r#oooooo#r...........",
        "..........r#oooooooo#r..........",
        "..........r#oooooooo#r..........",
        ".........r#oooooooooo#r.........",
        "........r#ooxxxxxxxxoo#r........",
        ".......rrr#oooooooooo#rrr.......",
        ".....rr###oooooooooooo###rr.....",
        "....r##oooooooooooooooooo##r....",
        "...r#oooooooooooooooooooooo#r...",
        "...r#oooooooooooooooooooooo#r...",
        "...r########################r...",
        "....rrrrrrrrrrrrrrrrrrrrrrrr...."
    ]
};

(function () {
    /* pezzo e colore (w/b) di ogni sezione */
    const SEZ = {
        blog:    { sigla: "wP", pezzo: "pawn",   dati: () => window.BLOG,    fn: renderBlog,    w: 640, h: 560 },
        musica:  { sigla: "bN", pezzo: "knight", dati: () => window.MUSICA,  fn: renderMusica,  w: 680, h: 560 },
        scacchi: { sigla: "wK", pezzo: "king",   dati: () => window.SCACCHI, fn: renderScacchi, w: 560, h: 360 },
        video:   { sigla: "wQ", pezzo: "queen",  dati: () => window.VIDEO,   fn: renderVideo,   w: 720, h: 540 },
        appunti: { sigla: "bR", pezzo: "rook",   dati: () => window.APPUNTI, fn: renderAppunti, w: 600, h: 400 },
        foto:    { sigla: "bB", pezzo: "bishop", dati: () => window.FOTO,    fn: renderFoto,    w: 720, h: 560 },
        about:   { sigla: "bK", pezzo: "king",   dati: () => window.ABOUT,   fn: renderAppunti, w: 600, h: 400 },
    };
    const FILE = "abcdefgh";
    const root = document.documentElement;
    const telefono = matchMedia("(max-width: 720px)");
    const calmo = matchMedia("(prefers-reduced-motion: reduce)");
    const board = document.getElementById("board");
    const cv = document.getElementById("cv");
    const pezzi = {};      // sezione -> elemento
    const aperte = {};     // sezione -> { el, body, sub }
    let z = 10;

    /* ---------- disegno dei pezzi: righe di caratteri -> rettangoli nitidi ----------
       . vuoto, o riempimento, # contorno, x dettaglio (stesso colore del contorno), r alone */
    function sprite(nome) {
        const rows = SPRITES[nome];
        const path = cl => rows.map((r, y) =>
            [...r.matchAll(new RegExp("[" + cl + "]+", "g"))].map(m => `M${m.index} ${y}h${m[0].length}v1h-${m[0].length}z`).join("")).join("");
        return `<svg class="pc" viewBox="0 0 32 32" shape-rendering="crispEdges" aria-hidden="true">` +
            `<path class="r" d="${path("r")}"/><path class="f" d="${path("o")}"/><path class="l" d="${path("#x")}"/></svg>`;
    }

    /* ---------- la posizione ---------- */
    const pos = POSIZIONE.genera();
    const inCasa = {};
    for (const k in SEZ) inCasa[k] = pos[SEZ[k].sigla];
    const casa = c => FILE[c[0]] + (c[1] + 1);

    const nodi = Object.keys(SEZ).map(k => ({ k, c: inCasa[k], colore: SEZ[k].sigla[0] }));
    nodi.sort((a, b) => b.c[1] - a.c[1] || a.c[0] - b.c[0]);   // ordine di lettura: dall'alto a sinistra

    nodi.forEach(n => {
        const el = document.createElement("a");
        el.className = "piece " + n.colore;
        el.href = "#" + n.k;
        el.dataset.k = n.k;
        el.dataset.casa = casa(n.c);
        el.style.left = `calc(${n.c[0]} * var(--sq))`;
        el.style.top = `calc(${7 - n.c[1]} * var(--sq))`;
        el.innerHTML = sprite(SEZ[n.k].pezzo) + `<span class="nome"></span>`;
        board.append(el);
        pezzi[n.k] = el;
        el.querySelector(".nome").textContent = n.k;
        el.setAttribute("aria-label", `${n.k}, ${casa(n.c)}`);
    });

    document.querySelector(".ranks").innerHTML = [8, 7, 6, 5, 4, 3, 2, 1].map(r => `<span>${r}</span>`).join("");
    document.querySelector(".files").innerHTML = [...FILE].map(f => `<span>${f}</span>`).join("");

    /* ---------- la scacchiera a punti (dither ordinato, come lo sfondo della scrivania) ----------
       un punto = u pixel dello schermo (sempre pixel fisici interi). Case scure: quasi tutto
       inchiostro. Case chiare: puntini sparsi, piu' fitti verso il basso. */
    const BAYER = (function b(n) {
        if (n === 1) return [[0]];
        const m = b(n / 2), s = n / 2, t = [];
        for (let y = 0; y < n; y++) {
            t[y] = [];
            for (let x = 0; x < n; x++) t[y][x] = 4 * m[y % s][x % s] + [[0, 2], [3, 1]][+(y >= s)][+(x >= s)];
        }
        return t;
    })(8);
    let u = 1, sq = 0;

    const INK = [233, 227, 215], PAPER = [23, 21, 18];     // #E9E3D7 su #171512
    const px = c => (255 << 24) | (c[2] << 16) | (c[1] << 8) | c[0];

    function punti() {
        const per = Math.round(sq / u), n = 8 * per;
        cv.width = cv.height = n;
        cv.style.width = cv.style.height = 8 * sq + "px";
        const cx = cv.getContext("2d"), img = cx.createImageData(n, n), d = new Uint32Array(img.data.buffer);
        for (let y = 0; y < n; y++) {
            for (let x = 0; x < n; x++) {
                // casa scura se colonna + traversa e' pari (a1 = 0,0): punti radi. Casa chiara: quasi tutto crema.
                const scura = (Math.floor(x / per) + Math.floor(y / per)) % 2 === 1;
                const t = 0.85 * y / n + 0.15 * x / n;                                  // 0 in alto a sinistra, 1 in basso a destra
                const cop = scura ? 0.04 + 0.34 * Math.pow(t, 1.15) : 0.8 + 0.17 * t;
                d[y * n + x] = px((BAYER[y % 8][x % 8] + 0.5) / 64 < cop ? INK : PAPER);
            }
        }
        cx.putImageData(img, 0, 0);
    }

    /* ---------- lo sfondo: un cielo di notte a 1 bit ----------
       stessa griglia di punti e stessi due colori della scacchiera, a scatti (~10 fps).
       Nuvole: macchie morbide e radissime (soglia di Bayer). Stelle: punti e piccole croci che
       sfarfallano. Scie: rari trattini che sfumano in coda. Posizioni e velocita' sono a caso
       a ogni caricamento. Buffer riusati, nessuna allocazione per fotogramma. */
    const fondo = document.getElementById("fondo"), fcx = fondo.getContext("2d");
    const ferma = matchMedia("(prefers-reduced-motion: reduce)");
    const IP = px(INK), PP = px(PAPER);
    const rnd = (a, b) => a + Math.random() * (b - a);
    let fw = 0, fh = 0, fimg, fdati, ultimo = 0, tc = 0;
    let stelle = [], scie = [], deriva = { x: 0, y: 0, ox: 0, oy: 0 };

    /* punti su una griglia con scarto casuale, mescolati: copertura uniforme senza buchi grandi */
    function celle(n) {
        const col = Math.max(1, Math.round(Math.sqrt(n * fw / fh))), rig = Math.max(1, Math.round(n / col)), r = [];
        for (let y = 0; y < rig; y++) for (let x = 0; x < col; x++) r.push([(x + Math.random()) * fw / col, (y + Math.random()) * fh / rig]);
        for (let i = r.length - 1; i > 0; i--) { const k = Math.floor(Math.random() * (i + 1)); [r[i], r[k]] = [r[k], r[i]]; }
        return r;
    }

    function fondoMisura() {
        fw = Math.ceil(innerWidth / u); fh = Math.ceil(innerHeight / u);
        fondo.width = fw; fondo.height = fh;
        fondo.style.width = fw * u + "px"; fondo.style.height = fh * u + "px";
        fimg = fcx.createImageData(fw, fh); fdati = new Uint32Array(fimg.data.buffer);

        const area = innerWidth * innerHeight / (1280 * 900);
        const vel = (a, b) => { const v = rnd(a, b) / u, g = rnd(0, 6.2832); return [Math.cos(g) * v, Math.sin(g) * v]; };   // CSS px/s -> punti/s

        /* stelle: ~140 su 1280x900; 0 punto, 1 croce 3x3, 2 croce 5x5 (centro vuoto o pieno) */
        stelle = celle(Math.min(220, Math.max(50, Math.round(140 * area)))).map(c => {
            const q = Math.random();
            return { x: c[0], y: c[1], t: q < 0.65 ? 0 : q < 0.9 ? 1 : 2, vuota: Math.random() < 0.5, lv: 0, fine: 0, prossima: rnd(1, 18) };
        });
        const d = vel(0.2, 1.4); deriva = { x: d[0], y: d[1], ox: 0, oy: 0 };

        /* scie: 6-9 (4-5 sui telefoni); ogni scia sceglie una direzione a caso a ogni comparsa */
        scie = Array.from({ length: area < 0.6 ? Math.round(rnd(4, 5)) : Math.round(rnd(6, 9)) }, () => {
            const s = { dx: 1, dy: 0, v: rnd(15, 40) / u, n: Math.round(rnd(10, 36)), pausa: 0, resta: 0, x: 0, y: 0 };
            parti(s, true);
            return s;
        });
        fotogramma(0, true);
    }

    /* una scia (re)nasce: dal bordo a monte lungo la sua direzione (o a meta' strada, la prima volta) */
    function parti(s, primo) {
        const g = rnd(0, 6.2832); s.dx = Math.cos(g); s.dy = Math.sin(g);
        const x = rnd(0, fw), y = rnd(0, fh);
        const fino = (dx, dy) => Math.min(dx > 0 ? (fw - x) / dx : dx < 0 ? -x / dx : 1e9, dy > 0 ? (fh - y) / dy : dy < 0 ? -y / dy : 1e9);
        const avanti = fino(s.dx, s.dy), indietro = fino(-s.dx, -s.dy);
        s.x = primo ? x : x - s.dx * (indietro + 0.5);
        s.y = primo ? y : y - s.dy * (indietro + 0.5);
        s.resta = (primo ? 0 : indietro) + avanti + s.n;      // strada ancora da fare, coda compresa
        s.pausa = primo ? rnd(0, 4) : rnd(2, 7);               // pausa casuale prima di (ri)apparire
    }

    function fotogramma(dt, statico) {
        if (!statico) {
            tc += dt;
            deriva.ox += deriva.x * dt; deriva.oy += deriva.y * dt;
            stelle.forEach(s => {
                if (s.lv && tc >= s.fine) { s.lv = 0; s.prossima = tc + rnd(6, 20); }
                else if (!s.lv && tc >= s.prossima) { s.lv = Math.random() < 0.6 ? 1 : 2; s.fine = tc + rnd(0.1, 0.25); }
            });
            scie.forEach(s => {
                if (s.pausa > 0) { s.pausa -= dt; return; }
                s.x += s.dx * s.v * dt; s.y += s.dy * s.v * dt; s.resta -= s.v * dt;
                if (s.resta <= 0) parti(s, false);
            });
        }

        fdati.fill(PP);

        /* stelle */
        const acceso = (x, y) => { if (x >= 0 && x < fw && y >= 0 && y < fh) fdati[y * fw + x] = IP; };
        for (const s of stelle) {
            const grandezza = s.t - s.lv;
            if (s.lv === 2 || grandezza < 0) continue;
            const x = Math.floor(((s.x + deriva.ox) % fw + fw) % fw), y = Math.floor(((s.y + deriva.oy) % fh + fh) % fh);
            if (!(s.t === 2 && s.vuota && s.lv === 0)) acceso(x, y);
            for (let i = 1; i <= grandezza; i++) { acceso(x + i, y); acceso(x - i, y); acceso(x, y + i); acceso(x, y - i); }
        }

        /* scie: un punto di spessore, fitte in testa e radi in coda (stessa soglia di Bayer) */
        if (!statico) for (const s of scie) {
            if (s.pausa > 0) continue;
            for (let i = 0; i < s.n; i++) {
                const x = Math.round(s.x - s.dx * i), y = Math.round(s.y - s.dy * i);
                if (x >= 0 && x < fw && y >= 0 && y < fh && (BAYER[y % 8][x % 8] + 0.5) / 64 < Math.pow(1 - i / s.n, 1.3)) fdati[y * fw + x] = IP;
            }
        }
        fcx.putImageData(fimg, 0, 0);
    }

    function anima(ms) {
        if (!document.hidden && ms - ultimo >= 100) { const dt = Math.min(0.25, (ms - ultimo) / 1000); ultimo = ms; fotogramma(dt); }
        requestAnimationFrame(anima);
    }

    /* misure: u e sq in modo che ogni punto cada su pixel fisici interi */
    function misura() {
        const dpr = window.devicePixelRatio || 1, tel = telefono.matches;
        /* lato disponibile: sul telefono margini stretti ma uguali ai due lati, cosi' la scacchiera resta centrata */
        const lato = tel ? Math.min(innerHeight - 32, innerWidth - 24) - 2 : Math.min(innerHeight, innerWidth) - 2 * (24 + 16) - 2;
        const base = lato >= 560 ? 2 : 1;
        u = Math.max(1, Math.round(base * dpr)) / dpr;
        sq = 2 * u * Math.max(1, Math.floor(lato / 8 / (2 * u)));
        /* etichetta: 12px, piccola per non coprire i pezzi; nelle case strette il testo si adatta, cosi' non e' mai piu' larga di una casa
           ("appunti", il nome piu' lungo, e' circa 3,9 volte il corpo del carattere) */
        let fs = 12, pp = 5, chip = 14;
        if (sq < 60) { pp = 2; fs = Math.max(8, Math.min(12, Math.floor((sq - 2 * pp) / 4))); chip = Math.min(14, fs + 3); }
        const ps = 32 * u;
        const pt = Math.max(0, Math.floor((sq - ps - chip) / 2 / u) * u);
        const st = root.style;
        st.setProperty("--u", u + "px");
        st.setProperty("--sq", sq + "px");
        st.setProperty("--fs", fs + "px");
        st.setProperty("--pp", pp + "px");
        st.setProperty("--chip", chip + "px");
        st.setProperty("--pt", pt + "px");
        punti();
        fondoMisura();
    }

    let raf;
    addEventListener("resize", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(misura); });

    /* ---------- finestre ---------- */
    function porta(k) {
        aperte[k].el.style.zIndex = ++z;
        for (const x in aperte) aperte[x].el.classList.toggle("attiva", x === k);
        for (const x in pezzi) pezzi[x].classList.toggle("on", !!aperte[x]);
        document.title = casa(inCasa[k]) + " " + k + " - miti";
    }

    function apri(k, sub) {
        sub = sub || "";
        let w = aperte[k];
        if (!w) {
            if (telefono.matches) for (const x in aperte) chiudi(x, true);
            w = aperte[k] = crea(k);
        }
        if (w.sub !== sub) {
            w.sub = sub;
            SEZ[k].fn(SEZ[k].dati(), w.body, k, sub);
            const vuoto = w.body.querySelector(".empty");
            if (vuoto) vuoto.insertAdjacentHTML("afterbegin", `<span class="${SEZ[k].sigla[0]}">${sprite(SEZ[k].pezzo)}</span>`);
            w.body.scrollTop = 0;
        }
        porta(k);
        w.body.focus({ preventScroll: true });
    }

    function crea(k) {
        const el = document.createElement("section");
        el.className = "win";
        el.setAttribute("role", "dialog");
        el.setAttribute("aria-label", k);
        el.innerHTML = `<div class="titlebar"><button type="button" class="chiudi" aria-label="chiudi ${k}"></button>` +
            `<h2 class="titolo">${casa(inCasa[k])} ${k}</h2></div><div class="win-body" tabindex="0"></div>`;
        document.body.append(el);
        const w = { el, body: el.querySelector(".win-body"), sub: null };

        const def = SEZ[k], p = pezzi[k].getBoundingClientRect();
        const n = Object.keys(aperte).length;
        const ww = Math.min(def.w, innerWidth - 16), hh = Math.min(def.h, innerHeight - 16);
        const aSinistra = p.left + p.width / 2 < innerWidth / 2;       // la finestra si apre dal lato con piu' spazio
        const x = (aSinistra ? p.right + 12 : p.left - ww - 12) + n * 24;
        const y = p.top - 40 + n * 24;
        Object.assign(el.style, {
            width: ww + "px", height: hh + "px",
            left: Math.min(Math.max(x, 8), innerWidth - ww - 8) + "px",
            top: Math.min(Math.max(y, 8), Math.max(8, innerHeight - hh - 8)) + "px",
        });

        el.addEventListener("pointerdown", () => porta(k));
        el.querySelector(".chiudi").onclick = () => chiudi(k);
        trascina(el, el.querySelector(".titlebar"));
        zoom(pezzi[k], el);
        return w;
    }

    function chiudi(k, silenzioso) {
        const w = aperte[k];
        if (!w) return;
        w.el.remove();
        delete aperte[k];
        pezzi[k].classList.remove("on");
        const resta = Object.keys(aperte).sort((a, b) => aperte[a].el.style.zIndex - aperte[b].el.style.zIndex).pop();
        if (resta) porta(resta);
        else document.title = "Martino Cosci";
        if (silenzioso) return;
        if (location.hash.slice(1).split("/")[0] === k) history.replaceState(null, "", location.pathname + location.search);
        pezzi[k].focus();
    }

    /* trascinamento dalla barra del titolo (solo schermi larghi) */
    function trascina(el, barra) {
        barra.addEventListener("pointerdown", ev => {
            if (telefono.matches || ev.button || ev.target.closest("button")) return;
            const ox = ev.clientX - el.offsetLeft, oy = ev.clientY - el.offsetTop;
            barra.setPointerCapture(ev.pointerId);
            const muovi = e => {
                el.style.left = Math.min(Math.max(e.clientX - ox, 80 - el.offsetWidth), innerWidth - 80) + "px";
                el.style.top = Math.min(Math.max(e.clientY - oy, 0), innerHeight - 21) + "px";
            };
            const fine = () => { barra.removeEventListener("pointermove", muovi); barra.removeEventListener("pointerup", fine); };
            barra.addEventListener("pointermove", muovi);
            barra.addEventListener("pointerup", fine);
        });
    }

    /* rettangolo tratteggiato che si allarga dalla casa alla finestra, come nel vecchio Mac */
    function zoom(pezzo, el) {
        if (telefono.matches || calmo.matches) return;
        const a = pezzo.getBoundingClientRect(), b = el.getBoundingClientRect();
        const d = document.body.appendChild(document.createElement("div"));
        d.className = "zoom";
        const box = r => ({ left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" });
        d.animate([box(a), box(b)], { duration: 240, easing: "steps(6)" }).onfinish = () => d.remove();
    }

    /* ---------- indirizzi ---------- */
    function percorso() {
        const h = location.hash.slice(1), i = h.indexOf("/");
        const k = i < 0 ? h : h.slice(0, i);
        let sub = "";
        try { sub = i < 0 ? "" : decodeURIComponent(h.slice(i + 1)); } catch (e) {}
        if (SEZ[k]) apri(k, sub);
    }
    /* Esc chiude la finestra in primo piano e riporta il focus sul suo pezzo */
    document.addEventListener("keydown", ev => {
        const su = ev.key === "Escape" && !document.querySelector("dialog[open]") && document.querySelector(".win.attiva");
        if (su) chiudi(Object.keys(aperte).find(k => aperte[k].el === su));
    });
    addEventListener("hashchange", percorso);
    document.addEventListener("click", ev => {
        const a = ev.target.closest('a[href^="#"]');
        if (!a || ev.ctrlKey || ev.metaKey || ev.shiftKey) return;
        ev.preventDefault();
        if (location.hash === a.getAttribute("href")) percorso();
        else location.hash = a.getAttribute("href");
    });

    misura();
    if (!ferma.matches) requestAnimationFrame(anima);
    percorso();
})();

