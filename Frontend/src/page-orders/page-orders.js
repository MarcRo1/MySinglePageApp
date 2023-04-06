import Page from "../page.js";
import HtmlTemplate from "./page-orders.html";

/**
 * Klasse PageList: Stellt die Listenübersicht zur Verfügung
 */
export default class PageOrders extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     */
    constructor(app) {
        super(app, HtmlTemplate);

        this._emptyMessageElement = null;
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
        this._title = "Übersicht der Bestellungen";

        // Platzhalter anzeigen, wenn noch keine Daten vorhanden sind
        let data = await this._app.backend.fetch("GET", "/order");
        this._emptyMessageElement = this._mainElement.querySelector(".empty-placeholder");

        if (data.length) {
            this._emptyMessageElement.classList.add("hidden");
        }

        // Je Datensatz einen Listeneintrag generieren
        let olElement = this._mainElement.querySelector("ol");

        let templateElement = this._mainElement.querySelector(".list-entry");
        let templateHtml = templateElement.outerHTML;
        templateElement.remove();

        for (let index in data) {
            // Platzhalter ersetzen
            let dataset = data[index];
            let html = templateHtml;

            html = html.replace("$ID$", dataset._id);
            html = html.replace("$FIRST_NAME$", dataset.first_name);
            html = html.replace("$LAST_NAME$", dataset.last_name);
            html = html.replace("$PHONE$", dataset.phone);
            html = html.replace("$EMAIL$", dataset.email);
            html = html.replace("$ESSEN$", dataset.essen);
            html = html.replace("$ANZAHL$", dataset.anzahl);
            html = html.replace("$PREIS$", dataset.preis);
        //    html = html.replace("$AMOUNT$", dataset.amount);
        //    html = html.replace("$PAYED$", dataset.payed);

            if (dataset.payed == true) {
                html = html.replace("bezahlen", "Ist bezahlt");
            }

            // Element in die Liste einfügen
            let dummyElement = document.createElement("div");
            dummyElement.innerHTML = html;
            let liElement = dummyElement.firstElementChild;
            liElement.remove();
            olElement.appendChild(liElement);

            // Event Handler registrieren
            liElement.querySelector(".action.pay").addEventListener("click", () => this._collectMoney(dataset));
            // liElement.querySelector(".action.edit").addEventListener("click", () => location.hash = `#/orderedit/${dataset._id}`);
            liElement.querySelector(".action.delete").addEventListener("click", () => this._askDelete(dataset._id));
        }
    }

    async _collectMoney(newOrder) {
        this._editId = newOrder._id;

        if (newOrder.payed == true) {
            alert("Bestellung ist schon bezahlt");
            return;
        }
        // Sicherheitsfrage zeigen
        let answer = confirm("Möchten Sie jetzt bezahlen?");
        if (!answer) return;
        let email = prompt("Eingabe eMail-Adresse");
        
        if (email != null && email != "") {
            newOrder.email = email;
            newOrder.payed = true;
        }else {
           alert ("Bitte richtiges Format eingeben/ Email darf nicht leer sein");              
        }

        // Bestellung als bezahlt aktualisieren
        try {
            this._url = `/order`;
            this._url = `/order/${this._editId}`;
            this._title = "Bestellung aktualisieren";
            await this._app.backend.fetch("PUT", this._url, {body: newOrder}); 
            location.reload();

        } catch (ex) {
            this._app.showException(ex);
            return;
        }
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
};
