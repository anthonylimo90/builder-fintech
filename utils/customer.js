require("dotenv").config;
const signale = require("signale");
const axios = require("axios");
const utils = require("./utils");

const customer = {
    customerQuery: async (phoneNumber) => {
        const customerResp = await axios.post(
            "https://sandbox.loop.co.ke/v1/customer/query",
            {
                "requestDateTime": utils.getCurrentDate(),
                "requestId": utils.generateRandomNumber(),
                "userIdType": "P",
                "reserve1": "",
                "reserve2": "",
                "requestChannel": "APP",
                "userId": utils.removeThePlus(phoneNumber),
                "partnerId": "LOOP",
                "productSet": "LOOP"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.LOOP_TOKEN}`
                }
            }
        );
    
        signale.debug(customerResp.data);
    
        return customerResp.data;
    },
    walletQuery: async (phoneNumber) => {

        const customerResp = await axios.post(
            "https://sandbox.loop.co.ke/v1/account/wallet/inquiry",
            {
                "requestDateTime": utils.getCurrentDate(),
                "requestId": utils.generateRandomNumber(),
                "userIdType": "P",
                "accountNo": "420410001106",
                "reserve1": "",
                "reserve2": "",
                "requestChannel": "APP",
                "userId": utils.removeThePlus(phoneNumber),
                "partnerId": "LOOP",
                "productSet": "LOOP"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.LOOP_TOKEN}`
                }
            }
        );
    
        signale.debug(utils.getCurrentDate());
        signale.debug(customerResp);
    
        return customerResp.data;
    
    
    },
    customerKYCQuery: async (phoneNumber) => {
        const customerResp = await axios.post(
            "https://sandbox.loop.co.ke/v1/customer/querykyc",
            {
                    "lastName": "Cherutich",
                    "requestDateTime": utils.getCurrentDate(),
                    "userIdType": "P",
                    "idTyp": "01",
                    "reserve1": "",
                    "reserve2": "",
                    "userId": utils.removeThePlus(phoneNumber),
                    "idNo": "30990528",
                    "partnerId": "LOOP",
                    "productSet": "LOOP",
                    "firstName": "Anthony",
                    "requestId": utils.generateRandomNumber(),
                    "middleName": "Kiplimo",
                    "requestChannel": "APP"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.LOOP_TOKEN}`
                }
            }
        );
    
        signale.debug(customerResp.data);
    
        return customerResp.data;
    },
    loanLimitQuery: async (phoneNumber) => {
        const customerResp = await axios.post(
            "https://sandbox.loop.co.ke/v1/loan/inquiry",
            {
                    "productCode": "LONGEN01",
                    "requestDateTime": utils.getCurrentDate(),
                    "requestId": utils.generateRandomNumber(),
                    "userIdType": "P",
                    "reserve1": "",
                    "reserve2": "",
                    "requestChannel": "APP",
                    "userId": utils.removeThePlus(phoneNumber),
                    "partnerId": "LOOP",
                    "productSet": "LOOP"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.LOOP_TOKEN}`
                }
            }
        );

        signale.debug(customerResp);
        return customerResp.creditLimit;
    }
};

module.exports = customer;