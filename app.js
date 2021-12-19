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

let determineOptimalRoutes = (shipments) => {
    let optimalRoute = [];
    console.log(JSON.stringify(findNextRoute(shipments)));
    //Iterate over the shipments until all shipments have been processed
    // while (shipments.length > 0) {
    //     let shipmentIndex = findNextRoute(shipments);
    //     //Add route to optimal route and remove from shipments
    // }
    return optimalRoute;
};

let findNextRoute = (shipments) => {
    let deltas = [];
    console.log("Looking at routes " + shipments.driverRouteMatrix.length);
    //Determine route with highest potential loss
    shipments.driverRouteMatrix.map((route) => {
        //Create a deep clone of the route array
        let tmpRoute = [].concat(route);
        //Get route max
        let max = Math.max.apply(null, tmpRoute);
        //Remove the value from the array
        tmpRoute.splice(tmpRoute.indexOf(max), 1);
        let secondHighest = Math.max.apply(null, tmpRoute);
        let delta = max - secondHighest;
        deltas.push(delta);
    });
    console.log("Looking at deltas");
    console.log(deltas);
    //Route with the highest potential loss
    let highestDelta = Math.max.apply(null, deltas);
    //Grab route index of route with highest delta
    let nextRouteIndex = deltas.indexOf(highestDelta);
    console.log("Looking at route index " + nextRouteIndex);
    //Grab max driver score
    let maxDriverScore = Math.max.apply(
        null,
        shipments.driverRouteMatrix[nextRouteIndex]
    );
    console.log(maxDriverScore);
    //Grab the max driver score index
    let nextDriverIndex =
        shipments.driverRouteMatrix[nextRouteIndex].indexOf(maxDriverScore);
    console.log(nextDriverIndex);
    let nextRoute = {};
    nextRoute.routeIndex = nextRouteIndex;
    nextRoute.driverIndex = nextDriverIndex;
    return nextRoute;
};

//Main program start
async function runProgram() {
    // displayUserPrompt();
    let getFileData = await loadFileData();
    let shipments = await topSecretAlgorithm(getFileData());
    let optimalRoute = determineOptimalRoutes(shipments);
}

runProgram();
