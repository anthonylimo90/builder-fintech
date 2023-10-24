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
        let phoneNumber = menu.args.phoneNumber;
        signale.debug(`This is the phone number in use: ${phoneNumber}`);

        await customer.customerQuery(phoneNumber).then((resp) => {
            signale.debug(`Checking the resp object in customer validation: ${resp}`);

            if (controller.queryUserData(phoneNumber) == null && resp["responseMessage"] !== "SUCCESS") {
                // const resp = await customer.customerQuery(phoneNumber);
                menu.end("END User not registered. Kindly register with the service before proceeding");
            } else if (resp.responseMessage === "SUCCESS" && controller.queryUserData(phoneNumber) !== null) {
                controller.saveInitialData(resp, phoneNumber);
                
                menu.con(`
                CON Welcome to Nisome Bank 
                ${resp.firstName} ${resp.lastName} 
                User No ${resp.userNo}
                1. Check Balance
                2. Check KYC status
                3. Check Loan Limit`);
    
            }
            else {
                // const resp = await customer.customerQuery(phoneNumber);
                // console.log(resp, phoneNumber);     
                menu.con(`
                CON Welcome to Nisome Bank 
                ${resp.firstName} ${resp.lastName} 
                User No ${resp.userNo}
                1. Check Balance
                2. Check KYC status
                3. Check Loan Limit`);
            }
        }).catch(error => {
            signale.error( `Something went terribly wrong 🤯: ${error}`);
        });
    },
    // next object links to next state based on user input
    next: {
        '1': 'showBalance',
        '2': 'buyAirtime'
    }
});

menu.state('showBalance', {
    run: () => {
        // fetch balance
        fetchBalance(menu.args.phoneNumber).then(function(bal){
            // use menu.end() to send response and terminate session
            menu.end('Your balance is KES ' + bal);
        });
    }
});

menu.state('buyAirtime', {
    run: () => {
        menu.con('Enter amount:');
    },
    next: {
        // using regex to match user input to next state
        '*\\d+': 'buyAirtime.amount'
    }
});

// nesting states
menu.state('buyAirtime.amount', {
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