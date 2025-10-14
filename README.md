# Simpsons Checklist - Proxy + Web UI

## Inhalt
- `index.html` – Die Web-App (Firebase Sync, M3U8-Parser, Popup-Player)
- `server.js` – Node.js Proxy (FFmpeg: MKV → MP4 on-the-fly)
- `package.json` – Node dependencies

## Deploy auf Render.com
1. Neues Repository erstellen und Dateien hochladen.
2. Render: New → Web Service → Repository auswählen.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Environment: wenn Render Probleme mit ffmpeg hat, wähle eine Runtime mit ffmpeg oder verwende Railway.com

## Hinweise
- Stelle sicher, dass FFmpeg im Render-Container verfügbar ist. Manche Render-Images enthalten es nicht; in dem Fall deploye auf Railway oder verwende ein Custom Docker-Image mit FFmpeg.
- In `index.html` ist `PROXY_BASE` auf `https://simpsons-proxy.onrender.com` eingestellt – passe das an, falls deine Render-URL anders ist.
- Firebase-Realtime-DB: `https://simpsons-checkliste-default-rtdb.firebaseio.com` ist konfiguriert.
