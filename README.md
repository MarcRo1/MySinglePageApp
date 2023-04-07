Anwendung „Bestellservice”
==============================

Inhaltsverzeichnis
------------------

 1. [Kurzbeschreibung](#kurzbeschreibung)
 2. [Nutzung der Gitpod Online-IDE](#nutzung-der-gitpod-online-ide)


Kurzbeschreibung
----------------

Bei dieser Anwendung handelt es sich um eine Ansammlung von Microservices, um von verschiedenen Restaurants Essen bestellen zu können. Ein Microservice ist dabei die Kundensicht und das damit einhergehende Bestellen von Essen. Ein weiterer Microservice ist das Bezahlen der angelegten Bestellungen. Hinzu kommt eine geschützte Adminsicht, um alle eingegangenen Bestellungen sehen zu können. Eine weitere Adminsicht, stellt die Bestellungen in anschaulichen Daten da. Die Services sind in der Datei order-service.js aufgeführt. Die HTML und JS der einzelnen bestandteile sind in namensgerechten Ordnern enthalten. 

Nutzung der Gitpod Online-IDE
----------------------------

Am einfachsten lässt sich die Anwendung in der Gitpod Online IDE starten. Sie müssen lediglich `https://gitpod.io/#` vor die GitHub-URL schreiben, um die
IDE zu starten.
Dort angekommen bitte den folgenden Befehl in das Terminal eingeben:

* `docker-compose -f docker-compose.dev.yml up` zum Starten aller Dienste

Anschließend den Port 3000 public schalten und die URL von diesem Port kopieren.
Danach im Terminal folgenden Befehl eingeben:

* export API_URL=[Hier die URL]

Nach einer kurzen Wartezeit mit dem Befehl alle dienste Stoppen:

 * `docker-compose -f docker-compose.dev.yml down` zum Stoppen aller Dienste
 
Jetzt mit dem Befehlt von oben alle Dienste wieder starten. Es kann eine weile dauern bis es funktionstüchtig geladen hat. Im zweifel das ganze vorgehen noch einmal durchlaufen und alle Ports auf Public stellen.



