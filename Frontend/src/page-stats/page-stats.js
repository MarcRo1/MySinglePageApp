"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-stats.html";

/**
 * Klasse PageAdmin: Stellt die Listenübersicht zur Verfügung
 */
export default class PageStats extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     */
    constructor(app) {
        super(app, HtmlTemplate);

        this._emptyMessageElement = null;

        this.stateAkt = 0;

        this.nichtbestellt = "Nicht bestellt!";

        this.schlüssel = "admin";

        this.counting = 0;

        this.restaurantAnzahl = [];

        this.restaurantUmsatz = [];
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
        this._title = "Stats";

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
        bElement.querySelector(".action.stats").addEventListener("click", () => this._statszeigen());

    }
    /**
     * @param {Booleen} state Status
     * @param {Integer} anzahlAkt Anzahl der Aktualisierungen pro Sitzung
    */
    async _statszeigen() {
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

                    console.log(this.datenarray);
    
                    // Element in die Liste einfügen
                    let dummyElement = document.createElement("div");
                    dummyElement.innerHTML = html;
                    let liElement = dummyElement.firstElementChild;
                    liElement.remove();
                    olElement.appendChild(liElement);

                    
                }

                for (let i = 0; i < data.length; i++) {
                    console.log(data[i].essen);
                }

            //Button nur einmal drücken können
                this.stateAkt++;
            } else { // 
                alert("Die Statistiken sind schon geladen")
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