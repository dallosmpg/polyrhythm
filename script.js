const paper = document.querySelector('#paper');
const text = document.querySelector('#text');
const pen = paper.getContext('2d');
let startTime = new Date().getTime();
let soundEnabled = false;
document.onvisibilitychange = () => soundEnabled = false;
paper.addEventListener('click', () => {
    soundEnabled = !soundEnabled;

    if (soundEnabled) {
        text.textContent = "Click to disable sound";
    } else {
        text.textContent = "Click to enable sound"
    }
})


const oneFullLoop = 2 * Math.PI;
const realignAfterSeconds = 900;

function calculateNextImpactTime(currentImpactTime, velocity) {
    return currentImpactTime + Math.PI / velocity * 1000;
}   

const arcs = [
          "#D0E7F5",
          "#D9E7F4",
          "#D6E3F4",
          "#BCDFF5",
          "#B7D9F4",
          "#C3D4F0",
          "#9DC1F3",
          "#9AA9F4",
          "#8D83EF",
          "#AE69F0",
          "#D46FF1",
          "#DB5AE7",
          "#D911DA",
          "#D601CB",
          "#E713BF",
          "#F24CAE",
          "#FB79AB",
          "#FFB6C1",
          "#FED2CF",
          "#FDDFD5",
].map((color, index) => {
    const audio = new Audio(`./sounds/Untitled song(${index}).mp3`);
    audio.volume = 0.05;

    const numberOfLoops = 50 - index;
    const velocity = (oneFullLoop * numberOfLoops) / realignAfterSeconds; 


    return {
        color,
        audio,
        nextImpactTime: calculateNextImpactTime(startTime, velocity),
        velocity
    }
})

function draw() {
    paper.width = paper.clientWidth;
    paper.height = paper.clientHeight;

    pen.strokeStyle = 'white';
    pen.lineWidth = 6;
    const length = paper.width * 0.9 - paper.width * 0.1


    const start = {
        x: paper.width * 0.1,
        y: paper.height * 0.9
    }

    const end = {
        x: paper.width * 0.9,
        y: paper.height * 0.9,
    }

    const center = {
        x: paper.width * 0.5,
        y: paper.height * 0.9
    }

    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - startTime) / 1000;

    // const velocity = 1;
    const initialArcRadius = length * 0.05;
    // const distance = Math.PI + (elapsedTime * velocity);
    const maxAngle = 2 * Math.PI;
    // const modDistance = distance % maxAngle;
    // const adjustedDistance = modDistance >= Math.PI ? modDistance : maxAngle - modDistance;
    const spacing = (length / 2 - initialArcRadius) / arcs.length;
    

    pen.beginPath();
    pen.moveTo(start.x, start.y);
    pen.lineTo(end.x, end.y)
    pen.stroke();

    arcs.forEach((arc, index) => {
        const arcRadius = initialArcRadius + (index * spacing);
        
        const distance = Math.PI + (elapsedTime * arc.velocity);
        const modDistance = distance % maxAngle;
        const adjustedDistance = modDistance >= Math.PI ? modDistance : maxAngle - modDistance;

        const x = center.x + arcRadius * Math.cos(adjustedDistance);
        const y = center.y + arcRadius * Math.sin(adjustedDistance);
    
        pen.beginPath();
        pen.strokeStyle = arc.color;
        pen.arc(center.x, center.y, arcRadius, Math.PI, 2 * Math.PI);
        pen.stroke();
    
        pen.fillStyle = 'white';
        pen.beginPath();
        pen.arc(x, y, length * 0.0065, 0, 2 * Math.PI);
        pen.fill();

        if (currentTime >= arc.nextImpactTime) {
            if(soundEnabled) {
                arc.audio.play();
            }
            arc.nextImpactTime = calculateNextImpactTime(arc.nextImpactTime, arc.velocity);
        } 
    })
    
    requestAnimationFrame(draw)
}

draw();