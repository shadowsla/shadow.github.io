# Shadow's Tower RPG - Comprehensive Game Project

## 🎮 Game Overview

**Shadow's Tower RPG** is an epic tower-climbing RPG game developed in both **Java** (desktop version) and **JavaScript** (web version). Players progress through increasingly difficult towers, defeat enemies with various weapons, unlock skills, and rank up from F to Z through a comprehensive progression system.

### Key Features

- **10-Tier Ranking System**: F → E → D → C → B → A → S → SS → SSS → Z
- **15 Unique Weapon Types** with individual synchronization and skill trees
- **6 Main Towers + 1 Secret 7th Tower** to unlock after completing all towers
- **Progressive Difficulty**: Each tower gets harder with more floors and stronger enemies
- **Dynamic Enemy AI**: Enemies wander, chase, attack, and flee based on health
- **Inventory System**: 50-item capacity with item stacking and rarity tiers
- **Crafting System**: Combine materials from defeated enemies to create better gear
- **Skill Trees**: Unlock skills for each weapon type
- **Guild System**: Rank up through the guild by gaining experience
- **Boss Battles**: Each tower culminates in an epic boss fight with multiple phases
- **Armor & Equipment**: Visual equipment system on your character
- **Loot Drops**: Rare to legendary items from defeated enemies
- **Optimized Performance**: 60 FPS target with efficient rendering

---

## 📁 Project Structure

```
RPGGame/
├── src/com/shadowrpg/
│   ├── core/
│   │   ├── Game.java              # Main game engine
│   │   ├── GamePanel.java         # Rendering and input handler
│   │   ├── GameState.java         # Game state enum
│   │   └── GameStateManager.java  # State management
│   ├── entities/
│   │   ├── Player.java            # Player character class
│   │   ├── Enemy.java             # Enemy base class
│   │   ├── Entity.java            # Entity base class
│   │   ├── Item.java              # Inventory items
│   │   ├── Armor.java             # Armor system
│   │   ├── WeaponType.java        # Weapon enum
│   │   ├── PlayerRank.java        # Rank progression
│   │   ├── EnemyType.java         # Enemy types
│   │   ├── ItemType.java          # Item categories
│   │   ├── AI.java                # Enemy AI system
│   │   ├── AttackState.java       # Combat states
│   │   └── Vector.java            # 2D vector math
│   ├── world/
│   │   ├── TowerManager.java      # Tower management
│   │   ├── Tower.java             # Tower class
│   │   ├── Floor.java             # Floor mechanics
│   │   └── Boss.java              # Boss enemy class
│   ├── systems/
│   │   ├── InventorySystem.java   # Inventory management
│   │   ├── EnemyManager.java      # Enemy spawning & updates
│   │   ├── CraftingSystem.java    # Crafting recipes
│   │   ├── SkillTreeSystem.java   # Skill progression
│   │   └── GuildSystem.java       # Guild & ranking
│   ├── ui/
│   │   └── UIRenderer.java        # UI rendering
│   └── audio/
│       └── AudioManager.java      # Sound & music management
├── web/
│   ├── index.html                 # Web game interface
│   ├── style.css                  # Styling
│   ├── game.js                    # Main game logic
│   ├── player.js                  # Player management
│   ├── enemy.js                   # Enemy management
│   └── ui.js                      # UI system
├── res/
│   └── audio/                     # Audio files directory
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Java Desktop Version

#### Requirements
- Java SE 11 or higher
- 2GB RAM minimum
- 100MB disk space

#### Building & Running

1. **Compile the Java project:**
```bash
cd RPGGame
mkdir bin
javac -d bin src/com/shadowrpg/**/*.java
```

2. **Run the game:**
```bash
java -cp bin com.shadowrpg.core.Game
```

#### Controls
| Key | Action |
|-----|--------|
| Arrow Keys / WASD | Move |
| Space | Attack |
| I | Inventory |
| G | Guild |
| S | Skill Tree |
| C | Crafting |
| ESC | Menu |
| 1-7 | Select Tower |

### Web Version

Simply open `RPGGame/web/index.html` in a modern web browser (Chrome, Firefox, Safari, Edge).

**Browser Requirements:**
- HTML5 Canvas support
- JavaScript ES6+ support
- Modern GPU acceleration recommended

---

## 🎯 Gameplay Guide

### Progression System

1. **Start**: Begin as an F-rank adventurer with 100 HP and a Long Sword
2. **Complete Towers**: Defeat all enemies on each floor to advance
3. **Gain Experience**: Every defeated enemy grants experience
4. **Rank Up**: Accumulate enough experience at the Guild to increase rank
5. **Unlock 7th Tower**: Complete all 6 main towers to unlock the ultimate tower

### Tower Structure

Each tower has:
- **Multiple Floors**: Difficulty increases with each floor
- **Regular Enemies**: Various types with different stats and loot
- **Mini-Bosses**: Appear every 3 floors (every 3 floors)
- **Boss**: Final floor has a tower boss with multiple attack patterns

### Weapon Synchronization

- Each weapon has a **synchronization meter** (0-100%)
- Using a weapon increases its synchronization
- Higher synchronization increases damage and attack speed
- Each weapon type has unique skills in its skill tree

### Inventory & Crafting

**Items you can get:**
- Crafting materials from enemies
- Weapons and armor pieces
- Potions and consumables
- Rare treasures and gems

**Crafting Example:**
```
Recipe: Healing Potion
Materials needed: Herb x3 + Water x1
Result: Healing Potion (restores 50 HP)
```

### Armor System

- Collect different armor pieces from defeated enemies
- Each armor has defense value
- Visible on your character model
- Can be combined with weapons

---

## 🏰 Towers & Bosses

### Tower 1: Tower of Shadows
- Floors: 5
- Difficulty: F-E Rank
- Boss: Shadow Lord
- Theme: Dark and mysterious

### Tower 2: Crimson Peak
- Floors: 6
- Difficulty: D-C Rank
- Boss: Crimson Warlord
- Theme: Blood-stained mountain

### Tower 3: Frozen Abyss
- Floors: 7
- Difficulty: B-A Rank
- Boss: Frost King
- Theme: Icy caverns

### Tower 4: Inferno Citadel
- Floors: 8
- Difficulty: A-B Rank
- Boss: Inferno Prince
- Theme: Volcanic fortress

### Tower 5: Mystic Spire
- Floors: 9
- Difficulty: B-A Rank
- Boss: Mystic Sage
- Theme: Magical tower

### Tower 6: Draconic Sanctum
- Floors: 10
- Difficulty: A-S Rank
- Boss: Dragon Overlord
- Theme: Dragon's lair

### Tower 7: The Seventh Tower (Secret)
- Floors: 15
- Difficulty: S-Z Rank
- Boss: Ultimate Challenge
- Theme: Transcendence
- **Unlocked after** completing all 6 main towers

---

## ⚔️ Weapon Types

| Weapon | Damage | Speed | Special Feature |
|--------|--------|-------|-----------------|
| Short Sword | 15 | 1.0x | Balanced |
| Long Sword | 25 | 1.2x | Strong attack |
| Spear | 20 | 1.1x | Reach advantage |
| Gauntlets | 12 | 0.9x | Fast attacks |
| Bow | 18 | 1.3x | Ranged attack |
| Axe | 30 | 0.8x | Highest damage |
| Scythe | 28 | 1.0x | Life-steal |
| War Hammer | 35 | 0.7x | Crushing power |
| Dagger | 10 | 1.5x | Fastest weapon |
| Mace | 22 | 0.9x | Stun chance |

---

## 👹 Enemy Types

| Enemy | Level | Health | Damage | Loot |
|-------|-------|--------|--------|------|
| Goblin | 1 | 20 | 5 | Common materials |
| Orc | 2 | 40 | 10 | Basic loot |
| Skeleton | 3 | 35 | 8 | Bone material |
| Zombie | 3 | 50 | 12 | Rare drops |
| Wraith | 4 | 30 | 30 | Ethereal essence |
| Demon | 5 | 80 | 20 | Epic loot |
| Golem | 5 | 100 | 25 | Rare gems |
| Dragon | 8 | 200+ | 40 | Legendary items |

---

## 🛠️ Systems Explained

### Inventory System
- Maximum capacity: 50 items
- Items can stack (same items combine quantity)
- 5 rarity tiers: Common → Uncommon → Rare → Epic → Legendary
- Auto-sort available

### Skill Tree System
- 10 universal skills available
- 10+ weapon-specific skills
- Gain skill points as you level up
- Skills increase damage multiplier (1.0x to 3.0x)

### Guild System
- Rank up by accumulating experience
- 10 ranks total: F through Z
- Each rank grants stat increases
- Guild tracks player progress

### Crafting System
- 15+ base recipes (can be expanded)
- NPC crafters can make custom items
- Secret recipes hidden throughout towers
- Crafting consumes materials

### Audio System
- Context-sensitive music:
  - Exploration theme in safe areas
  - Intense battle music during combat
  - Boss theme during boss battles
- Sound effects for all actions
- Adjustable volume sliders

---

## 🎵 Performance & Optimization

The game is optimized for:
- **60 FPS target** on standard hardware
- Efficient rendering with double buffering (Java)
- Minimal memory usage
- Optimized collision detection
- Asset caching

**Recommended Specs:**
- Processor: Intel i5 or equivalent
- RAM: 2GB
- GPU: Integrated graphics sufficient
- Display: 1280x720 minimum resolution

---

## 🔧 Advanced Features

### AI System
Enemies use intelligent AI:
- **Wandering**: Random patrol when player far away
- **Chasing**: Follow player when detected
- **Attacking**: Stand ground and fight
- **Fleeing**: Run away when low health

### Secret Paths
- 15% chance per floor to have secret path
- Secret paths contain hidden items
- Harder enemies but better rewards
- Secret boss rooms (every 3rd tower)

### Secret NPCs
Hidden throughout towers:
- **Blacksmith**: Upgrades weapons
- **Alchemist**: Crafts special potions
- **Sage**: Teaches advanced skills
- **Merchant**: Sells rare items

### Dynamic Loot System
Drop rates vary by:
- Enemy type
- Difficulty level
- Player rank
- Tower location
- Current progression

---

## 📝 Customization & Modding

### Adding New Weapons
Edit `WeaponType.java`:
```java
NEW_WEAPON("New Weapon", baseDamage, attackSpeed)
```

### Adding New Enemies
Edit `EnemyType.java`:
```java
NEW_ENEMY("Enemy Name", level, health, damage)
```

### Adding Recipes
Edit `CraftingSystem.java` in `initializeRecipes()`:
```java
recipes.put("Recipe Name", new Recipe(...))
```

### Custom Skills
Extend `SkillTreeSystem.Skill` class

---

## 🐛 Known Issues & Troubleshooting

### Game won't start
- Ensure Java is installed: `java -version`
- Check all source files are in correct directories
- Try rebuilding: `javac -d bin src/com/shadowrpg/**/*.java`

### Laggy performance
- Close other applications
- Reduce game window size
- Check GPU drivers are updated
- Disable background processes

### Web version issues
- Clear browser cache
- Use latest Chrome/Firefox
- Check JavaScript console for errors
- Disable browser extensions

---

## 📚 Game Balance & Statistics

### Experience Requirements by Rank
- F: 0 exp
- E: 500 exp
- D: 1,200 exp
- C: 2,500 exp
- B: 5,000 exp
- A: 10,000 exp
- S: 20,000 exp
- SS: 40,000 exp
- SSS: 80,000 exp
- Z: 160,000 exp

### Player Stat Progression
- Starting HP: 100
- HP per rank up: +50
- Mana regen: 0.3/sec
- Health regen: 0.5/sec

---

## 🎓 Technical Details

### Java Architecture
- **MVC Pattern**: Model (entities), View (rendering), Controller (input)
- **Double Buffering**: Smooth rendering
- **JFrame + JPanel**: Swing graphics
- **Thread-based game loop**: 60 FPS target

### Web Version
- **HTML5 Canvas**: 2D rendering
- **Vanilla JavaScript**: No external dependencies
- **Object-oriented JS**: Similar to Java structure
- **Responsive design**: Mobile-friendly CSS

### Performance Metrics
- Memory usage: ~100-200MB (Java)
- GPU memory: ~50MB
- File size: Java version ~500KB, Web version ~200KB

---

## 📜 Version History

### Version 1.0 (Current)
- Initial release
- 6 towers with 5-10 floors each
- 10 player ranks
- 15 weapon types
- Enemy AI and boss battles
- Full crafting and skill tree systems
- Guild ranking
- Both Java and web versions

### Planned Features
- PvP multiplayer mode
- Trading system between players
- Daily quests and achievements
- Boss raid mode
- Tournament system
- New towers monthly
- Cosmetic items and transmog
- Achievement badges
- Leaderboards
- Cloud save synchronization

---

## 🤝 Contributing

This is a single-player story game. Community contributions welcome for:
- Bug reports
- Feature suggestions
- Balance feedback
- Art/Music contributions
- Translation support

---

## 📄 License

Shadow's Tower RPG - Created for entertainment purposes.
Feel free to modify and distribute for personal use.

---

## 👨‍💻 Developer Notes

### Performance Considerations
The game prioritizes:
1. **Smooth gameplay**: 60 FPS target
2. **User experience**: Intuitive controls
3. **Progression**: Satisfying advancement
4. **Variety**: 100+ hours of content

### Design Philosophy
- "Accessibility for new players, depth for veterans"
- Progression feels rewarding
- Challenge scales appropriately
- Clear feedback for all actions

### Code Quality
- Well-commented code
- Consistent naming conventions
- Modular architecture
- Easy to extend and maintain

---

## 🎮 Getting Help

### FAQ

**Q: How do I rank up?**
A: Gain experience by defeating enemies, visit the Guild to rank up using your experience.

**Q: How do I get better loot?**
A: Defeat enemies in higher towers, defeat mini-bosses and bosses, complete secret paths.

**Q: Can I reset my skills?**
A: Not in the base game, but you can focus on different weapons.

**Q: How long is the game?**
A: Main 6 towers: 20-30 hours. With 7th tower: 50-100+ hours depending on playstyle.

**Q: Is there a maximum level?**
A: Yes, rank Z is maximum. But the 7th tower provides endgame content.

---

## 📞 Contact & Support

For bug reports and feature requests:
- Check latest version first
- Document exact steps to reproduce
- Include system information
- Provide screenshots/videos if applicable

---

**Enjoy Your Adventure in Shadow's Tower RPG! 🏰⚔️**

Last updated: 2026
