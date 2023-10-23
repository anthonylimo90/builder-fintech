require("dotenv").config;
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
    
        console.log(customerResp.data);
    
        return customerResp.data;
    },
    walletQuery: async (phoneNumber) => {

        const customerResp = await axios.post(
            "https://sandbox.loop.co.ke/v1/customer/query",
            {
                "requestDateTime": utils.getCurrentDate(),
                "requestId": utils.generateRandomNumber(),
                "userIdType": "P",
                "accountNo": "420410001106",
                "reserve1": "",
                "reserve2": "",
                "requestChannel": "APP",
                "userId": removeThePlus(phoneNumber),
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
    
        console.log(customerResp.data);
    
        return customerResp.data;
    
    
    },
    customerKYCQuery: async (phoneNumber) => {
        const customerResp = await axios.post(
            "https://sandbox.loop.co.ke/v1/customer/query",
            {
                "requestDateTime": utils.getCurrentDate(),
                "requestId": utils.generateRandomNumber(),
                "userIdType": "P",
                "accountNo": "420410001106",
                "reserve1": "",
                "reserve2": "",
                "requestChannel": "APP",
                "userId": removeThePlus(phoneNumber),
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
    
        console.log(customerResp.data);
    
        return customerResp.data;
    },
    loanLimitQuery: async (phoneNumber) => {
        const customerResp = await axios.post(
            "https://sandbox.loop.co.ke/v1/customer/query",
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

        console.log(customerResp.creditLimit);
        return customerResp.creditLimit;
    }
};

module.exports = customer;