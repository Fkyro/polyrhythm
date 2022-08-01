function generateRandomCode() {
    var myRandomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
    return myRandomColor;
}

var timer = 0;

class DrawingCanvas {
    constructor(id) {
        this.id = id;
        this.color = generateRandomCode();
        this.curBeat = 0;
    }

    setBeat() {
        let input = document.querySelector("input#input" + this.id);
        this.beat = input.value;
    }

    draw() {
        const canvas = document.querySelector('#canvas');

        if (!canvas.getContext) {
            return;
        }

        const ctx = canvas.getContext('2d');

        ctx.beginPath();

        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = 3;

        //let angle = ((180-(180*(this.beat-2))/this.beat)/2)*((Math.PI)/180);

        let angle = ((180-((180 * (this.beat-2))/(this.beat)))/(2))*((Math.PI)/180);

        let offset = 0;
        if (this.beat%4 == 1)
            offset = 1;

        for (let i = 0; i < this.beat; i++) {
            let x = Math.cos(angle*(i+1)+angle*i+Math.PI/2+(Math.PI/this.beat)*offset) * 100 + 200;
            let y = Math.sin(angle*(i+1)+angle*i+Math.PI/2+(Math.PI/this.beat)*offset) * 100 + 200;
            ctx.lineTo(x,y);
        }

        ctx.closePath();
        ctx.stroke();

        let BPM = document.querySelector("input#BPM").value;

        let mesure = (60/BPM) * 4000;

        let BPM_cur = mesure / this.beat;
        let i = Math.floor((timer % mesure) / BPM_cur);

        if (i != this.curBeat) {
            this.curBeat = i;
            const audio = new Audio("/static/snare.mp3");
            audio.play();
        }

        ctx.beginPath();
        
        if (this.beat%4 == 1)
            offset = 1;
        let x1 = Math.cos(angle*(i+1)+angle*i+Math.PI/2+(Math.PI/this.beat)*offset) * 100 + 200;
        let y1 = Math.sin(angle*(i+1)+angle*i+Math.PI/2+(Math.PI/this.beat)*offset) * 100 + 200;

        i += 1;

        let x2 = Math.cos(angle*(i+1)+angle*i+Math.PI/2+(Math.PI/this.beat)*offset) * 100 + 200;
        let y2 = Math.sin(angle*(i+1)+angle*i+Math.PI/2+(Math.PI/this.beat)*offset) * 100 + 200;

        let k = ((timer % mesure) % BPM_cur)/BPM_cur;

        ctx.arc((x1 + k*(x2-x1)), y1 + k*(y2-y1), 10, 0, 2 * Math.PI);
        ctx.fill();
    }

}

class ScreenCanvas {

    constructor() {
        this.arrayOfDrawing = [];
        this.nb = 0;
    }

    add() {
        let form = document.querySelector("form#form");
        this.nb++;

        let drawCanvas = new DrawingCanvas(this.nb);

        function beatUpdate() {
            drawCanvas.setBeat();
        }

        let res = document.createElement("input");
        res.setAttribute("type", "number");
        res.setAttribute("id", "input"+ this.nb);
        res.setAttribute("value", 2);
        res.addEventListener('change', beatUpdate);
            
        form.appendChild(res);
        beatUpdate();

        this.arrayOfDrawing.push(drawCanvas)
    }

    remove() {
        if (this.nb <= 1)
            return;
        let form = document.querySelector("form#form");
        let button = form.lastElementChild;
        this.nb--;

        form.removeChild(button);
        this.arrayOfDrawing.pop();
    }

    
}

const screenCanvas = new ScreenCanvas();

function addButton() {
    screenCanvas.add();
}

function removeButton() {
    screenCanvas.remove();
}

function drawEvery() {
    timer += 10;

    const canvas = document.querySelector('#canvas');

    if (!canvas.getContext) {
        return;
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,400,400)
    for (let val of screenCanvas.arrayOfDrawing) {
        val.draw();
    }
}

window.onload = function(){

    document.querySelector("#add").onclick = addButton;
    document.querySelector("#remove").onclick = removeButton;

    addButton();

    screenCanvas.arrayOfDrawing[0].setBeat();

    drawEvery();

    setInterval(drawEvery,10);
};
