const express = require('express');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

const app = express();
app.use(express.json());

// Middleware agar tidak terkena blokir CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post('/tts', async (req, res) => {
  try {
    const { text, voice = 'id-ID-ArdiNeural' } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Teks tidak boleh kosong" });
    }

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    
    const { audioStream } = tts.toStream(text);
    
    // Langsung alirkan (stream) audio MP3 ke browser/PHP
    res.setHeader('Content-Type', 'audio/mpeg');
    audioStream.pipe(res);
  } catch (error) {
    console.error("TTS Error:", error);
    res.status(500).json({ error: error.message || "Gagal menghasilkan audio TTS" });
  }
});

// Koyeb secara otomatis menggunakan process.env.PORT (biasanya port 8000)
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server Edge TTS Daffa aktif di port ${PORT}`);
});
