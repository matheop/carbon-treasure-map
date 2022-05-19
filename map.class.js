class TreasureMap {
    constructor(w, h) {
        this.width = w;
        this.height = h;
        this.map = this.createMap(w, h, ".");
    }

    createMap(w, h, val) {
        const arr = [];
        for (let i = 0; i < h; i++) {
            arr[i] = [];
            for (let j = 0; j < w; j++) {
                arr[i][j] = val;
            }
        }
        return arr;
    }

    // return blocked/free/treasure
    checkMapElement(x, y) {
        let element;
        // check if element is "M", "A" or outside map
        if (x < 0 || y < 0 || x > this.width - 1 || y > this.height - 1)
            element = "outside";
        else element = this.map[y][x];
        if (element === "outside" || element === "M") return "blocked";
        if (element.startsWith("T")) return "treasure";
        else return "free";
    }

    // placeElement(arr, val) {
    // 	for (const e of arr) {
    // 		this.updateMapElement([+e[2]], [+e[1]], val);
    // 	}
    // }

    updateTreasureQty(x, y) {
        const element = this.map[y][x];
        const qty = element.match(/[0-9]+/);
        if (qty > 1) {
            const name = element.replace(/[0-9]+/, qty - 1);
            this.updateMapElement(x, y, name);
        } else {
            this.updateMapElement(x, y, ".");
        }
    }

    updateMapElement(x, y, val) {
        this.map[y][x] = val;
    }
}

module.exports = TreasureMap;
