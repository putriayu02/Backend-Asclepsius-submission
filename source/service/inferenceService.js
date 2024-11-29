const tf = require("@tensorflow/tfjs-node");
const ValidationError = require("../exceptions/ValidationError");

async function predictClassification(model, image) {
    try {
        // Decode dan resize gambar
        const tensor = tf.node
            .decodeImage(image)
            .resizeNearestNeighbor([224, 224]) // Ubah ukuran gambar agar sesuai dengan input model
            .expandDims() // Tambahkan dimensi batch
            .toFloat(); // Mengubah tipe data menjadi float

        // Lakukan prediksi menggunakan model
        const prediction = model.predict(tensor);
        const score = await prediction.data(); // Ambil hasil prediksi sebagai array
        const confidenceScore = Math.max(...score) * 100; // Dapatkan skor kepercayaan tertinggi

        // Tentukan label berdasarkan skor kepercayaan
        const label = confidenceScore > 50 ? "Cancer" : "Non-cancer";

        // Tentukan saran berdasarkan label prediksi
        const suggestion = label === "Cancer"
            ? "Segera periksa ke dokter!"
            : "Penyakit kanker tidak terdeteksi.";

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
