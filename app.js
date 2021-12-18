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

    //Iterate over shipment destination streets to build shipment info
    streetNames.map((streetName) => {
        let shipment = {};
        shipment.streetName = streetName;
        shipment.shipmentDrivers = [];
        let highestShippingScore = 0;
        let highestShippingScoreDriverName = "";

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
            //Check for highest shipment driver score
            if (shipmentDriver.score > highestShippingScore) {
                highestShippingScore = shipmentDriver.score;
                highestShippingScoreDriverName = shipmentDriver.driverName;
            }
            //Add shipment driver to the shipment
            shipment.shipmentDrivers.push(shipmentDriver);
        });
        console.log("Highest shipping score is " + highestShippingScore);
        //Add the shipment to the shipments list
        shipments.push(shipment);
    });
    // console.log("Looking at shipments");
    let shipmentObject = shipments;
    console.log(JSON.stringify(shipmentObject));
    return shipmentObject;
}

/*
Optimizing using a greedy algorithm
Highest driver score on the route gets priority
*/
let determineOptimalRoutes = (shipments) => {
    let optimalRoute = [];
    // shipments.map((shipment) => {});
    return optimalRoute;
};

//Main program start
async function runProgram() {
    // displayUserPrompt();
    let getFileData = await loadFileData();
    let shipments = topSecretAlgorithm(getFileData());
    let optimalRoute = determineOptimalRoutes(shipments);
}

runProgram();
