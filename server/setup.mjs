import fs from "node:fs/promises";

const characters = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789"

function randomIndex(a) {
    return Math.floor(Math.random() * a.length)
}
function encodeName(n) {
    n += "$";
    while (n.length < 10) {
        n += characters[randomIndex(characters)];
    }
    return new Buffer.from(n, "utf8").toString("hex");
}

const NAMES = ["Liam", "Daelisse", "Bre", "Patrick",
    "Derin", "Cat", "Simon", "Zeke",
    "Daniel", "Ember P.", "Hens",
    "Ember S.", "Hannah",
].map(encodeName);
const table = {};

function randomKey() {
    let r;
    do {
        r = "";
        for (let i = 0; i < 3; i++) {
            r += characters[randomIndex(characters)];
        }
    } while (r in table);
    return r;
}

table[randomKey()] = {
    name: encodeName("Sam"),
    card: "coal",
}

let COAL_COUNT = 5
for (let i = 0; i < COAL_COUNT; i++) {
    table[randomKey()] = {
        name: NAMES.splice(randomIndex(NAMES), 1)[0],
        card: "coal",
    }
}

for (let name of NAMES) {
    table[randomKey()] = {
        name: name,
        card: "candy",
    }
}

await fs.writeFile("./server/tickets.json", JSON.stringify(table));

console.log(await fs.readFile("./server/tickets.json", "utf8"));