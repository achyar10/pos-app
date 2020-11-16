const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const routes = require("./routes")

let mainWindow;
const server = express()
function createWindow() {

    // Server Thermal Printer
    server.use(cors())
    server.use(bodyParser.json({ limit: '50mb' }))
    server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    server.use('/', routes)
    server.get('/', (req, res) => {
        res.send('Welcome server thermal printer')
    })
    server.use((req, res, next) => {
        res.status(404).send('<h2 align=center>Page not found!</h2>')
    })
    const PORT = 7001
    server.listen(PORT, () => {
        console.log(`server printer running on port ${PORT}`)
    })

    // Close Server Thermal
    
    mainWindow = new BrowserWindow();
    mainWindow.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );
    mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});