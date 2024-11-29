const { Firestore } = require('@google-cloud/firestore');
const path = require('path');
// const filePath = ('../server/submissionmlgc-putriayu-36f69ac2160a.json');
require('dotenv').config();

// Mendapatkan path ke file kunci Firestore dari environment variable
const pathKey = path.resolve(process.env.FIRESTORE_KEY_PATH);

async function storeData(id, data) {
    try {
        // Inisialisasi koneksi ke Firestore menggunakan kredensial dari file kunci
        const db = new Firestore({
            projectId: 'submissionmlgc-putriayu',
            keyFilename: pathKey,
        });

        // Menyimpan data prediksi di koleksi 'predictions'
        const predictCollection = db.collection('predictions');
        await predictCollection.doc(id).set(data); // Menyimpan data dengan ID yang diberikan
        console.log("Data prediksi berhasil disimpan.");
    } catch (error) {
        console.error("Gagal menyimpan data:", error);
        throw new Error("Gagal menyimpan data prediksi ke Firestore.");
    }
}

module.exports = storeData;
