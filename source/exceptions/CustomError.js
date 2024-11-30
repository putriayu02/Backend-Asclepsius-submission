class CustomError extends Error {
    constructor(msg, code = 400) {
        super(msg);
        this.code = code;
        this.name = 'CustomError';
    }
}
module.exports = CustomError;