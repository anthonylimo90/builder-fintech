const utils = {
    generateRandomNumber: () => {
        let randomNumber = Math.floor(Math.random * 20);
        let randomNumberString = randomNumber.toString();
        return randomNumberString;
    },
    getCurrentDate: () => {
        let date = new Date();
        let preDate = date.toISOString().substring(0, 10);
        return preDate.replace(/-/g, "");
    },
    removeThePlus: (phoneNumber) => {
        let correctPhoneNumber = phoneNumber.substring(1);
        return correctPhoneNumber;
    }
};

module.exports = utils;