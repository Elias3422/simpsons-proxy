import express from "express";
import { spawn } from "child_process";

const app = express();
const ffmpegPath = "/usr/bin/ffmpeg";

app.get("/stream", (req, res) => {
  const sourceUrl = req.query.url;
  if (!sourceUrl) return res.status(400).send("Missing ?url parameter");

  console.log("Proxy streaming:", sourceUrl);
  res.setHeader("Content-Type", "video/mp4");
  // spawn ffmpeg to transcode MKV->MP4 on the fly
  const ffmpeg = spawn(ffmpegPath, [
    "-i", sourceUrl,
    "-c:v", "libx264",
    "-c:a", "aac",
    "-f", "mp4",
    "-movflags", "frag_keyframe+empty_moov",
    "pipe:1"
  ]);

  ffmpeg.stdout.pipe(res);
  ffmpeg.stderr.on("data", (d) => console.error("ffmpeg:", d.toString()));
  ffmpeg.on("close", (code) => console.log("ffmpeg exited with code", code));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));