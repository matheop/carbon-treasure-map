// imports
const fs = require("fs");
const { Explorer, orientation } = require("./explorer.class");
const TreasureMap = require("./map.class");

// functions
const readFile = () => {
    try {
        const file = fs.readFileSync("./map.txt", "utf8");
        return file;
    } catch (error) {
        console.error(error);
    }
};

const formatData = (file) => {
    const arr = file.split(/\r?\n/);

    let mapZoneAdded = false;
    let data = [];

    for (let line of arr) {
        line = line.replace(/\s+/g, "");

        // ensure only one C line is added
        if (mapRegex.test(line) && !mapZoneAdded) {
            data.push(line);
            mapZoneAdded = true;
        }

        // check if it is M, T or A line
        if (
            [mountainsRegex, treasuresRegex, explorerRegex].some((rx) =>
                rx.test(line)
            )
        ) {
            data.push(line);
        }
    }

    if (!mapZoneAdded) return null;
    return data;
};

const buildMap = (data) => {
    // --OLD
    // const map = Array(x).fill(new Array(y).fill(".")); // -> create swallow copy: cannot work
    // const map = makeArray(x, y, ".");

    const mapSize = data.find((e) => mapRegex.test(e)).split("-");
    const [x, y] = [+mapSize[1], +mapSize[2]];
    const mountains = filterElements(data, mountainsRegex);
    const treasures = filterElements(data, treasuresRegex);

    const map = new TreasureMap(x, y);

    // add mountains
    for (const mount of mountains) {
        map.updateMapElement([+mount[1]], [+mount[2]], "M");
    }
    // add treasures
    for (const t of treasures) {
        map.updateMapElement([+t[1]], [+t[2]], `T(${t[3]})`);
    }
    // -- OLD add treasures
    // for (const [i, t] of treasures.entries()) {
    // 	// create treasures
    // 	treasures[i] = new Treasure(+t[1], +t[2], t[3]);
    // 	// add treasures
    // 	map.updateMapElement(treasures[i].x, treasures[i].y, treasures[i].name);
    // }
    const explorers = filterElements(data, explorerRegex);
    for (const [i, exp] of explorers.entries()) {
        // create explorers
        explorers[i] = new Explorer(
            `A(${exp[1]})`,
            +exp[2],
            +exp[3],
            exp[4],
            exp[5]
        );
        // add explorers
        // map.updateMapElement(explorers[i].x, explorers[i].y, explorers[i].name);
    }

    // -- OLD add
    // for (const mount of mountains) {
    //     map[+mount[2]][+mount[1]] = "M";
    // }
    // for (const t of treasures) {
    //     map[+t[2]][+t[1]] = `T(${t[3]})`;
    // }
    // for (const exp of explorers) {
    //     map[+exp[3]][+exp[2]] = `A(${exp[1]})`;
    // }

    return [map, mountains, treasures, explorers];
};

const moveExplorers = (map, explorers) => {
    const longestJourney = getLongestJourney(explorers);
    let i = 0;
    while (i < longestJourney) {
        for (const exp of explorers) {
            exp.calculateMove();
            let pos = { x: 0, y: 0 };
            if (exp.direction === orientation.N)
                pos = {
                    x: exp.x,
                    y: exp.y - 1,
                };
            else if (exp.direction === orientation.E)
                pos = {
                    x: exp.x + 1,
                    y: exp.y,
                };
            else if (exp.direction === orientation.S)
                pos = {
                    x: exp.x,
                    y: exp.y + 1,
                };
            else if (exp.direction === orientation.O)
                pos = {
                    x: exp.x - 1,
                    y: exp.y,
                };
            let el = map.checkMapElement(pos.x, pos.y);
            if (el !== "blocked") {
                el = checkIfPlaceIsFree(el, pos, explorers);
                if (el === "treasure") {
                    map.updateTreasureQty(pos.x, pos.y);
                }
            }
            exp.move(el, pos.x, pos.y);
        }
        i++;
    }
    for (const exp of explorers) {
        map.updateMapElement(exp.x, exp.y, exp.name);
    }
    return map;
};

// get the explorers' longest journey
const getLongestJourney = (explorers) => {
    let longestJourney = 0;
    for (const exp of explorers) {
        if (exp.journey.length > longestJourney)
            longestJourney = exp.journey.length;
    }
    return longestJourney;
};

// check if there is no explorer on the free/treasure place and block if so
const checkIfPlaceIsFree = (el, pos, explorers) => {
    for (const exp of explorers) {
        if (pos.x === exp.x && pos.y === exp.y) {
            return "blocked";
        }
    }
    return el;
};

// --OLD
// function makeArray(w, h, val) {
//     const arr = [];
//     for (let i = 0; i < h; i++) {
//         arr[i] = [];
//         for (let j = 0; j < w; j++) {
//             arr[i][j] = val;
//         }
//     }
//     return arr;
// }

const filterElements = (data, regex) => {
    const arr = data.filter((e) => regex.test(e));
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].split("-");
    }
    return arr;
};

const writeOutputFile = (map, mountains, treasures, explorers) => {
    let content = `C - ${map.width} - ${map.height}`;
    mountains.forEach((m) => {
        content = content.concat("\n", `M - ${m[1]} - ${m[2]}`);
    });
    content = content.concat(
        "\n",
        "# {T comme Trésor} - {Axe horizontal} - {Axe vertical} - {Nb. de trésors restants}"
    );
    treasures.forEach((t) => {
        content = content.concat("\n", `T - ${t[1]} - ${t[2]} - ${t[3]}`);
    });
    content = content.concat(
        "\n",
        "# {A comme Aventurier} - {Nom de l’aventurier} - {Axe horizontal} - {Axe vertical} - {Orientation} - {Nb. trésors ramassés}"
    );
    explorers.forEach((e) => {
        content = content.concat(
            "\n",
            `A - ${e.name} - ${e.x} - ${e.y} - ${e.getDirection()} - ${
                e.treasures
            }`
        );
    });

    console.log(content);
    return content;
};

// regex (verified with: https://www.regextester.com/)
const mapRegex = /^C(-[0-9]+){2}$/;
const mountainsRegex = /^M(-[0-9]+){2}$/;
const treasuresRegex = /^T(-[0-9]+){3}$/;
const explorerRegex = /^A-[A-Z][a-z]+(-[0-9]+){2}-[NSEO]-[AGD]*A$/; // doesn't include accented chars + composed names + has to finish by "A"

// RUNNING CODE
const file = readFile();
const data = formatData(file);
if (!data) {
    console.error("Error: no map zone in the file.");
    process.exit(0);
}
// console.log("data:", data);

// init game
const [map, mountains, treasures, explorers] = buildMap(data);
// console.log("map:", map);
// console.log("explorers:", explorers);

// starting game
const finalMap = moveExplorers(map, explorers);
console.log("finalMap:", finalMap);

// write output file
const text = writeOutputFile(map, mountains, treasures, explorers);

fs.writeFile("./output.txt", text, (err) => {
    if (err) console.error(err);
    console.log("Text wrote successfully!");
});

// ------ ROAD MAP ------

/*
1: read input file
- read and parse input file
- check if format is good:
	- use regex,
	- invalidate #lines and bad ones (not C, M, T or A lines)
	- check if there is more than one C line (and pop out the followings)

2: create map
- build map (C)
- add montains (M)
- add treasures (T)
- add explorers (A)

3: fake explorers' moves (in turns)
- make moves in turns
- invalidate move (and wait) if: moutain (M) or explorer (A)
- grab treasure (T) one by one: if (T > 1) T = T-1 else T = plains ('.')

4: write output file
- stop running once no more explorers' move
- parse file and get A, T's new positions
- write output file
*/
