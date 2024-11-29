require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const routes = require('./routes');
const loadModel = require('../service/loadModel');
const ValidationError = require('../exceptions/ValidationError');

(async () => {
    try {
        // Inisialisasi server
        const server = Hapi.server({
            port: 8000,
            host: '0.0.0.0',
            routes: {
                cors: {
                    origin: ['*'], // Mengaktifkan CORS untuk semua origin
                },
            },
        });

        // Registrasi plugin Inert
        await server.register(Inert);  // Inert harus didaftarkan sebelum rute Anda

        // Load model
        const model = await loadModel();
        server.app.model = model; // Menyimpan model di app context Hapi

        // Menambahkan route
        server.route(routes);

        // Global error handling
        server.ext('onPreResponse', (request, h) => {
            const response = request.response;
            if (response.isBoom) {
                console.error('Error terjadi:', response.message); // Tambahkan log untuk debug
                // Jika error adalah custom InputError
                if (response.data instanceof ValidationError) {
                    return h.response({
                        status: 'fail',
                        message: response.data.message,
                    }).code(response.data.statusCode);
                }

                // Error lainnya
                return h.response({
                    status: 'fail',
                    message: response.message || 'Internal Server Error',
                }).code(response.output.statusCode);
            }
            return h.continue;
        });

        // Jalankan server
        await server.start();
        console.log(`Server is running at ${server.info.uri}`);
    } catch (error) {
        console.error('Error starting server:', error);
    }
})();
