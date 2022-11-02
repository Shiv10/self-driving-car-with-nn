const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;

const carCTX = carCanvas.getContext('2d');
const networkCTX = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)
]

const animate = () => {
    traffic.forEach(npcCar => {
        npcCar.update(road.borders,  []);
    })
    car.update(road.borders, traffic);
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    
    carCTX.save()
    carCTX.translate(0, -car.y+carCanvas.height*0.7);

    road.draw(carCTX);
    traffic.forEach(npcCar => {
        npcCar.draw(carCTX, "red");
    })
    car.draw(carCTX, "blue");
    
    carCTX.restore();

    Visualizer.drawNetwork(networkCTX, car.brain);
    requestAnimationFrame(animate);
}

animate();
