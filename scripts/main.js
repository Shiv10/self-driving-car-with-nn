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
const cars = generateCars(1);
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
]

let bestCar = cars[0];

if(localStorage.getItem('bestBrain')) {
    for(let i = 0; i<cars.length; i++) {
        cars[i].brain = JSON.parse( '{"levels":[{"inputs":[0,0,0,0.31299587355363645,0.6281960459828831],"outputs":[0,0,1,0,0,0],"biases":[0.36126820752016653,0.5329818098628021,-0.23040713536187724,0.5008057915622489,0.24267963501152182,0.27426925409833147],"weights":[[-0.04612033614813363,-0.5881022278340108,-0.3542207007964534,0.7163860360948741,0.3259232815084304,0.06730243331381489],[-0.1934155049057943,-0.37948691695811565,-0.5714000834065596,-0.05470540385788797,-0.42332897396357705,0.2638463071809195],[0.8603064201217545,-0.19626674401588184,0.3429019144981903,-0.6324991353402333,-0.015420052746717296,-0.3605515761202146],[0.8232699943392181,-0.5832379008382531,0.1625621384301249,0.27955708808580326,-0.015234611284715881,-0.42034536244501003],[0.10370906415083092,-0.3164177175666471,0.257690614441913,0.3422096385058997,-0.1638533650699338,0.13929434675282754]]},{"inputs":[0,0,1,0,0,0],"outputs":[1,1,1,0],"biases":[0.05157368673599727,0.37521549076566785,-0.028784799202948685,0.06510561809145646],"weights":[[0.3751260787450085,0.029305561851472983,-0.12130806967657179,-0.4012919129296964],[0.6065574056413461,0.38888511863791486,0.6132727734318191,-0.034537452310959615],[0.31466504280377444,0.5481193590673976,-0.017647212690747746,-0.36405322590009626],[0.6554625751735947,0.10802587613244564,0.36262053852836723,0.3923823227408529],[-0.09227831868627723,0.13346585470258449,0.0764964109130627,-0.45373511374611236],[0.24166345223213914,0.6745432417399109,0.3554798953914916,0.195527548823494]]}]}' );
        if (i!=0) {
            NeuralNetwork.mutate(cars[i].brain, 0.15);
        }
    }
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
