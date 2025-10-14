import express from "express";
import { spawn } from "child_process";

const app = express();

// Proxy: Konvertiert MKV → MP4 on the fly
app.get("/stream", (req, res) => {
  const sourceUrl = req.query.url;
  if (!sourceUrl) return res.status(400).send("Fehlender ?url Parameter");

  res.setHeader("Content-Type", "video/mp4");

  const ffmpeg = spawn("ffmpeg", [
    "-i", sourceUrl,
    "-c:v", "libx264",
    "-c:a", "aac",
    "-f", "mp4",
    "-movflags", "frag_keyframe+empty_moov",
    "pipe:1"
  ]);

  ffmpeg.stdout.pipe(res);
  ffmpeg.stderr.on("data", (d) => console.log(d.toString()));
  ffmpeg.on("close", (code) => console.log("FFmpeg beendet mit", code));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Proxy läuft auf Port ${PORT}`));
