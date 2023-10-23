const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    firstName: {
        required: true,
        type: String
    },
    idNo: {
        required: true,
        type: String
    },
    idType: {
        required: true,
        type: String
    },
    kycStatus: {
        required: true,
        type: String
    },
    middleName: {
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    userNumber: {
        required: true,
        type: String
    },
    phoneNumber: {
        required: true,
        type: String
    }
});

module.exports = mongoose.model("Data", dataSchema);