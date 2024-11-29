const Joi = require('joi');
const { postPredictHandler, predictHistories } = require('./handler');
const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

const routes = [
    {
        method: 'POST',
        path: '/predict',
        options: {
            payload: {
                maxBytes: 1 * 1024 * 1024, // Batas maksimal file 1MB
                output: 'stream',         // Menangani file sebagai stream
                parse: true,              // Parsing otomatis payload
                allow: 'multipart/form-data', // Mengizinkan file upload
            },
            validate: {
                payload: Joi.object({
                    image: Joi.any()
                        .meta({ swaggerType: 'file' })
                        .required()
                        .description('The image to be analyzed')
                        .custom((value, helpers) => {
                            // Validasi berdasarkan Content-Type
                            const contentType = value.hapi.headers['content-type'];
                            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
                            if (!allowedTypes.includes(contentType)) {
                                throw new Error(`Unsupported file type: ${contentType}`);
                            }
                            return value; // Jika validasi berhasil
                        }),
                }),
                failAction: (request, h, error) => {
                    console.error('Validation Error:', error.details); // Debugging error validasi
                    return h.response({
                        status: 'fail',
                        message: 'Invalid request payload input',
                    }).code(400);
                },
            },
        },
        handler: postPredictHandler,
    },
    {
        method: 'GET',
        path: '/predict/histories',
        handler: predictHistories,
    },
];

module.exports = routes;
