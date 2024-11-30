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
    
    }];

module.exports = routes;
