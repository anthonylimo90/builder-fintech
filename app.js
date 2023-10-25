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

            if (resp.responseCode == "IAS00000" && controller.queryUserData(phoneNumber) != null) {
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
            }else if (resp.responseCode == "IAS00000" && controller.queryUserData(phoneNumber) == null) {
                await controller.saveInitialData(JSON.stringify(resp), phoneNumber);
                menu.con(`
                Welcome to Nisome Bank
                ${resp.firstName} ${resp.lastName}
                User No ${resp.userNo}
                1. Check balance
                2. Check KYC Status
                3. Check Loan Limit
                `);
            } else {
                menu.end("Invalid response. Please try again");
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
    run: async () => {
        // fetch balance
        const phoneNumber = menu.args.phoneNumber;
        await customer.walletQuery(phoneNumber).then(async (resp) => {
            signale.debug(`This customer's wallet has: ${resp.balance} KES`);
            menu.end(`Your balance is: ${resp.balance} KES`);
        }).catch(error => {
            signale.error( `Something went terribly wrong 🤯: ${error}`);
        });
    }
});

menu.state('checkKYCStatus', {
    run: async () => {
        const phoneNumber = menu.args.phoneNumber;
        await customer.customerKYCQuery(phoneNumber).then(async (resp) => {
            signale.debug(`This customer's KYC status is: ${resp.kycStatus}`);
            menu.end(`Your KYC status is: ${resp.kycStatus}`);
        }).catch(error => {
            signale.error( `Something went terribly wrong 🤯: ${error}`);
        });
    }
});

// nesting states
menu.state('checkLoanLimit', {
    run: async () => {
        const phoneNumber = menu.args.phoneNumber;
        await customer.loanLimitQuery(phoneNumber).then(async (resp) => {
            signale.debug(`This customer's loan limit is: ${resp.creditLimit}`);
            menu.end(`Your loan limit is: ${resp.creditLimit}`);
        }).catch(error => {
            signale.error( `Something went terribly wrong 🤯: ${error}`);
        })
    }
});

app.get("/", (req, res) => {
    signale.info("Hey, I'm alive 🧟🧟");
});

app.post("/events", (req, res) => {
    signale.info(`
    This is what is happening on ${req.body.sessionId} 👇🏽

    Phone Number: ${req.body.phoneNumber}
    Status: ${req.body.status}
    USSD Hops Count: ${req.body.hopsCount}
    Error Message: ${req.body.errorMessage}
    `);
})

// Registering USSD handler with Express

app.post('/ussd', function(req, res){
    menu.run(req.body, ussdResult => {
        res.send(ussdResult);
    });
});

app.listen(port, () => {
    signale.success(`Service is running on port: ${port}`);
});