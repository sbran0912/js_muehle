"use strict";
import {MuehleFactory} from './muehlebrett.js';
import {GrafikFactory} from './muehlegrafik.js';

class Spielzug {
	constructor(farbe, farbegegner) {
		this.farbe = farbe;
		this.farbegegner = farbegegner;
		this.startpos = -1;
		this.zielpos = -1;
		this.gegnerstein = -1;
		this.status = 0;
	}

	reset() {
		this.startpos = -1;
		this.zielpos = -1;
		this.gegnerstein = -1;
		this.status = 0;		
	}

	speichern(startpos, zielpos, gegnerstein) {
		this.startpos = startpos;
		this.zielpos = zielpos;
		this.gegnerstein = gegnerstein;
	}
}

class SpielerMensch {
    constructor(farbe, farbegegner) {
		this.zug = new Spielzug(farbe, farbegegner);
		this.mb = MuehleFactory.makeClass();
    }
	
	zugReset() {
		this.zug.reset();
	}
	
    verarbeiteZug(pos) {
		/* 
		 zustand = zugoption + status
		 ---------------------------------------------------
		 00			= Setzen
		 10,20 		= 1. Teilzug (Schieben, Springen)
		 11,21 		= 2. Teilzug (Schieben, Springen)
		 02,12,22 	= Gegnerstein nehmen
		 ----------------------------------------------------
		 Status 3	= Zug ist beendet
		 */

		const zugoption = this.mb.leseZugOption(this.zug.farbe);
		const zustand = zugoption.toString() + this.zug.status.toString();
		switch (zustand) {
			case "00":
			case "11":
			case "21":
				//Zug kann geprüft werden
				if (this.mb.pruefeZug(zugoption, this.zug.startpos, pos)) {
					this.zug.zielpos = pos;
					
					//für Mühleprüfung Zug temporär speichern
					if (this.zug.startpos > -1) {
						this.mb.loescheStein(this.zug.farbe, this.zug.startpos);
					}
					this.mb.setzeStein(this.zug.farbe, this.zug.zielpos);
					//------------------------------------
					
					if (this.mb.istMuehle(this.zug.farbe, this.zug.zielpos) && this.mb.istNehmenMoeglich(this.zug.farbegegner)) {
						this.zug.status = 2;
					} else {
						this.zug.status = 3;
					}
					
					//nach Mühleprüfung Zug zurücknehmen
					this.mb.loescheStein(this.zug.farbe, this.zug.zielpos); 
					if (this.zug.startpos > -1) {
						this.mb.setzeStein(this.zug.farbe, this.zug.startpos);
					}
					//-----------------------------------

				}
				break;
			case "10":
				//Schieben
				if (this.mb.istFeldbelegt(this.zug.farbe, pos) && this.mb.pruefeTeilzugSchieben(pos)) {
					//Schieben für Pos ist moeglich
					this.zug.status = 1;
					this.zug.startpos = pos;	
				}	
				break;
			case "20":
				// Springen	
				if (this.mb.istFeldbelegt(this.zug.farbe, pos)) {
					//Auswahl ist moeglich
					this.zug.status = 1;
					this.zug.startpos = pos;	
				}	
				break;
			case "02":
			case "12":
			case "22":
				//Gegnerstein nehmen
				if (this.mb.pruefeNehmen(this.zug.farbegegner, pos)) {
					this.zug.gegnerstein = pos;
					this.zug.status = 3;
				}  
		}

		if (this.zug.status == 3) {
			this.mb.setzeZug(zugoption, this.zug.farbe, this.zug.farbegegner, this.zug.startpos, this.zug.zielpos, this.zug.gegnerstein);
		}

		return this.zug.status;
	}
}

class SpielerComputer {
	constructor(farbe, farbegegner, tiefe) {
		this.zug = new Spielzug(farbe, farbegegner);
		this.mb = MuehleFactory.makeClass();
		this.tiefe = tiefe;
	}

	bewerteSpielstand(farbe, farbegegner){
		let wert = 0;
			
		wert += (this.mb.leseAnzahlSpielsteine(farbe) * 3);
		wert += (this.mb.leseAnzahlSpielsteine(farbegegner) * -3);
		wert += (this.mb.leseAnzahlMuehlen(farbe) * 2);
		wert += (this.mb.leseAnzahlMuehlen(farbegegner) * -2);
		wert += (this.mb.leseAnzahlMuehlenOffen(farbe) * 3);
		wert += (this.mb.leseAnzahlMuehlenOffen(farbegegner) * -3);
		wert += (this.mb.leseAnzMoeglicheZuegeSchieben(farbe) * 1);
		wert += (this.mb.leseAnzMoeglicheZuegeSchieben(farbegegner) * -1);
		
		return wert;
	}

	generiereSetzen(farbe, farbegegner) {

		let gegnersteine = this.mb.leseBesetzteFelder(farbegegner); 
		let freiefelder = this.mb.leseFreieFelder(); 
		let nehmenmoeglich;
		let aktzug;
		let zugliste = [];

		for (let zielpos of freiefelder) {
			//zur Mühleprüfung muss stein gespeichert werden
			this.mb.setzeStein(farbe, zielpos)
			nehmenmoeglich = false;
			if (this.mb.istMuehle(farbe, zielpos)) {
				for (let gegnerpos of gegnersteine) {
					if (this.mb.pruefeNehmen(farbegegner, gegnerpos)) {
						nehmenmoeglich = true;
						aktzug = new Spielzug(farbe, farbegegner);
						aktzug.speichern(-1, zielpos, gegnerpos);
						zugliste.push(aktzug);
					}
				}	 				
			}
			if (!nehmenmoeglich) {
				//Spielzug speichern (ohne Gegnerstein)	
				aktzug = new Spielzug(farbe, farbegegner);
				aktzug.speichern(-1, zielpos, -1);
				zugliste.push(aktzug);			
			}
			this.mb.loescheStein(farbe, zielpos);
		}
		return zugliste;
	}

	generiereSchieben(farbe, farbegegner) {

		let meinesteine = this.mb.leseBesetzteFelder(farbe);
		let gegnersteine = this.mb.leseBesetzteFelder(farbegegner); 
		let nehmenmoeglich;
		let aktzug;
		let zielpos;
		let zugliste = [];

		for (let startpos of meinesteine) {
			let nachbarn = this.mb.leseNachbarn(startpos); //ermittle alle Nachbarn von startpos
			for (let nachbar of nachbarn) {
				if (this.mb.istFeldfrei(nachbar)) { //Zug ist moeglich von startpos zu nachbarfeld
					zielpos = nachbar;
					this.mb.setzeStein(farbe, zielpos); //Zug zwischenspeichern fuer die Muehlepruefung
					this.mb.loescheStein(farbe, startpos);
					nehmenmoeglich = false;
					if (this.mb.istMuehle(farbe, zielpos)) {
						for (let gegnerpos of gegnersteine) {
							if (this.mb.pruefeNehmen(farbegegner, gegnerpos)) {
								nehmenmoeglich = true;
								aktzug = new Spielzug(farbe, farbegegner);
								aktzug.speichern(startpos, zielpos, gegnerpos);
								zugliste.push(aktzug);
							}
						}	 					
					}
					if (!nehmenmoeglich) {
						//Spielzug speichern (ohne Gegnerstein)	
						aktzug = new Spielzug(farbe, farbegegner);
						aktzug.speichern(startpos, zielpos, -1);
						zugliste.push(aktzug);			
					}
					this.mb.setzeStein(farbe, startpos);
					this.mb.loescheStein(farbe, zielpos);	
				}					
			}
		}	
		return zugliste;
	}

	generiereSpringen(farbe, farbegegner) {

		let meinesteine = this.mb.leseBesetzteFelder(farbe);
		let freiefelder = this.mb.leseFreieFelder(); 
		let gegnersteine = this.mb.leseBesetzteFelder(farbegegner); 
		let nehmenmoeglich;
		let aktzug;
		let zugliste = [];

		for (let startpos of meinesteine) {
			for (let zielpos of freiefelder) {
				this.mb.setzeStein(farbe, zielpos); //Zug zwischenspeichern fuer die Muehlepruefung
				this.mb.loescheStein(farbe, startpos);
				nehmenmoeglich = false;
				if (this.mb.istMuehle(farbe, zielpos)) {
					for (let gegnerpos of gegnersteine) {
						if (this.mb.pruefeNehmen(farbegegner, gegnerpos)) {
							nehmenmoeglich = true;
							aktzug = new Spielzug(farbe, farbegegner);
							aktzug.speichern(startpos, zielpos, gegnerpos);
							zugliste.push(aktzug);
						}
					}	 					
				}
				if (!nehmenmoeglich) {
					//Spielzug speichern (ohne Gegnerstein)	
					aktzug = new Spielzug(farbe, farbegegner);
					aktzug.speichern(startpos, zielpos, -1);
					zugliste.push(aktzug);			
				}
				this.mb.setzeStein(farbe, startpos);
				this.mb.loescheStein(farbe, zielpos);						
			}
		}	
		return zugliste;
	}

	sucheSpielzug(farbe, farbegegner, tiefe) {
		let best = -1000;
		let wert;
		let moeglicheZuege = [];
		let zugoption = this.mb.leseZugOption(farbe);
		
		if (tiefe == 0){
			return this.bewerteSpielstand(farbe, farbegegner); 
		}

		switch (zugoption) {
			case 0:
				moeglicheZuege = this.generiereSetzen(farbe, farbegegner);
				break;
			case 1:
				moeglicheZuege = this.generiereSchieben(farbe, farbegegner);
				break;
			case 2:
				moeglicheZuege = this.generiereSpringen(farbe, farbegegner);
				break;
		}

		moeglicheZuege.forEach((element) => {
			this.mb.setzeZug(zugoption, farbe, farbegegner, element.startpos, element.zielpos, element.gegnerstein);
			wert = this.sucheSpielzug(farbegegner, farbe, tiefe-1) * -1;
			if (wert > best) {
				best = wert;
				if (tiefe == this.tiefe) {
					this.zug = element;	
				}
			}
			this.mb.storniereZug(zugoption, farbe, farbegegner, element.startpos, element.zielpos, element.gegnerstein);
		})

		return best;
	}

	verarbeiteZug() {
		let zugoption = this.mb.leseZugOption(this.zug.farbe);
		let best = this.sucheSpielzug(this.zug.farbe, this.zug.farbegegner, this.tiefe);
		this.mb.setzeZug(zugoption, this.zug.farbe, this.zug.farbegegner, this.zug.startpos, this.zug.zielpos, this.zug.gegnerstein);
	}
}

const fnstartComputer = () => {
	//Computer ist am Zug
	Computer.verarbeiteZug();
	console.log(Computer.zug);
	console.log(`Mensch am Zug, Option: ${Mensch.mb.leseZugOption(Mensch.zug.farbe)}`);	
	grafik.zeichneZug(Computer.zug);
	grafik.btnstart.disabled = true;
}

const fnstartMensch = (event) => {
	let status;
	let pos = -1;
	pos = grafik.getFeldpos(event.offsetX, event.offsetY);
	if (pos > -1) {
		console.log(`Eingabe: ${pos}`);
		status = Mensch.verarbeiteZug(pos);
		grafik.zeichneZug(Mensch.zug);
		console.log(`Aktueller Status (Mensch): ${status}`);
		if (status == 3) {			
			console.log(Mensch.zug);
			Mensch.zugReset();
			grafik.btnstart.disabled = false;
			console.log(`Comuter am Zug, Option: ${Computer.mb.leseZugOption(Computer.zug.farbe)}`);	
		}		
	}
}

//Hauptmodul	
let Mensch = new SpielerMensch(0, 1);
let Computer = new SpielerComputer(1, 0, 4);
let grafik = GrafikFactory.makeClass();
grafik.addEvLisMouse(fnstartMensch);
grafik.addEvLisBtn(fnstartComputer)
grafik.zeichneBrett();






