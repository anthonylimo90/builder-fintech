const utils = {
    generateRandomNumber: () => {
        let randomNumber = Math.floor(Math.random * 20);
        let randomNumberString = randomNumber.toString();
        return randomNumberString;
    },
    getCurrentDate: () => {
        let date = new Date();
        //TODO: Remove hyphens from date response
        return date.toISOString().substring(0, 10);
    },
    removeThePlus: (phoneNumber) => {
        let correctPhoneNumber = phoneNumber.substring(1);
        return correctPhoneNumber;
    }
};

module.exports = utils;