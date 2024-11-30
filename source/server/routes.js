const Joi = require('joi');
const { postPredictHandler, predictHistories } = require('./handler');

const routes = [{method: 'POST',
    path: '/predict',
    handler: postPredictHandler,
    options: {
        payload: {
            allow: 'multipart/form-data', // Mengizinkan file upload
            multipart: true,             
            maxBytes: 1000000,
        },
    },
            
        handler: postPredictHandler,
    },
    {
        method: 'GET',
        path: '/predict/histories',
        handler: predictHistories,
    
    },
    // {
    //     method: 'GET',
    //     path: '/predict/{id}', // Route baru untuk mendapatkan prediksi berdasarkan ID
    //     handler: getPredictHandler, // Menggunakan handler yang sudah dibuat
    //     options: {
    //         validate: {
    //             params: Joi.object({
    //                 id: Joi.string().required(), // Validasi bahwa parameter ID adalah string
    //             }),
    //         },
    //     },
    // }

];

module.exports = routes;
