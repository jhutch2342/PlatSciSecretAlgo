const fs = require("fs").promises;

function displayUserPrompt() {
    console.log("Welcome to the driver assignment portal");
    console.log(
        "To use this platform you will need to have two files both of which will need to be in the same folder as this application"
    );
    console.log(
        'The first file is a file named "Driver Name File"  (File name is case sensitive) that will need to contain the drivers names'
    );
    console.log(
        'The second file is a file named "Desination Street File"  (File name is case sensitive) that will need to contain the street address of the shipment destinations\n'
    );
}

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
        // console.log("Loading data from: " + filePath.replace("./", ""));
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
    // console.log("Data loaded\n");
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
            If street is odd multiply 1 times the number of consonatns in the driver's name
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
    console.log("Returning shipments");
    console.log(JSON.stringify(shipmentsObject));
    return shipmentsObject;
}

let determineOptimalRoutes = (shipmentsObject) => {
    let optimalRoutes = [];
    let drivers = [];
    let shipmentRoutes = [];
    //Make a deep copy of the driver matrix
    let driverRouteMatrix = [].concat(shipmentsObject.driverRouteMatrix);

    //Load drivers into drivers array
    shipmentsObject.shipments[0].shipmentDrivers.map((driver) => {
        drivers.push(driver.driverName);
    });

    //Load routes into routes array
    shipmentsObject.shipments.map((routes) => {
        shipmentRoutes.push(routes.streetName);
    });

    console.log("Drivers");
    console.log(drivers);
    console.log(shipmentRoutes);

    // Iterate over all routes until there is only one route left
    while (driverRouteMatrix.length > 0) {
        //Compute and store next optimal route
        let nextRoute = findNextRoute(driverRouteMatrix);
        //Get the route's street
        nextRoute.streetName = shipmentRoutes[nextRoute.routeIndex];

        //Get the driver name
        nextRoute.driverName = drivers[nextRoute.driverIndex];
        console.log("1.0------------------------------------");
        console.log("Looking at next route data " + JSON.stringify(nextRoute));
        //Remove route from driver route matrix
        driverRouteMatrix.splice(nextRoute.routeIndex, 1);
        console.log("1.1------------------------------------");
        console.log(driverRouteMatrix);
        //Remove driver from other routes
        console.log("1.2------------------------------------");
        console.log(nextRoute.driverIndex);
        for (
            var routeIndex = 0;
            routeIndex < driverRouteMatrix.length;
            routeIndex++
        ) {
            driverRouteMatrix[routeIndex].splice(nextRoute.driverIndex, 1);
        }
        console.log("1.3------------------------------------");
        console.log(driverRouteMatrix);

        //Remove route from shipment routes
        shipmentRoutes.splice(nextRoute.routeIndex, 1);
        //Remove driver from drivers
        drivers.splice(nextRoute.driverIndex, 1);

        //Remove the route and driver index. They are meaningless once the array updates
        delete nextRoute["driverIndex"];
        delete nextRoute["routeIndex"];
        //Add route to optimal routes
        optimalRoutes.push(nextRoute);
    }
    console.log("Looking at optimal routes");
    console.log(optimalRoutes);
    return optimalRoutes;
};

let findNextRoute = (driverMatrix) => {
    let deltas = [];
    console.log("0----------------start--------------------");
    console.log(
        "Entering findNextRoute " + driverMatrix.length + " routes left"
    );
    console.log(driverMatrix);
    let nextRoute = {};
    //Only 1 route left. No need to compare for efficiency
    if (driverMatrix.length === 1) {
        nextRoute.routeIndex = 0;
        nextRoute.driverIndex = 0;
        console.log("------------------------------------");
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
    console.log("1------------------------------------");
    console.log("Looking at deltas");
    console.log(deltas);
    //Route with the highest potential loss
    let highestDelta = Math.max.apply(null, deltas);
    //Grab route index of route with highest potential loss
    let nextRouteIndex = deltas.indexOf(highestDelta);
    console.log("Looking at route index " + nextRouteIndex);
    console.log("2------------------------------------");
    //Grab max driver score for that route
    let maxDriverScore = Math.max.apply(null, driverMatrix[nextRouteIndex]);
    console.log("Max driver score " + maxDriverScore);
    //Grab the max driver score index
    console.log("Looking at driver matrix");
    console.log(driverMatrix[nextRouteIndex]);
    let nextDriverIndex = driverMatrix[nextRouteIndex].indexOf(maxDriverScore);
    console.log("Driver index " + nextDriverIndex);
    nextRoute.routeIndex = nextRouteIndex;
    nextRoute.driverIndex = nextDriverIndex;
    console.log("Looking at next route " + JSON.stringify(nextRoute));
    console.log("----------------end--------------------");
    return nextRoute;
};

//Main program start
async function runProgram() {
    // displayUserPrompt();
    let getFileData = await loadFileData();
    let shipments = await topSecretAlgorithm(getFileData());
    let optimalRoutes = determineOptimalRoutes(shipments);
}

runProgram();
