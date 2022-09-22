const fs = require("node:fs");
const path = require("node:path");

const routesPath = path.join(__dirname, "routes");
const routesFiles = fs.readdirSync(routesPath).filter(file=>file.endsWith(".js"));

let routers = []

for(const file of routesFiles){
    const filePath = path.join(routesPath, file);
    const route = require(filePath);
    console.log("done:"+file);
    routers.push(route);
}

module.exports = routers;