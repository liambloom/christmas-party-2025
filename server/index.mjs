import express from "express";
import util from "node:util";
import path from "node:path";

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

app.get("/:_/ticket", async (req, res) => {
  await res.status(200).sendFileAsync("./pages/ticket.html", sendFileOptions);
});
// app.get("/:ticketNum/img/:side", async (req, res) => {

// })
app.get("/static/*_", async (req, res) => {
    try {
        await res.status(200).sendFileAsync("." + req.parsedUrl.pathname, sendFileOptions);
    }
    catch (err) {
        res.sendStatus(404);
    }

})

app.listen(8080);
