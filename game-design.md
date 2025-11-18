```markdown
# MedTime — Game Design (brief)

Goal
Turn "Edexcel: Medicine Through Time" into a progressive, narrative-driven mobile web game so learners "level up" while covering syllabus topics.

Core concepts
- Maps = syllabus units (Ancient, Medieval, Renaissance, Industrial, Modern).
- Characters = playable historical learner avatars (Physician, Barber-Surgeon, Apothecary...). Each has simple stats (Diagnosis, Hands-on, Knowledge).
- Storylines = era-specific quest hooks that introduce core facts through context: e.g., "A mysterious fever in the Roman baths" that leads you to learn Galenic theory.
- Challenges = short, interactive tasks tied to exam skills:
  - Multiple-choice quizzes (knowledge recall)
  - Source evaluation mini-challenges (identify bias, provenance)
  - Timeline puzzles (put events in order)
  - Diagnosis puzzles (select likely cause given symptoms)
- Progression = XP, player level, and roster levels. Completing maps grants XP and unlocks the next map.
- Maps unlocking rule = map N+1 becomes available only after map N is completed (first-run completion).

Example structure mapped to Edexcel units
- Map 1: Ancient & Classical — Humours, Hippocrates, Galen
- Map 2: Medieval — Islamic medicine, Black Death, monasteries
- Map 3: Renaissance — Vesalius, Harvey, advances in anatomy
- Map 4: Industrial — Sanitation, Snow, Nightingale, public health
- Map 5: Modern — Germ theory, antibiotics, 20th/21st-century tech

Monetization & retention ideas (optional)
- Cosmetic skins for roster characters.
- Daily challenge with small XP.
- In-class multiplayer quizzes for revision sessions.

Accessibility & pedagogy
- Short sessions (3–6 min) per map to fit revision slots.
- Each challenge shows a short explanation of the correct answer to reinforce learning.
- Save state locally; optionally add cloud sync for real student accounts.

Technical notes for iOS "download via Safari"
- Provide manifest.json and apple-touch-icon for Add to Home Screen experience.
- Use service worker to cache core assets so app can run offline.
- Use localStorage or IndexedDB for saves; consider encryption or server sync for multi-device.
```
