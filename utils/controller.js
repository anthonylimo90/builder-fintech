const mongoose = require("mongoose");
const utils = require("./utils");
const Model = require("./../models/model");

const dataController = {
    saveInitialData: async (resp, phoneNumber) => {
        let dataToSave = {};

        dataToSave.firstName = resp.firstName;
        dataToSave.idNo = resp.idNo;
        dataToSave.idType = resp.idType;
        dataToSave.kycStatus = resp.kycStatus;
        dataToSave.middleName = resp.middleName;
        dataToSave.lastName = resp.lastName;
        dataToSave.userNo = resp.userNo;
        dataToSave.phoneNumber = phoneNumber;

        const data = new Model({
            firstName: dataToSave.firstName,
            idNo: dataToSave.idNo,
            idType: dataToSave.idType,
            kycStatus: dataToSave.kycStatus,
            middleName: dataToSave.middleName,
            lastName: dataToSave.lastName,
            userNumber: dataToSave.userNo,
            phoneNumber: dataToSave.phoneNumber
        });

        let dataResp = await data.save();
        console.log(dataResp)

        return dataResp;
    },
    queryUserData: async (phoneNumber) => {
        
        const queryResponse = await Model.exists({phoneNumber: phoneNumber});
        console.log(queryResponse);

        return queryResponse;
        
    }
}

module.exports = dataController;