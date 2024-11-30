const predictClassification = require("../service/inferenceService");
const crypto = require("crypto");
const storeData = require("../service/storeData");
const path = require('path');
require('dotenv').config();

async function postPredictHandler(request, h) {
    const {image} = request.payload
    const {model} = request.server.app
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
        message: "Model is predicted successfully",
        data,
    }).code(201);
}

async function predictHistories(req, res, next) {
    try {
        const model = req.app.get('model');
        const pathKey = path.resolve(process.env.FIRESTORE_KEY_PATH);
        const { Firestore } = require("@google-cloud/firestore");
        const db = new Firestore({
            projectId: "submissionmlgc-putriayu",
            keyFilename: pathKey,
        });
        const predictCollection = db.collection("predictions");
        const snapshot = await predictCollection.get();

        const result = snapshot.docs.map(doc => ({
            id: doc.id,
            history: {
                result: doc.data().result,
                createdAt: doc.data().createdAt,
                suggestion: doc.data().suggestion,
                id: doc.data().id,
            },
        }));

        res.status(200).json({
            status: 'success',
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { postPredictHandler, predictHistories };