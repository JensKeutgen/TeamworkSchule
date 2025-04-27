// === Konfiguration ===
// Trage hier die verfügbaren JSON-Dateien ein.
// 'name' ist der Text, der im Dropdown angezeigt wird.
// 'datei' ist der tatsächliche Dateiname.
const verfuegbareListen = [
    { name: "Mathe Prüfungsvorbereitung", datei: "mathe_pruefung.json" }, // NEU
    { name: "Messtechnik Grundlagen", datei: "messtechnik.json" }, // NEU
    //     // Füge hier weitere Listen hinzu, z.B.:
    // { name: "Lineare Algebra", datei: "lineare_algebra.json" },
];

// === HTML-Elemente holen ===
const auswahlBereich = document.getElementById('auswahl-bereich');
const dateiAuswahl = document.getElementById('datei-auswahl');
const startBtn = document.getElementById('start-btn');
const ladeFehlerAnzeige = document.getElementById('lade-fehler');

const spielBereich = document.getElementById('spiel-bereich');
const begriffAnzeige = document.getElementById('begriff');
const erklaerungAnzeige = document.getElementById('erklaerung');
const neuerBegriffBtn = document.getElementById('neuer-begriff-btn');

// === Globale Variable ===
let aktuelleBegriffeListe = []; // Hier werden die Begriffe der *ausgewählten* Datei gespeichert

// === Funktionen ===

// Füllt das Dropdown-Menü mit den verfügbaren Listen
function fuelleDropdown() {
    // Standard-Option leeren (falls vorhanden)
    dateiAuswahl.innerHTML = '<option value="">-- Bitte wählen --</option>';

    verfuegbareListen.forEach(liste => {
        const option = document.createElement('option');
        option.value = liste.datei; // Der Wert ist der Dateiname
        option.textContent = liste.name; // Der Text ist der Anzeigename
        dateiAuswahl.appendChild(option);
    });
}

// Funktion zum Laden der Begriffe aus der *ausgewählten* JSON-Datei
async function ladeBegriffe(dateiname) {
    // Deaktiviere den Button und lösche alte Fehler während des Ladens
    startBtn.disabled = true;
    startBtn.textContent = 'Lade...';
    ladeFehlerAnzeige.textContent = ''; // Alte Fehlermeldung löschen
    aktuelleBegriffeListe = []; // Alte Liste leeren

    try {
        const antwort = await fetch(dateiname);
        if (!antwort.ok) {
             // Spezifischere Fehlermeldung für nicht gefundene Dateien
            if (antwort.status === 404) {
                 throw new Error(`Datei '${dateiname}' nicht gefunden. Stelle sicher, dass sie im richtigen Ordner liegt.`);
            } else {
                throw new Error(`HTTP Fehler! Status: ${antwort.status} beim Laden von '${dateiname}'`);
            }
        }
        aktuelleBegriffeListe = await antwort.json();
        console.log(`Begriffe aus ${dateiname} erfolgreich geladen:`, aktuelleBegriffeListe);

        // Überprüfen, ob die geladene Liste leer ist
        if (!Array.isArray(aktuelleBegriffeListe) || aktuelleBegriffeListe.length === 0) {
            throw new Error(`Die Datei '${dateiname}' ist leer oder hat ein ungültiges Format.`);
        }

        return true; // Signalisiert Erfolg

    } catch (error) {
        console.error("Fehler beim Laden der Begriffe:", error);
        begriffAnzeige.textContent = "Fehler!";
        erklaerungAnzeige.textContent = `Die Begriffe aus '${dateiname}' konnten nicht geladen werden. Details: ${error.message}`;
        ladeFehlerAnzeige.textContent = `Fehler: ${error.message}`; // Zeige Fehler im Auswahlbereich
        spielBereich.style.display = 'none'; // Spielbereich ausblenden bei Fehler
        auswahlBereich.style.display = 'block'; // Auswahlbereich wieder zeigen
        return false; // Signalisiert Fehler
    } finally {
        // Button wieder aktivieren und Text zurücksetzen, egal ob Erfolg oder Fehler
        startBtn.disabled = false;
        startBtn.textContent = 'Liste laden & Spiel starten';
    }
}

// Funktion zum Auswählen und Anzeigen eines zufälligen Begriffs
function zeigeZufaelligenBegriff() {
    if (aktuelleBegriffeListe.length === 0) {
        begriffAnzeige.textContent = "Keine Begriffe";
        erklaerungAnzeige.textContent = "Die ausgewählte Liste enthält keine Begriffe oder konnte nicht korrekt geladen werden.";
        neuerBegriffBtn.disabled = true; // Button deaktivieren, wenn keine Begriffe da sind
        return;
    }

    neuerBegriffBtn.disabled = false; // Button aktivieren (falls er deaktiviert war)
    const zufallsIndex = Math.floor(Math.random() * aktuelleBegriffeListe.length);
    const zufallsBegriff = aktuelleBegriffeListe[zufallsIndex];

    begriffAnzeige.textContent = zufallsBegriff.begriff || "Unbekannter Begriff"; // Fallback
    erklaerungAnzeige.textContent = zufallsBegriff.erklaerung || "Keine Erklärung vorhanden."; // Fallback
}

// === Event Listener ===

// Event Listener für den Start-Button
startBtn.addEventListener('click', async () => {
    const ausgewaehlteDatei = dateiAuswahl.value;

    if (!ausgewaehlteDatei) {
        ladeFehlerAnzeige.textContent = "Bitte wähle zuerst eine Liste aus.";
        return; // Nichts tun, wenn keine Datei ausgewählt ist
    }

    // Versuche, die ausgewählte Liste zu laden
    const ladeErfolg = await ladeBegriffe(ausgewaehlteDatei);

    if (ladeErfolg) {
        // Wenn Laden erfolgreich war:
        auswahlBereich.style.display = 'none'; // Auswahl ausblenden
        spielBereich.style.display = 'block'; // Spiel anzeigen
        zeigeZufaelligenBegriff(); // Ersten Begriff anzeigen
    }
    // Bei Fehler wird die Fehlermeldung bereits in ladeBegriffe() gesetzt
});

// Event Listener für den "Neuen Begriff"-Button
neuerBegriffBtn.addEventListener('click', zeigeZufaelligenBegriff);

// === Initialisierung ===
// Fülle das Dropdown beim Laden der Seite
fuelleDropdown();
// Stelle sicher, dass der Spielbereich anfangs versteckt ist (macht das CSS eigentlich schon, aber zur Sicherheit)
spielBereich.style.display = 'none';
// Stelle sicher, dass der "Neuer Begriff"-Button initial deaktiviert ist
neuerBegriffBtn.disabled = true;