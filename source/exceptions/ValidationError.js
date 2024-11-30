const CustomError = require("./customError");
class ValidationError extends CustomError {
    constructor(message) {
        super(message); // Call the parent class constructor
        this.name = 'ValidationError'; // Set a custom name for the error
    }
}
module.exports = ValidationError;