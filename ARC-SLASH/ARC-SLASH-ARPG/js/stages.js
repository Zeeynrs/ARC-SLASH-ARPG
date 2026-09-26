// --- STAGE CONFIGURATIONS WITH LABYRINTH MAPS (STAGES 1 TO 21) ---
const STAGE_CONFIGS = [
    // Stage 1
    {
        name: 'CAVE LABYRINTH', subName: 'Stage 1',
        mobs: [
            { x: 340, y: 110, hp: 50, speed: 0.9, color: '#2ecc71', type: 'normal' },
            { x: 420, y: 220, hp: 50, speed: 0.85, color: '#2ecc71', type: 'normal' },
            { x: 260, y: 290, hp: 50, speed: 0.95, color: '#2ecc71', type: 'normal' }
        ],
        loots: [{ x: 220, y: 130, type: 'health' }, { x: 260, y: 270, type: 'shield' }],
        torches: [
            { x: 100, y: 64 }, { x: 280, y: 64 }, { x: 500, y: 64 },
            { x: 18, y: 200 }, { x: 622, y: 200 }, { x: 180, y: 374 }, { x: 440, y: 374 }
        ],
        walls: [
            { x: 140, y: 66, w: 20, h: 120 }, { x: 140, y: 230, w: 20, h: 140 },
            { x: 260, y: 130, w: 120, h: 24 }, { x: 260, y: 240, w: 120, h: 24 },
            { x: 460, y: 66, w: 20, h: 110 }, { x: 460, y: 230, w: 20, h: 140 }
        ]
    },
    // Stage 2
    {
        name: 'DEEP CAVERN MAZE', subName: 'Stage 2',
        mobs: [
            { x: 300, y: 100, hp: 65, speed: 1.0, color: '#3498db', type: 'normal' },
            { x: 480, y: 110, hp: 65, speed: 0.95, color: '#3498db', type: 'normal' },
            { x: 380, y: 240, hp: 80, speed: 1.1, color: '#2ecc71', type: 'toxic' },
            { x: 510, y: 290, hp: 80, speed: 1.1, color: '#2ecc71', type: 'toxic' },
            { x: 240, y: 310, hp: 65, speed: 0.9, color: '#3498db', type: 'normal' }
        ],
        loots: [{ x: 200, y: 90, type: 'health' }, { x: 420, y: 200, type: 'shield' }],
        torches: [
            { x: 80, y: 64 }, { x: 260, y: 64 }, { x: 440, y: 64 },
            { x: 18, y: 180 }, { x: 622, y: 260 }, { x: 180, y: 374 }, { x: 520, y: 374 }
        ],
        walls: [
            { x: 120, y: 66, w: 20, h: 200 }, { x: 220, y: 140, w: 140, h: 24 },
            { x: 220, y: 240, w: 20, h: 130 }, { x: 340, y: 66, w: 20, h: 110 },
            { x: 440, y: 140, w: 20, h: 130 }, { x: 440, y: 270, w: 100, h: 24 }
        ]
    },
    // Stage 3
    {
        name: 'DARK ROCK TUNNELS', subName: 'Stage 3',
        mobs: [
            { x: 280, y: 100, hp: 70, speed: 1.0, color: '#9b59b6', type: 'normal' },
            { x: 420, y: 100, hp: 70, speed: 1.0, color: '#9b59b6', type: 'normal' },
            { x: 520, y: 220, hp: 70, speed: 1.15, color: '#3498db', type: 'speed' },
            { x: 340, y: 280, hp: 70, speed: 1.15, color: '#3498db', type: 'speed' },
            { x: 200, y: 300, hp: 75, speed: 0.95, color: '#9b59b6', type: 'normal' }
        ],
        loots: [{ x: 180, y: 120, type: 'health' }, { x: 360, y: 200, type: 'shield' }],
        torches: [{ x: 100, y: 64 }, { x: 300, y: 64 }, { x: 500, y: 64 }, { x: 18, y: 220 }, { x: 622, y: 220 }],
        walls: [
            { x: 160, y: 66, w: 24, h: 150 }, { x: 160, y: 270, w: 24, h: 100 },
            { x: 300, y: 140, w: 140, h: 24 }, { x: 480, y: 66, w: 24, h: 200 }
        ]
    },
    // Stage 4
    {
        name: 'CRYSTAL LABYRINTH', subName: 'Stage 4',
        mobs: [
            { x: 240, y: 90, hp: 80, speed: 1.05, color: '#2ecc71', type: 'toxic' },
            { x: 380, y: 90, hp: 80, speed: 1.05, color: '#2ecc71', type: 'toxic' },
            { x: 480, y: 180, hp: 75, speed: 1.2, color: '#3498db', type: 'speed' },
            { x: 320, y: 220, hp: 75, speed: 1.2, color: '#3498db', type: 'speed' },
            { x: 460, y: 300, hp: 80, speed: 1.05, color: '#2ecc71', type: 'toxic' },
            { x: 220, y: 320, hp: 75, speed: 1.2, color: '#3498db', type: 'speed' }
        ],
        loots: [{ x: 160, y: 100, type: 'health' }, { x: 400, y: 280, type: 'shield' }],
        torches: [{ x: 120, y: 64 }, { x: 320, y: 64 }, { x: 520, y: 64 }, { x: 18, y: 180 }, { x: 622, y: 240 }],
        walls: [
            { x: 130, y: 66, w: 24, h: 120 }, { x: 130, y: 220, w: 120, h: 24 },
            { x: 310, y: 120, w: 24, h: 140 }, { x: 430, y: 200, w: 120, h: 24 }
        ]
    },
    // Stage 5
    {
        name: "SLIME CAPTAIN'S HALL", subName: 'Stage 5 (MINI-BOSS)',
        mobs: [
            { x: 450, y: 200, hp: 180, speed: 0.85, color: '#8e44ad', type: 'normal', w: 32, h: 32 },
            { x: 300, y: 100, hp: 85, speed: 1.0, color: '#3498db', type: 'speed' },
            { x: 380, y: 120, hp: 85, speed: 1.0, color: '#3498db', type: 'speed' },
            { x: 300, y: 280, hp: 85, speed: 1.1, color: '#2ecc71', type: 'toxic' },
            { x: 380, y: 300, hp: 85, speed: 1.1, color: '#2ecc71', type: 'toxic' }
        ],
        loots: [{ x: 180, y: 120, type: 'health' }, { x: 260, y: 200, type: 'shield' }, { x: 180, y: 280, type: 'health' }],
        torches: [{ x: 100, y: 64 }, { x: 320, y: 64 }, { x: 540, y: 64 }, { x: 18, y: 160 }, { x: 18, y: 280 }, { x: 622, y: 160 }, { x: 622, y: 280 }],
        walls: [
            { x: 200, y: 120, w: 32, h: 60 }, { x: 200, y: 250, w: 32, h: 60 },
            { x: 400, y: 120, w: 32, h: 60 }, { x: 400, y: 250, w: 32, h: 60 }
        ]
    },
    // Stage 6
    {
        name: 'CORRIDORS OF DOOM', subName: 'Stage 6',
        mobs: [
            { x: 260, y: 90, hp: 90, speed: 1.1, color: '#2ecc71', type: 'toxic' },
            { x: 360, y: 90, hp: 90, speed: 1.1, color: '#2ecc71', type: 'toxic' },
            { x: 460, y: 90, hp: 90, speed: 1.25, color: '#3498db', type: 'speed' },
            { x: 260, y: 280, hp: 90, speed: 1.25, color: '#3498db', type: 'speed' },
            { x: 360, y: 280, hp: 90, speed: 1.1, color: '#2ecc71', type: 'toxic' },
            { x: 460, y: 280, hp: 90, speed: 1.1, color: '#2ecc71', type: 'toxic' },
            { x: 520, y: 180, hp: 95, speed: 1.0, color: '#9b59b6', type: 'normal' }
        ],
        loots: [{ x: 180, y: 100, type: 'health' }, { x: 380, y: 190, type: 'shield' }],
        torches: [{ x: 80, y: 64 }, { x: 280, y: 64 }, { x: 480, y: 64 }, { x: 18, y: 200 }, { x: 622, y: 200 }],
        walls: [
            { x: 140, y: 66, w: 20, h: 180 }, { x: 240, y: 140, w: 140, h: 24 },
            { x: 240, y: 240, w: 20, h: 130 }, { x: 440, y: 66, w: 20, h: 180 }
        ]
    },
    // Stage 7
    {
        name: 'TOXIC SLIME PIT', subName: 'Stage 7',
        mobs: [
            { x: 240, y: 90, hp: 100, speed: 1.15, color: '#2ecc71', type: 'toxic' },
            { x: 340, y: 90, hp: 100, speed: 1.15, color: '#2ecc71', type: 'toxic' },
            { x: 440, y: 90, hp: 100, speed: 1.15, color: '#2ecc71', type: 'toxic' },
            { x: 240, y: 290, hp: 100, speed: 1.15, color: '#2ecc71', type: 'toxic' },
            { x: 340, y: 290, hp: 100, speed: 1.15, color: '#2ecc71', type: 'toxic' },
            { x: 440, y: 290, hp: 100, speed: 1.0, color: '#9b59b6', type: 'normal' },
            { x: 510, y: 180, hp: 100, speed: 1.0, color: '#9b59b6', type: 'normal' },
            { x: 300, y: 190, hp: 105, speed: 1.25, color: '#3498db', type: 'speed' }
        ],
        loots: [{ x: 180, y: 190, type: 'health' }, { x: 380, y: 190, type: 'shield' }],
        torches: [{ x: 100, y: 64 }, { x: 320, y: 64 }, { x: 540, y: 64 }, { x: 18, y: 180 }, { x: 622, y: 240 }],
        walls: [
            { x: 160, y: 66, w: 24, h: 110 }, { x: 160, y: 230, w: 24, h: 140 },
            { x: 320, y: 120, w: 120, h: 24 }, { x: 320, y: 240, w: 120, h: 24 }
        ]
    },
    // Stage 8
    {
        name: 'MAGMA CAVERN', subName: 'Stage 8',
        mobs: [
            { x: 260, y: 90, hp: 115, speed: 1.05, color: '#9b59b6', type: 'normal' },
            { x: 360, y: 90, hp: 115, speed: 1.05, color: '#9b59b6', type: 'normal' },
            { x: 460, y: 90, hp: 115, speed: 1.05, color: '#9b59b6', type: 'normal' },
            { x: 260, y: 290, hp: 115, speed: 1.05, color: '#2ecc71', type: 'toxic' },
            { x: 360, y: 290, hp: 115, speed: 1.3, color: '#3498db', type: 'speed' },
            { x: 460, y: 290, hp: 115, speed: 1.3, color: '#3498db', type: 'speed' },
            { x: 520, y: 180, hp: 120, speed: 1.3, color: '#3498db', type: 'speed' },
            { x: 380, y: 190, hp: 120, speed: 1.3, color: '#3498db', type: 'speed' }
        ],
        loots: [{ x: 180, y: 100, type: 'health' }, { x: 200, y: 280, type: 'shield' }],
        torches: [{ x: 80, y: 64 }, { x: 280, y: 64 }, { x: 480, y: 64 }, { x: 18, y: 160 }, { x: 622, y: 260 }],
        walls: [
            { x: 130, y: 66, w: 24, h: 200 }, { x: 240, y: 140, w: 140, h: 24 },
            { x: 440, y: 140, w: 24, h: 140 }, { x: 240, y: 270, w: 120, h: 24 }
        ]
    },
    // Stage 9
    {
        name: 'ROYAL GUARD GATEWAY', subName: 'Stage 9',
        mobs: [
            { x: 400, y: 140, hp: 210, speed: 0.9, color: '#8e44ad', type: 'normal', w: 32, h: 32 },
            { x: 400, y: 240, hp: 210, speed: 0.9, color: '#8e44ad', type: 'normal', w: 32, h: 32 },
            { x: 260, y: 90, hp: 110, speed: 1.1, color: '#3498db', type: 'speed' },
            { x: 320, y: 90, hp: 110, speed: 1.1, color: '#3498db', type: 'speed' },
            { x: 260, y: 290, hp: 110, speed: 1.15, color: '#2ecc71', type: 'toxic' },
            { x: 320, y: 290, hp: 110, speed: 1.15, color: '#2ecc71', type: 'toxic' },
            { x: 480, y: 90, hp: 110, speed: 1.1, color: '#3498db', type: 'speed' },
            { x: 480, y: 290, hp: 110, speed: 1.15, color: '#2ecc71', type: 'toxic' }
        ],
        loots: [{ x: 180, y: 100, type: 'health' }, { x: 180, y: 280, type: 'shield' }, { x: 300, y: 190, type: 'health' }],
        torches: [{ x: 100, y: 64 }, { x: 320, y: 64 }, { x: 540, y: 64 }, { x: 18, y: 140 }, { x: 18, y: 260 }, { x: 622, y: 140 }, { x: 622, y: 260 }],
        walls: [
            { x: 180, y: 120, w: 32, h: 60 }, { x: 180, y: 250, w: 32, h: 60 },
            { x: 360, y: 66, w: 24, h: 100 }, { x: 360, y: 260, w: 24, h: 110 }
        ]
    },
    // Stage 10 - SLIME KING BOSS STAGE
    {
        name: "SLIME KING'S THRONE ROOM", subName: 'Stage 10 (SLIME KING BOSS)',
        mobs: [
            { x: 460, y: 180, hp: 540, speed: 0.8, color: '#9b59b6', type: 'boss', species: 'slime', w: 54, h: 54 },
            { x: 340, y: 90, hp: 95, speed: 1.1, color: '#3498db', type: 'speed', species: 'slime' },
            { x: 340, y: 290, hp: 95, speed: 1.1, color: '#3498db', type: 'speed', species: 'slime' },
            { x: 260, y: 120, hp: 100, speed: 1.05, color: '#2ecc71', type: 'toxic', species: 'slime' },
            { x: 260, y: 260, hp: 100, speed: 1.05, color: '#2ecc71', type: 'toxic', species: 'slime' }
        ],
        loots: [
            { x: 180, y: 100, type: 'health' }, { x: 180, y: 280, type: 'health' },
            { x: 260, y: 190, type: 'shield' }, { x: 380, y: 190, type: 'shield' }
        ],
        torches: [
            { x: 100, y: 64 }, { x: 320, y: 64 }, { x: 540, y: 64 },
            { x: 18, y: 140 }, { x: 18, y: 260 }, { x: 622, y: 140 }, { x: 622, y: 260 },
            { x: 200, y: 374 }, { x: 440, y: 374 }
        ],
        walls: [
            { x: 200, y: 120, w: 32, h: 60 }, { x: 200, y: 250, w: 32, h: 60 },
            { x: 400, y: 120, w: 32, h: 60 }, { x: 400, y: 250, w: 32, h: 60 }
        ]
    },
    // Stage 11 - ANCIENT GRAVEYARD VAULT
    {
        name: 'GRAVEYARD VAULT', subName: 'Stage 11',
        mobs: [
            { x: 280, y: 100, hp: 120, speed: 0.8, species: 'zombie' },
            { x: 440, y: 100, hp: 120, speed: 0.8, species: 'zombie' },
            { x: 320, y: 280, hp: 100, speed: 1.15, species: 'skeleton' },
            { x: 480, y: 280, hp: 100, speed: 1.15, species: 'skeleton' },
            { x: 200, y: 190, hp: 110, speed: 1.05, color: '#2ecc71', species: 'slime' }
        ],
        loots: [{ x: 180, y: 120, type: 'health' }, { x: 360, y: 200, type: 'shield' }],
        torches: [{ x: 100, y: 64 }, { x: 300, y: 64 }, { x: 500, y: 64 }, { x: 18, y: 200 }, { x: 622, y: 200 }],
        walls: [
            { x: 160, y: 66, w: 24, h: 140 }, { x: 160, y: 250, w: 24, h: 120 },
            { x: 340, y: 140, w: 120, h: 24 }, { x: 480, y: 66, w: 24, h: 200 }
        ]
    },
    // Stage 12 - BONE CRYPT CORRIDOR
    {
        name: 'BONE CRYPT CORRIDOR', subName: 'Stage 12',
        mobs: [
            { x: 260, y: 90, hp: 110, speed: 1.2, species: 'skeleton' },
            { x: 360, y: 90, hp: 110, speed: 1.2, species: 'skeleton' },
            { x: 460, y: 90, hp: 110, speed: 1.2, species: 'skeleton' },
            { x: 260, y: 290, hp: 110, speed: 1.2, species: 'skeleton' },
            { x: 460, y: 290, hp: 115, speed: 1.25, color: '#3498db', species: 'slime' }
        ],
        loots: [{ x: 200, y: 100, type: 'health' }, { x: 400, y: 200, type: 'shield' }],
        torches: [{ x: 80, y: 64 }, { x: 280, y: 64 }, { x: 480, y: 64 }, { x: 18, y: 180 }, { x: 622, y: 240 }],
        walls: [
            { x: 140, y: 66, w: 20, h: 180 }, { x: 240, y: 140, w: 140, h: 24 },
            { x: 440, y: 140, w: 20, h: 180 }
        ]
    },
    // Stage 13 - ROTTING ZOMBIE PIT
    {
        name: 'ROTTING ZOMBIE PIT', subName: 'Stage 13',
        mobs: [
            { x: 240, y: 90, hp: 140, speed: 0.8, species: 'zombie' },
            { x: 340, y: 90, hp: 140, speed: 0.8, species: 'zombie' },
            { x: 440, y: 90, hp: 140, speed: 0.8, species: 'zombie' },
            { x: 240, y: 290, hp: 140, speed: 0.8, species: 'zombie' },
            { x: 340, y: 290, hp: 140, speed: 0.8, species: 'zombie' },
            { x: 480, y: 190, hp: 120, speed: 1.05, color: '#9b59b6', species: 'slime' }
        ],
        loots: [{ x: 180, y: 190, type: 'health' }, { x: 380, y: 190, type: 'shield' }],
        torches: [{ x: 100, y: 64 }, { x: 320, y: 64 }, { x: 540, y: 64 }, { x: 18, y: 180 }, { x: 622, y: 240 }],
        walls: [
            { x: 160, y: 66, w: 24, h: 110 }, { x: 160, y: 230, w: 24, h: 140 },
            { x: 320, y: 120, w: 120, h: 24 }, { x: 320, y: 240, w: 120, h: 24 }
        ]
    },
    // Stage 14 - NECROPOLIS MAZE
    {
        name: 'NECROPOLIS MAZE', subName: 'Stage 14',
        mobs: [
            { x: 260, y: 90, hp: 130, speed: 0.82, species: 'zombie' },
            { x: 360, y: 90, hp: 130, speed: 0.82, species: 'zombie' },
            { x: 460, y: 90, hp: 120, speed: 1.2, species: 'skeleton' },
            { x: 260, y: 280, hp: 120, speed: 1.2, species: 'skeleton' },
            { x: 360, y: 280, hp: 130, speed: 0.82, species: 'zombie' },
            { x: 460, y: 280, hp: 120, speed: 1.2, species: 'skeleton' }
        ],
        loots: [{ x: 180, y: 100, type: 'health' }, { x: 380, y: 280, type: 'shield' }],
        torches: [{ x: 80, y: 64 }, { x: 280, y: 64 }, { x: 480, y: 64 }, { x: 18, y: 160 }, { x: 622, y: 260 }],
        walls: [
            { x: 130, y: 66, w: 24, h: 200 }, { x: 240, y: 140, w: 140, h: 24 },
            { x: 440, y: 140, w: 24, h: 140 }
        ]
    },
    // Stage 15 - ZOMBIE WARLORD'S TOMB (MINI-BOSS)
    {
        name: "ZOMBIE WARLORD'S TOMB", subName: 'Stage 15 (MINI-BOSS)',
        mobs: [
            { x: 450, y: 190, hp: 405, speed: 0.78, species: 'zombie', type: 'boss', w: 38, h: 42 },
            { x: 300, y: 100, hp: 125, speed: 1.2, species: 'skeleton' },
            { x: 380, y: 120, hp: 125, speed: 1.2, species: 'skeleton' },
            { x: 300, y: 280, hp: 130, speed: 0.85, species: 'zombie' },
            { x: 380, y: 300, hp: 130, speed: 0.85, species: 'zombie' }
        ],
        loots: [{ x: 180, y: 120, type: 'health' }, { x: 260, y: 200, type: 'shield' }, { x: 180, y: 280, type: 'health' }],
        torches: [{ x: 100, y: 64 }, { x: 320, y: 64 }, { x: 540, y: 64 }, { x: 18, y: 160 }, { x: 18, y: 280 }, { x: 622, y: 160 }, { x: 622, y: 280 }],
        walls: [
            { x: 200, y: 120, w: 32, h: 60 }, { x: 200, y: 250, w: 32, h: 60 },
            { x: 400, y: 120, w: 32, h: 60 }, { x: 400, y: 250, w: 32, h: 60 }
        ]
    },
    // Stage 16 - SKULL CAVERN
    {
        name: 'SKULL CAVERN', subName: 'Stage 16',
        mobs: [
            { x: 240, y: 90, hp: 135, speed: 1.25, species: 'skeleton' },
            { x: 340, y: 90, hp: 135, speed: 1.25, species: 'skeleton' },
            { x: 440, y: 90, hp: 135, speed: 1.25, species: 'skeleton' },
            { x: 240, y: 290, hp: 135, speed: 1.25, species: 'skeleton' },
            { x: 340, y: 290, hp: 135, speed: 1.25, species: 'skeleton' },
            { x: 480, y: 190, hp: 140, speed: 1.1, color: '#9b59b6', species: 'slime' }
        ],
        loots: [{ x: 180, y: 100, type: 'health' }, { x: 380, y: 190, type: 'shield' }],
        torches: [{ x: 80, y: 64 }, { x: 280, y: 64 }, { x: 480, y: 64 }, { x: 18, y: 200 }, { x: 622, y: 200 }],
        walls: [
            { x: 140, y: 66, w: 20, h: 180 }, { x: 240, y: 140, w: 140, h: 24 },
            { x: 440, y: 66, w: 20, h: 180 }
        ]
    },
    // Stage 17 - UNDEAD HORDE HALL
    {
        name: 'UNDEAD HORDE HALL', subName: 'Stage 17',
        mobs: [
            { x: 240, y: 90, hp: 150, speed: 0.85, species: 'zombie' },
            { x: 340, y: 90, hp: 140, speed: 1.25, species: 'skeleton' },
            { x: 440, y: 90, hp: 150, speed: 0.85, species: 'zombie' },
            { x: 240, y: 290, hp: 140, speed: 1.25, species: 'skeleton' },
            { x: 340, y: 290, hp: 150, speed: 0.85, species: 'zombie' },
            { x: 440, y: 290, hp: 140, speed: 1.25, species: 'skeleton' },
            { x: 520, y: 190, hp: 150, speed: 0.85, species: 'zombie' }
        ],
        loots: [{ x: 180, y: 190, type: 'health' }, { x: 380, y: 190, type: 'shield' }],
        torches: [{ x: 100, y: 64 }, { x: 320, y: 64 }, { x: 540, y: 64 }, { x: 18, y: 180 }, { x: 622, y: 240 }],
        walls: [
            { x: 160, y: 66, w: 24, h: 110 }, { x: 160, y: 230, w: 24, h: 140 },
            { x: 320, y: 120, w: 120, h: 24 }, { x: 320, y: 240, w: 120, h: 24 }
        ]
    },
    // Stage 18 - LICH ANTECHAMBER
    {
        name: 'LICH ANTECHAMBER', subName: 'Stage 18',
        mobs: [
            { x: 440, y: 190, hp: 288, speed: 1.15, species: 'skeleton', type: 'boss', w: 34, h: 36 },
            { x: 260, y: 90, hp: 155, speed: 0.88, species: 'zombie' },
            { x: 340, y: 90, hp: 155, speed: 0.88, species: 'zombie' },
            { x: 260, y: 290, hp: 145, speed: 1.3, color: '#3498db', species: 'slime' },
            { x: 340, y: 290, hp: 145, speed: 1.3, color: '#3498db', species: 'slime' }
        ],
        loots: [{ x: 180, y: 100, type: 'health' }, { x: 200, y: 280, type: 'shield' }],
        torches: [{ x: 80, y: 64 }, { x: 280, y: 64 }, { x: 480, y: 64 }, { x: 18, y: 160 }, { x: 622, y: 260 }],
        walls: [
            { x: 130, y: 66, w: 24, h: 200 }, { x: 240, y: 140, w: 140, h: 24 },
            { x: 440, y: 140, w: 24, h: 140 }
        ]
    },
    // Stage 19 - GATE OF DECAY
    {
        name: 'GATE OF DECAY', subName: 'Stage 19',
        mobs: [
            { x: 260, y: 90, hp: 160, speed: 0.9, species: 'zombie' },
            { x: 340, y: 90, hp: 150, speed: 1.3, species: 'skeleton' },
            { x: 440, y: 90, hp: 160, speed: 0.9, species: 'zombie' },
            { x: 260, y: 290, hp: 150, speed: 1.3, species: 'skeleton' },
            { x: 340, y: 290, hp: 160, speed: 0.9, species: 'zombie' },
            { x: 440, y: 290, hp: 150, speed: 1.3, species: 'skeleton' },
            { x: 500, y: 190, hp: 160, speed: 1.15, color: '#9b59b6', species: 'slime' }
        ],
        loots: [{ x: 180, y: 100, type: 'health' }, { x: 180, y: 280, type: 'shield' }, { x: 300, y: 190, type: 'health' }],
        torches: [{ x: 100, y: 64 }, { x: 320, y: 64 }, { x: 540, y: 64 }, { x: 18, y: 140 }, { x: 18, y: 260 }, { x: 622, y: 140 }, { x: 622, y: 260 }],
        walls: [
            { x: 180, y: 120, w: 32, h: 60 }, { x: 180, y: 250, w: 32, h: 60 },
            { x: 360, y: 66, w: 24, h: 100 }, { x: 360, y: 260, w: 24, h: 110 }
        ]
    },
    // Stage 20 - SKELETON KING BOSS STAGE
    {
        name: "SKELETON KING'S CATACOMB", subName: 'Stage 20 (SKELETON KING BOSS)',
        mobs: [
            { x: 460, y: 180, hp: 720, speed: 0.85, species: 'skeleton', type: 'boss', w: 56, h: 56 },
            { x: 340, y: 90, hp: 160, speed: 0.88, species: 'zombie' },
            { x: 340, y: 290, hp: 160, speed: 0.88, species: 'zombie' },
            { x: 260, y: 120, hp: 150, speed: 1.25, species: 'skeleton' },
            { x: 260, y: 260, hp: 150, speed: 1.25, species: 'skeleton' }
        ],
        loots: [
            { x: 180, y: 100, type: 'health' }, { x: 180, y: 280, type: 'health' },
            { x: 260, y: 190, type: 'shield' }, { x: 380, y: 190, type: 'shield' }
        ],
        torches: [
            { x: 100, y: 64 }, { x: 320, y: 64 }, { x: 540, y: 64 },
            { x: 18, y: 140 }, { x: 18, y: 260 }, { x: 622, y: 140 }, { x: 622, y: 260 },
            { x: 200, y: 374 }, { x: 440, y: 374 }
        ],
        walls: [
            { x: 200, y: 120, w: 32, h: 60 }, { x: 200, y: 250, w: 32, h: 60 },
            { x: 400, y: 120, w: 32, h: 60 }, { x: 400, y: 250, w: 32, h: 60 }
        ]
    },
    // Stage 21 - ANCIENT DRAGON BOSS STAGE
    {
        name: "ANCIENT DRAGON'S LAIR", subName: 'Stage 21 (ANCIENT DRAGON BOSS)',
        mobs: [
            { x: 440, y: 170, hp: 1350, speed: 0.85, species: 'dragon', type: 'boss', w: 72, h: 72 },
            { x: 300, y: 90, hp: 180, speed: 0.85, species: 'zombie' },
            { x: 300, y: 290, hp: 180, speed: 0.85, species: 'zombie' },
            { x: 220, y: 120, hp: 160, speed: 1.25, species: 'skeleton' },
            { x: 220, y: 260, hp: 160, speed: 1.25, species: 'skeleton' }
        ],
        loots: [
            { x: 160, y: 100, type: 'health' }, { x: 160, y: 280, type: 'health' },
            { x: 240, y: 190, type: 'shield' }, { x: 360, y: 190, type: 'shield' },
            { x: 480, y: 100, type: 'health' }, { x: 480, y: 280, type: 'shield' }
        ],
        torches: [
            { x: 80, y: 64 }, { x: 280, y: 64 }, { x: 480, y: 64 },
            { x: 18, y: 140 }, { x: 18, y: 260 }, { x: 622, y: 140 }, { x: 622, y: 260 },
            { x: 180, y: 374 }, { x: 460, y: 374 }
        ],
        walls: [
            { x: 180, y: 110, w: 36, h: 64 }, { x: 180, y: 250, w: 36, h: 64 },
            { x: 380, y: 110, w: 36, h: 64 }, { x: 380, y: 250, w: 36, h: 64 }
        ]
    },
    // Stage 22 - THE SHADOW SANCTUARY (FINAL BOSS: ALTER EGO SHOWDOWN)
    {
        name: "SANCTUARY OF THE ALTER EGO", subName: 'Stage 22 (FINAL CLIMAX: ALTER EGO BATTLE)',
        mobs: [
            { x: 450, y: 175, hp: 8438, speed: 1.15, species: 'alter_ego', type: 'boss', w: 32, h: 32 }
        ],
        loots: [
            { x: 110, y: 100, type: 'health' }, { x: 110, y: 280, type: 'health' },
            { x: 210, y: 190, type: 'shield' }, { x: 390, y: 190, type: 'shield' },
            { x: 510, y: 100, type: 'health' }, { x: 510, y: 280, type: 'shield' }
        ],
        torches: [
            { x: 70, y: 64 }, { x: 230, y: 64 }, { x: 410, y: 64 }, { x: 570, y: 64 },
            { x: 18, y: 190 }, { x: 622, y: 190 },
            { x: 150, y: 374 }, { x: 320, y: 374 }, { x: 490, y: 374 }
        ],
        walls: [
            { x: 150, y: 90, w: 28, h: 64 }, { x: 150, y: 240, w: 28, h: 64 },
            { x: 470, y: 90, w: 28, h: 64 }, { x: 470, y: 240, w: 28, h: 64 }
        ]
    },
    // =========================================================================
    // ===== THE DEEP DARK BIOME & ANCIENT CITY (STAGES 23 TO 50) =====
    // =========================================================================

    // Stage 23 - Deep Dark Outskirts
    {
        name: "DEEP DARK OUTSKIRTS", subName: 'Stage 23 (DESCENT INTO DEEP DARK)',
        mobs: [
            { x: 300, y: 110, hp: 190, speed: 1.15, species: 'sculk_crawler' },
            { x: 420, y: 130, hp: 220, speed: 0.95, species: 'sculk_zombie' },
            { x: 320, y: 270, hp: 190, speed: 1.15, species: 'sculk_crawler' },
            { x: 480, y: 250, hp: 220, speed: 0.95, species: 'sculk_zombie' }
        ],
        loots: [{ x: 220, y: 110, type: 'health' }, { x: 380, y: 200, type: 'shield' }],
        torches: [{ x: 90, y: 64 }, { x: 270, y: 64 }, { x: 450, y: 64 }, { x: 18, y: 200 }, { x: 622, y: 200 }, { x: 200, y: 374 }, { x: 460, y: 374 }],
        walls: [{ x: 160, y: 66, w: 22, h: 120 }, { x: 160, y: 240, w: 22, h: 130 }, { x: 300, y: 160, w: 120, h: 22 }, { x: 460, y: 90, w: 22, h: 180 }]
    },

    // Stage 24 - Sculk Vein Labyrinth
    {
        name: "SCULK VEIN LABYRINTH", subName: 'Stage 24 (RESONATING VEINS)',
        mobs: [
            { x: 260, y: 90, hp: 210, speed: 1.2, species: 'sculk_crawler' },
            { x: 400, y: 100, hp: 200, speed: 1.15, species: 'sculk_spitter' },
            { x: 320, y: 220, hp: 240, speed: 0.95, species: 'sculk_zombie' },
            { x: 460, y: 270, hp: 210, speed: 1.2, species: 'sculk_crawler' },
            { x: 220, y: 290, hp: 240, speed: 0.95, species: 'sculk_zombie' }
        ],
        loots: [{ x: 190, y: 90, type: 'health' }, { x: 410, y: 190, type: 'shield' }],
        torches: [{ x: 100, y: 64 }, { x: 320, y: 64 }, { x: 520, y: 64 }, { x: 18, y: 180 }, { x: 622, y: 220 }, { x: 180, y: 374 }, { x: 460, y: 374 }],
        walls: [{ x: 140, y: 66, w: 22, h: 180 }, { x: 260, y: 150, w: 120, h: 22 }, { x: 260, y: 250, w: 22, h: 120 }, { x: 420, y: 80, w: 22, h: 140 }, { x: 420, y: 270, w: 110, h: 22 }]
    },

    // Stage 25 - Ancient City Gates (Mini-Boss: Sculk Golem)
    {
        name: "ANCIENT CITY GATES", subName: 'Stage 25 (MINI-BOSS: SCULK GOLEM)',
        mobs: [
            { x: 430, y: 175, hp: 1980, speed: 0.88, species: 'sculk_zombie', type: 'boss', w: 44, h: 46, color: '#0891b2' },
            { x: 280, y: 110, hp: 220, speed: 1.2, species: 'sculk_crawler' },
            { x: 280, y: 270, hp: 220, speed: 1.2, species: 'sculk_crawler' }
        ],
        loots: [{ x: 160, y: 100, type: 'health' }, { x: 160, y: 280, type: 'shield' }, { x: 460, y: 190, type: 'health' }],
        torches: [{ x: 80, y: 64 }, { x: 260, y: 64 }, { x: 440, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 180, y: 374 }, { x: 480, y: 374 }],
        walls: [{ x: 180, y: 90, w: 28, h: 70 }, { x: 180, y: 230, w: 28, h: 70 }, { x: 360, y: 90, w: 28, h: 70 }, { x: 360, y: 230, w: 28, h: 70 }]
    },

    // Stage 26 - Echoing Corridors
    {
        name: "ECHOING CORRIDORS", subName: 'Stage 26 (ACOUSTIC SHADOWS)',
        mobs: [
            { x: 290, y: 110, hp: 230, speed: 1.22, species: 'sculk_crawler' },
            { x: 380, y: 120, hp: 250, speed: 1.0, species: 'sculk_zombie' },
            { x: 460, y: 220, hp: 220, speed: 1.18, species: 'sculk_spitter' },
            { x: 320, y: 280, hp: 230, speed: 1.22, species: 'sculk_crawler' },
            { x: 210, y: 290, hp: 250, speed: 1.0, species: 'sculk_zombie' }
        ],
        loots: [{ x: 200, y: 120, type: 'health' }, { x: 440, y: 260, type: 'shield' }],
        torches: [{ x: 110, y: 64 }, { x: 330, y: 64 }, { x: 510, y: 64 }, { x: 18, y: 200 }, { x: 622, y: 200 }],
        walls: [{ x: 150, y: 130, w: 120, h: 22 }, { x: 320, y: 66, w: 22, h: 130 }, { x: 320, y: 240, w: 22, h: 130 }, { x: 460, y: 150, w: 120, h: 22 }]
    },

    // Stage 27 - Sculk Sensor Halls
    {
        name: "SCULK SENSOR HALLS", subName: 'Stage 27 (VIBRATION RUNNERS)',
        mobs: [
            { x: 280, y: 90, hp: 240, speed: 1.25, species: 'sculk_crawler' },
            { x: 420, y: 90, hp: 230, speed: 1.2, species: 'sculk_spitter' },
            { x: 350, y: 190, hp: 270, speed: 1.02, species: 'sculk_zombie' },
            { x: 260, y: 290, hp: 240, speed: 1.25, species: 'sculk_crawler' },
            { x: 450, y: 270, hp: 230, speed: 1.2, species: 'sculk_spitter' }
        ],
        loots: [{ x: 170, y: 100, type: 'shield' }, { x: 370, y: 190, type: 'health' }],
        torches: [{ x: 90, y: 64 }, { x: 290, y: 64 }, { x: 490, y: 64 }, { x: 18, y: 180 }, { x: 622, y: 220 }, { x: 210, y: 374 }, { x: 470, y: 374 }],
        walls: [{ x: 170, y: 66, w: 22, h: 140 }, { x: 170, y: 250, w: 22, h: 120 }, { x: 300, y: 120, w: 140, h: 22 }, { x: 300, y: 240, w: 140, h: 22 }, { x: 480, y: 66, w: 22, h: 200 }]
    },

    // Stage 28 - Deep Dark Catacombs
    {
        name: "DEEP DARK CATACOMBS", subName: 'Stage 28 (ANCIENT GRAVES)',
        mobs: [
            { x: 260, y: 100, hp: 250, speed: 1.25, species: 'sculk_crawler' },
            { x: 400, y: 110, hp: 280, speed: 1.05, species: 'sculk_zombie' },
            { x: 490, y: 200, hp: 250, speed: 1.15, species: 'sculk_phantom' },
            { x: 340, y: 280, hp: 280, speed: 1.05, species: 'sculk_zombie' },
            { x: 220, y: 270, hp: 250, speed: 1.25, species: 'sculk_crawler' }
        ],
        loots: [{ x: 180, y: 110, type: 'health' }, { x: 390, y: 200, type: 'shield' }],
        torches: [{ x: 80, y: 64 }, { x: 320, y: 64 }, { x: 540, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 180, y: 374 }, { x: 460, y: 374 }],
        walls: [{ x: 140, y: 90, w: 30, h: 120 }, { x: 280, y: 66, w: 22, h: 160 }, { x: 280, y: 270, w: 140, h: 22 }, { x: 440, y: 130, w: 30, h: 140 }]
    },

    // Stage 29 - The Shrieking Tunnel
    {
        name: "THE SHRIEKING TUNNEL", subName: 'Stage 29 (RESONANCE TEST)',
        mobs: [
            { x: 270, y: 90, hp: 260, speed: 1.28, species: 'sculk_crawler' },
            { x: 420, y: 110, hp: 260, speed: 1.22, species: 'sculk_spitter' },
            { x: 480, y: 220, hp: 270, speed: 1.2, species: 'sculk_phantom' },
            { x: 320, y: 280, hp: 300, speed: 1.05, species: 'sculk_zombie' },
            { x: 210, y: 250, hp: 260, speed: 1.28, species: 'sculk_crawler' }
        ],
        loots: [{ x: 210, y: 90, type: 'shield' }, { x: 420, y: 270, type: 'health' }],
        torches: [{ x: 100, y: 64 }, { x: 300, y: 64 }, { x: 500, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 220, y: 374 }, { x: 440, y: 374 }],
        walls: [{ x: 160, y: 66, w: 22, h: 120 }, { x: 160, y: 230, w: 22, h: 140 }, { x: 280, y: 150, w: 140, h: 24 }, { x: 460, y: 80, w: 22, h: 150 }]
    },

    // Stage 30 - Shrieker Sanctum (Mini-Boss: Ancient Sculk Titan)
    {
        name: "SHRIEKER SANCTUM", subName: 'Stage 30 (MINI-BOSS: SCULK TITAN)',
        mobs: [
            { x: 440, y: 175, hp: 2880, speed: 0.92, species: 'sculk_zombie', type: 'boss', w: 48, h: 50, color: '#0e7490' },
            { x: 260, y: 110, hp: 270, speed: 1.28, species: 'sculk_crawler' },
            { x: 260, y: 270, hp: 270, speed: 1.28, species: 'sculk_crawler' },
            { x: 360, y: 190, hp: 260, speed: 1.22, species: 'sculk_spitter' }
        ],
        loots: [{ x: 160, y: 100, type: 'health' }, { x: 160, y: 280, type: 'shield' }, { x: 490, y: 190, type: 'shield' }],
        torches: [{ x: 80, y: 64 }, { x: 260, y: 64 }, { x: 440, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 180, y: 374 }, { x: 460, y: 374 }],
        walls: [{ x: 170, y: 90, w: 32, h: 70 }, { x: 170, y: 230, w: 32, h: 70 }, { x: 360, y: 90, w: 32, h: 70 }, { x: 360, y: 230, w: 32, h: 70 }]
    },

    // Stage 31 - Ancient City Promenade
    {
        name: "ANCIENT CITY PROMENADE", subName: 'Stage 31 (RUINED DEEPSLATE HALL)',
        mobs: [
            { x: 280, y: 100, hp: 280, speed: 1.3, species: 'sculk_crawler' },
            { x: 410, y: 110, hp: 290, speed: 1.22, species: 'sculk_phantom' },
            { x: 480, y: 230, hp: 320, speed: 1.05, species: 'sculk_zombie' },
            { x: 330, y: 270, hp: 280, speed: 1.25, species: 'sculk_spitter' },
            { x: 210, y: 280, hp: 280, speed: 1.3, species: 'sculk_crawler' }
        ],
        loots: [{ x: 190, y: 110, type: 'health' }, { x: 410, y: 200, type: 'shield' }],
        torches: [{ x: 90, y: 64 }, { x: 310, y: 64 }, { x: 530, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 190, y: 374 }, { x: 470, y: 374 }],
        walls: [{ x: 140, y: 66, w: 22, h: 150 }, { x: 260, y: 140, w: 130, h: 22 }, { x: 260, y: 260, w: 22, h: 110 }, { x: 430, y: 70, w: 22, h: 160 }, { x: 430, y: 270, w: 100, h: 22 }]
    },

    // Stage 32 - Pillars of Deepslate
    {
        name: "PILLARS OF DEEPSLATE", subName: 'Stage 32 (TITAN COLUMNS)',
        mobs: [
            { x: 270, y: 90, hp: 300, speed: 1.3, species: 'sculk_crawler' },
            { x: 420, y: 100, hp: 330, speed: 1.08, species: 'sculk_zombie' },
            { x: 480, y: 210, hp: 300, speed: 1.24, species: 'sculk_phantom' },
            { x: 340, y: 280, hp: 290, speed: 1.25, species: 'sculk_spitter' },
            { x: 220, y: 260, hp: 300, speed: 1.3, species: 'sculk_crawler' }
        ],
        loots: [{ x: 170, y: 100, type: 'shield' }, { x: 430, y: 270, type: 'health' }],
        torches: [{ x: 100, y: 64 }, { x: 320, y: 64 }, { x: 540, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 170, y: 374 }, { x: 490, y: 374 }],
        walls: [{ x: 170, y: 90, w: 28, h: 64 }, { x: 170, y: 230, w: 28, h: 64 }, { x: 310, y: 90, w: 28, h: 64 }, { x: 310, y: 230, w: 28, h: 64 }, { x: 450, y: 90, w: 28, h: 64 }, { x: 450, y: 230, w: 28, h: 64 }]
    },

    // Stage 33 - Ruined Barracks
    {
        name: "RUINED BARRACKS", subName: 'Stage 33 (SILENT ARSENAL)',
        mobs: [
            { x: 260, y: 100, hp: 310, speed: 1.32, species: 'sculk_crawler' },
            { x: 390, y: 100, hp: 310, speed: 1.25, species: 'sculk_spitter' },
            { x: 480, y: 190, hp: 350, speed: 1.08, species: 'sculk_zombie' },
            { x: 330, y: 270, hp: 310, speed: 1.25, species: 'sculk_phantom' },
            { x: 210, y: 280, hp: 310, speed: 1.32, species: 'sculk_crawler' }
        ],
        loots: [{ x: 180, y: 110, type: 'health' }, { x: 380, y: 190, type: 'shield' }],
        torches: [{ x: 80, y: 64 }, { x: 280, y: 64 }, { x: 480, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 180, y: 374 }, { x: 460, y: 374 }],
        walls: [{ x: 150, y: 110, w: 120, h: 22 }, { x: 290, y: 66, w: 22, h: 140 }, { x: 290, y: 250, w: 22, h: 120 }, { x: 440, y: 130, w: 110, h: 22 }]
    },

    // Stage 34 - Hall of Soul Lanterns (Threshold to the Warden)
    {
        name: "HALL OF SOUL LANTERNS", subName: 'Stage 34 (WARDEN APPROACHING)',
        mobs: [
            { x: 270, y: 90, hp: 320, speed: 1.32, species: 'sculk_crawler' },
            { x: 410, y: 100, hp: 330, speed: 1.28, species: 'sculk_phantom' },
            { x: 480, y: 220, hp: 360, speed: 1.1, species: 'sculk_zombie' },
            { x: 340, y: 280, hp: 320, speed: 1.26, species: 'sculk_spitter' },
            { x: 200, y: 260, hp: 320, speed: 1.32, species: 'sculk_crawler' }
        ],
        loots: [{ x: 170, y: 100, type: 'health' }, { x: 430, y: 200, type: 'shield' }, { x: 490, y: 270, type: 'health' }],
        torches: [{ x: 80, y: 64 }, { x: 220, y: 64 }, { x: 360, y: 64 }, { x: 500, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 150, y: 374 }, { x: 320, y: 374 }, { x: 490, y: 374 }],
        walls: [{ x: 160, y: 80, w: 24, h: 80 }, { x: 160, y: 230, w: 24, h: 80 }, { x: 440, y: 80, w: 24, h: 80 }, { x: 440, y: 230, w: 24, h: 80 }]
    },

    // =========================================================================
    // Stage 35 - ANCIENT CITY SANCTUARY (MAJOR BOSS: THE WARDEN 🔊💀)
    // =========================================================================
    {
        name: "ANCIENT CITY SANCTUARY", subName: 'Stage 35 (APEX BOSS: THE WARDEN 🔊)',
        mobs: [
            { x: 440, y: 165, hp: 19800, speed: 0.95, species: 'warden', type: 'boss', w: 58, h: 64, color: '#06b6d4' },
            { x: 280, y: 90, hp: 340, speed: 1.3, species: 'sculk_crawler' },
            { x: 280, y: 290, hp: 340, speed: 1.3, species: 'sculk_crawler' }
        ],
        loots: [
            { x: 130, y: 90, type: 'health' }, { x: 130, y: 290, type: 'health' },
            { x: 230, y: 190, type: 'shield' }, { x: 380, y: 190, type: 'shield' },
            { x: 510, y: 90, type: 'health' }, { x: 510, y: 290, type: 'shield' }
        ],
        torches: [
            { x: 80, y: 64 }, { x: 240, y: 64 }, { x: 400, y: 64 }, { x: 560, y: 64 },
            { x: 18, y: 140 }, { x: 18, y: 260 }, { x: 622, y: 140 }, { x: 622, y: 260 },
            { x: 160, y: 374 }, { x: 320, y: 374 }, { x: 480, y: 374 }
        ],
        walls: [
            { x: 170, y: 100, w: 32, h: 64 }, { x: 170, y: 240, w: 32, h: 64 },
            { x: 400, y: 100, w: 32, h: 64 }, { x: 400, y: 240, w: 32, h: 64 }
        ]
    },

    // Stage 36 - The Abyssal Chasm
    {
        name: "THE ABYSSAL CHASM", subName: 'Stage 36 (DESCENT BEYOND WARDEN)',
        mobs: [
            { x: 280, y: 100, hp: 340, speed: 1.34, species: 'sculk_crawler' },
            { x: 410, y: 110, hp: 360, speed: 1.3, species: 'sculk_phantom' },
            { x: 480, y: 230, hp: 390, speed: 1.12, species: 'sculk_zombie' },
            { x: 330, y: 280, hp: 340, speed: 1.28, species: 'sculk_spitter' },
            { x: 210, y: 270, hp: 340, speed: 1.34, species: 'sculk_crawler' }
        ],
        loots: [{ x: 190, y: 100, type: 'health' }, { x: 430, y: 200, type: 'shield' }],
        torches: [{ x: 90, y: 64 }, { x: 320, y: 64 }, { x: 530, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 200, y: 374 }, { x: 460, y: 374 }],
        walls: [{ x: 150, y: 66, w: 22, h: 160 }, { x: 280, y: 150, w: 120, h: 22 }, { x: 280, y: 260, w: 22, h: 110 }, { x: 440, y: 80, w: 22, h: 160 }]
    },

    // Stage 37 - Void Sculk Expanse
    {
        name: "VOID SCULK EXPANSE", subName: 'Stage 37 (DARK HORIZON)',
        mobs: [
            { x: 270, y: 90, hp: 360, speed: 1.35, species: 'sculk_crawler' },
            { x: 420, y: 100, hp: 370, speed: 1.3, species: 'sculk_phantom' },
            { x: 490, y: 210, hp: 410, speed: 1.12, species: 'sculk_zombie' },
            { x: 340, y: 280, hp: 350, speed: 1.3, species: 'sculk_spitter' },
            { x: 210, y: 260, hp: 360, speed: 1.35, species: 'sculk_crawler' }
        ],
        loots: [{ x: 170, y: 100, type: 'shield' }, { x: 440, y: 260, type: 'health' }],
        torches: [{ x: 80, y: 64 }, { x: 280, y: 64 }, { x: 480, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 180, y: 374 }, { x: 480, y: 374 }],
        walls: [{ x: 170, y: 80, w: 26, h: 90 }, { x: 170, y: 230, w: 26, h: 90 }, { x: 330, y: 130, w: 110, h: 22 }, { x: 470, y: 80, w: 26, h: 180 }]
    },

    // Stage 38 - Whispering Vaults
    {
        name: "WHISPERING VAULTS", subName: 'Stage 38 (ECHOES OF THE FALLEN)',
        mobs: [
            { x: 260, y: 100, hp: 370, speed: 1.36, species: 'sculk_crawler' },
            { x: 400, y: 100, hp: 370, speed: 1.3, species: 'sculk_spitter' },
            { x: 480, y: 190, hp: 430, speed: 1.14, species: 'sculk_zombie' },
            { x: 330, y: 270, hp: 380, speed: 1.32, species: 'sculk_phantom' },
            { x: 210, y: 280, hp: 370, speed: 1.36, species: 'sculk_crawler' }
        ],
        loots: [{ x: 180, y: 110, type: 'health' }, { x: 390, y: 190, type: 'shield' }],
        torches: [{ x: 100, y: 64 }, { x: 320, y: 64 }, { x: 520, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 190, y: 374 }, { x: 460, y: 374 }],
        walls: [{ x: 150, y: 100, w: 130, h: 22 }, { x: 290, y: 66, w: 22, h: 140 }, { x: 290, y: 250, w: 22, h: 120 }, { x: 440, y: 140, w: 120, h: 22 }]
    },

    // Stage 39 - Forgotten Shrine
    {
        name: "FORGOTTEN SHRINE", subName: 'Stage 39 (SHRINE OF SILENCE)',
        mobs: [
            { x: 270, y: 90, hp: 390, speed: 1.38, species: 'sculk_crawler' },
            { x: 420, y: 100, hp: 400, speed: 1.32, species: 'sculk_phantom' },
            { x: 490, y: 220, hp: 450, speed: 1.15, species: 'sculk_zombie' },
            { x: 340, y: 280, hp: 380, speed: 1.3, species: 'sculk_spitter' },
            { x: 200, y: 260, hp: 390, speed: 1.38, species: 'sculk_crawler' }
        ],
        loots: [{ x: 170, y: 100, type: 'health' }, { x: 440, y: 200, type: 'shield' }],
        torches: [{ x: 80, y: 64 }, { x: 280, y: 64 }, { x: 480, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 170, y: 374 }, { x: 490, y: 374 }],
        walls: [{ x: 160, y: 90, w: 28, h: 70 }, { x: 160, y: 230, w: 28, h: 70 }, { x: 310, y: 150, w: 120, h: 22 }, { x: 460, y: 90, w: 28, h: 140 }]
    },

    // Stage 40 - Chamber of Souls (Mini-Boss: Sculk Soul Colossus)
    {
        name: "CHAMBER OF SOULS", subName: 'Stage 40 (MINI-BOSS: SOUL COLOSSUS)',
        mobs: [
            { x: 440, y: 175, hp: 4050, speed: 0.95, species: 'sculk_zombie', type: 'boss', w: 50, h: 54, color: '#0284c7' },
            { x: 260, y: 100, hp: 400, speed: 1.38, species: 'sculk_crawler' },
            { x: 260, y: 280, hp: 400, speed: 1.38, species: 'sculk_crawler' },
            { x: 360, y: 190, hp: 410, speed: 1.32, species: 'sculk_phantom' }
        ],
        loots: [{ x: 150, y: 90, type: 'health' }, { x: 150, y: 290, type: 'shield' }, { x: 480, y: 190, type: 'health' }],
        torches: [{ x: 80, y: 64 }, { x: 260, y: 64 }, { x: 440, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 180, y: 374 }, { x: 460, y: 374 }],
        walls: [{ x: 170, y: 90, w: 32, h: 70 }, { x: 170, y: 230, w: 32, h: 70 }, { x: 370, y: 90, w: 32, h: 70 }, { x: 370, y: 230, w: 32, h: 70 }]
    },

    // Stage 41 - The Resonating Depths
    {
        name: "THE RESONATING DEPTHS", subName: 'Stage 41 (HARMONIC PULSES)',
        mobs: [
            { x: 280, y: 100, hp: 420, speed: 1.4, species: 'sculk_crawler' },
            { x: 410, y: 100, hp: 420, speed: 1.35, species: 'sculk_phantom' },
            { x: 490, y: 220, hp: 470, speed: 1.16, species: 'sculk_zombie' },
            { x: 340, y: 280, hp: 410, speed: 1.32, species: 'sculk_spitter' },
            { x: 210, y: 270, hp: 420, speed: 1.4, species: 'sculk_crawler' }
        ],
        loots: [{ x: 180, y: 100, type: 'shield' }, { x: 430, y: 260, type: 'health' }],
        torches: [{ x: 100, y: 64 }, { x: 320, y: 64 }, { x: 530, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 190, y: 374 }, { x: 470, y: 374 }],
        walls: [{ x: 150, y: 66, w: 22, h: 160 }, { x: 270, y: 140, w: 130, h: 22 }, { x: 270, y: 260, w: 22, h: 110 }, { x: 430, y: 80, w: 22, h: 160 }]
    },

    // Stage 42 - Acoustic Caverns
    {
        name: "ACOUSTIC CAVERNS", subName: 'Stage 42 (SOUND OF SHADOWS)',
        mobs: [
            { x: 270, y: 90, hp: 440, speed: 1.4, species: 'sculk_crawler' },
            { x: 420, y: 100, hp: 440, speed: 1.35, species: 'sculk_spitter' },
            { x: 490, y: 200, hp: 490, speed: 1.18, species: 'sculk_zombie' },
            { x: 330, y: 280, hp: 440, speed: 1.35, species: 'sculk_phantom' },
            { x: 200, y: 260, hp: 440, speed: 1.4, species: 'sculk_crawler' }
        ],
        loots: [{ x: 170, y: 100, type: 'health' }, { x: 410, y: 200, type: 'shield' }],
        torches: [{ x: 90, y: 64 }, { x: 290, y: 64 }, { x: 490, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 180, y: 374 }, { x: 480, y: 374 }],
        walls: [{ x: 160, y: 80, w: 26, h: 90 }, { x: 160, y: 230, w: 26, h: 90 }, { x: 320, y: 130, w: 120, h: 22 }, { x: 460, y: 80, w: 26, h: 180 }]
    },

    // Stage 43 - Shadow Sculk Nexus
    {
        name: "SHADOW SCULK NEXUS", subName: 'Stage 43 (CONVERGENCE)',
        mobs: [
            { x: 260, y: 100, hp: 460, speed: 1.42, species: 'sculk_crawler' },
            { x: 400, y: 100, hp: 460, speed: 1.36, species: 'sculk_spitter' },
            { x: 480, y: 190, hp: 520, speed: 1.2, species: 'sculk_zombie' },
            { x: 330, y: 270, hp: 460, speed: 1.36, species: 'sculk_phantom' },
            { x: 210, y: 280, hp: 460, speed: 1.42, species: 'sculk_crawler' }
        ],
        loots: [{ x: 180, y: 110, type: 'health' }, { x: 390, y: 190, type: 'shield' }],
        torches: [{ x: 80, y: 64 }, { x: 280, y: 64 }, { x: 480, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 180, y: 374 }, { x: 460, y: 374 }],
        walls: [{ x: 140, y: 90, w: 30, h: 120 }, { x: 280, y: 66, w: 22, h: 150 }, { x: 280, y: 260, w: 130, h: 22 }, { x: 440, y: 120, w: 30, h: 150 }]
    },

    // Stage 44 - Void Cradle
    {
        name: "VOID CRADLE", subName: 'Stage 44 (BIRTHPLACE OF SHADOWS)',
        mobs: [
            { x: 270, y: 90, hp: 480, speed: 1.42, species: 'sculk_crawler' },
            { x: 420, y: 100, hp: 480, speed: 1.38, species: 'sculk_phantom' },
            { x: 490, y: 220, hp: 550, speed: 1.22, species: 'sculk_zombie' },
            { x: 340, y: 280, hp: 470, speed: 1.35, species: 'sculk_spitter' },
            { x: 200, y: 260, hp: 480, speed: 1.42, species: 'sculk_crawler' }
        ],
        loots: [{ x: 170, y: 100, type: 'shield' }, { x: 440, y: 200, type: 'health' }],
        torches: [{ x: 90, y: 64 }, { x: 310, y: 64 }, { x: 530, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 170, y: 374 }, { x: 490, y: 374 }],
        walls: [{ x: 160, y: 80, w: 26, h: 80 }, { x: 160, y: 230, w: 26, h: 80 }, { x: 310, y: 140, w: 120, h: 22 }, { x: 450, y: 80, w: 26, h: 160 }]
    },

    // Stage 45 - The Mirror Antechamber (Mini-Boss: Shadow Doppelganger)
    {
        name: "THE MIRROR ANTECHAMBER", subName: 'Stage 45 (MINI-BOSS: SHADOW CLONE)',
        mobs: [
            { x: 440, y: 175, hp: 5400, speed: 1.15, species: 'sculk_zombie', type: 'boss', w: 42, h: 46, color: '#6366f1' },
            { x: 260, y: 100, hp: 500, speed: 1.44, species: 'sculk_crawler' },
            { x: 260, y: 280, hp: 500, speed: 1.44, species: 'sculk_crawler' },
            { x: 360, y: 190, hp: 500, speed: 1.4, species: 'sculk_phantom' }
        ],
        loots: [{ x: 150, y: 90, type: 'health' }, { x: 150, y: 290, type: 'shield' }, { x: 480, y: 190, type: 'health' }],
        torches: [{ x: 80, y: 64 }, { x: 260, y: 64 }, { x: 440, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 180, y: 374 }, { x: 460, y: 374 }],
        walls: [{ x: 170, y: 90, w: 32, h: 70 }, { x: 170, y: 230, w: 32, h: 70 }, { x: 370, y: 90, w: 32, h: 70 }, { x: 370, y: 230, w: 32, h: 70 }]
    },

    // Stage 46 - Hall of False Reflections
    {
        name: "HALL OF FALSE REFLECTIONS", subName: 'Stage 46 (MIRROR ILLUSIONS)',
        mobs: [
            { x: 280, y: 100, hp: 520, speed: 1.45, species: 'sculk_crawler' },
            { x: 410, y: 100, hp: 520, speed: 1.4, species: 'sculk_phantom' },
            { x: 490, y: 210, hp: 580, speed: 1.25, species: 'sculk_zombie' },
            { x: 340, y: 280, hp: 510, speed: 1.38, species: 'sculk_spitter' },
            { x: 210, y: 270, hp: 520, speed: 1.45, species: 'sculk_crawler' }
        ],
        loots: [{ x: 180, y: 100, type: 'health' }, { x: 430, y: 260, type: 'shield' }],
        torches: [{ x: 100, y: 64 }, { x: 320, y: 64 }, { x: 530, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 190, y: 374 }, { x: 470, y: 374 }],
        walls: [{ x: 150, y: 66, w: 22, h: 160 }, { x: 270, y: 140, w: 130, h: 22 }, { x: 270, y: 260, w: 22, h: 110 }, { x: 430, y: 80, w: 22, h: 160 }]
    },

    // Stage 47 - Fractured Reality
    {
        name: "FRACTURED REALITY", subName: 'Stage 47 (SHATTERED VOID)',
        mobs: [
            { x: 270, y: 90, hp: 540, speed: 1.46, species: 'sculk_crawler' },
            { x: 420, y: 100, hp: 540, speed: 1.4, species: 'sculk_spitter' },
            { x: 490, y: 200, hp: 610, speed: 1.26, species: 'sculk_zombie' },
            { x: 330, y: 280, hp: 540, speed: 1.4, species: 'sculk_phantom' },
            { x: 200, y: 260, hp: 540, speed: 1.46, species: 'sculk_crawler' }
        ],
        loots: [{ x: 170, y: 100, type: 'shield' }, { x: 410, y: 200, type: 'health' }],
        torches: [{ x: 90, y: 64 }, { x: 290, y: 64 }, { x: 490, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 180, y: 374 }, { x: 480, y: 374 }],
        walls: [{ x: 160, y: 80, w: 26, h: 90 }, { x: 160, y: 230, w: 26, h: 90 }, { x: 320, y: 130, w: 120, h: 22 }, { x: 460, y: 80, w: 26, h: 180 }]
    },

    // Stage 48 - Silent Abyss
    {
        name: "SILENT ABYSS", subName: 'Stage 48 (THE DEEPEST SILENCE)',
        mobs: [
            { x: 260, y: 100, hp: 560, speed: 1.48, species: 'sculk_crawler' },
            { x: 400, y: 100, hp: 560, speed: 1.42, species: 'sculk_spitter' },
            { x: 480, y: 190, hp: 640, speed: 1.28, species: 'sculk_zombie' },
            { x: 330, y: 270, hp: 560, speed: 1.42, species: 'sculk_phantom' },
            { x: 210, y: 280, hp: 560, speed: 1.48, species: 'sculk_crawler' }
        ],
        loots: [{ x: 180, y: 110, type: 'health' }, { x: 390, y: 190, type: 'shield' }, { x: 490, y: 270, type: 'health' }],
        torches: [{ x: 80, y: 64 }, { x: 280, y: 64 }, { x: 480, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 180, y: 374 }, { x: 460, y: 374 }],
        walls: [{ x: 140, y: 90, w: 30, h: 120 }, { x: 280, y: 66, w: 22, h: 150 }, { x: 280, y: 260, w: 130, h: 22 }, { x: 440, y: 120, w: 30, h: 150 }]
    },

    // Stage 49 - Gateway to the Void Core
    {
        name: "GATEWAY TO THE VOID CORE", subName: 'Stage 49 (THRESHOLD OF THE MIRROR)',
        mobs: [
            { x: 270, y: 90, hp: 580, speed: 1.5, species: 'sculk_crawler' },
            { x: 420, y: 100, hp: 580, speed: 1.45, species: 'sculk_phantom' },
            { x: 490, y: 220, hp: 680, speed: 1.3, species: 'sculk_zombie' },
            { x: 340, y: 280, hp: 570, speed: 1.4, species: 'sculk_spitter' },
            { x: 200, y: 260, hp: 580, speed: 1.5, species: 'sculk_crawler' }
        ],
        loots: [
            { x: 140, y: 100, type: 'health' }, { x: 140, y: 280, type: 'shield' },
            { x: 450, y: 100, type: 'health' }, { x: 450, y: 280, type: 'shield' }
        ],
        torches: [{ x: 90, y: 64 }, { x: 310, y: 64 }, { x: 530, y: 64 }, { x: 18, y: 190 }, { x: 622, y: 190 }, { x: 170, y: 374 }, { x: 490, y: 374 }],
        walls: [{ x: 160, y: 80, w: 26, h: 80 }, { x: 160, y: 230, w: 26, h: 80 }, { x: 310, y: 140, w: 120, h: 22 }, { x: 450, y: 80, w: 26, h: 160 }]
    },

    // =========================================================================
    // Stage 50 - THE DEEP DARK CORE (ULTIMATE CLIMAX: TRUE MIRROR ALTER EGO 👑)
    // =========================================================================
    {
        name: "THE DEEP DARK CORE", subName: 'Stage 50 (ULTIMATE BATTLE: TRUE MIRROR ALTER EGO)',
        mobs: [
            { x: 450, y: 175, hp: 28800, speed: 1.25, species: 'alter_ego', type: 'boss', w: 32, h: 32, isApexMirror: true }
        ],
        loots: [
            { x: 110, y: 100, type: 'health' }, { x: 110, y: 280, type: 'health' },
            { x: 210, y: 190, type: 'shield' }, { x: 390, y: 190, type: 'shield' },
            { x: 510, y: 100, type: 'health' }, { x: 510, y: 280, type: 'shield' }
        ],
        torches: [
            { x: 70, y: 64 }, { x: 230, y: 64 }, { x: 410, y: 64 }, { x: 570, y: 64 },
            { x: 18, y: 190 }, { x: 622, y: 190 },
            { x: 150, y: 374 }, { x: 320, y: 374 }, { x: 490, y: 374 }
        ],
        walls: [
            { x: 150, y: 90, w: 28, h: 64 }, { x: 150, y: 240, w: 28, h: 64 },
            { x: 470, y: 90, w: 28, h: 64 }, { x: 470, y: 240, w: 28, h: 64 }
        ]
    }
];

