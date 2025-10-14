import express from "express";
import { spawn } from "child_process";
import fetch from "node-fetch";
import { chmodSync, existsSync } from "fs";
import { execSync } from "child_process";
import path from "path";

const app = express();

// 🧰 Stelle sicher, dass FFmpeg existiert
const ffmpegPath = "/usr/bin/ffmpeg";

async function ensureFfmpeg() {
  try {
    execSync(`${ffmpegPath} -version`, { stdio: "ignore" });
    console.log("✅ FFmpeg gefunden");
  } catch {
    console.error("⚠️ FFmpeg fehlt! Bitte Render-Container mit FFmpeg-Image starten.");
  }
}

ensureFfmpeg();

// 🔁 Proxy-Endpunkt
app.get("/stream", async (req, res) => {
  const sourceUrl = req.query.url;
  if (!sourceUrl) return res.status(400).send("Fehlender ?url Parameter");

  console.log("▶️ Streaming:", sourceUrl);

  res.setHeader("Content-Type", "video/mp4");

  const ffmpeg = spawn(ffmpegPath, [
    "-i", sourceUrl,
    "-c:v", "libx264",
    "-c:a", "aac",
    "-f", "mp4",
    "-movflags", "frag_keyframe+empty_moov",
    "pipe:1"
  ]);

  ffmpeg.stdout.pipe(res);
  ffmpeg.stderr.on("data", d => console.log(d.toString()));
  ffmpeg.on("close", code => console.log("FFmpeg beendet mit Code:", code));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Proxy läuft auf Port ${PORT}`));
