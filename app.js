require("dotenv").config();
const signale = require("signale");
const express = require("express");
const UssdMenu = require('ussd-menu-builder');
const mongoose = require("mongoose");

const controller = require("./utils/controller");
const customer = require("./utils/customer");

const Model = require("./models/model");

const mongoString = process.env.MONGO_URI;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
    signale.error(`Something went wrong while trying to connect to the database: ${error}`);
});
database.once("connected", () => {
    signale.success("Database is connected...😎");
});

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

let menu = new UssdMenu();

// Define menu states
menu.startState({
    run: async () => {
        const phoneNumber = menu.args.phoneNumber;
        signale.debug(`This is the phone number in use: ${phoneNumber}`);

        await customer.customerQuery(phoneNumber).then(async (resp) => {
            signale.debug(`Checking the resp object in customer validation: ${JSON.stringify(resp)}`);

            signale.note(`Checking the resp values for the different values: 
            
            FirstName: ${resp.firstName}
            LastName: ${resp.lastName}
            responseCode: ${resp.responseCode}
            responseMessage: ${resp.responseMessage}
            
            `);

            // if (controller.queryUserData(phoneNumber) == null && resp.responseMessage != "SUCCESS") {
            //     // const resp = await customer.customerQuery(phoneNumber);
            //     menu.end("END User not registered. Kindly register with the service before proceeding");
            // } else if (resp.responseMessage == "SUCCESS" && controller.queryUserData(phoneNumber) != null) {
            //     controller.saveInitialData(resp, phoneNumber);
                
            //     menu.con(`
            //     CON Welcome to Nisome Bank 
            //     ${resp.firstName} ${resp.lastName} 
            //     User No ${resp.userNo}
            //     1. Check Balance
            //     2. Check KYC status
            //     3. Check Loan Limit`);
            // }
            // else {     
            //     menu.con(`
            //     CON Welcome to Nisome Bank 
            //     ${resp.firstName} ${resp.lastName} 
            //     User No ${resp.userNo}
            //     1. Check Balance
            //     2. Check KYC status
            //     3. Check Loan Limit`);
            // }

            if (resp.responseCode == "ISA00000" && controller.queryUserData(phoneNumber) == null) {
                await controller.saveInitialData(JSON.stringify(resp), phoneNumber);
                menu.con(`
                Welcome to Nisome Bank
                ${resp.firstName} ${resp.lastName}
                User No ${resp.userNo}
                1. Check balance
                2. Check KYC Status
                3. Check Loan Limit
                `);
            } else if (resp.responseCode == "IASP4002") {
                menu.end("Kindly register for the Nisome bank service to enjoy our free credit!");
            } else {
                menu.end("END Invalid response. Please try again");
            }
        }).catch(error => {
            signale.error( `Something went terribly wrong 🤯: ${error}`);
        });
    },
    // next object links to next state based on user input
    next: {
        '1': 'checkBalance',
        '2': 'checkKYCStatus',
        '3': 'checkLoanLimit'
    }
});

menu.state('checkBalance', {
    run: () => {
        // fetch balance
        fetchBalance(menu.args.phoneNumber).then(function(bal){
            // use menu.end() to send response and terminate session
            menu.end('Your balance is KES ' + bal);
        });
    }
});

menu.state('checkKYCStatus', {
    run: () => {
        menu.con('Enter amount:');
    },
    next: {
        // using regex to match user input to next state
        '*\\d+': 'buyAirtime.amount'
    }
});

// nesting states
menu.state('checkLoanLimit', {
    run: () => {
        // use menu.val to access user input value
        var amount = Number(menu.val);
        buyAirtime(menu.args.phoneNumber, amount).then(function(res){
            menu.end('Airtime bought successfully.');
        });
    }
});

app.get("/", (req, res) => {
    signale.info("Hey, I'm alive 🧟🧟")
});

// Registering USSD handler with Express

app.post('/ussd', function(req, res){
    menu.run(req.body, ussdResult => {
        res.send(ussdResult);
    });
});

app.listen(port, () => {
    signale.success(`Service is running on port: ${port}`);
});