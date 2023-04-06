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

        this.stateAkt = 0;

        this.nichtbestellt = "Nicht bestellt!";

        this.schlüssel = "admin";

        this.gesamtUmsatz = 0;

        this.kfcAnzahl = 0;

        this.asiaAnzahl = 0;

        this.pizzaAnzahl = 0;

        this.kfcUmsatz = 0;

        this.asiaUmsatz = 0;

        this.pizzaUmsatz = 0;

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

        if (data.length == 0) {
            alert("Keine Bestellungen vorhanden!")
        }

        // Aktualisieren Button
        let bElement = this._mainElement.querySelector("nav");
        bElement.querySelector(".action.stats").addEventListener("click", () => this._statszeigen());

    }
    /**
     * @param {Booleen} state Status
     * @param {Integer} anzahlAkt Anzahl der Knopf-Drückungen pro Sitzung
    */
    async _statszeigen() {
        // Pop Up
        let answer = this._getpassword();
        if (!answer) return;
        else {
            if (this.stateAkt == 0) {
                let data = await this._app.backend.fetch("GET", "/order");
                for (let i = 0; i < data.length; i++) {
                    if (data[i].email == "") {
                    } else {
                        if (data[i].essen == "KFC_Pommes") {
                            this.kfcAnzahl++;
                            var xkfc = data[i].anzahl * data[i].preis;
                            this.kfcUmsatz = this.kfcUmsatz + xkfc;
                        } else if (data[i].essen == "Asia Wok_Sushi") {
                            this.asiaAnzahl++;
                            var xasia = data[i].anzahl * data[i].preis;
                            this.asiaUmsatz = this.asiaUmsatz + xasia;
                        } else {
                            this.pizzaAnzahl++;
                            var xpizza = data[i].anzahl * data[i].preis;
                            this.pizzaUmsatz = this.pizzaUmsatz + xpizza;
                        }
                    }
                }
                console.log(this.kfcUmsatz);
                console.log(this.asiaUmsatz);
                console.log(this.pizzaUmsatz);

                // hier kommt kreisdiagramm mit anzahl von bestellungen pro restaurant

                google.charts.load('current',{packages:['corechart']});

                google.charts.setOnLoadCallback(drawChart);

                var xValues = ["KFC", "Asia Wok", "Pizzaria"];
                var yValues = [this.kfcAnzahl, this.asiaAnzahl, this.pizzaAnzahl];


                //hier kommt säulendiagramm umsatz pro restaurant

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

    /**
     * Zeichnet das Diagramm
    */
    _drawChart() {

        const cdata = google.visualization.arrayToDataTable([
          ['Restaurant', 'Umsatz'],
          ['KFC', this.kfcUmsatz],
          ['Asia Wok', this.asiaUmsatz],
          ['Pizzaria', this.pizzaUmsatz],
        ]);
        
        const options = {
          title: 'Umsatz nach Restaurant'
        };
        
        const chart = new google.visualization.BarChart(document.getElementById('myChart'));
        chart.draw(cdata, options);
        
        }
}