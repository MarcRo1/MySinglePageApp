"use strict";

import Backend from "./backend.js";
import Router from "./router.js";
import "./app.css";

/**
 * Hauptklasse App: Steuert die gesamte Anwendung
 *
 * Diese Klasse erzeugt den Single Page Router zur Navigation innerhalb
 * der Anwendung und ein Datenbankobjekt zur Verwaltung der Adressliste.
 * Darüber hinaus beinhaltet sie verschiedene vom Single Page Router
 * aufgerufene Methoden, zum Umschalten der aktiven Seite.
 */
class App {
    /**
     * Konstruktor.
     */
    constructor() {
        // Datenbank-Klasse zur Verwaltung der Datensätze
        this.backend = new Backend();

        // Single Page Router zur Steuerung der sichtbaren Inhalte
        this.router = new Router([
            {
                url: "^/$",
                show: () => this._gotoList()
            },{
                url: "^/new/$",
                show: () => this._gotoNew()
            },{
                url: "^/edit/(.*)$",
                show: matches => this._gotoEdit(matches[1])
            },{
                url: "^/orders/$",
                show: () => this._gotoOrders()
            },{
                url: "^/orderedit/(.*)$",
                show: matches => this._gotoEditOrder(matches[1])
            }, {
                url: "^/admin/$",
                show: () => this._gotoAdmin()
            }, {
                url: "^/stats/$",
                show: () => this._gotoStats()
            },{
                url: ".*",
                show: () => this._gotoList()
            },
        ]);

        // Fenstertitel merken, um später den Name der aktuellen Seite anzuhängen
        this._documentTitle = document.title;

        // Von dieser Klasse benötigte HTML-Elemente
        this._pageCssElement = document.querySelector("#page-css");
        this._bodyElement = document.querySelector("body");
        this._menuElement = document.querySelector("#app-menu");
    }

    /**
     * Initialisierung der Anwendung beim Start. Im Gegensatz zum Konstruktor
     * der Klasse kann diese Methode mit der vereinfachten async/await-Syntax
     * auf die Fertigstellung von Hintergrundaktivitäten warten, ohne dabei
     * mit den zugrunde liegenden Promise-Objekten direkt hantieren zu müssen.
     */
    async init() {
        try {
            await this.backend.init();
            this.router.start();
        } catch (ex) {
            this.showException(ex);
        }
    }

    async _gotoOrders() {
        try {
            //alert("Orders");
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageOrders} = await import("./page-orders/page-orders.js");

            let page = new PageOrders(this);
            await page.init();
            this._showPage(page, "orders");
        } catch (ex) {
            this.showException(ex);
        }
    }

    async _gotoEditOrder(id) {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageOrderEdit} = await import("./page-editorder/page-editorder.js");

            let page = new PageOrderEdit(this, id);
            await page.init();
            this._showPage(page, "editorder");
        } catch (ex) {
            this.showException(ex);
        }
    }


    /**
     * Übersichtsseite anzeigen. Wird vom Single Page Router aufgerufen.
     */
    async _gotoList() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageList} = await import("./page-list/page-list.js");

            let page = new PageList(this);
            await page.init();
            this._showPage(page, "list");
        } catch (ex) {
            this.showException(ex);
        }
    }

    /**
     * Seite zum Anlegen einer neuen Adresse anzeigen.  Wird vom Single Page
     * Router aufgerufen.
     */
    async _gotoNew() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageEdit} = await import("./page-edit/page-edit.js");

            let page = new PageEdit(this);
            await page.init();
            this._showPage(page, "new");
        } catch (ex) {
            this.showException(ex);
        }
    }

    /**
     * Seite zum Bearbeiten einer Adresse anzeigen.  Wird vom Single Page
     * Router aufgerufen.
     *
     * @param {Number} id ID der zu bearbeitenden Adresse
     */
    async _gotoEdit(id) {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageEdit} = await import("./page-edit/page-edit.js");

            let page = new PageEdit(this, id);
            await page.init();
            this._showPage(page, "edit");
        } catch (ex) {
            this.showException(ex);
        }
    }

        /**
 * Adminseite anzeigen. Wird vom Single Page Router aufgerufen.
 */
    async _gotoAdmin() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let { default: PageAdmin } = await import("./page-admin/page-admin.js");
    
            let page = new PageAdmin(this);
            await page.init();
            this._showPage(page, "admin");
        } catch (ex) {
            this.showException(ex);
        }
    }
    
           /**
     * Statistikseite anzeigen. Wird vom Single Page Router aufgerufen.
     */
    async _gotoStats() {
        try {
        // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let { default: PageStats } = await import("./page-stats/page-stats.js");
    
            let page = new PageStats(this);
            await page.init();
            this._showPage(page, "stats");
         } catch (ex) {
            this.showException(ex);
         }
    }

    /**
     * Interne Methode zum Umschalten der sichtbaren Seite.
     *
     * @param  {Page} page Objekt der anzuzeigenden Seiten
     * @param  {String} name Name zur Hervorhebung der Seite im Menü
     */
    _showPage(page, name) {
        // Fenstertitel aktualisieren
        document.title = `${this._documentTitle} – ${page.title}`;

        // Stylesheet der Seite einfügen
        this._pageCssElement.innerHTML = page.css;

        // Aktuelle Seite im Kopfbereich hervorheben
        this._menuElement.querySelectorAll("li").forEach(li => li.classList.remove("active"));
        this._menuElement.querySelectorAll(`li[data-page-name="${name}"]`).forEach(li => li.classList.add("active"));

        // Sichtbaren Hauptinhalt austauschen
        this._bodyElement.querySelector("main")?.remove();
        this._bodyElement.appendChild(page.mainElement);
    }

    /**
     * Hilfsmethode zur Anzeige eines Ausnahmefehlers. Der Fehler wird in der
     * Konsole protokolliert und als Popupmeldung angezeigt.
     *
     * @param {Object} ex Abgefangene Ausnahme
     */
    showException(ex) {
        console.error(ex);

        if (ex.message) {
            alert(ex.message)
        } else {
            alert(ex.toString());
        }
    }
}

/**
 * Anwendung starten
 */
window.addEventListener("load", async () => {
    let app = new App();
    await app.init();
});
