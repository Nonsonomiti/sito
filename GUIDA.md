# Guida — come aggiungere contenuti al sito

Non devi più toccare l'HTML. I contenuti vivono in file dentro la cartella `data/`.
Per aggiungerli c'è una pagina apposta: **`admin.html`**.

## Il modo facile (consigliato)

1. Apri il file **`admin.html`** facendo doppio click (si apre nel browser).
2. In alto scegli la sezione: `blog`, `appunti`, `musica`, `scacchi`, `foto`, `video`.
3. Compila i campi.
4. Premi **Aggiungi**.
5. Premi **Scarica file**: il browser scarica un file (es. `blog.js`).
6. Sposta quel file dentro la cartella `data/` del sito, **sovrascrivendo** quello vecchio
   (di solito finisce in `Download`, trascinalo in `data/`).
7. Pubblica online (vedi sotto).

Puoi aggiungere più voci di fila prima di scaricare: ogni "Aggiungi" le accumula tutte nel file.

## Come pubblicare online (senza comandi)

Il sito sta su GitHub. Per mettere online le modifiche, dal browser:

1. Vai su `https://github.com/Nonsonomiti/sito` (il repository del sito).
2. Entra nella cartella `data`, clicca sul file che hai cambiato (es. `blog.js`).
3. Clicca l'icona della matita ✏️ (Edit), poi cancella tutto e incolla il nuovo
   contenuto — **oppure** usa "Add file → Upload files" e trascina il file scaricato.
4. In fondo premi **Commit changes**.
5. Dopo 1-2 minuti il sito (e4c5.it) è aggiornato.

> Se usi **GitHub Desktop** (app con i pulsanti): sostituisci il file nella cartella,
> apri GitHub Desktop, scrivi due parole in basso e premi *Commit* poi *Push*.

## Le foto

Nella sezione `foto` scegli l'immagine dal computer: viene rimpicciolita e **inserita
dentro il file** automaticamente. Non devi gestire cartelle di immagini.

## I video

Incolla il link normale di YouTube (quello della barra degli indirizzi). L'ID del video
viene riconosciuto da solo.

## Se vuoi modificare a mano (avanzato)

I file in `data/` sono liste di voci. Per cambiare o cancellare qualcosa apri il file
con un editor di testo e modifica/togli il blocco tra `{ ... }`. La struttura di ogni
sezione è spiegata in cima a ciascun file.

## Come è fatto il sito (riferimento)

- `index.html`, `blog.html`, ... → pagine (template, non si toccano).
- `data/*.js` → i contenuti (qui aggiungi le cose).
- `assets/style.css` → l'aspetto grafico (colori, font). Da modificare una volta sola.
- `assets/render.js` → il motore che trasforma i dati in pagina (non si tocca).
- `admin.html` → lo strumento per aggiungere contenuti.
