class Explorer {
    constructor(name, x, y, direction, journey) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.direction = this.setDirection(direction);
        this.journey = this.createJourney(journey);
        this.treasures = 0;
    }

    createJourney(journey) {
        return journey.match(/[^A]+A?|A/g);
    }

    setDirection(d) {
        let dir = orientation.N;
        if (d === "E") dir = orientation.E;
        else if (d === "S") dir = orientation.S;
        else if (d === "O") dir = orientation.O;
        return dir;
    }

    getDirection() {
        let d = "N";
        if (this.direction === 1) d = "E";
        else if (this.direction === 2) d = "S";
        else if (this.direction === 1) d = "O";
        return d;
    }

    calculateMove() {
        if (!this.journey.length) return null;
        this.direction = this.updateOrientation();
    }

    move(nextElement, x, y) {
        if (nextElement !== "blocked") {
            this.x = x;
            this.y = y;
        }
        if (nextElement === "treasure") {
            this.treasures++;
        }
        this.journey.shift();
    }

    updateOrientation() {
        const move = this.journey[0].split("");
        let i = 0;
        let count = this.direction;
        // calculate rotation
        while (move[i] !== "A" || !move[i]) {
            switch (move[i]) {
                case "G":
                    count--;
                    break;
                case "D":
                    count++;
                    break;
            }
            // ensure coherent position NESO/0123
            if (count > 3) count = 0;
            else if (count < 0) count = 3;
            i++;
        }
        return count;
    }
}

const orientation = {
    N: 0,
    E: 1,
    S: 2,
    O: 3,
};

module.exports = {
    Explorer: Explorer,
    orientation: orientation,
};
