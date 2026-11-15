// Posizione casuale legale: Re bianco, Donna bianca, pedone bianco, Re nero, Torre nera, Alfiere nero, Cavallo nero.
// Quadrati come [colonna 0-7 (a-h), traversa 0-7 (1-8)]. Browser: window.POSIZIONE. Node: node posizione.js (self-check).
(function (root) {
  const ORTO = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const DIAG = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  const CAV = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]];
  const KEY = (s) => s[0] + ',' + s[1];
  const dentro = (f, r) => f >= 0 && f < 8 && r >= 0 && r < 8;

  // il pezzo "tipo" in p attacca il quadrato t? occ = set dei quadrati occupati (bloccano i pezzi lunghi)
  function attacca(tipo, p, t, occ) {
    const df = t[0] - p[0], dr = t[1] - p[1];
    if (tipo === 'N') return CAV.some(([a, b]) => a === df && b === dr);
    if (tipo === 'K') return Math.max(Math.abs(df), Math.abs(dr)) === 1;
    if (tipo === 'P') return dr === 1 && Math.abs(df) === 1; // pedone bianco: cattura in avanti in diagonale
    const dirs = tipo === 'R' ? ORTO : tipo === 'B' ? DIAG : ORTO.concat(DIAG);
    return dirs.some(([a, b]) => {
      for (let f = p[0] + a, r = p[1] + b; dentro(f, r); f += a, r += b) {
        if (f === t[0] && r === t[1]) return true;
        if (occ.has(f + ',' + r)) return false;
      }
      return false;
    });
  }

  function valida(pos) {
    const tutti = Object.values(pos);
    const occ = new Set(tutti.map(KEY));
    if (occ.size !== 7) return false;
    if (pos.wP[1] < 1 || pos.wP[1] > 6) return false;
    if (attacca('K', pos.wK, pos.bK, occ)) return false;
    // re bianco: attaccato da torre, alfiere, cavallo neri
    if (attacca('R', pos.bR, pos.wK, occ) || attacca('B', pos.bB, pos.wK, occ) || attacca('N', pos.bN, pos.wK, occ)) return false;
    // re nero: attaccato da donna, pedone bianchi
    if (attacca('Q', pos.wQ, pos.bK, occ) || attacca('P', pos.wP, pos.bK, occ)) return false;
    return true;
  }

  function genera() {
    const nomi = ['wK', 'wQ', 'wP', 'bK', 'bR', 'bB', 'bN'];
    for (;;) {
      const sq = [];
      while (sq.length < 7) {
        const s = Math.floor(Math.random() * 64);
        if (!sq.includes(s)) sq.push(s);
      }
      const pos = {};
      nomi.forEach((n, i) => (pos[n] = [sq[i] % 8, Math.floor(sq[i] / 8)]));
      if (valida(pos)) return pos;
    }
  }

  const api = { genera, valida, attacca };
  if (typeof module !== 'undefined') module.exports = api;
  else root.POSIZIONE = api;

  if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
    const assert = require('assert');
    // casi noti per l'attacco con blocchi
    const s = (...a) => new Set(a.map(KEY));
    assert(attacca('R', [0, 0], [0, 7], s([0, 0], [0, 7])));
    assert(!attacca('R', [0, 0], [0, 7], s([0, 0], [0, 3], [0, 7])));
    assert(attacca('B', [0, 0], [7, 7], s([0, 0], [7, 7])));
    assert(!attacca('B', [0, 0], [7, 7], s([0, 0], [4, 4], [7, 7])));
    assert(attacca('Q', [3, 3], [3, 0], s([3, 3], [3, 0])) && attacca('Q', [3, 3], [6, 6], s([3, 3], [6, 6])));
    assert(attacca('N', [1, 0], [2, 2], s()) && !attacca('N', [1, 0], [2, 1], s()));
    assert(attacca('P', [4, 3], [5, 4], s()) && !attacca('P', [4, 3], [5, 2], s()) && !attacca('P', [4, 3], [4, 4], s()));
    for (let i = 0; i < 2000; i++) {
      const p = genera();
      const occ = new Set(Object.values(p).map(KEY));
      assert.strictEqual(occ.size, 7, 'quadrati distinti');
      assert(p.wP[1] >= 1 && p.wP[1] <= 6, 'pedone traverse 2-7');
      assert(Math.max(Math.abs(p.wK[0] - p.bK[0]), Math.abs(p.wK[1] - p.bK[1])) > 1, 're non adiacenti');
      assert(!attacca('R', p.bR, p.wK, occ) && !attacca('B', p.bB, p.wK, occ) && !attacca('N', p.bN, p.wK, occ), 're bianco sotto scacco');
      assert(!attacca('Q', p.wQ, p.bK, occ) && !attacca('P', p.wP, p.bK, occ), 're nero sotto scacco');
    }
    console.log('ok');
  }
})(typeof window !== 'undefined' ? window : globalThis);
