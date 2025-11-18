```markdown
# MedTime: Legends of Medicine (PWA)

A small playable scaffold that turns Edexcel "Medicine Through Time" into a game you can add to your iOS home screen using Safari.

What this repo includes
- index.html, styles.css, app.js — a lightweight playable prototype that maps syllabus topics to "maps".
- manifest.json & service-worker.js — make the site behave like a downloadable app (PWA).
- Simple progression: complete Map 1 to unlock Map 2, earn XP, level up roster members.

Play & Install on iOS (Safari)
1. Host these files on any static site (GitHub Pages, Netlify, local static server).
2. Open the site in Safari on iOS.
3. Tap the Share button → Add to Home Screen.
4. The app icon will appear on your home screen and launch in standalone mode.

Notes about iOS support
- iOS supports PWAs via "Add to Home Screen". There are some platform-specific differences (no custom install prompt, splash screens require specific meta tags and icon names).
- The included service worker enables offline caching for core assets — good for studying on the go.

Extending the game
- Add more questions & mini-games (timed diagnosis, primary-source analysis, drag-and-drop cause-effect timelines).
- Add persistent account sync (requires backend + auth).
- Add richer graphics / animations, audio, and social features (leaderboards).
```
