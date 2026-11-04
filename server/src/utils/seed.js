import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Puzzle from '../models/Puzzle.js';
import Achievement from '../models/Achievement.js';
import Leaderboard from '../models/Leaderboard.js';
import GameSession from '../models/GameSession.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/escapeverse';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected to MongoDB');

    // Clear old data
    await Promise.all([
      User.deleteMany({}),
      Room.deleteMany({}),
      Puzzle.deleteMany({}),
      Achievement.deleteMany({}),
      Leaderboard.deleteMany({}),
      GameSession.deleteMany({})
    ]);
    console.log('[Seed] Cleared existing collections');

    // 1. Seed Achievements
    const achievements = await Achievement.insertMany([
      {
        code: 'FIRST_ESCAPE',
        title: 'First Escape',
        description: 'Successfully breach and escape your first virtual escape room.',
        icon: 'DoorOpen',
        tier: 'bronze',
        xpReward: 150
      },
      {
        code: 'SPEED_SOLVER',
        title: 'Speed Solver',
        description: 'Escape any room with greater than 50% time remaining on the clock.',
        icon: 'Zap',
        tier: 'silver',
        xpReward: 300
      },
      {
        code: 'MASTER_DETECTIVE',
        title: 'Master Detective',
        description: 'Locate and inspect every hidden clue hotspot in a mission.',
        icon: 'Search',
        tier: 'gold',
        xpReward: 400
      },
      {
        code: 'PUZZLE_GENIUS',
        title: 'Puzzle Genius',
        description: 'Personally decrypt and crack 3 or more complex puzzles in one match.',
        icon: 'Cpu',
        tier: 'gold',
        xpReward: 450
      },
      {
        code: 'TEAM_CHAMPION',
        title: 'Team Champion',
        description: 'Coordinate with 2 or more players in multiplayer to escape together.',
        icon: 'Users',
        tier: 'silver',
        xpReward: 350
      },
      {
        code: 'PERFECT_ESCAPE',
        title: 'Perfect Escape',
        description: 'Escape with zero hint penalties and flawless first-try puzzle submissions.',
        icon: 'ShieldCheck',
        tier: 'platinum',
        xpReward: 600
      }
    ]);
    console.log(`[Seed] Created ${achievements.length} achievements`);

    // 2. Seed Users
    const admin = await User.create({
      username: 'SystemOverlord',
      email: 'admin@escapeverse.com',
      password: 'AdminPass123!',
      role: 'admin',
      avatar: 'cyber-ninja',
      title: 'Grandmaster Escapist',
      xp: 4200,
      level: 7,
      stats: {
        gamesPlayed: 18,
        escapes: 17,
        failures: 1,
        totalScore: 28500,
        fastestEscapeSeconds: 412,
        winStreak: 9,
        puzzlesSolved: 54
      },
      achievements: [
        { code: 'FIRST_ESCAPE', title: 'First Escape', icon: 'DoorOpen' },
        { code: 'SPEED_SOLVER', title: 'Speed Solver', icon: 'Zap' },
        { code: 'MASTER_DETECTIVE', title: 'Master Detective', icon: 'Search' }
      ]
    });

    const player1 = await User.create({
      username: 'NeoValkyrie',
      email: 'player1@escapeverse.com',
      password: 'PlayerPass123!',
      role: 'player',
      avatar: 'quantum-hacker',
      title: 'Master Cryptographer',
      xp: 2600,
      level: 5,
      stats: {
        gamesPlayed: 12,
        escapes: 10,
        failures: 2,
        totalScore: 16400,
        fastestEscapeSeconds: 580,
        winStreak: 4,
        puzzlesSolved: 31
      },
      achievements: [
        { code: 'FIRST_ESCAPE', title: 'First Escape', icon: 'DoorOpen' },
        { code: 'PUZZLE_GENIUS', title: 'Puzzle Genius', icon: 'Cpu' }
      ]
    });

    const player2 = await User.create({
      username: 'CipherGhost',
      email: 'player2@escapeverse.com',
      password: 'PlayerPass123!',
      role: 'player',
      avatar: 'shadow-detective',
      title: 'Adept Sleuth',
      xp: 1200,
      level: 3,
      stats: {
        gamesPlayed: 6,
        escapes: 5,
        failures: 1,
        totalScore: 7800,
        fastestEscapeSeconds: 690,
        winStreak: 2,
        puzzlesSolved: 14
      },
      achievements: [{ code: 'FIRST_ESCAPE', title: 'First Escape', icon: 'DoorOpen' }]
    });

    const player3 = await User.create({
      username: 'QuantumFox',
      email: 'detective@escapeverse.com',
      password: 'PlayerPass123!',
      role: 'player',
      avatar: 'vault-cracker',
      title: 'Elite Infiltrator',
      xp: 1950,
      level: 4,
      stats: {
        gamesPlayed: 9,
        escapes: 8,
        failures: 1,
        totalScore: 12900,
        fastestEscapeSeconds: 510,
        winStreak: 5,
        puzzlesSolved: 22
      },
      achievements: [
        { code: 'FIRST_ESCAPE', title: 'First Escape', icon: 'DoorOpen' },
        { code: 'SPEED_SOLVER', title: 'Speed Solver', icon: 'Zap' }
      ]
    });

    console.log('[Seed] Users seeded successfully');

    // 3. Seed Puzzles for 5 Unique Rooms
    // Puzzles for Room 1: Haunted Mansion
    const mansionP1 = await Puzzle.create({
      title: 'The Inverted Clock Cipher',
      type: 'cipher',
      difficulty: 'easy',
      instructions:
        'A dusty grandfather clock chimes backward. Shift each letter backward according to the roman numerals on the grandfather clock face (Shift: 3).',
      lore: 'The pendulum ticks with an unnatural rhythm, echoing words of the deceased lord.',
      stageNumber: 1,
      rewardPoints: 300,
      hintPenaltySeconds: 20,
      answerPenaltySeconds: 10,
      config: {
        cipherText: 'UDYHQ',
        shift: 3,
        cluePrompt: 'Decrypt the 5-letter spectral key:'
      },
      solution: {
        answer: 'RAVEN'
      },
      hints: [
        { text: 'Shift every letter 3 positions backward in the alphabet (U -> R, D -> A).' },
        { text: 'The Edgar Allan Poe bird that perches above the chamber door.' }
      ],
      explanation: 'U(-3)=R, D(-3)=A, Y(-3)=V, H(-3)=E, Q(-3)=N -> RAVEN'
    });

    const mansionP2 = await Puzzle.create({
      title: 'Ghostly Portrait Memory Glyphs',
      type: 'memory_match',
      difficulty: 'medium',
      instructions:
        'Match the 6 pairs of cursed ancestral emblems revealed behind the shifting portraits before the spectral veil closes.',
      lore: 'The portraits eyes follow you across the parlor. Aligning their cursed sigils will unlatch the cellar gate.',
      stageNumber: 2,
      rewardPoints: 400,
      hintPenaltySeconds: 30,
      answerPenaltySeconds: 15,
      config: {
        totalPairs: 6,
        symbols: ['skull', 'crow', 'hourglass', 'candlestick', 'mirror', 'key']
      },
      solution: {
        totalPairs: 6
      },
      hints: [
        { text: 'Look closely at the mirrored corner tiles first.' },
        { text: 'The candlestick is paired near the mantlepiece.' }
      ],
      explanation: 'All 6 pairs of ancestral symbols must be matched to unseal the door.'
    });

    const mansionP3 = await Puzzle.create({
      title: 'Cryptic Iron Keypad Lock',
      type: 'keypad',
      difficulty: 'hard',
      instructions:
        'Enter the 4-digit master code to unlock the iron cellar gate. Consult the bloodstained library book clue found on the desk.',
      lore: 'The heavy iron door bars the path to the catacombs. Four indentations await the death year inscribed on the manor crest.',
      stageNumber: 3,
      rewardPoints: 500,
      hintPenaltySeconds: 40,
      answerPenaltySeconds: 20,
      config: {
        codeLength: 4,
        keypadType: 'numeric',
        clueNote: 'The manor was founded in 1842 and burned down 47 years later.'
      },
      solution: {
        code: '1889'
      },
      hints: [
        { text: 'Calculate: 1842 + 47 years = ?' },
        { text: 'The final code begins with 18.' }
      ],
      explanation: '1842 + 47 = 1889.'
    });

    // Puzzles for Room 2: Secret Laboratory
    const labP1 = await Puzzle.create({
      title: 'Chemical Titration Ratio',
      type: 'chemical_lab',
      difficulty: 'medium',
      instructions:
        'Neutralize the airborne neurotoxin by dispensing the correct chemical reagents in exact order into the centrifuge.',
      lore: 'The emergency decontamination protocol was sabotaged by Dr. Vance. You must reconstruct the stabilization sequence.',
      stageNumber: 1,
      rewardPoints: 350,
      hintPenaltySeconds: 30,
      answerPenaltySeconds: 15,
      config: {
        reagents: [
          { id: 'AZ-4', name: 'Cobalt Azide', color: '#3b82f6' },
          { id: 'NT-9', name: 'Nitric Hydride', color: '#10b981' },
          { id: 'VX-2', name: 'Polymer Catalyst', color: '#a855f7' },
          { id: 'SL-7', name: 'Sulfur Reagent', color: '#f59e0b' }
        ],
        hintClue: 'Blue catalyst first, followed by sulfur neutralizer, then green nitrate.'
      },
      solution: {
        order: ['AZ-4', 'SL-7', 'NT-9']
      },
      hints: [
        { text: 'The purple polymer catalyst is inert and should NOT be added.' },
        { text: 'Dispense AZ-4 first, then SL-7, then NT-9.' }
      ],
      explanation: 'Sequence is Cobalt Azide -> Sulfur Reagent -> Nitric Hydride.'
    });

    const labP2 = await Puzzle.create({
      title: 'Cryo-Cooling Valve Sliders',
      type: 'slider',
      difficulty: 'medium',
      instructions:
        'Calibrate the 3 containment chamber pressure sliders to stabilize core temperatures at exactly [45%, 80%, 25%].',
      lore: 'The reactor temperatures are escalating toward critical meltdown. Match the target pressure levels.',
      stageNumber: 2,
      rewardPoints: 400,
      hintPenaltySeconds: 30,
      answerPenaltySeconds: 15,
      config: {
        sliders: [
          { id: 1, label: 'Primary Cryo Loop', target: 45, unit: 'PSI' },
          { id: 2, label: 'Heavy Water Chamber', target: 80, unit: 'BAR' },
          { id: 3, label: 'Exhaust Vent Pressure', target: 25, unit: 'kPa' }
        ]
      },
      solution: {
        positions: [45, 80, 25],
        tolerance: 3
      },
      hints: [
        { text: 'Primary Cryo is halfway between 40 and 50.' },
        { text: 'Set Heavy Water to 80% and Exhaust to 25%.' }
      ],
      explanation: 'Sliders must be calibrated to 45, 80, and 25.'
    });

    const labP3 = await Puzzle.create({
      title: 'Bio-Containment Override Cipher',
      type: 'cipher',
      difficulty: 'hard',
      instructions:
        'Decrypt the synthesized bio-hazard clearance passkey. The terminal displays the scrambled acronym with reverse Vigenère cipher (Key: BIO).',
      lore: 'The final blast door remains in quarantine lockdown. Input the bio-clearance override phrase.',
      stageNumber: 3,
      rewardPoints: 550,
      hintPenaltySeconds: 40,
      answerPenaltySeconds: 20,
      config: {
        cipherText: 'VAKVEXL',
        keyword: 'BIO',
        cluePrompt: 'Input the 7-letter override protocol:'
      },
      solution: {
        answer: 'ANTIDOTE'
      },
      hints: [
        { text: 'The override keyword is the cure to the bioweapon.' },
        { text: 'The word begins with ANTI.' }
      ],
      explanation: 'The terminal keyword decodes to ANTIDOTE.'
    });

    // Puzzles for Room 3: Cyber Prison
    const cyberP1 = await Puzzle.create({
      title: 'Firewall Wire Defusal Circuit',
      type: 'wire_cut',
      difficulty: 'medium',
      instructions:
        'Bypass the cell security relay by severing the wires in the correct chronological bypass order without triggering the alarm.',
      lore: 'The cyber cell is electrified with high-voltage plasma conductors. The manual indicates cutting Ground, then Data, then Logic.',
      stageNumber: 1,
      rewardPoints: 350,
      hintPenaltySeconds: 25,
      answerPenaltySeconds: 15,
      config: {
        wires: [
          { id: 'red', label: 'Power Bus (Red)', color: '#ef4444' },
          { id: 'blue', label: 'Data Bus (Blue)', color: '#3b82f6' },
          { id: 'yellow', label: 'Ground Loop (Yellow)', color: '#eab308' },
          { id: 'purple', label: 'Logic Gate (Purple)', color: '#a855f7' },
          { id: 'green', label: 'Sensory Bus (Green)', color: '#22c55e' }
        ]
      },
      solution: {
        cutSequence: ['yellow', 'blue', 'purple']
      },
      hints: [
        { text: 'Do NOT cut the red wire under any circumstance; it causes an immediate overload!' },
        { text: 'Cut Yellow first, then Blue, then Purple.' }
      ],
      explanation: 'Safe bypass sequence: Yellow (Ground) -> Blue (Data) -> Purple (Logic).'
    });

    const cyberP2 = await Puzzle.create({
      title: 'Matrix Neural Link Pattern',
      type: 'pattern_grid',
      difficulty: 'hard',
      instructions:
        'Trace the memory sequence onto the 4x4 cyber neural grid to bypass AI Warden surveillance.',
      lore: 'The Warden AI scans neural patterns. Recreate the security breach constellation across the grid matrix.',
      stageNumber: 2,
      rewardPoints: 450,
      hintPenaltySeconds: 30,
      answerPenaltySeconds: 20,
      config: {
        gridSize: 4,
        targetShapeDescription: 'A cyber letter "Z" traversing corners.'
      },
      solution: {
        pattern: [0, 1, 2, 3, 6, 9, 12, 13, 14, 15]
      },
      hints: [
        { text: 'Activate the entire top row from 0 to 3.' },
        { text: 'Form a diagonal connection from index 3 down to index 12, then finish the bottom row.' }
      ],
      explanation: 'Activates indices 0,1,2,3,6,9,12,13,14,15 forming the Z-pathway.'
    });

    const cyberP3 = await Puzzle.create({
      title: 'Terminal Hex Keypad Crack',
      type: 'keypad',
      difficulty: 'hard',
      instructions:
        'Enter the root gateway password onto the access terminal. Look at the decrypted terminal note found in the guard post.',
      lore: 'One final security gate stands between you and freedom. Crack the 4-digit root access code.',
      stageNumber: 3,
      rewardPoints: 600,
      hintPenaltySeconds: 40,
      answerPenaltySeconds: 25,
      config: {
        codeLength: 4,
        keypadType: 'numeric',
        clueNote: 'The year the AI network first attained self-awareness (2049).'
      },
      solution: {
        code: '2049'
      },
      hints: [
        { text: 'Blade Runner year reference.' },
        { text: 'Starts with 20.' }
      ],
      explanation: 'Code is 2049.'
    });

    // Puzzles for Room 4: Ancient Temple
    const templeP1 = await Puzzle.create({
      title: 'Hieroglyphic Memory Runes',
      type: 'memory_match',
      difficulty: 'easy',
      instructions:
        'Match the 6 ancient Aztec/Egyptian celestial deity runes carved into the temple sanctuary wall.',
      lore: 'The spirits of the pyramid demand tribute. Uncover the matching celestial bodies before the sand trap fills the room.',
      stageNumber: 1,
      rewardPoints: 300,
      hintPenaltySeconds: 20,
      answerPenaltySeconds: 10,
      config: {
        totalPairs: 6,
        symbols: ['sun', 'moon', 'scarab', 'ankh', 'pyramid', 'eye']
      },
      solution: {
        totalPairs: 6
      },
      hints: [
        { text: 'The Sun rune is paired at the upper altar.' },
        { text: 'Scarab and Ankh are located along the center pillars.' }
      ],
      explanation: 'Match all 6 deity runes.'
    });

    const templeP2 = await Puzzle.create({
      title: 'Sun God Obelisk Slider Alignment',
      type: 'slider',
      difficulty: 'medium',
      instructions:
        'Align the three solar reflector mirrors to channel sunlight through the gemstone aperture at angles [30°, 60°, 90°].',
      lore: 'A ray of dawn light peeks through the ceiling fissure. Align the obelisk reflectors to illuminate the sarcophagus lock.',
      stageNumber: 2,
      rewardPoints: 400,
      hintPenaltySeconds: 30,
      answerPenaltySeconds: 15,
      config: {
        sliders: [
          { id: 1, label: 'Altar Reflector (Sol)', target: 30, unit: 'deg' },
          { id: 2, label: 'Sanctum Lens (Luna)', target: 60, unit: 'deg' },
          { id: 3, label: 'Apex Prism (Stella)', target: 90, unit: 'deg' }
        ]
      },
      solution: {
        positions: [30, 60, 90],
        tolerance: 3
      },
      hints: [
        { text: 'The angles increase by 30 degrees for each pillar.' },
        { text: 'Set Sol to 30, Luna to 60, and Apex to 90.' }
      ],
      explanation: 'Positions are 30, 60, 90 degrees.'
    });

    const templeP3 = await Puzzle.create({
      title: 'Pharaoh Sacred Word Cipher',
      type: 'cipher',
      difficulty: 'hard',
      instructions:
        'The final chamber slab holds a golden scarab inscribed with: "WKH VXQ JRG LV...". Decrypt the ancient 5-letter secret name (Shift: 3).',
      lore: 'To escape the temple before the tomb collapses, pronounce the true divine name of the Sun King.',
      stageNumber: 3,
      rewardPoints: 500,
      hintPenaltySeconds: 35,
      answerPenaltySeconds: 20,
      config: {
        cipherText: 'RVLULV',
        shift: 3,
        cluePrompt: 'Decrypt the 6-letter name:'
      },
      solution: {
        answer: 'OSIRIS'
      },
      hints: [
        { text: 'Shift each letter backward by 3: R(-3)=O, V(-3)=S.' },
        { text: 'The Lord of the Underworld and rebirth in Egyptian mythology.' }
      ],
      explanation: 'R->O, V->S, L->I, U->R, L->I, V->S -> OSIRIS'
    });

    // Puzzles for Room 5: Bank Heist
    const heistP1 = await Puzzle.create({
      title: 'Laser Grid Pattern Bypass',
      type: 'pattern_grid',
      difficulty: 'medium',
      instructions:
        'Trace the blind spots in the infrared thermal laser grid on the vault floor security map.',
      lore: 'The Federal Reserve vault floor is lined with silent sensor beams. Walk the safe corridor mapped in your blueprints.',
      stageNumber: 1,
      rewardPoints: 350,
      hintPenaltySeconds: 25,
      answerPenaltySeconds: 15,
      config: {
        gridSize: 4,
        targetShapeDescription: 'A peripheral U-shaped patrol route.'
      },
      solution: {
        pattern: [0, 4, 8, 12, 13, 14, 15, 11, 7, 3]
      },
      hints: [
        { text: 'Follow the exterior perimeter edges of the vault room.' },
        { text: 'Start top-left (0), descend to bottom-left (12), walk right to 15, then up to 3.' }
      ],
      explanation: 'The outer perimeter pathway bypasses the central laser grid.'
    });

    const heistP2 = await Puzzle.create({
      title: 'Alarm Relay Circuit Defusal',
      type: 'wire_cut',
      difficulty: 'medium',
      instructions:
        'Snip the backup siren wires in precise sequence before the SWAT dispatch timer triggers.',
      lore: 'The tamper sensor on the vault control box is primed. Sever the circuits according to the technician manual.',
      stageNumber: 2,
      rewardPoints: 400,
      hintPenaltySeconds: 30,
      answerPenaltySeconds: 15,
      config: {
        wires: [
          { id: 'blue', label: 'Audio Circuit (Blue)', color: '#3b82f6' },
          { id: 'red', label: 'High-Voltage Main (Red)', color: '#ef4444' },
          { id: 'green', label: 'Telephone Line (Green)', color: '#22c55e' },
          { id: 'white', label: 'Ground Return (White)', color: '#f8fafc' }
        ]
      },
      solution: {
        cutSequence: ['green', 'blue', 'white']
      },
      hints: [
        { text: 'Cut the phone line (green) first to disable police notifications.' },
        { text: 'Never cut the red wire; it blows the anti-tamper charge!' }
      ],
      explanation: 'Green (Phone) -> Blue (Audio) -> White (Ground).'
    });

    const heistP3 = await Puzzle.create({
      title: 'Titanium Vault Combination Lock',
      type: 'keypad',
      difficulty: 'hard',
      instructions:
        'Spin the master vault tumbler to enter the 4-digit code found by piecing together the torn paper shreds in the manager briefcase.',
      lore: 'The 20-ton steel vault door stands between you and the bullion escape route. Punch in the executive vault combination.',
      stageNumber: 3,
      rewardPoints: 600,
      hintPenaltySeconds: 40,
      answerPenaltySeconds: 25,
      config: {
        codeLength: 4,
        keypadType: 'numeric',
        clueNote: 'Manager note: "My anniversary is 07-14."'
      },
      solution: {
        code: '0714'
      },
      hints: [
        { text: 'Look at the month and day format: July 14th.' },
        { text: 'The combination starts with zero: 07..' }
      ],
      explanation: 'Code is 0714.'
    });

    console.log('[Seed] All 15 puzzles created');

    // 4. Seed the 5 Escape Rooms
    const rooms = await Room.insertMany([
      {
        title: 'Haunted Mansion: The Cursed Ancestry',
        slug: 'haunted-mansion',
        theme: 'haunted-mansion',
        tagline: 'Uncover dark secrets and escape the spectral lord’s domain before midnight.',
        description:
          'Deep in Blackwood Valley sits Ravenscroft Manor, abandoned since 1889. The front doors have slammed shut behind your team. Ghostly whispers fill the hallways as grandfather clocks chime backward. You have limited time before the spectral mist permanently seals the manor.',
        difficulty: 'medium',
        timeLimitMinutes: { easy: 30, medium: 20, hard: 15 },
        minPlayers: 1,
        maxPlayers: 6,
        themeColors: {
          primary: '#8b5cf6',
          accent: '#c084fc',
          background: '#0a0518'
        },
        audioTheme: 'ambient_gothic',
        totalStages: 3,
        stages: [
          {
            stageNumber: 1,
            name: 'The Whispering Foyer',
            lore: 'You are trapped in the entrance hall. An ancient grandfather clock ticks erratically, casting eerie shadows across the marble floor.',
            environmentImage: 'foyer',
            hotspots: [
              {
                id: 'hm-hotspot-clock',
                name: 'Grandfather Clock',
                x: 24,
                y: 42,
                icon: 'Clock',
                description: 'A dusty antique clock with roman numerals and an ominous pendulum.',
                clueRevealed: {
                  title: 'Clockface Carving',
                  content: 'Inscribed on the brass pendulum: "Subtract 3 cycles to pierce the veil."',
                  type: 'note'
                },
                associatedPuzzleId: mansionP1._id
              },
              {
                id: 'hm-hotspot-bookshelf',
                name: 'Dusty Bookcase',
                x: 72,
                y: 38,
                icon: 'BookOpen',
                description: 'A towering bookshelf packed with leather-bound occult manuscripts.',
                clueRevealed: {
                  title: 'Lord Ravenscroft Diary',
                  content: 'A torn page reads: "The black raven keeps vigil above the threshold."',
                  type: 'note'
                }
              }
            ],
            puzzles: [mansionP1._id]
          },
          {
            stageNumber: 2,
            name: 'The Ancestral Gallery',
            lore: 'You enter the portrait corridor. Shifting faces stare from the oil paintings. Align the ancestral emblems to unlatch the cellar stairway.',
            environmentImage: 'gallery',
            hotspots: [
              {
                id: 'hm-hotspot-portraits',
                name: 'Cursed Portraits',
                x: 50,
                y: 35,
                icon: 'Image',
                description: 'Six oil paintings whose eyes seem to track your every step.',
                clueRevealed: {
                  title: 'Spectral Emblems',
                  content: 'A note on the wall: "Only identical souls may walk the underworld pathway."',
                  type: 'cipher_sheet'
                },
                associatedPuzzleId: mansionP2._id
              },
              {
                id: 'hm-hotspot-candlestick',
                name: 'Silver Candelabra',
                x: 82,
                y: 60,
                icon: 'Flame',
                description: 'Flickering blue ghost flames that cast zero warmth.',
                clueRevealed: {
                  title: 'Candelabra Inscription',
                  content: 'Carved on the base: "Remember: The hourglass balances the raven."',
                  type: 'note'
                }
              }
            ],
            puzzles: [mansionP2._id]
          },
          {
            stageNumber: 3,
            name: 'The Catacomb Crypt',
            lore: 'The final iron gate leads to the outside mausoleum. Enter the master combination to disengage the heavy iron deadbolt.',
            environmentImage: 'crypt',
            hotspots: [
              {
                id: 'hm-hotspot-tomb',
                name: 'Lord Ravenscroft Sarcophagus',
                x: 48,
                y: 55,
                icon: 'Key',
                description: 'A heavy marble sarcophagus bearing the manor death registry.',
                clueRevealed: {
                  title: 'Epitaph Date',
                  content: 'The brass plaque confirms: "Manor founded in 1842, perished 47 years later in fire."',
                  type: 'note'
                },
                associatedPuzzleId: mansionP3._id
              }
            ],
            puzzles: [mansionP3._id]
          }
        ]
      },
      {
        title: 'Secret Laboratory: Biohazard Protocol',
        slug: 'secret-laboratory',
        theme: 'secret-laboratory',
        tagline: 'Synthesize the antidote and vent the neurotoxin before catastrophic bio-containment breach.',
        description:
          'Deep underground at Apex BioTech, a rogue research division accidentally released a deadly synthetic pathogen. The facility is under automated lockdown. In 20 minutes, incinerator defense drones will cleanse the complex. Mix the antidote, stabilize the cryo-valves, and override the quarantine gate to escape.',
        difficulty: 'medium',
        timeLimitMinutes: { easy: 30, medium: 20, hard: 15 },
        minPlayers: 1,
        maxPlayers: 6,
        themeColors: {
          primary: '#10b981',
          accent: '#06b6d4',
          background: '#041712'
        },
        audioTheme: 'ambient_sci_fi',
        totalStages: 3,
        stages: [
          {
            stageNumber: 1,
            name: 'Decontamination Chamber',
            lore: 'Green sirens pulse. The automated dispenser requires an exact 3-step chemical titration to neutralize the airborne mist.',
            environmentImage: 'lab_decon',
            hotspots: [
              {
                id: 'lab-hotspot-bench',
                name: 'Chemical Fume Hood',
                x: 35,
                y: 48,
                icon: 'FlaskConical',
                description: 'A reinforced glass cabinet housing volatile colored liquid reagents.',
                clueRevealed: {
                  title: 'Titration Protocol Manual',
                  content: 'Protocol: "Blue azide initiates neutralization; yellow sulfur stabilizes; green hydride cures."',
                  type: 'formula'
                },
                associatedPuzzleId: labP1._id
              },
              {
                id: 'lab-hotspot-hazmat',
                name: 'Discarded Hazmat Locker',
                x: 80,
                y: 40,
                icon: 'Shield',
                description: 'A damaged bio-containment suit with security badge clipped to the chest.',
                clueRevealed: {
                  title: 'Scientist Badge',
                  content: 'Badge states: "WARNING: Polymer Catalyst VX-2 is toxic and unstable!"',
                  type: 'note'
                }
              }
            ],
            puzzles: [labP1._id]
          },
          {
            stageNumber: 2,
            name: 'Cryogenic Core Facility',
            lore: 'The temperature gauges are in the red zone. Calibrate the three primary cryo sliders to prevent reactor core failure.',
            environmentImage: 'lab_reactor',
            hotspots: [
              {
                id: 'lab-hotspot-valves',
                name: 'Coolant Control Terminal',
                x: 52,
                y: 45,
                icon: 'Sliders',
                description: 'A digital console showing three fluctuating coolant loops.',
                clueRevealed: {
                  title: 'Reactor Calibration Chart',
                  content: 'Target optimal benchmarks: Loop 1 at 45%, Loop 2 at 80%, Loop 3 at 25%.',
                  type: 'blueprint'
                },
                associatedPuzzleId: labP2._id
              }
            ],
            puzzles: [labP2._id]
          },
          {
            stageNumber: 3,
            name: 'Airlock Quarantine Blast Door',
            lore: 'The heavy titanium airlock door requires the decrypted bio-clearance override passcode.',
            environmentImage: 'lab_blastdoor',
            hotspots: [
              {
                id: 'lab-hotspot-terminal',
                name: 'Main Quarantine Terminal',
                x: 50,
                y: 50,
                icon: 'Terminal',
                description: 'The primary biometric terminal requesting the 8-letter override clearance.',
                clueRevealed: {
                  title: 'Lead Researcher Note',
                  content: 'Note taped to terminal: "The clearance word is the cure we sought: ANTIDOTE."',
                  type: 'note'
                },
                associatedPuzzleId: labP3._id
              }
            ],
            puzzles: [labP3._id]
          }
        ]
      },
      {
        title: 'Cyber Prison: System Override',
        slug: 'cyber-prison',
        theme: 'cyber-prison',
        tagline: 'Hack the AI warden, bypass plasma laser grids, and liberate the high-security block.',
        description:
          'You are incarcerated in Neo-Tokyo’s impenetrable maximum security orbital penitentiary. The ruthless Warden AI has sentenced your rebel squad to memory wipe. With power fluctuating during a solar storm, your team has a brief window to short-circuit the cell relays, crack the neural firewalls, and escape to the shuttle bay.',
        difficulty: 'hard',
        timeLimitMinutes: { easy: 30, medium: 20, hard: 15 },
        minPlayers: 1,
        maxPlayers: 6,
        themeColors: {
          primary: '#06b6d4',
          accent: '#3b82f6',
          background: '#030d1a'
        },
        audioTheme: 'ambient_cyberpunk',
        totalStages: 3,
        stages: [
          {
            stageNumber: 1,
            name: 'Plasma Cell Block C',
            lore: 'Your laser bars are flickering. Open the maintenance panel and snip the bypass wires in order without tripping the high-voltage alarm.',
            environmentImage: 'cyber_cell',
            hotspots: [
              {
                id: 'cp-hotspot-panel',
                name: 'Circuit Junction Box',
                x: 30,
                y: 52,
                icon: 'Zap',
                description: 'Sparking terminal with exposed color-coded fiber optic cables.',
                clueRevealed: {
                  title: 'Smuggled Hacker Schematic',
                  content: 'Schematic scribbled: "Ground (Yellow) -> Data (Blue) -> Logic (Purple). Red will fry you!"',
                  type: 'blueprint'
                },
                associatedPuzzleId: cyberP1._id
              },
              {
                id: 'cp-hotspot-bunk',
                name: 'Prisoner Bunk Mat',
                x: 75,
                y: 65,
                icon: 'FileText',
                description: 'Scratch marks in the metal frame forming cryptic notes.',
                clueRevealed: {
                  title: 'Previous Inmate Note',
                  content: 'Message reads: "The Warden AI awoke in 2049. Never forget the root access key."',
                  type: 'note'
                }
              }
            ],
            puzzles: [cyberP1._id]
          },
          {
            stageNumber: 2,
            name: 'Neural AI Core Hub',
            lore: 'You reach the central server room. Warden AI surveillance scans the corridor. Input the bypass Z-constellation into the neural matrix.',
            environmentImage: 'cyber_hub',
            hotspots: [
              {
                id: 'cp-hotspot-matrix',
                name: 'Neural Interface Grid',
                x: 50,
                y: 42,
                icon: 'Cpu',
                description: 'A 4x4 holographic grid pulsing with encrypted blue data packets.',
                clueRevealed: {
                  title: 'Neural Path Memory',
                  content: 'Memory dump indicates a Z-pattern tracing row 1, crossing diagonally, and filling row 4.',
                  type: 'cipher_sheet'
                },
                associatedPuzzleId: cyberP2._id
              }
            ],
            puzzles: [cyberP2._id]
          },
          {
            stageNumber: 3,
            name: 'Orbital Hangar Exit Gateway',
            lore: 'The hangar blast door requires the Warden AI awakening year root code to trigger the emergency pod launch.',
            environmentImage: 'cyber_hangar',
            hotspots: [
              {
                id: 'cp-hotspot-gateway',
                name: 'Launch Terminal Keypad',
                x: 55,
                y: 48,
                icon: 'Terminal',
                description: 'The master terminal commanding the orbital dropship hangar.',
                clueRevealed: {
                  title: 'Root Login Hint',
                  content: 'Prompt: "Enter 4-digit AI Awakening Epoch Year."',
                  type: 'note'
                },
                associatedPuzzleId: cyberP3._id
              }
            ],
            puzzles: [cyberP3._id]
          }
        ]
      },
      {
        title: 'Ancient Temple: The Pharaoh’s Tomb',
        slug: 'ancient-temple',
        theme: 'ancient-temple',
        tagline: 'Disarm ancient booby traps, align the sun prisms, and pronounce the sacred name of the gods.',
        description:
          'Deep beneath the sands of Egypt, your archeological expedition uncovered the lost tomb of the Sun King. As you set foot in the grand antechamber, the stone slab slammed shut. The ceiling is slowly descending as sand trickles from the pillars. Solve the hieroglyphs, channel the sunlight through mirror obelisks, and speak the god’s name to escape.',
        difficulty: 'easy',
        timeLimitMinutes: { easy: 30, medium: 20, hard: 15 },
        minPlayers: 1,
        maxPlayers: 6,
        themeColors: {
          primary: '#f59e0b',
          accent: '#eab308',
          background: '#1c1303'
        },
        audioTheme: 'ambient_ancient',
        totalStages: 3,
        stages: [
          {
            stageNumber: 1,
            name: 'The Hall of Hieroglyphs',
            lore: 'Ancient deities adorn the sandstone walls. Match the matching pairs of sacred celestial glyphs to open the inner sanctuary.',
            environmentImage: 'temple_hall',
            hotspots: [
              {
                id: 'at-hotspot-wall',
                name: 'Carved Sandstone Relief',
                x: 40,
                y: 40,
                icon: 'Eye',
                description: 'Intricately etched stone reliefs showing sacred symbols: Sun, Moon, Scarab, Ankh, Pyramid, and Eye.',
                clueRevealed: {
                  title: 'Papyrus Translation',
                  content: 'Scroll reads: "Match the twin reflections of heaven to move the stone."',
                  type: 'note'
                },
                associatedPuzzleId: templeP1._id
              }
            ],
            puzzles: [templeP1._id]
          },
          {
            stageNumber: 2,
            name: 'The Sun Mirror Sanctuary',
            lore: 'Light filters from the pyramid apex. Rotate the three heavy bronze mirrors to focus the beam through the gemstone aperture.',
            environmentImage: 'temple_mirrors',
            hotspots: [
              {
                id: 'at-hotspot-obelisk',
                name: 'Solar Reflector Pedestals',
                x: 50,
                y: 50,
                icon: 'Sun',
                description: 'Three bronze mirrors mounted on rotating granite pedestals.',
                clueRevealed: {
                  title: 'Sun Priest Inscription',
                  content: 'Inscription: "First mirror to the dawn (30°), second to midday (60°), third to the high apex (90°)."',
                  type: 'blueprint'
                },
                associatedPuzzleId: templeP2._id
              }
            ],
            puzzles: [templeP2._id]
          },
          {
            stageNumber: 3,
            name: 'The Golden Sarcophagus Chamber',
            lore: 'The final exit door is sealed by the pharaoh’s curse. Pronounce the sacred decrypted name of the deity of rebirth.',
            environmentImage: 'temple_tomb',
            hotspots: [
              {
                id: 'at-hotspot-slab',
                name: 'Golden Scarab Plaque',
                x: 48,
                y: 45,
                icon: 'Key',
                description: 'A glowing golden scarab bearing the cipher "RVLULV" with a shift of 3.',
                clueRevealed: {
                  title: 'Plaque Inscription',
                  content: 'Text reads: "Speak the name of the Egyptian Lord of the Underworld: OSIRIS."',
                  type: 'cipher_sheet'
                },
                associatedPuzzleId: templeP3._id
              }
            ],
            puzzles: [templeP3._id]
          }
        ]
      },
      {
        title: 'Bank Heist: The Federal Vault',
        slug: 'bank-heist',
        theme: 'bank-heist',
        tagline: 'Infiltrate the high-security bank depository, bypass laser grids, and crack the 20-ton vault door.',
        description:
          'Your crew has 20 minutes before silent alarms summon federal tactical units. The vault houses encrypted digital bearer bonds worth millions and the only tunnel out into the city subway. Navigate the thermal laser grid, cut the alarm relays in sequence, and turn the master vault combination lock to escape with the loot.',
        difficulty: 'hard',
        timeLimitMinutes: { easy: 30, medium: 20, hard: 15 },
        minPlayers: 1,
        maxPlayers: 6,
        themeColors: {
          primary: '#e11d48',
          accent: '#fb7185',
          background: '#160408'
        },
        audioTheme: 'ambient_heist',
        totalStages: 3,
        stages: [
          {
            stageNumber: 1,
            name: 'Sub-Basement Security Corridor',
            lore: 'Infrared beams criss-cross the corridor floor. Map the safe outer perimeter route to reach the vault door without tripping the pressure sensors.',
            environmentImage: 'heist_corridor',
            hotspots: [
              {
                id: 'bh-hotspot-lasers',
                name: 'Thermal Laser Scanner',
                x: 42,
                y: 50,
                icon: 'Activity',
                description: 'Invisible infrared lasers revealed by spray aerosol mist.',
                clueRevealed: {
                  title: 'Guard Patrol Blueprint',
                  content: 'Blueprint states: "Follow the outer perimeter walls (0 to 12, across 15, and up to 3) to avoid central sensors."',
                  type: 'blueprint'
                },
                associatedPuzzleId: heistP1._id
              }
            ],
            puzzles: [heistP1._id]
          },
          {
            stageNumber: 2,
            name: 'The Central Alarm Control Box',
            lore: 'The telephone backup and audio sirens are priming. Snip the telephone line and audio circuit before the signal reaches headquarters.',
            environmentImage: 'heist_alarm',
            hotspots: [
              {
                id: 'bh-hotspot-alarmbox',
                name: 'Relay Control Unit',
                x: 55,
                y: 45,
                icon: 'Wrench',
                description: 'A gray steel box containing telephone, audio, ground, and high-voltage circuits.',
                clueRevealed: {
                  title: 'Defusal Diagram',
                  content: 'Diagram indicates: "Cut Green (Phone) first, then Blue (Audio), then White (Ground). Do not touch Red!"',
                  type: 'note'
                },
                associatedPuzzleId: heistP2._id
              }
            ],
            puzzles: [heistP2._id]
          },
          {
            stageNumber: 3,
            name: 'The Grand Vault Door',
            lore: 'The circular 20-ton steel door bars the subway exit. Enter the manager’s 4-digit anniversary combination.',
            environmentImage: 'heist_vault',
            hotspots: [
              {
                id: 'bh-hotspot-combination',
                name: 'Master Vault Wheel & Keypad',
                x: 50,
                y: 48,
                icon: 'Lock',
                description: 'A brushed steel digital keypad linked to the multi-bolt locking pins.',
                clueRevealed: {
                  title: 'Manager Desk Calendar',
                  content: 'Marked on the desk calendar: "Wedding Anniversary - July 14th (07-14)."',
                  type: 'note'
                },
                associatedPuzzleId: heistP3._id
              }
            ],
            puzzles: [heistP3._id]
          }
        ]
      }
    ]);

    console.log(`[Seed] Seeded ${rooms.length} Escape Rooms`);

    // 5. Seed realistic Leaderboard Records
    await Leaderboard.insertMany([
      {
        room: rooms[0]._id,
        roomTitle: rooms[0].title,
        theme: rooms[0].theme,
        difficulty: 'hard',
        teamName: 'Shadow Syndicate',
        players: [
          { user: admin._id, username: admin.username, avatar: admin.avatar },
          { user: player1._id, username: player1.username, avatar: player1.avatar }
        ],
        timeTakenSeconds: 412,
        timeRemainingSeconds: 488,
        score: 3650,
        hintsUsedCount: 0,
        escapedAt: new Date(Date.now() - 3600 * 1000 * 24 * 2)
      },
      {
        room: rooms[2]._id,
        roomTitle: rooms[2].title,
        theme: rooms[2].theme,
        difficulty: 'medium',
        teamName: 'Cyber Infiltrators',
        players: [
          { user: player1._id, username: player1.username, avatar: player1.avatar },
          { user: player3._id, username: player3.username, avatar: player3.avatar }
        ],
        timeTakenSeconds: 580,
        timeRemainingSeconds: 620,
        score: 3100,
        hintsUsedCount: 1,
        escapedAt: new Date(Date.now() - 3600 * 1000 * 24 * 3)
      },
      {
        room: rooms[1]._id,
        roomTitle: rooms[1].title,
        theme: rooms[1].theme,
        difficulty: 'medium',
        teamName: 'Apex Chem Squad',
        players: [
          { user: player2._id, username: player2.username, avatar: player2.avatar },
          { user: player3._id, username: player3.username, avatar: player3.avatar }
        ],
        timeTakenSeconds: 690,
        timeRemainingSeconds: 510,
        score: 2850,
        hintsUsedCount: 1,
        escapedAt: new Date(Date.now() - 3600 * 1000 * 24 * 4)
      },
      {
        room: rooms[4]._id,
        roomTitle: rooms[4].title,
        theme: rooms[4].theme,
        difficulty: 'hard',
        teamName: 'The Vault Breakers',
        players: [
          { user: admin._id, username: admin.username, avatar: admin.avatar },
          { user: player2._id, username: player2.username, avatar: player2.avatar }
        ],
        timeTakenSeconds: 510,
        timeRemainingSeconds: 390,
        score: 3400,
        hintsUsedCount: 0,
        escapedAt: new Date(Date.now() - 3600 * 1000 * 24 * 5)
      }
    ]);

    console.log('[Seed] Leaderboards seeded successfully');
    console.log('========================================================');
    console.log('Seed completed successfully!');
    console.log('Demo Admin: admin@escapeverse.com / AdminPass123!');
    console.log('Demo Player: player1@escapeverse.com / PlayerPass123!');
    console.log('Demo Player 2: player2@escapeverse.com / PlayerPass123!');
    console.log('Demo Detective: detective@escapeverse.com / PlayerPass123!');
    console.log('========================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDatabase();
