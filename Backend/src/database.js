"use strict"

import { MongoClient } from "mongodb";

/**
 * Singleton-Klasse zum Zugriff auf das MongoDB-Datenbankobjekt, ohne dieses
 * ständig als Methodenparameter durchreichen zu müssen. Stattdessen kann
 * einfach das Singleton-Objekt dieser Klasse importiert und das Attribut
 * `mongodb` oder `database` ausgelesen werden.
 */
class DatabaseFactory {
    /**
     * Ersatz für den Konstruktor, damit aus dem Hauptprogramm heraus die
     * Verbindungs-URL der MongoDB übergeben werden kann. Hier wird dann
     * auch gleich die Verbindung hergestellt.
     *
     * @param {String} connectionUrl URL-String mit den Verbindungsdaten
     */
    async init(connectionUrl) {
        // Datenbankverbindung herstellen
        this.client = new MongoClient(connectionUrl);
        await this.client.connect();
        this.database = this.client.db("adressbook");

        await this._createDemoData();
    }

    /**
     * Hilfsmethode zum Anlegen von Demodaten. Würde man so in einer
     * Produktivanwendung natürlich nicht machen, aber so sehen wir
     * wenigstens gleich ein paar Daten.
     */
    async _createDemoData() {
        let addresses = this.database.collection("addresses");
        let orders = this.database.collection("orders");

        if (await addresses.estimatedDocumentCount() === 0) {
            addresses.insertMany([
                {
                    first_name: "Willy",
                    last_name: "Tanner",
                    phone: "+49 711 564412",
                    email: "willy.tanner@alf.com",
                    essen: "Wiener Schnitzel",
                    preis: "17.90"
                },
                {
                    first_name: "Michael",
                    last_name: "Knight",
                    phone: "+49 721 554194",
                    email: "michael@knight-rider.com",
                    essen: "Pommes Frites",
                    preis: "4.90"
                },
                {
                    first_name: "Fox",
                    last_name: "Mulder",
                    phone: "+49 721 553181",
                    email: "mulder@xfiles.com",
                    essen: "Nudelsalat",
                    preis: "11.00"
                },
                {
                    first_name: "Dana",
                    last_name: "Scully",
                    phone: "+49 721 572287",
                    email: "scully@xfiles.com",
                    essen: "Wurstbrot",
                    preis: "4.5"
                },
                {
                    first_name: "Elwood",
                    last_name: "Blues",
                    phone: "+49 721 957338",
                    email: "elwood@blues-brothers.com",
                    essen: "Spaghetti",
                    preis: "5.5"
                },
            ]);
        }

        if (await orders.estimatedDocumentCount() === 0) {
            orders.insertMany([
                {
                    first_name: "Felix",
                    last_name: "Tischer",
                    phone: "+49 711 564412",
                    email: "felix@mytischer.de",
                    essen: 'Pommes Frites',
                    essen: 'Wurst',
                    preis: '10',
                    anzahl: '1'
                },
                {
                    first_name: "Linda",
                    last_name: "Tischer",
                    phone: "+49 6341 7799393",
                    email: "linda@mytischer.de",
                    essen: 'Curry Wurst',
                    anzahl: '2',
                    essen: 'Pommes Frites',
                    preis: '5'
                }
            ]);
        }
       

    }
}

export default new DatabaseFactory();
