"use strict";

class BitSet {
    constructor(laenge) {
        this.bitArr = new Array(laenge).fill(0);
    }

    setBit(pos) {
        this.bitArr[pos] = 1;
    }

    clearBit(pos) {
        this.bitArr[pos] = 0;
    }

    getBit(pos) {
        return this.bitArr[pos];
    }

    getArray() {
        return this.bitArr;
    }

    bitCardinality() {
        return this.bitArr.reduce((a,b) => {return a + b});
    }

    nextSetBit(pos) {
        return this.bitArr.indexOf(1,pos);
    }

    opAnd(compareBitset) {
        // mulitipliziert die jeweiligen elemente von bitArr und compareArr 
        // entspricht logischem UND. Multiplikation muss 1 sein.
        // das Ergebnis wird in eine neues bitset kopiert.
        let compareArr = compareBitset.bitArr;
        let ergebnis  = new BitSet(this.bitArr.length);
        ergebnis.bitArr = this.bitArr.map((element, pos) => {return element * compareArr[pos]});
        return ergebnis;
    }

    opOr(compareBitset) {
        // addiert die jeweiligen elemente von bitArr und compareArr 
        // entspricht logischem OR. Addition muss > 0 sein
        let compareArr = compareBitset.bitArr;
        let ergebnis  = new BitSet(this.bitArr.length);
        ergebnis.bitArr = this.bitArr.map((element, pos) => {return (element + compareArr[pos]) == 0 ? 0 : 1});
        return ergebnis;
    }

    opXor(compareBitset) {
        // addiert die jeweiligen elemente von bitArr und compareArr 
        // entspricht logischem OR. Addition muss 1 sein
        let compareArr = compareBitset.bitArr;
        let ergebnis  = new BitSet(this.bitArr.length);
        ergebnis.bitArr = this.bitArr.map((element, pos) => {return (element + compareArr[pos]) == 1 ? 1 : 0});
        return ergebnis;
    }

    opShift() {
        // kehrt die Bit-Belegung um
        let ergebnis = new BitSet(this.bitArr.length);
        ergebnis.bitArr = this.bitArr.map((element) => {return element == 0 ? 1 : 0});
        return ergebnis; 
    }

}

class Muehlebrett {
    constructor() {
        this.stapel = [9, 9];   // 2 Stapel a 9 Steine #testzwecke nur 5
        this.spielsteine = new Array(2);
        this.spielsteine[0] = new BitSet(24); // 24 spielsteine Weiss
        this.spielsteine[1] = new BitSet(24); // 24 spielsteine Schwarz
        this.nachbarfeld = [
            [1,9],[0,2,4],[1,14],[4,10],[1,3,5,7],[4,13],[7,11],[4,6,8],[7,12],
            [0,10,21],[3,9,11,18],[6,10,15],[8,13,17],[5,12,14,20],[2,13,23],
            [11,16],[15,17,19],[12,16],[10,19],[16,18,20,22],[13,19],[9,22],
            [19,21,23],[14,22]
        ]
        this.muehlemaske = new Array(16);     // es gibt 16 mögliche Mühlen
        for (let i = 0; i < 16; i += 1) {
            this.muehlemaske[i] = new BitSet(24);
        }
        this.muehlemaske[0].setBit(0);this.muehlemaske[0].setBit(1);this.muehlemaske[0].setBit(2);
		this.muehlemaske[1].setBit(3);this.muehlemaske[1].setBit(4);this.muehlemaske[1].setBit(5);
		this.muehlemaske[2].setBit(6);this.muehlemaske[2].setBit(7);this.muehlemaske[2].setBit(8);
		this.muehlemaske[3].setBit(9);this.muehlemaske[3].setBit(10);this.muehlemaske[3].setBit(11);
		this.muehlemaske[4].setBit(12);this.muehlemaske[4].setBit(13);this.muehlemaske[4].setBit(14);
		this.muehlemaske[5].setBit(15);this.muehlemaske[5].setBit(16);this.muehlemaske[5].setBit(17);
		this.muehlemaske[6].setBit(18);this.muehlemaske[6].setBit(19);this.muehlemaske[6].setBit(20);
		this.muehlemaske[7].setBit(21);this.muehlemaske[7].setBit(22);this.muehlemaske[7].setBit(23);
		this.muehlemaske[8].setBit(0);this.muehlemaske[8].setBit(9);this.muehlemaske[8].setBit(21);
		this.muehlemaske[9].setBit(3);this.muehlemaske[9].setBit(10);this.muehlemaske[9].setBit(18);
		this.muehlemaske[10].setBit(6);this.muehlemaske[10].setBit(11);this.muehlemaske[10].setBit(15);
		this.muehlemaske[11].setBit(1);this.muehlemaske[11].setBit(4);this.muehlemaske[11].setBit(7);
		this.muehlemaske[12].setBit(8);this.muehlemaske[12].setBit(12);this.muehlemaske[12].setBit(17);
		this.muehlemaske[13].setBit(5);this.muehlemaske[13].setBit(13);this.muehlemaske[13].setBit(20);
		this.muehlemaske[14].setBit(2);this.muehlemaske[14].setBit(14);this.muehlemaske[14].setBit(23); 
		this.muehlemaske[15].setBit(16);this.muehlemaske[15].setBit(19);this.muehlemaske[15].setBit(22);	
    }
    	
    leseNachbarn(feldnr) {
		return this.nachbarfeld[feldnr];
    }

    leseAnzahlStapel(farbe) {
        return this.stapel[farbe];
    }

    leseAnzahlSpielsteine(farbe) {
		return this.spielsteine[farbe].bitCardinality(); 
	}

	leseZugOption(farbe) {
		// 0 = Setzen
		// 1 = schieben
		// 2 = springen
		let ergebnis = 0; 
		if (this.leseAnzahlStapel(farbe) == 0){ 
            //im Stapel ist kein Stein
            // wenn mehr als 3 Steine dann schieben, ansonsten springen
            ergebnis = this.leseAnzahlSpielsteine(farbe) > 3 ? 1 : 2;
		}
		return ergebnis;
		
	}

    leseAnzahlMuehlen(farbe){
		let anzahl = 0;
		let schnittmenge = new BitSet(24);
		//alle Muehlemasken durchlaufen und Schnittmenge
		//mit Spielsteinen bilden
		for (let muehle of this.muehlemaske) {
			schnittmenge = muehle.opAnd(this.spielsteine[farbe]);
			if (schnittmenge.bitCardinality() == 3){
				anzahl += 1;
			}
		}
		return anzahl;
	}

    leseAnzahlMuehlenOffen(farbe){
		
		let anzahl = 0;
		let posfehl = -1; //Position des nicht besetzten Steins der offenen Muehle
		let posbesetzt = [-1,-1]; //Positionen der beiden besetzten Steine der offenen Muehle
		let schnittmenge = new BitSet(24);
		let restmenge = new BitSet(24);
		
		for (let muehle of this.muehlemaske) {
			
			schnittmenge= muehle.opAnd(this.spielsteine[farbe]);
			
			if (schnittmenge.bitCardinality() == 2) {
				restmenge = muehle.opXor(schnittmenge);		//fehlender Stein ermittelt
				
				//finde die Stelle im BitSet
				posfehl = restmenge.nextSetBit(0);
				
				if (this.istFeldfrei(posfehl)) {
					
					if (this.leseZugOption(farbe) == 1){	//schieben
						//zuerstdie beiden Stene der offenen Muehle ermitteln
						posbesetzt[0] = schnittmenge.nextSetBit(0);
						posbesetzt[1] = schnittmenge.nextSetBit(posbesetzt[0]+1);
	
						for (let nachbar of this.nachbarfeld[posfehl]){
							if (this.istFeldbelegt(farbe, nachbar) && nachbar != posbesetzt[0] && nachbar != posbesetzt[1]){
								anzahl += 1;  //Nachbar mit gleicher Farbe gefunden
								break;
							}
						}

					} else {
						anzahl += 1;
					}
				}
				
			}
		}		
		
		return anzahl;
	}

    leseAnzMoeglicheZuegeSchieben (farbe){
		let anzahl = 0;
        
        this.spielsteine[0].getArray().forEach((element, index) => {
            if (element == 1) { //Feld ist mit Spielstein belegt?
                for (let nachbar of this.nachbarfeld[index]) {
                    if (this.istFeldfrei(nachbar)) {
                        anzahl += 1;  
                    }
                }

            }
        });
		return anzahl;
    }
    
    leseBesetzteFelder(farbe) {
				
        let result = [];
        this.spielsteine[farbe].getArray().forEach((element, index) => {
            if (element == 1) {
                result.push(index);
            }
        });
        return result;
        	    
	}	
    
    leseFreieFelder() {
        let result = [];
        let beideFarben = this.spielsteine[0].opOr(this.spielsteine[1]).getArray();
        beideFarben.forEach((element,index) => {
            if (element == 0) {
                result.push(index);
            }

        });
        return result;

    }


    setzeStein(farbe, pos) {
		this.spielsteine[farbe].setBit(pos);
	}

    loescheStein(farbe, pos) {
		this.spielsteine[farbe].clearBit(pos);
    }
    
    nehmeStapel(farbe) {
		this.stapel[farbe] -= 1;
	}
	
	gebeStapel(farbe) {
		this.stapel[farbe] += 1;
	}

    istFeldfrei(pos) {
		return this.spielsteine[0].getBit(pos) != 1 && this.spielsteine[1].getBit(pos) != 1;
    }
    
    istFeldbelegt(farbe, pos) {
		return this.spielsteine[farbe].getBit(pos) == 1;
    }

    
    istNehmenMoeglich(farbe) {
		let muehlesteine = new BitSet(24);
		let schnittmenge = new BitSet(24);
		
		//Fuer jede moegliche Muehle (muehlemaske) wird schnittmenge
		//zwischen spielsteinen und Maske gebildet
		//wenn Scnittmenge Muehle ergibt, dann spielsteine dieser Muehle speichern (muehlesteine)
		//wenn a Ende soviel muehlesteine vorhanden, dann ist Nehmen nicht moeglich.
		
		for (let muehle of this.muehlemaske) {  //durchlaufe alle Muehlemasken
			schnittmenge = muehle.opAnd(this.spielsteine[farbe]); //schnittmenge von spielsteinen und Maske
			if (schnittmenge.bitCardinality() == 3) muehlesteine = muehlesteine.opOr(muehle); //bei Muehle die Steine merken (in muehlesteine)
		}
        return muehlesteine.bitCardinality() < this.leseAnzahlSpielsteine(farbe);
	}

    istMuehle(farbe, pos) {
		let ergebnis = false;
		let schnittmenge = new BitSet(24);
		 
		
		for (let muehle of this.muehlemaske) {
			if (muehle.getBit(pos) == 1) {        				        //Position des Spielsteins ist in Mühle enthalten?	
				schnittmenge = muehle.opAnd(this.spielsteine[farbe]);	//Schnittmenge von Spielsteine und Maske bilden
				if (schnittmenge.bitCardinality() == 3) {
					ergebnis = true;                                    //an der Position ist eine Muehle (gelegt worden)
				}
			}
		}
		return ergebnis;
	}
	
	setzeZug(zugoption, farbe, farbegegner, startpos, zielpos, gegnerstein) {

		switch (zugoption) {
			case 0: // setzen
				this.setzeStein(farbe, zielpos);
				this.nehmeStapel(farbe);
				break;
				
			case 1: //schieben
			case 2: //springen
				this.loescheStein(farbe, startpos);
				this.setzeStein(farbe, zielpos);
				break;
		}
		if (gegnerstein > -1) {
			this.loescheStein(farbegegner, gegnerstein);
		}
	}

	storniereZug(zugoption, farbe, farbegegner, startpos, zielpos, gegnerstein) {

		switch (zugoption) {
			case 0: // setzen
				this.loescheStein(farbe, zielpos);
				this.gebeStapel(farbe);
				break;
				
			case 1: //schieben
			case 2: //springen
				this.setzeStein(farbe, startpos);
				this.loescheStein(farbe, zielpos);
				break;
		}
		if (gegnerstein > -1) {
			this.setzeStein(farbegegner, gegnerstein);
		}
	}
	

	pruefeNehmen(farbegegner, pos) {
		let erfolg = false;
		
		if (this.istFeldbelegt(farbegegner, pos) && !this.istMuehle(farbegegner, pos)) {
			//gegnerischer Stein ist gesetzt und nicht Muehle!!
			erfolg = true;
		}
		return erfolg;
	}

	pruefeZug (zugoption, startpos, zielpos) {
		switch (zugoption) {
		case 0: // setzen
			if (this.istFeldfrei(zielpos)) {
				return true;
			} 
			break;
		case 1: //schieben
			if (this.istFeldfrei(zielpos)) { 
				//Stein auf startpos ist vorhanden und zielpos ist grundsätzlich frei
				let alleNachbarn = this.leseNachbarn(startpos);
				//gehe alle Nachbarn von startpos durch und prüfe
				//ob Zielpos einem Nachbarfeld entspricht
				for (let nachbar of alleNachbarn) {
					if (nachbar == zielpos) {
						return true;
					}
				}
			}
			break;
		case 2: //springen
			if (this.istFeldfrei(zielpos)){
				//Stein auf startpos ist vorhanden und zielpos ist frei
				return true;
			}
			break;
		}
		
		return false;
	}

	pruefeTeilzugSchieben(pos) {
		let alleNachbarn = this.leseNachbarn(pos);
		//gehe alle Nachbarn von pos durch und prüfe
		//ob Nachbarfeld frei ist
		for (let nachbar of alleNachbarn) {
					if (this.istFeldfrei(nachbar)) {
						return true; 
					}
		}		
		return false;
	}



}

export class MuehleFactory {
   
	static makeClass() {
        if (this.mb == null) {
            this.mb = new Muehlebrett();
        }
        return this.mb;
    }
}


