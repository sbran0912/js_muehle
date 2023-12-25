const felder = [[100,100],[400,100],[700,100],
[200,200],[400,200],[600,200],
[300,300],[400,300],[500,300],
[100,400],[200,400],[300,400],[500,400],[600,400],[700,400],
[300,500],[400,500],[500,500],
[200,600],[400,600],[600,600],
[100,700],[400,700],[700,700]];

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.strokeStyle = "black";

const fnDraw = (event) => {
    for (let i = 0; i < 24; i++) {
        if (event.offsetX > felder[i][0] && event.offsetX < felder[i][0] + 40 && event.offsetY > felder[i][1] && event.offsetY < felder[i][1] + 40) {
            console.log(i);
            break;
        }
    }
}

canvas.addEventListener("mousedown", fnDraw);

for (const iterator of felder) {
        ctx.strokeRect(iterator[0], iterator[1], 40, 40);
}

ctx.fillStyle = "red";
ctx.fillRect(100,100,40,40);
ctx.clearRect(100,100,20,20);

const fnZeichneBrett = (felder) => {
	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");
	ctx.strokeStyle = "black";
	for (const element of felder) {
        ctx.strokeRect(element[0], element[1], 40, 40);
    }

let fnPos = (felder) => {
	for (let i = 0; i < 24; i++) {
		//alle Koordinaten werden geprüft
        if (event.offsetX > felder[i][0] && event.offsetX < felder[i][0] + 40 && event.offsetY > felder[i][1] && event.offsetY < felder[i][1] + 40) {
            return i; //Position entspricht Feldindex
        }
    }

}
	
}
