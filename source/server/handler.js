const predictClassification = require("../service/inferenceService");
const crypto = require("crypto");
const storeData = require("../service/storeData");
const path = require('path');
const { Firestore } = require("@google-cloud/firestore");
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

const predictHistories = async (_request, h) => {
    try {
        // Mengambil jalur file kredensial
        const pathKey = path.resolve(process.env.FIRESTORE_KEY_PATH);
        
        // Inisialisasi instance Firestore
        const db = new Firestore({
            projectId: "submissionmlgc-putriayu",  // ID proyek Google Cloud
            keyFilename: pathKey,  // Jalur ke file kredensial
        });

        // Ambil semua dokumen dari koleksi "predictions"
        const snapshot = await db.collection("predictions").get();

        // Jika koleksi kosong, kirim respons kosong
        if (snapshot.empty) {
            return h.response({
                status: "success",
                data: [],
            }).code(200);
        }

        // Format data hasil query
        const data = snapshot.docs.map(doc => ({
            id: doc.id, // ID dokumen
            history: {
                result: doc.data().result, // hasil prediksi
                createdAt: doc.data().createdAt, // waktu pembuatan dokumen
                suggestion: doc.data().suggestion, // saran berdasarkan hasil prediksi
                id: doc.id, // ID dokumen untuk bagian history
            },
        }));

        // Kirim respons ke klien
        return h.response({
            status: "success",
            data,
        }).code(200);

    } catch (error) {
        // Tangani error dan kirimkan respons
        console.error(error);
        return h.response({
            status: "fail",
            message: error.message || "Internal Server Error",
        }).code(500);
    }
};


module.exports = { postPredictHandler, predictHistories };