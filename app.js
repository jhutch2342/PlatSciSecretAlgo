const fs = require("fs");

function displayUserPrompt() {
    console.log("Welcome to the driver assignment portal");
    console.log(
        "To use this platform you will need to have two files both of which will need to be in the same folder as this application"
    );
    console.log(
        'The first file is a file named "Driver Name File"  (case sensitive) that will need to contain the drivers names'
    );
    console.log(
        'The second file is a file named "Desination Street File"  (case sensitive) that will need to contain the street address of the shipment destinations'
    );
}

async function getFileData() {
    //Street and Driver data from system files
    let driverNames = [];
    let streetNames = [];

    //Load in Driver data
    try {
        fs.readFile("./Driver Data File", "utf8", (err, data) => {
            if (err) {
                console.log("Error reading Driver File. Exiting program");
                process.exit();
            }
            const drivers = data.split(/\r?\n/);
            console.log("\nLoading Drivers");
            drivers.forEach((driverName) => {
                //Filter out blank lines
                if (driverName.length > 0) {
                    console.log(driverName + " loaded");
                    driverNames.push(driverName);
                }
            });
            //Exit if no Drivers in files
            if (driverNames.length === 0) {
                console.log(
                    "Error. No Drivers in Driver Data File. Please add Driver names to the file. Exiting program"
                );
                process.exit();
            }
            console.log("All drivers loaded\n");
        });
    } catch (err) {
        console.log("Error reading Driver File. Exiting program");
        process.exit();
    }

    return () => {
        return [driverNames, streetNames];
    };
}

//Main program start
displayUserPrompt();
getFileData();
