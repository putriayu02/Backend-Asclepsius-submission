const inferenceService = require('../service/inferenceService');
const crypto = require("crypto");
const storeData = require("../service/storeData");
const path = require("path");
require("dotenv").config();

async function postPredictHandler(request, h) {
    try {
        // Pastikan ada gambar yang diunggah
        const image = request.payload.image;
        
        if (!image) {
            return h.response({
                status: "fail",
                message: "Image data is required",
            }).code(400);
        }
        
        // Cek header content-type
        const contentType = image.hapi.headers['content-type'];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(contentType)) {
            return h.response({
                status: "fail",
                message: `Unsupported file type: ${contentType}`,
            }).code(415); // HTTP Status 415: Unsupported Media Type
        }

        // Ambil model dari app context
        const model = request.server.app.model;
        const { confidenceScore, label, suggestion } = await predictClassification(model, image);

        // Generate ID dan timestamp
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        // Siapkan data untuk disimpan
        const data = {
            id,
            result: label,
            suggestion,
            createdAt,
        };

        // Simpan data ke Firestore
        await storeData(id, data);

        // Kirim respons kembali ke klien
        return h.response({
            status: "success",
            message: confidenceScore > 99 
                ? "Model is predicted successfully with high confidence." 
                : "Model is predicted successfully.",
            data,
        }).code(201);
    } catch (error) {
        console.error(error);
        return h.response({
            status: 'fail',
            message: 'Prediction failed',
        }).code(500);
    }
}

async function predictHistories(request, h) {
    try {
        // Ambil instance Firestore
        const pathKey = path.resolve(process.env.FIRESTORE_KEY_PATH);
        const { Firestore } = require("@google-cloud/firestore");
        const db = new Firestore({
            projectId: "submissionmlgc-putriayu",
            keyFilename: pathKey,
        });

        const predictCollection = db.collection("predictions");
        const snapshot = await predictCollection.get();

        // Format data hasil snapshot
        const result = snapshot.docs.map((doc) => ({
            id: doc.id,
            history: {
                result: doc.data().result,
                createdAt: doc.data().createdAt,
                suggestion: doc.data().suggestion,
                id: doc.data().id,
            },
        }));

        // Kirim data riwayat prediksi
        return h.response({
            status: "success",
            data: result,
        }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({
            status: 'fail',
            message: 'Failed to fetch prediction histories',
        }).code(500);
    }
}

module.exports = {
    postPredictHandler,
    predictHistories,
};
