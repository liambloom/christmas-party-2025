import fs from "node:fs/promises";

const o = await fs.readFile("./server/tickets.json", "utf8")
    .then(JSON.parse);

const a = [];
for (let [k, v] of Object.entries(o).sort()) {
    a.push(Buffer.from(v.name, "hex").toString("utf8").split("$")[0] + "\n"
    + `Hey, here is your link for the holiday party: <https://dgholiday.liambloom.dev/${k}/ticket>. You should print this ticket out (using the download button in the top right) or write coal/candy cane and put it on the gift`
    + "\n");
}
a.sort();
for (let m of a) {
    console.log(m);
}
// return a.sort((e1, e2) => e1.name.localeCompare(e2.name));