const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;

const carCTX = carCanvas.getContext('2d');
const networkCTX = networkCanvas.getContext('2d');
const generateCars = (n) => {
    const cars = [];
    for (let i = 0; i<n; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }

    return cars;
}

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);
const cars = generateCars(100);
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
]

let bestCar = cars[0];

if(localStorage.getItem('bestBrain')) {
    bestCar = JSON.parse( localStorage.getItem('bestBrain') );
}

const save = () => {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}

const discard = () => {
    localStorage.removeItem('bestCar');
}

const animate = (time) => {
    traffic.forEach(npcCar => {
        npcCar.update(road.borders,  []);
    });

    cars.forEach(car => {
        car.update(road.borders, traffic);
    });

    bestCar = cars.find(c => c.y==Math.min(...cars.map(c => c.y)));
    
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    
    carCTX.save()
    carCTX.translate(0, -bestCar.y+carCanvas.height*0.7);

    road.draw(carCTX);
    traffic.forEach(npcCar => {
        npcCar.draw(carCTX, "red");
    });
    
    carCTX.globalAlpha = 0.2;
    cars.forEach(car => {
        car.draw(carCTX, "blue");
    });

    carCTX.globalAlpha = 1;
    bestCar.draw(carCTX, "blue", true);

    
    carCTX.restore();

    networkCTX.lineDashOffset = -time/50;
    Visualizer.drawNetwork(networkCTX, bestCar.brain);
    requestAnimationFrame(animate);
}

animate();
