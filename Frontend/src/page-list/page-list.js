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

        this._dataset = {
            essen: "",
            preis: "",
            anzahl: "",
            email: "",
        };

        this._restaurantNameInput = null;
        this._speiseNameInput  = null;
        this._preisInput     = null;
        this._anzahlInput     = null;
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
        this._title = "Bestellung";
        this._url = `/order`; 

        let _betellen1 = this._mainElement.querySelector(".action_bestellen1");
        let _betellen2 = this._mainElement.querySelector(".action_bestellen2");
        let _betellen3 = this._mainElement.querySelector(".action_bestellen3"); 
        let _bezahlen = this._mainElement.querySelector(".action_bezahlen");      

        _betellen1.addEventListener("click", (e) => {
            let _restaurant_name = this.mainElement.querySelector(".restaurant_name1");
            let _speise_name = this.mainElement.querySelector(".speise_name1");
            let _preis = this.mainElement.querySelector(".preis1");
            let _anzahl = this.mainElement.querySelector("#anzahl1");
            this.bestellen(_restaurant_name, _speise_name, _preis, _anzahl);
        });

        _betellen2.addEventListener("click", (e) => {
            let _restaurant_name = this.mainElement.querySelector(".restaurant_name2");
            let _speise_name = this.mainElement.querySelector(".speise_name2");
            let _preis = this.mainElement.querySelector(".preis2");
            let _anzahl = this.mainElement.querySelector("#anzahl2");
            this.bestellen(_restaurant_name, _speise_name, _preis, _anzahl);
        });

        _betellen3.addEventListener("click", (e) => {
            let _restaurant_name = this.mainElement.querySelector(".restaurant_name3");
            let _speise_name = this.mainElement.querySelector(".speise_name3");
            let _preis = this.mainElement.querySelector(".preis3");
            let _anzahl = this.mainElement.querySelector("#anzahl3");
            this.bestellen(_restaurant_name, _speise_name, _preis, _anzahl);
        }); 

        _bezahlen.addEventListener("click", (e) => {
            location.hash = `#/orders/`
        });
        
    }

    
    async bestellen(a,b,c,d){
        this._restaurantNameInput = a.innerHTML;
        this._speiseNameInput  = b.innerHTML;
        this._preisInput     = c.innerHTML;
        this._anzahlInput     = d.value;

     

        let answer = confirm("Wollen Sie wirklich bestellen?");
        if (!answer) return;
        if (parseInt(this._anzahlInput) > 10 || parseInt(this._anzahlInput) < 1) {
            confirm("bitte die richtige Anzahl (0<Anzahl<11) eingeben");
            return;
        }   
   

        this._dataset.essen = this._restaurantNameInput.trim() + "_" + this._speiseNameInput.trim();
        this._dataset.preis = this._preisInput.trim().toString();
        this._dataset.anzahl = this._anzahlInput.trim().toString();

      

        try {
                await this._app.backend.fetch("POST", this._url, {body: this._dataset});
                alert("bestellt")
            } catch (ex) {      
                this._app.showException(ex);
                return;
        }

    }
};
