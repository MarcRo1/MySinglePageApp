"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-admin.html";

/**
 * Klasse PageAdmin: Zeigt eine tabellarische Übersicht
 */
export default class PageAdmin extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     */
    constructor(app) {
        super(app, HtmlTemplate);

        this._emptyMessageElement = null;

        this.stateAkt = 0;

        this.nichtbestellt = "!--- NOCH NICHT BEZAHLT ---!";

        this.schlüssel = "admin";
    }

    async init() {
        // HTML-Inhalt nachladen
        await super.init();
        this._title = "Admin";

        // Inhalte verstecken und Placeholder
        let data = await this._app.backend.fetch("GET", "/order");
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
     * Löschen der übergebenen Bestellung. Zeigt einen Popup, ob der Anwender
     * die Bestellung löschen will und löscht diese dann.
     *
     * @param {Integer} id ID des zu löschenden Datensatzes
     */
    async _askDelete(id) {
        // Sicherheitsfrage zeigen
        let answer = confirm("Soll die ausgewählte Bestellung wirklich gelöscht werden?");
        if (!answer) return;

        // Datensatz löschen
        try {
            this._app.backend.fetch("DELETE", `/order/${id}`);
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
        let answer = this._getpassword();
        if (!answer) return;
        else {
            if (this.stateAkt == 0) {
                // Je Datensatz einen Listeneintrag generieren
                this._tempElement.classList.remove("hidden");
                let data = await this._app.backend.fetch("GET", "/order");
                let olElement = this._mainElement.querySelector("ol");
    
                let templateElement = this._mainElement.querySelector(".list-entry");
                let templateHtml = templateElement.outerHTML;
                templateElement.remove();
    
                for (let index in data) {
                    // Platzhalter ersetzen
                    let dataset = data[index];
                    let html = templateHtml;
    
                    html = html.replace("$ID$", dataset._id);
                    html = html.replace("$ESSEN$", dataset.essen);
                    html = html.replace("$ANZAHL$", dataset.anzahl);
                    html = html.replace("$PREIS$", dataset.preis);
                    
                    // Anzeigen ob die Bestellung auch bezahlt wurde oder nicht
                    if (dataset.email == "") {
                        html = html.replace("$EMAIL$", this.nichtbestellt);
                    } else {
                        html = html.replace("$EMAIL$", dataset.email);
                    }
    
                    // Element in die Liste einfügen
                    let dummyElement = document.createElement("div");
                    dummyElement.innerHTML = html;
                    let liElement = dummyElement.firstElementChild;
                    liElement.remove();
                    olElement.appendChild(liElement);
    
                    // Event Handler registrieren
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

    /**
     * Prüft das eingegebene Passwort und verhindert damit, dass einsehen der Daten von normalen Usern
    */
    _getpassword() {
        var password = prompt("Passwort:");
        if (password == this.schlüssel) {
            return true;;
        } else {
            alert("Passwort falsch!");
            return false;
        }

    }
}
