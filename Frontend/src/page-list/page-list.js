"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-list.html";

/**
 * Klasse PageList: Stellt die Listenübersicht zur Verfügung
 */
export default class PageList extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     */
    constructor(app) {
        super(app, HtmlTemplate);

        this._emptyMessageElement = null;

        this.stateAkt = 0;
    }

    /**
     * HTML-Inhalt und anzuzeigende Daten laden.
     *
     * HINWEIS: Durch die geerbte init()-Methode wird `this._mainElement` mit
     * dem <main>-Element aus der nachgeladenen HTML-Datei versorgt. Dieses
     * Element wird dann auch von der App-Klasse verwendet, um die Seite
     * anzuzeigen. Hier muss daher einfach mit dem üblichen DOM-Methoden
     * `this._mainElement` nachbearbeitet werden, um die angezeigten Inhalte
     * zu beeinflussen.
     *
     * HINWEIS: In dieser Version der App wird mit dem üblichen DOM-Methoden
     * gearbeitet, um den finalen HTML-Code der Seite zu generieren. In größeren
     * Apps würde man ggf. eine Template Engine wie z.B. Nunjucks integrieren
     * und den JavaScript-Code dadurch deutlich vereinfachen.
     */
    async init() {
        // HTML-Inhalt nachladen
        await super.init();
        this._title = "Übersicht";

        // Inhalte verstecken und Placeholder
        let data = await this._app.backend.fetch("GET", "/address");
        this._emptyMessageElement = this._mainElement.querySelector(".empty-placeholder");
        this._tempElement = this._mainElement.querySelector(".list-entry");
        this._tempElement.classList.add("hidden");

        if (data.length) {
            this._emptyMessageElement.classList.add("hidden");
        }

        // Aktualisieren Button
        let bElement = this._mainElement.querySelector("nav");
        bElement.querySelector(".action.aktualisieren").addEventListener("click", () => this._aktualisieren());

    }

    /**
     * Löschen der übergebenen Adresse. Zeigt einen Popup, ob der Anwender
     * die Adresse löschen will und löscht diese dann.
     *
     * @param {Integer} id ID des zu löschenden Datensatzes
     */
    async _askDelete(id) {
        // Sicherheitsfrage zeigen
        let answer = confirm("Soll die ausgewählte Adresse wirklich gelöscht werden?");
        if (!answer) return;

        // Datensatz löschen
        try {
            this._app.backend.fetch("DELETE", `/address/${id}`);
        } catch (ex) {
            this._app.showException(ex);
            return;
        }

        // HTML-Element entfernen
        this._mainElement.querySelector(`[data-id="${id}"]`)?.remove();

        if (this._mainElement.querySelector("[data-id]")) {
            this._emptyMessageElement.classList.add("hidden");
        } else {
            this._emptyMessageElement.classList.remove("hidden");
        }
    }

    /**
     * @param {Booleen} state Status
     * @param {Integer} anzahlAkt Anzahl der Aktualisierungen pro Sitzung
    */
    async _aktualisieren() {
        // Pop Up
        let answer = confirm("Daten abrufen?");
        if (!answer) return;
        else {
            if (this.stateAkt == 0) {
                // Je Datensatz einen Listeneintrag generieren
                this._tempElement.classList.remove("hidden");
                let data = await this._app.backend.fetch("GET", "/address");
                let olElement = this._mainElement.querySelector("ol");
    
                let templateElement = this._mainElement.querySelector(".list-entry");
                let templateHtml = templateElement.outerHTML;
                templateElement.remove();
    
                for (let index in data) {
                    // Platzhalter ersetzen
                    let dataset = data[index];
                    let html = templateHtml;
    
                    html = html.replace("$ID$", dataset._id);
                    html = html.replace("$LAST_NAME$", dataset.last_name);
                    html = html.replace("$FIRST_NAME$", dataset.first_name);
                    html = html.replace("$PHONE$", dataset.phone);
                    html = html.replace("$EMAIL$", dataset.email);
    
                    // Element in die Liste einfügen
                    let dummyElement = document.createElement("div");
                    dummyElement.innerHTML = html;
                    let liElement = dummyElement.firstElementChild;
                    liElement.remove();
                    olElement.appendChild(liElement);
    
                    // Event Handler registrieren
                    liElement.querySelector(".action.edit").addEventListener("click", () => location.hash = `#/edit/${dataset._id}`);
                    liElement.querySelector(".action.delete").addEventListener("click", () => this._askDelete(dataset._id));
    
                }
            //Doppeltes Aktualiseren verhindern, da dies zu Anzeigedoppelungen führt
                this.stateAkt++;
            } else { // 
                alert("Die Daten sind eventuell nicht mehr auf dem neusten Stand. Laden sie die Seite neu.")
                return;
            }
        }
    }
}
    
