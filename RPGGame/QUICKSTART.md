# Shadow's Tower RPG - Quick Start Guide

## 🚀 Quick Start (5 minutes)

### For Java Desktop Version

#### Windows Users:
1. Open `RPGGame` folder
2. Double-click `build.bat`
3. Type `y` when asked to run the game
4. Game launches!

#### Mac/Linux Users:
1. Open terminal in `RPGGame` folder
2. Run: `bash build.sh`
3. Type `y` when asked to run the game
4. Game launches!

#### Chromebook (Crostini) Users:
1. Open the Linux terminal (Crostini) on your Chromebook
2. Install OpenJDK if needed:
```bash
sudo apt update
sudo apt install openjdk-17-jdk -y
```
3. From the `RPGGame` directory run: `bash build.sh`
4. If you prefer the web version, serve the `web/` folder and open it in Chrome (see Web Version below).

#### Manual Compilation:
```bash
# Compile
javac -d bin src/com/shadowrpg/**/*.java

# Run
java -cp bin com.shadowrpg.core.Game
```

### For Web Version

1. Open `RPGGame/web/index.html` with any modern browser
2. Click "Start Game" button
3. Follow on-screen instructions

Tip: If the browser blocks local file access, serve the web folder with a simple HTTP server from the `RPGGame` directory:

```bash
# Python 3
python3 -m http.server 8000
# then open http://localhost:8000/web/ in your browser
```

---

## 🎮 First Time Playing

### Your First 10 Minutes:

1. **Start Game** - Read the intro text
2. **Select Tower** - Choose "Tower of Shadows" (difficulty 1)
3. **Defeat Enemies** - Use Arrow Keys to move, Space to attack
4. **Advance Floors** - Defeat all enemies to go to next floor
5. **Face the Boss** - Large enemy at the top
6. **Complete Tower** - Get experience and loot!
7. **Visit Guild** - Go to Guild to rank up
8. **Explore Inventory** - Press I to see your items
9. **Upgrade Skills** - Press S to view skill tree
10. **Keep Climbing** - Try the next tower!

---

## 🎯 Beginner Tips

### Combat Tips
- Always keep moving in combat
- Watch enemy patterns and dodge
- Use weapons with higher synchronization
- Collect materials early for crafting

### Progression Tips
- Complete towers in order (they get harder)
- Equip better gear as you find it
- Focus on one or two weapons initially
- Craft healing potions for tough battles

### Economic Tips
- Sell unwanted items to merchants
- Collect all materials from enemies
- Invest gold in crafting better equipment
- Complete side quests for extra rewards

---

## 📊 Game Difficulty Curve

| Tower | Recommended Rank | Difficulty | Time |
|-------|-----------------|-----------|------|
| Tower of Shadows | F-E | ⭐ Beginner | 1-2 hours |
| Crimson Peak | D-C | ⭐⭐ Easy | 2-3 hours |
| Frozen Abyss | C-B | ⭐⭐⭐ Medium | 3-4 hours |
| Inferno Citadel | B-A | ⭐⭐⭐⭐ Hard | 3-4 hours |
| Mystic Spire | A-S | ⭐⭐⭐⭐⭐ Very Hard | 4-5 hours |
| Draconic Sanctum | S-SS | ⭐⭐⭐⭐⭐ Expert | 5-6 hours |
| The Seventh Tower | SS-Z | 💀💀💀 EXTREME | 10+ hours |

---

## 💡 Essential Controls

```
Movement:     Arrow Keys or WASD
Attack:       Space Bar
Inventory:    I
Guild:        G
Skills:       S
Crafting:     C
Menu/Escape:  ESC
Select Tower: 1-7 (from tower select)
```

---

## 📈 Progression Checklist

### Early Game (Hours 0-5)
- [ ] Complete Tutorial
- [ ] Finish Tower of Shadows
- [ ] Reach D Rank
- [ ] Get 5 different weapons
- [ ] Collect 20 materials

### Mid Game (Hours 5-20)
- [ ] Complete 3 towers
- [ ] Reach B Rank
- [ ] Learn 10+ skills
- [ ] Craft 5 items
- [ ] Find legendary item

### Late Game (Hours 20-50)
- [ ] Complete 6 main towers
- [ ] Reach S Rank
- [ ] Unlock 7th Tower
- [ ] Fully upgrade one weapon
- [ ] Complete all recipes

### Endgame (Hours 50+)
- [ ] Reach Z Rank
- [ ] Complete 7th Tower
- [ ] Unlock all skills
- [ ] Equip full legendary set
- [ ] Achieve 100% completion

---

## 🛠️ Customization

### Change Game Settings

Edit `Game.java`:
```java
private static final int WIDTH = 1280;      // Screen width
private static final int HEIGHT = 720;      // Screen height
private static final int TARGET_FPS = 60;   // Target FPS
```

### Adjust Difficulty

Edit `EnemyManager.java`:
```java
int enemyCount = 3 + (floorNumber * 2);  // More enemies = harder
```

### Modify Starting Equipment

Edit `Game.java`:
```java
player = new Player("Adventurer", 100, 50, 1, 1, WeaponType.LONG_SWORD);
//                                 HP   MP  Level Level Weapon
```

---

## 🐛 Troubleshooting

### Game Won't Compile
```
ERROR: package com.shadowrpg.core does not exist
```
**Solution:** Make sure you're in the RPGGame directory and all source files exist

### Game Runs Slow
- Close other programs
- Reduce game window size
- Check GPU drivers

### Web Version Crashes
- Clear browser cache
- Disable ad blockers
- Try different browser

---

## 📚 Learning Resources

### Study the Code
1. Start with `Game.java` - understand main loop
2. Read `Player.java` - see player mechanics
3. Check `Enemy.java` - understand enemy behavior
4. Review `CraftingSystem.java` - see how systems work

### Modify Game Features
1. Add new weapon: Edit `WeaponType.java`
2. Add new enemy: Edit `EnemyType.java`
3. Add recipe: Edit `CraftingSystem.java`
4. Add skill: Edit `SkillTreeSystem.java`

---

## 🎓 Advanced Topics

### Extending the Game

#### Add New Tower:
```java
// In TowerManager.java, initializeTowers()
towers.add(new Tower("Tower Name", "Description", 12, 8));
```

#### Add Mini-Boss:
```java
// In EnemyManager.java, generateFloorEnemies()
Enemy miniBoss = createMiniBoss(x, y, difficulty);
enemies.add(miniBoss);
```

#### Create Custom Recipe:
```java
// In CraftingSystem.java
recipes.put("Item Name", new Recipe("Item Name",
    new Item[]{material1, material2},
    new Item("Result", ItemType.WEAPON)));
```

---

## 📞 Getting Help

### Common Questions

**Q: My game is laggy!**
A: Try closing other programs, reducing graphics settings, or checking your GPU drivers

**Q: How do I use the guide?**
A: Press G to open the in-game guide (when implemented)

**Q: Can I mod the game?**
A: Yes! Modify Java files and recompile

**Q: Where do I report bugs?**
A: Document the bug with steps to reproduce and system specs

---

## 🎮 Gameplay Strategies

### Tower Strategy
1. Scout the floor first
2. Identify mini-bosses before engaging
3. Save healing items for boss fights
4. Farm materials on easier difficulties first

### Combat Strategy
1. Keep distance when possible
2. Focus one enemy at a time
3. Use crowd control skills
4. Adopt hit-and-run tactics

### Progression Strategy
1. Focus on main story first
2. Side quests for extra experience
3. Craft better gear between towers
4. Build up specific weapon trees

---

## 🌟 Pro Tips

- Secret paths have better loot but harder enemies
- Boss patterns repeat - memorize them!
- Weapon synchronization increases with use - main weapon becomes strongest
- Crafted items are often better than drops
- Keep 10 inventory slots empty for loot
- Sell duplicate items for gold
- Visit NPC merchants regularly for special offers

---

**Ready to start? Launch the game and begin your adventure!**

May your fights be legendary! ⚔️
