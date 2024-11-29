// source/exceptions/ValidationError.js

class ValidationError extends Error {
    constructor(message) {
        super(message); // Call the parent class constructor
        this.name = 'ValidationError'; // Set a custom name for the error
        this.stack = (new Error()).stack; // Capture the stack trace
    }
}

module.exports = ValidationError;
