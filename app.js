require("dotenv").config();
const signale = require("signale");
const express = require("express");
const UssdMenu = require('ussd-menu-builder');
const mongoose = require("mongoose");

const controller = require("./utils/controller");
const customer = require("./utils/customer");

const Model = require("./models/model");

const mongoString = process.env.MONGO_URI;

// mongoose.connect(mongoString);
// const database = mongoose.connection;

// database.on("error", (error) => {
//     signale.error(`Something went wrong while trying to connect to the database: ${error}`);
// });
// database.once("connected", () => {
//     signale.success("Database is connected...😎");
// });

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

let menu = new UssdMenu();

// Define menu states
menu.startState({
    run: () => {
        // const phoneNumber = menu.args.phoneNumber;
        // signale.debug(`This is the phone number in use: ${phoneNumber}`);

        // await customer.customerQuery(phoneNumber).then(async (resp) => {
        //     signale.debug(`Checking the resp object in customer validation: ${JSON.stringify(resp)}`);

        //     signale.note(`Checking the resp values for the different values: 
            
        //     FirstName: ${resp.firstName}
        //     LastName: ${resp.lastName}
        //     responseCode: ${resp.responseCode}
        //     responseMessage: ${resp.responseMessage}
            
        //     `);

        //     if (resp.responseCode == "IAS00000" && controller.queryUserData(phoneNumber) != null) {
        //         menu.con(`
        //         Welcome to the world of Nisome Bank
        //         ${resp.firstName} ${resp.lastName}

        //         1. Send Money
        //         2. Deposit
        //         3. Check balance
        //         4. Pay by code
        //         5. Check KYC Status
        //         6. Check Loan Limit
        //         7. About Nisome Bank
        //         `);
        //     } else if (resp.responseCode == "IASP4002") {
        //         menu.end("Kindly register for the Nisome bank service to enjoy our free credit!");
        //     }else if (resp.responseCode == "IAS00000" && controller.queryUserData(phoneNumber) == null) {
        //         await controller.saveInitialData(JSON.stringify(resp), phoneNumber);
        //         menu.con(`
        //         Welcome to the world of Nisome Bank
        //         ${resp.firstName} ${resp.lastName}

        //         1. Send Money
        //         2. Deposit
        //         3. Check balance
        //         4. Pay by code
        //         5. Check KYC Status
        //         6. Check Loan Limit
        //         7. About Nisome Bank
        //         `);
        //     } else {
        //         menu.end("Invalid response. Please try again");
        //     }
        // }).catch(error => {
        //     signale.error( `Something went terribly wrong 🤯: ${error}`);
        // });
        menu.con(`
                Welcome to the world of Nisome Bank

                1. Send Money
                2. Deposit
                3. Check balance
                4. Pay by code
                5. Check KYC Status
                6. Check Loan Limit
                7. About Nisome Bank
                `);
    },
    // next object links to next state based on user input
    next: {
        '1': 'sendMoney',
        '2': 'deposit',
        '3': 'checkBalance',
        '4': 'payByCode',
        '5': 'checkKYCStatus',
        '6': 'checkLoanLimit',
        '7': 'aboutNisomeBank'
    }
});

menu.state('defaultState', {
    run: () => {
        menu.con(`
                Welcome to the world of Nisome Bank

                1. Send Money
                2. Deposit
                3. Check balance
                4. Pay by code
                5. Check KYC Status
                6. Check Loan Limit
                7. About Nisome Bank
                `);
    },
    // next object links to next state based on user input
    next: {
        '1': 'sendMoney',
        '2': 'deposit',
        '3': 'checkBalance',
        '4': 'payByCode',
        '5': 'checkKYCStatus',
        '6': 'checkLoanLimit',
        '7': 'aboutNisomeBank'
    }
})

menu.state('sendMoney', {
    run: async () => {
        menu.con(`
        Send Money:
        1. Send to LOOP
        2. Send to MPESA
        3. Send to PesaLink
        `);
    },
    next: {
        '1': 'sendMoney.sendToLOOP',
        '2': 'sendMoney.sendtoMPESA',
        '3': 'sendMoney.sendWithPesalink'
    }
});

// Nested menus for Send Money

menu.state('sendMoney.sendToLOOP', {
    run: async () => {
        menu.con(`
        Enter the LOOP Mobile Number you'd like to send to:
        `);
    },
    next: {
        '/^+? \d+ (?: [-. ()] \d+)*$/i': 'sendMoney.accountSelection'
    }
});

menu.state('sendMoney.sendToMPESA', {
    run: async () => {
        menu.con(`
        Enter the LOOP Mobile Number you'd like to send to:
        `);
    },
    next: {
        '/^+? \d+ (?: [-. ()] \d+)*$/i': 'sendMoney.accountSelection'
    }
});

menu.state('sendMoney.sendWithPesaLink', {
    run: async () => {
        menu.con(`
        Enter the LOOP Mobile Number you'd like to send to:
        `);
    },
    next: {
        '/^+? \d+ (?: [-. ()] \d+)*$/i': 'sendMoney.accountSelection'
    }
});

// menu.state('sendMoney.enterDestinationNumber');

menu.state('sendMoney.amount', {
    run: async () => {
        menu.con(`
        Enter the amount you'd like to send:
        `);
    },
    next: {
        '/^+? \d+ (?: [-. ()] \d+)*$/i': 'sendMoney.accountSelection'
    }
});

menu.state('sendMoney.accountSelection', {
    run: () => {
        menu.con(`
        Select the account you would like to use:
        1. LOOP Wallet
        2. LOOP Bank
        `);
    },
    next: {
        '1': 'sendMoney.confirmationScreen',
        '2': 'sendMoney.confirmationScreen'
    }
});

menu.state('sendMoney.pinEntry', {
    run: () => {
        menu.con(`
        Enter your LOOP USSD Pin:
        `);
    },
    next: {
        '/^\d{4}$/': 'sendMoney.endState'
    }
});

menu.state('sendMoney.confirmationScreen', {
    run: () => {
        menu.con(`
        Confirm that you're sending KES 300 to 07220000000
        1. Yes
        2. No
        `);
    },
    next: {
        '1': 'sendMoney.pinEntry',
        '2': 'sendMoney.cancelledScreen'
    }
});

menu.state('sendMoney.endState', {
    run: () => {
        menu.end(`
        Your transaction is being processed. Kindly wait for an SMS confrmation.
        `)
    }
});

// Deposit

menu.state('deposit', {
    run: () => {
        menu.con(`
        Enter the amount you'd like to deposit from MPESA:
        `);
    },
    next: {
        '/^+? \d+ (?: [-. ()] \d+)*$/i': 'deposit.confirmationScreen'
    }
});

// Nested states for Deposit

menu.state('deposit.confirmationScreen', {
    run: () => {
        menu.con(`
        Confirm you are about to deposit 300 KES to your account:
        1. Yes
        2. No
        `);
    },
    next: {
        '1': 'deposit.pinEntry',
        '2': 'deposit.cancelledScreen'
    }
});

menu.state('deposit.cancelledScreen', {
    run: () => {
        menu.con(`
        You have cancelled this transaction.
        `);
    }
})

menu.state('deposit.pinEntry', {
    run: () => {
        menu.con(`
        Enter your LOOP USSD Pin:
        `);
    },
    next: {
        '': 'deposit.endState'
    }
});

menu.state('deposit.endState', {
    run: () => {
        menu.con(`
        Your transaction is being processed. Kindly wait for an SMS confrmation.
        `);
    }
});

// Check balance

menu.state('checkBalance', {
    run: async () => {
        // fetch balance
        // const phoneNumber = menu.args.phoneNumber;
        // await customer.walletQuery(phoneNumber).then(async (resp) => {
        //     signale.debug(`This customer's wallet has: ${resp.balance} KES`);
        //     menu.end(`Your balance is: ${resp.balance} KES`);
        // }).catch(error => {
        //     signale.error( `Something went terribly wrong 🤯: ${error}`);
        // });

        menu.con(`
        Your account balances:
        1. LOOP Wallet: 300 KES
        2. LOOP Bank: 100,000 KES
        `);
    }
});

// Pay by Code

menu.state('payByCode', {
    run: () => {
        menu.con(`
        Pay By Code

        1. LOOP Till
        2. MPESA Till
        3. MPESA Paybill
        `);
    },
    next: {
        '1': 'payByCode.tillNumber',
        '2': 'payByCode.tillNumber',
        '3': 'payByCode.paybillNumber'
    }
});

// Nested states for Pay By Code

// menu.state('payByCode.selectionScreen');

menu.state('payByCode.tillNumber', {
    run: () => {
        menu.con(`
        Enter Till Number:
        `);
    },
    next: {
        '/^\d{6,8}$/': 'payByCode.amount'
    }
});

menu.state('payByCode.paybillNumber', {
    run: () => {
        menu.con(`
        Enter Paybill:
        `);
    },
    next: {
        '/^\d{6,8}$/': 'payByCode.paybillNumberAccountNumber'
    }
});

menu.state('payByCode.paybillNumberAccountNumber', {
    run: () => {
        menu.con(`
        Enter Account Number:
        `);
    },
    next: {
        '/^\d{6,8}$/': 'payByCode.amount'
    }
})

menu.state('payByCode.amount', {
    run: () => {
        menu.con(`
        Enter the amount you would like to pay:
        `);
    },
    next: {
        '/^+? \d+ (?: [-. ()] \d+)*$/i': 'payByCode.accountSelection'
    }
});

menu.state('payByCode.accountSelection', {
    run: () => {
        menu.con(`
        Select the account you would like to use:
        1. LOOP Wallet
        2. LOOP Bank
        `);
    },
    next: {
        '1': 'payByCode.confirmationScreen',
        '2': 'payByCode.confirmationScreen'
    }
})

// Enter Amount -> Confirmation Screen -> Pin Entry -> 

menu.state('payByCode.confirmationScreen', {
    run: () => {
        menu.con(`
        Confirm you want to pay 300 KES to Jamii LTD:
        1. Yes
        2. No
        `);
    },
    next: {
        '1': 'payByCode.pinEntry',
        '2': 'payByCode.cancelledScreen'
    }
});

menu.state('payByCode.cancelledScreen', {
    run: () => {
        menu.con(`
        You have cancelled this operation.
        `);
    }
});

menu.state('payByCode.pinEntry', {
    run: () => {
        menu.con(`
        Enter your pin:
        `);
    },
    next: {
        '': 'payByCode.endState'
    }
});

menu.state('payByCode.endState', {
    run: () => {
        menu.end(`
        Your transaction is being processed. Kindly wait for an SMS confrmation.
        `);
    },
});

// Check KYC Status

menu.state('checkKYCStatus', {
    run: async () => {
        // const phoneNumber = menu.args.phoneNumber;
        // await customer.customerKYCQuery(phoneNumber).then(async (resp) => {
        //     signale.debug(`This customer's KYC status is: ${resp.kycStatus}`);
        //     menu.end(`Your KYC status is: ${resp.kycStatus}`);
        // }).catch(error => {
        //     signale.error( `Something went terribly wrong 🤯: ${error}`);
        // });

        menu.con(`
        Your KYC is validated.
        `);
    }
});

// Check Loan Limits
menu.state('checkLoanLimit', {
    run: async () => {
        // const phoneNumber = menu.args.phoneNumber;
        // await customer.loanLimitQuery(phoneNumber).then(async (resp) => {
        //     signale.debug(`This customer's loan limit is: ${resp.creditLimit}`);
        //     menu.end(`Your loan limit is: ${resp.creditLimit} KES`);
        // }).catch(error => {
        //     signale.error( `Something went terribly wrong 🤯: ${error}`);
        // })
        menu.con(`
        Your loan limit is 50,000 KES
        `);
    }
});

// About Nisome Bank

menu.state('aboutNisomeBank', {
    run: () => {
        menu.con(`
        Just some cool info :)
        `);
    }
});

// App initialization

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