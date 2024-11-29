const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
    try {
        // Memuat model TensorFlow dari URL
        return await tf.loadGraphModel('https://storage.googleapis.com/cancer-data-submission/submissions-model/model.json');
    } catch (error) {
        console.error("Gagal memuat model:", error);
        throw new Error("Gagal memuat model.");
    }
}

module.exports = loadModel;
