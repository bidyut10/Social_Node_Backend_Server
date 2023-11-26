export const validation = {
    // Check if the input is a string
    isString: (value) => {
        return typeof value === 'string' || value instanceof String;
    },

    // Check if the input is a number
    isNumber: (value) => {
        return typeof value === 'number' && isFinite(value);
    },

    // Check if the input is a valid email address
    isEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Check if the input is a valid Indian phone number
    isIndianPhoneNumber: (phoneNumber) => {
        const phoneRegex = /^\+91[1-9][0-9]{9}$/;
        return phoneRegex.test(phoneNumber);
    },

    // Check if the input has a minimum length
    hasMinLength: (value, minLength) => {
        return validation.isString(value) && value.length >= minLength;
    },

    // Check if the input is a boolean
    isBoolean: (value) => {
        return typeof value === 'boolean';
    },

    // Check if the input is a valid Mongoose ObjectId
    isValidMongooseId: (id) => {
        const mongooseIdRegex = /^[0-9a-fA-F]{24}$/;
        return mongooseIdRegex.test(id);
    },
};

