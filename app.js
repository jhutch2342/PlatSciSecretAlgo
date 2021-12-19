const fs = require("fs").promises;
const stringTable = require("string-table");

let displayUserPrompt = () => {
    console.log("Welcome to the driver assignment portal");
    console.log(
        "To use this platform you will need to have two files both of which will need to be in the same folder as this application"
    );
    console.log(
        'The first file is a file named "Driver Data File"  (File name is case sensitive) that will need to contain the drivers names'
    );
    console.log(
        'The second file is a file named "Desination Street File"  (File name is case sensitive) that will need to contain the street address of the shipment destinations\n'
    );
};

let displayOptimalRoutes = (optimalRoutesObject) => {
    //Print out optimal routes
    console.log(
        stringTable.create(optimalRoutesObject.optimalRoutes, {
            headers: ["Route", "Driver", "Score"],
        })
    );

    console.log("\nRoute Score " + optimalRoutesObject.routesScore + "\n");
    //Warn user about routes with no driver present
    if (optimalRoutesObject.routesWithNoDriver.length > 0) {
        console.log(
            "--------------WARNING ROUTES WITHOUT DRIVER--------------"
        );
        optimalRoutesObject.routesWithNoDriver.map((route) => {
            console.log(route.Route);
        });
    }
};

//Load and save data from file
let loadFileData = async () => {
    //Load Street and Driver data from system files
    let driverNames = await readFile("./Driver Data File");
    let streetNames = await readFile("./Destination Street File");
    return () => {
        let dataObject = {
            driverNames: driverNames,
            streetNames: streetNames,
        };
        return dataObject;
    };
};

//Helper function for loading and parameterizing data from file
async function readFile(filePath) {
    let data;
    try {
        data = await fs.readFile(filePath);
        //Grab driver by new line
        data = data.toString().split(/\r?\n/);
    } catch (err) {
        console.error(
            `Got an error trying to read the file. Please verify file data and rerun program. Exiting program`
        );
    }
    //Filter out blank lines
    data = data.filter((dataLine) => {
        return dataLine.length > 0;
    });
    return data;
}

async function topSecretAlgorithm(dataObject) {
    //Parameterize incoming values
    let { driverNames, streetNames } = dataObject;

    let shipments = [];
    let driverRouteMatrix = [];

    //Iterate over shipment destination streets to build shipment info
    streetNames.map((streetName) => {
        let shipment = {};
        shipment.streetName = streetName;
        shipment.shipmentDrivers = [];
        let deliveryArray = [];

        driverNames.map((driver) => {
            let shipmentDriver = {};
            shipmentDriver.driverName = driver;
            /*
            Determine driver route score

            Driver score is based on street name length and driver name length
            If street name is even multiply 1.5 times the number of vowels in driver's name
            If street is odd multiply 1 times the number of consonants in the driver's name
            If street name length and driver name length match increase score by 50%
            */
            shipmentDriver.score =
                shipment.streetName.match(/[a-z]/gi).length % 2 == 0
                    ? 1.5 * driver.match(/[aeiou]/gi).length
                    : 1 * driver.match(/[bcdfghjklmnpqrstvwxyz]/gi).length;
            //Check for name length match. 50% increase on driver score if match
            if (
                driver.match(/[a-z]/gi).length ===
                streetName.match(/[a-z]/gi).length
            ) {
                shipmentDriver.score *= 1.5;
            }
            //Add shipment driver to the shipment
            shipment.shipmentDrivers.push(shipmentDriver);
            //Add driver score to delivery score array
            deliveryArray.push(shipmentDriver.score);
        });
        //Add the shipment to the shipments list
        shipments.push(shipment);
        //Add the driver score array to the driverRouterMatrix
        driverRouteMatrix.push(deliveryArray);
    });
    //Creating shipment object
    let shipmentsObject = {};
    shipmentsObject.shipments = shipments;
    shipmentsObject.driverRouteMatrix = driverRouteMatrix;
    return shipmentsObject;
}

let determineOptimalRoutes = (shipmentsObject) => {
    let optimalRoutes = [];
    let drivers = [];
    let shipmentRoutes = [];
    let routesWithNoDriver = [];
    //Make a deep copy of the driver matrix
    let driverRouteMatrix = [].concat(shipmentsObject.driverRouteMatrix);
    let optimalRouteScore = 0;

    //Load drivers into drivers array
    shipmentsObject.shipments[0].shipmentDrivers.map((driver) => {
        drivers.push(driver.driverName);
    });

    //Load routes into routes array
    shipmentsObject.shipments.map((routes) => {
        shipmentRoutes.push(routes.streetName);
    });

    // Iterate over all routes until there is only one route left
    while (driverRouteMatrix.length > 0) {
        //Compute and store next optimal route
        let nextRoute = findNextRoute(driverRouteMatrix);
        //Get the route street
        nextRoute.Route = shipmentRoutes[nextRoute.routeIndex];

        //Get the driver name
        nextRoute.Driver = drivers[nextRoute.driverIndex];
        //Remove route from driver route matrix
        driverRouteMatrix.splice(nextRoute.routeIndex, 1);
        //Remove driver from other routes
        for (
            var routeIndex = 0;
            routeIndex < driverRouteMatrix.length;
            routeIndex++
        ) {
            driverRouteMatrix[routeIndex].splice(nextRoute.driverIndex, 1);
        }

        //Remove route from shipment routes
        shipmentRoutes.splice(nextRoute.routeIndex, 1);
        //Remove driver from drivers
        drivers.splice(nextRoute.driverIndex, 1);

        //Remove the route and driver index. They are meaningless once the array updates
        delete nextRoute["driverIndex"];
        delete nextRoute["routeIndex"];
        //Separate routes that have drivers from routes that do not
        if (nextRoute.Driver === undefined) {
            routesWithNoDriver.push(nextRoute);
        } else {
            //Add route to optimal routes
            optimalRoutes.push(nextRoute);
            //Add route score to optimal route score
            optimalRouteScore += nextRoute.Score;
        }
    }
    let optimalRoutesObject = {};
    optimalRoutesObject.optimalRoutes = optimalRoutes;
    optimalRoutesObject.routesWithNoDriver = routesWithNoDriver;
    optimalRoutesObject.routesScore = optimalRouteScore;
    return optimalRoutesObject;
};

let findNextRoute = (driverMatrix) => {
    let deltas = [];
    let nextRoute = {};
    //Only 1 route left or 1 driver left. No need to compare routes for efficiency
    if (driverMatrix.length === 1 || driverMatrix[0].length === 1) {
        //If only one route left grab highest route score
        if (driverMatrix.length === 1) {
            //Only one route left so route index will be 0
            nextRoute.routeIndex = 0;
            //Get max score out of route
            let maxScore = Math.max.apply(null, driverMatrix[0]);
            nextRoute.driverIndex = driverMatrix[0].indexOf(maxScore);
            nextRoute.Score = driverMatrix[0][nextRoute.driverIndex];
        }
        //If only one driver left grab highest score from routes
        if (driverMatrix[0].length === 1) {
            //Only one driver left so driver index will be 0
            nextRoute.driverIndex = 0;
            let maxRouteIndex = 0;
            let maxRouteScore = 0;
            driverMatrix.map((route, routeIndex) => {
                //Look at the driver score of each route (only 1 driver per route here). If greater than current max save score
                if (route[0] > maxRouteScore) {
                    maxRouteIndex = routeIndex;
                    maxRouteScore = route[0];
                }
            });
            nextRoute.routeIndex = maxRouteIndex;
            nextRoute.Score = maxRouteScore;
        }
        return nextRoute;
    }
    //Determine route with highest potential loss
    driverMatrix.map((route) => {
        //Create a deep clone of the route array
        let tmpRoute = [].concat(route);
        //Get route max
        let max = Math.max.apply(null, tmpRoute);
        //Remove the value from the array
        tmpRoute.splice(tmpRoute.indexOf(max), 1);
        let secondHighest = Math.max.apply(null, tmpRoute);
        //Compute loss delta
        let delta = max - secondHighest;
        //Store route deltas for comparison
        deltas.push(delta);
    });
    //Route with the highest potential loss
    let highestDelta = Math.max.apply(null, deltas);
    //Grab route index of route with highest potential loss
    let nextRouteIndex = deltas.indexOf(highestDelta);
    //Grab max driver score for that route
    let maxDriverScore = Math.max.apply(null, driverMatrix[nextRouteIndex]);
    //Grab the max driver score index
    let nextDriverIndex = driverMatrix[nextRouteIndex].indexOf(maxDriverScore);
    nextRoute.routeIndex = nextRouteIndex;
    nextRoute.driverIndex = nextDriverIndex;
    nextRoute.Score = maxDriverScore;
    return nextRoute;
};

//Main program start
async function runProgram() {
    displayUserPrompt();
    let getFileData = await loadFileData();
    let shipments = await topSecretAlgorithm(getFileData());
    let optimalRoutesObject = determineOptimalRoutes(shipments);
    displayOptimalRoutes(optimalRoutesObject);
}

runProgram();
