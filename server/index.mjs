import express from "express";
import util from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
import e from "express";

const ticketLookup = fs.readFile("./server/tickets.json", "utf8")
    .then(JSON.parse)
    .then(o => {
        for (let v of Object.values(o)) {
            v.name = Buffer.from(v.name, "hex").toString("utf8").split("$")[0]
        }
        return o;
    });
const sendFileOptions = { root: process.cwd() };
const app = express();

function bindPromisify(obj, func) {
    return util.promisify(obj[func].bind(obj));
}

app.use((req, res, next) => {
    req.parsedUrl = new URL(`${req.protocol}://${req.headers.host}${req.originalUrl}`);
    res.sendFileAsync = bindPromisify(res, "sendFile");
    next();
});


app.get("/static/*_", async (req, res) => {
    try {
        await res.status(200).sendFileAsync("." + req.parsedUrl.pathname, sendFileOptions);
    }
    catch (err) {
        res.sendStatus(404);
    }

});
app.get("/favicon.ico", async (req, res) => {
    await res.status(200).sendFileAsync("./favicon.ico", sendFileOptions);
})

const ticketRouter = express.Router({mergeParams: true});
app.use("/:ticketNum", ticketRouter);
ticketRouter.use(async (req, res, next) => {
    req.params.ticketNum = req.params.ticketNum.toUpperCase()
    if (req.params.ticketNum in await ticketLookup) {
        req.ticketType = (await ticketLookup)[req.params.ticketNum.toUpperCase()].card;
        next();
    }
    else {
        res.sendStatus(404);
    }
});

ticketRouter.get("/ticket", async (req, res) => {
    await res.status(200).sendFileAsync("./ticket.html", sendFileOptions);
});
ticketRouter.get("/img/:side{front|back}.png", async (req, res) => {
    if (req.params.side === "front" || req.params.side === "back")
    {
        await res.status(200)
            .sendFileAsync(
                `./tickets/${req.ticketType}/${req.params.side}.png`, 
                sendFileOptions);
    }
    else {
        await res.sendStatus(404);
    }
});
ticketRouter.get("/download.pdf", async (req, res) => {
    await res.status(200).sendFileAsync(`./tickets/${req.ticketType}/download.pdf`, sendFileOptions)
})

app.listen(8080);
