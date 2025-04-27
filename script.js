// Elemente aus dem HTML holen
const begriffAnzeige = document.getElementById('begriff');
const erklaerungAnzeige = document.getElementById('erklaerung');
const neuerBegriffBtn = document.getElementById('neuer-begriff-btn');

let begriffeListe = []; // Hier werden die Begriffe aus der JSON-Datei gespeichert

// Funktion zum Laden der Begriffe aus der JSON-Datei
async function ladeBegriffe() {
    try {
        const antwort = await fetch('begriffe.json'); // Fordert die Datei an
        if (!antwort.ok) {
            // Wenn die Datei nicht gefunden wurde oder ein anderer Fehler auftrat
            throw new Error(`HTTP Fehler! Status: ${antwort.status}`);
        }
        begriffeListe = await antwort.json(); // Wandelt die Antwort in ein JavaScript-Array um
        console.log("Begriffe erfolgreich geladen:", begriffeListe); // Für Debugging-Zwecke
        zeigeZufaelligenBegriff(); // Zeigt sofort einen ersten Begriff an
    } catch (error) {
        console.error("Fehler beim Laden der Begriffe:", error);
        begriffAnzeige.textContent = "Fehler!";
        erklaerungAnzeige.textContent = "Die Begriffe konnten nicht geladen werden. Stelle sicher, dass die Datei 'begriffe.json' im selben Ordner wie die HTML-Datei liegt und korrekt formatiert ist.";
    }
}

// Funktion zum Auswählen und Anzeigen eines zufälligen Begriffs
function zeigeZufaelligenBegriff() {
    if (begriffeListe.length === 0) {
        // Falls die Liste leer ist (z.B. wegen Ladefehler)
        begriffAnzeige.textContent = "Keine Begriffe";
        erklaerungAnzeige.textContent = "Es sind keine Begriffe verfügbar.";
        return; // Beendet die Funktion hier
    }

    // Wählt einen zufälligen Index aus dem Array
    const zufallsIndex = Math.floor(Math.random() * begriffeListe.length);
    // Holt das Begriff-Objekt an diesem Index
    const zufallsBegriff = begriffeListe[zufallsIndex];

    // Zeigt den Begriff und die Erklärung auf der Webseite an
    begriffAnzeige.textContent = zufallsBegriff.begriff;
    erklaerungAnzeige.textContent = zufallsBegriff.erklaerung;
}

// Event Listener für den Button: Wenn geklickt wird, zeige neuen Begriff
neuerBegriffBtn.addEventListener('click', zeigeZufaelligenBegriff);

// Lade die Begriffe, wenn die Seite zum ersten Mal geladen wird
ladeBegriffe();