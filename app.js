const fs = require("fs").promises;

function displayUserPrompt() {
    console.log("Welcome to the driver assignment portal");
    console.log(
        "To use this platform you will need to have two files both of which will need to be in the same folder as this application"
    );
    console.log(
        'The first file is a file named "Driver Name File"  (case sensitive) that will need to contain the drivers names'
    );
    console.log(
        'The second file is a file named "Desination Street File"  (case sensitive) that will need to contain the street address of the shipment destinations\n'
    );
}

//Load and save data from file
let loadFileData = async () => {
    //Street and Driver data from system files
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

//Loads and returns data from file
async function readFile(filePath) {
    let data;
    try {
        console.log("Loading data from: " + filePath.replace("./", ""));
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
    console.log("Data loaded\n");
    return data;
}

//Main program start
async function runProgram() {
    // displayUserPrompt();
    let getFileData = await loadFileData();
    console.log(getFileData());
}

runProgram();
