const tf = require("@tensorflow/tfjs-node");
const ValidationError = require("../exceptions/ValidationError");

async function predictClassification(model, image) {
    try {
        // Decode dan resize gambar
        const tensor = tf.node.decodeJpeg(image).resizeNearestNeighbor([224, 224]).expandDims().toFloat();

        // Lakukan prediksi menggunakan model
        const prediction = model.predict(tensor);
        const score = await prediction.data(); // Ambil hasil prediksi sebagai array
        const confidenceScore = Math.max(...score) * 100; // Dapatkan skor kepercayaan tertinggi


        const label = confidenceScore > 50 ? "Cancer" : "Non-cancer";

        // Tentukan saran berdasarkan label prediksi
        let suggestion = "";
        if (label === "Cancer") {
            suggestion = "Segera periksa ke dokter!";
        } else if (label === "Non-cancer") {
            suggestion = "Penyakit kanker tidak terdeteksi.";
        } else {
            suggestion = "Anda Sehat!";
        }
        console.log("Skor Prediksi: ", score);
        console.log("Skor Kepercayaan: ", confidenceScore);

        return {
            confidenceScore,
            label,
            suggestion,
        };
    } catch (error) {
        // Jika terjadi kesalahan dalam prediksi
        throw new ValidationError("Terjadi kesalahan dalam melakukan prediksi.");
    }
}

module.exports = predictClassification;
