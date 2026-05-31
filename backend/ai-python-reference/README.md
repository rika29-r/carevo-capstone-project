# CAREVO AI Python Reference

File dari model user disimpan sebagai referensi. Backend Express memakai `src/services/careerAiService.js` untuk inferensi langsung di Node.js agar project bisa jalan tanpa TensorFlow/Python server. Jika ingin memakai Keras asli, jalankan model ini sebagai microservice Python dan panggil dari `careerController`.
