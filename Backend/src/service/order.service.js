"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Bestellungen. 
 * Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Bestellungen werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class OrderService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._orders = DatabaseFactory.database.collection("orders");
    }

    /**
     * Bestellungen suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Adressen
     */
    async search(query) {
        let cursor = this._orders.find(query, {
            sort: {
                first_name: 1,
                last_name: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern einer neuen Bestellung.
     *
     * @param {Object} order Zu speichernde Bestelldaten
     * @return {Promise} Gespeicherte Bestelldaten
     */
    async create(order) {
        order = order || {};

        let newOrder = {
            // first_name: order.first_name || "",
            // last_name:  order.last_name  || "",
            // phone:      order.phone      || "",
            email:      order.email      || "",
            essen:      order.essen      || "",
            preis:      order.preis      || "",
            anzahl:     order.anzahl     || "",
            //amount:     order.amount     || "",
            //payed:      order.payed      || false
        };

        let result = await this._orders.insertOne(newOrder);
        return await this._orders.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen einer vorhandenen Bestellung anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Bestellung
     * @return {Promise} Gefundene Bestelldaten
     */
    async read(id) {
        let result = await this._orders.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung einer Bestellung, durch Überschreiben einzelner Felder
     * oder des gesamten Bestellobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten Bestellung
     * @param {[type]} address Zu speichernde Bestelldaten
     * @return {Promise} Gespeicherte Bestelldaten oder undefined
     */
    async update(id, order) {
        let oldOrder = await this._orders.findOne({_id: new ObjectId(id)});
        if (!oldOrder) return;

        let updateDoc = {
            $set: {},
        }

        if (order.first_name) updateDoc.$set.first_name = order.first_name;
        if (order.last_name)  updateDoc.$set.last_name  = order.last_name;
        if (order.phone)      updateDoc.$set.phone      = order.phone;
        if (order.email)      updateDoc.$set.email      = order.email;
        if (order.essen)      updateDoc.$set.essen      = order.essen;
        if (order.anzahl)     updateDoc.$set.amount     = order.anzahl;
        if (order.preis)      updateDoc.$set.preis      = order.preis;
        if (order.amount)     updateDoc.$set.amount     = order.amount;
        if (order.payed)      updateDoc.$set.payed      = order.payed;

        await this._orders.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._orders.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen einer Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._orders.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
