# ⚔️ ARC SLASH — Retro ARPG Web Game

> **Arc Slash** adalah game Web-based Action RPG (ARPG) retro 16-bit bertema *Dark Fantasy Dungeon Crawler* yang dibuat menggunakan **Vanilla HTML5 Canvas & JavaScript murni** (tanpa external library/bundler). Game ini ringan, responsif, dan siap langsung dimainkan di desktop maupun smartphone!

🎮 **Live Demo GitHub Pages**: [https://arch-slash-arpg.netlify.app/)

---

## 🌟 Fitur Utama

- **3 Karakter Unik (Class Role)**:
  - 🛡️ **Knight**: Tank jarak dekat, pertahanan tinggi, tebasan pedang area, dan kemampuan block perisai.
  - 🔮 **Mage**: Ahli sihir jarak jauh, mana shield pelindung, bola api mistik, dan ledakan mantra arcana.
  - 🗡️ **Assassin**: Penyerang lincah berkecepatan tinggi, dagger ganda, racun mematikan, dan serangan kritikal.
- **50 Stage & Biome Beragam**:
  - Slime Dungeon, Crypt / Makam Kuno, Cavern Lava, hingga Deep Dark Biome dengan bos tangguh (Warden & Alter Ego).
- **Sistem Boss & Mekanik Pertarungan**:
  - Indikator zona bahaya (*telegraph hazard zones*), serangan bertahap, perisai bos, dan fase murka (*enrage*).
- **Toko & Sistem Equipment**:
  - Puluhan senjata, armor, helm, perisai, dan sepatu dari Tier 1 hingga Tier 5 (Divine/Abyssal).
- **Event Room & Roulette**:
  - Ruang misteri antar stage dengan undian roulette keberuntungan untuk mendapatkan gold, buff, atau perlengkapan legendaris.
- **18 Pencapaian (Achievements)**:
  - Sistem medali dengan penyimpanan otomatis di browser (`localStorage`).
- **Audio Prosedural Retro**:
  - Sound effect 16-bit arcade yang digenerate langsung oleh browser via **Web Audio API** (tanpa perlu file mp3 eksternal).
- **Dukungan Penuh Layar Sentuh HP (Mobile Responsive)**:
  - Dilengkapi virtual D-Pad retro dan tombol aksi dinamis adaptif sesuai role karakter.

---

## 🕹️ Panduan Kontrol

### 💻 Desktop (Keyboard)

| Tombol | Aksi |
| :--- | :--- |
| `W` `A` `S` `D` atau Tombol Panah | Bergerak ke Atas, Kiri, Bawah, Kanan |
| `J` atau `Spasi` | Serangan Utama (Attack) |
| `1`, `2`, `3` | Mengaktifkan Skill 1, 2, atau 3 |
| `B` | Buka / Tutup Toko Perlengkapan (Shop) |
| `A` | Buka Menu Pencapaian (Achievements) |
| `R` | Restart Permainan saat Game Over |
| `M` | Mode simulasi kontrol HP (Mobile UI Test) |

### 📱 Smartphone / Layar Sentuh

- **Virtual D-Pad (Kiri)**: Geser / sentuh arah untuk bergerak.
- **Tombol Aksi Utama (Kanan)**: Menyesuaikan class (Slash / Cast / Stab) & interaksi kontekstual (Start / Next / Spin / Retry).
- **Tombol Skill (1, 2, 3)**: Disertai indikator durasi cooldown.
- **Bar Utilitas (Atas)**: Tombol Fullscreen, Toko, Pause, dan Bisu Suara (SFX Mute).

---

## 📁 Struktur Direktori

```text
ARC-SLASH-ARPG/
├── css/
│   └── style.css            # Desain UI retro, tata letak mobile deck & canvas
├── js/
│   ├── achievements.js      # Sistem achievement & local storage persistence
│   ├── audio.js             # Engine sintesis suara retro Web Audio API
│   ├── combat.js            # Sistem damage, hitbox, formula armor & AI boss
│   ├── dialogue.js          # Sistem narasi interaktif & percakapan NPC
│   ├── equipment.js         # Registry item, equipment tiering & stat modifier
│   ├── event-room.js        # Logika mini-game roulette & event room
│   ├── input.js             # Handler keyboard & kontrol virtual touch mobile
│   ├── main.js              # Game loop utama & state machine
│   ├── mobs.js              # Spawning & konfigurasi musuh tiap biome
│   ├── particles.js         # Efek partikel pixel, serpihan & darah
│   ├── player.js            # Data pemain & penyesuaian role
│   ├── shop.js              # Sistem belanja & jual equipment
│   ├── skills.js            # Mekanika skill aktif dan cooldown tiap role
│   ├── stages.js            # Konfigurasi stage 1 - 50 & layout dungeon
│   └── draw/
│       ├── dungeon.js       # Render lantai, dinding & gerbang dungeon
│       ├── effects.js       # Render efek visual proyektil & ledakan
│       ├── hud.js           # Render bar HP/Shield/Mana & UI canvas
│       ├── mobs-render.js   # Render sprite pixel-art monster & boss
│       └── player-render.js # Render sprite karakter (Knight, Mage, Assassin)
├── tests/                   # Automated test suite (Node.js)
│   ├── test_boss_equipment_balance.js
│   ├── test_game_systems.js
│   ├── test_main_menu_and_achievements.js
│   └── test_mobile_controls.cjs
├── DESIGN.md                # Dokumentasi panduan gaya visual & palet warna
├── index.html               # File utama game (Entry point)
├── LICENSE                  # Lisensi Open Source (GPL-3.0)
└── README.md                # Dokumentasi proyek
```

---

## 🚀 Cara Menjalankan Secara Lokal

Karena game ini dibuat tanpa framework atau build step yang rumit, kamu bisa langsung menjalankannya:

1. **Buka Langsung di Browser**:
   - Cukup klik dua kali file [index.html](index.html) atau drag ke Google Chrome / Firefox / Safari.

2. **Menggunakan Local Server (Disarankan)**:
   ```bash
   # Menggunakan Python
   python -m http.server 8000

   # Atau menggunakan Node.js npx serve
   npx serve .
   ```
   Buka browser di `http://localhost:8000`.

3. **Menjalankan Automated Test**:
   ```bash
   node tests/test_game_systems.js
   node tests/test_boss_equipment_balance.js
   node tests/test_main_menu_and_achievements.js
   node tests/test_mobile_controls.cjs
   ```

---

## 🌐 Cara Hosting di GitHub Pages

File proyek sudah dirapikan dengan `index.html` berada tepat di root repository. Ikuti langkah mudah ini untuk mengaktifkan hosting:

1. Pastikan perubahan sudah di-commit dan di-push ke GitHub:
   ```bash
   git add .
   git commit -m "Tidy up project structure for GitHub Pages hosting"
   git push origin main
   ```
2. Buka repository kamu di browser: `https://github.com/Zeeynrs/ARC-SLASH-ARPG`
3. Klik tab **Settings** (Pengaturan) di bagian atas.
4. Pada menu samping kiri, klik **Pages**.
5. Di bagian **Build and deployment** > **Branch**:
   - Pilih branch: **`main`**
   - Pilih folder: **`/(root)`**
6. Klik **Save**.
7. Tunggu sekitar 1-2 menit hingga proses deploy selesai. Game kamu akan langsung aktif dan bisa dimainkan di URL:
   👉 **`https://zeeynrs.github.io/ARC-SLASH-ARPG/`**

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah [GNU General Public License v3.0](LICENSE).
