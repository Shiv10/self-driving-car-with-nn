class Sensor{
    constructor(car) {
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI/2;

        this.rays = [];
        this.readings = [];
    }
    
    update(roadBorders, traffic) {
        this.#castRays();
        this.readings = [];
        this.rays.forEach(ray => {
            this.readings.push(this.#getReading(ray, roadBorders, traffic));
        })
    }

    #getReading(ray, roadBorders, traffic) {
        const touches = [];
        roadBorders.forEach(border => {
            const touch = getIntersection(ray[0], ray[1], border[0], border[1]);
            if (touch) {
                touches.push(touch);
            }
        });

        traffic.forEach(car => {
            const poly = car.polygon;
            for (let j = 0; j<poly.length; j++) {
                const value = getIntersection(ray[0], ray[1], poly[j], poly[(j+1)%poly.length]);
                if (value) {
                    touches.push(value);
                }
            }
        });

        if (touches.length == 0) {
            return null;
        } else {
            const offsets = touches.map(e => e.offset);
            const minOffset = Math.min(...offsets);
            return touches.find(e => e.offset == minOffset);
        }
    }

    #castRays() {
        this.rays = [];
        for(let i = 0; i<this.rayCount; i++ ) {
            const rayAngle = lerp(this.raySpread/2, -this.raySpread/2, this.rayCount==1?0.5:i/(this.rayCount-1))+this.car.angle;
            const start = {x: this.car.x, y: this.car.y};
            const end = {
                x: this.car.x - Math.sin(rayAngle)*this.rayLength,
                y: this.car.y - Math.cos(rayAngle)*this.rayLength
            }

            this.rays.push([start, end]);
        }
    }


    draw() {
        let i = 0;
        this.rays.forEach(ray => {
            let end = ray[1];
            if (this.readings[i]){
                end = this.readings[i]
            }
            carCTX.beginPath();
            carCTX.lineWidth = 2;
            carCTX.strokeStyle = "yellow";
            carCTX.moveTo(ray[0].x, ray[0].y);
            carCTX.lineTo(end.x, end.y);
            carCTX.stroke();


            carCTX.beginPath();
            carCTX.lineWidth = 2;
            carCTX.strokeStyle = "black";
            carCTX.moveTo(ray[1].x, ray[1].y);
            carCTX.lineTo(end.x, end.y);
            carCTX.stroke();

            i++;
        });
    }
}