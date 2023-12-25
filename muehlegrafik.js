class Muehlegrafik {
    constructor() {
        this.feldpos = [[100,100],[400,100],[700,100],
                    [200,180],[400,180],[600,180],
                    [300,240],[400,240],[500,240],
                    [100,320],[200,320],[300,320],[500,320],[600,320],[700,320],
                    [300,400],[400,400],[500,400],
                    [200,480],[400,480],[600,480],
                    [100,560],[400,560],[700,560]];
        this.canvas = document.querySelector("canvas");     
        this.ctx = this.canvas.getContext("2d");  
        this.btnstart = document.querySelector("#btnstart");
    }

    addEvLisMouse(fn) {
        this.canvas.addEventListener("mousedown", fn);
    }

    addEvLisBtn(fn) {
        this.btnstart.addEventListener("click", fn)
    }

    getFeldpos(x, y) {
        let pos = -1;
        let i = 0;
        while (i < 24 && pos < 0) {
            if (x > this.feldpos[i][0] && x < this.feldpos[i][0] + 40 && y > this.feldpos[i][1] && y < this.feldpos[i][1] + 40) {
                pos = i;
            }           
            i += 1;
        } 
        return pos;  
    }

    zeichneBrett() {
        this.ctx.strokeStyle ="black";
        for (const element of this.feldpos) {
            this.ctx.strokeRect(element[0], element[1], 40, 40);
        }
    
    }

    zeichneZug(zug) {
        let farbe = ["red","black"];

        if (zug.startpos > -1) {
            this.ctx.clearRect(this.feldpos[zug.startpos][0], this.feldpos[zug.startpos][1], 40, 40)
        }
        if (zug.zielpos > -1) {
            this.ctx.fillStyle = farbe[zug.farbe];
            this.ctx.fillRect(this.feldpos[zug.zielpos][0], this.feldpos[zug.zielpos][1], 40, 40);    
        }

        if (zug.gegnerstein > -1) {
            this.ctx.clearRect(this.feldpos[zug.gegnerstein][0], this.feldpos[zug.gegnerstein][1], 40, 40);                
        }
        
    }
    
}

export class GrafikFactory {
   
	static makeClass() {
        if (this.mg == null) {
            this.mg = new Muehlegrafik();
        }
        return this.mg;
    }
}
