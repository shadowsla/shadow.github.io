# Shadow's Tower RPG - Developer Guide

## 👨‍💻 For Game Developers & Modders

This guide explains the game architecture and how to extend features.

---

## 🏗️ Architecture Overview

### Game Loop
```
Initialize Systems
    ↓
Main Loop (60 FPS):
    ├─ Input Handling
    ├─ Update Logic (deltaTime)
    ├─ Collision Detection
    ├─ Render Graphics
    └─ Repeat
```

### Core Components

#### 1. Game Engine (`Game.java`)
- Initializes all systems
- Manages game loop
- Handles state transitions
- Coordinates rendering

#### 2. Rendering System (`GamePanel.java`)
- Double-buffered graphics
- Input capture
- 60 FPS targeting
- UI overlay rendering

#### 3. Entity System
- Base `Entity` class
- `Player` extends Entity
- `Enemy` extends Entity
- `Boss` extends Enemy

---

## 🔧 Extending Game Features

### Adding a New Weapon Type

1. **Add to `WeaponType.java`:**
```java
public enum WeaponType {
    // ... existing weapons ...
    NEW_WEAPON("Weapon Name", baseDamage, attackSpeed)
}
```

2. **Add weapon-specific skill in `SkillTreeSystem.java`:**
```java
private void initializeSkills(WeaponType weapon) {
    switch (weapon) {
        // ... existing cases ...
        case NEW_WEAPON:
            skills.put("SpecialSkill", new Skill("SpecialSkill", 
                "Description", 2.5, true));
            break;
    }
}
```

3. **Add rendering in `Player.java`:**
```java
case NEW_WEAPON:
    // Add custom render code
    break;
```

### Adding a New Enemy Type

1. **Add to `EnemyType.java`:**
```java
NEW_ENEMY("Enemy Name", level, baseHealth, baseDamage)
```

2. **Add loot table in `EnemyManager.java`:**
```java
private void addLootToEnemy(Enemy enemy, EnemyType type, int difficulty) {
    switch (type) {
        case NEW_ENEMY:
            enemy.addLoot(new Item("Special Drop", ItemType.CRAFTING_MATERIAL, 1));
            break;
    }
}
```

3. **Add rendering color in `Enemy.java`:**
```java
switch (type) {
    case NEW_ENEMY:
        g.setColor(new Color(R, G, B));
        break;
}
```

### Creating a New Tower

1. **Add to tower list in `TowerManager.java`:**
```java
towers.add(new Tower("Tower Name", "Description", floorCount, difficultyTier));
```

2. **Update UI displaying towers**

3. **Set difficulty-specific spawning in `EnemyManager.java`**

### Adding a New Crafting Recipe

1. **Edit `CraftingSystem.java`:**
```java
recipes.put("Unique Item", new Recipe("Unique Item",
    new Item[]{
        new Item("Material1", ItemType.CRAFTING_MATERIAL, 3),
        new Item("Material2", ItemType.CRAFTING_MATERIAL, 2)
    },
    new Item("Result Item", ItemType.WEAPON, 1, 2, 1, 500)
));
```

2. **Learn recipe in guild or by progression**

### Adding a Boss Battle

1. **Create Boss in `Boss.java`:**
```java
public Boss(String name, int x, int y, int floorNumber, ...) {
    // Initialize boss stats
    // Define attack patterns
    // Set loot table
}
```

2. **Spawn at last floor:**
```java
// In TowerManager.java
if (i == floorCount) {
    floors.add(new Floor(i, true));  // Boss floor
}
```

---

## 📊 System Communication

### Inventory Interaction Flow
```
Player Defense Pickup
    ↓
Add to Inventory
    ↓
Update UI
    ↓
Save Item Data
```

### Crafting Flow
```
Select Recipe
    ↓
Check Materials
    ↓
Consume Materials
    ↓
Create Item
    ↓
Add to Inventory
```

### Combat Flow
```
Player Attacks
    ↓
Deal Damage to Enemy
    ↓
Enemy Counterattacks
    ↓
Player Takes Damage
    ↓
Check Win/Lose Condition
```

---

## 🎯 Adding Game Mechanics

### Adding a Status Effect (Poison, Stun, etc.)

1. **Create Status enum:**
```java
public enum StatusEffect {
    POISON("Poison", 2.0, 5),  // duration, damage per tick
    STUN("Stun", 1.0, 0),
    BURN("Burn", 3.0, 10);
}
```

2. **Add to Entity:**
```java
private Map<StatusEffect, Double> activeEffects;

public void applyStatus(StatusEffect effect, double duration) {
    activeEffects.put(effect, duration);
}
```

3. **Update in entity update method:**
```java
public void update(double deltaTime) {
    for (StatusEffect effect : activeEffects.keySet()) {
        // Apply effect damage
        // Decrease duration
    }
}
```

### Adding a Special Ability

1. **Define ability:**
```java
public class Ability {
    String name;
    double cooldown;
    double manaCost;
    double damage;
    double attackSpeed;
}
```

2. **Add to Player:**
```java
private Ability[] abilities;

public void useAbility(Ability ability) {
    if (currentMana >= ability.manaCost && canUseAbility(ability)) {
        currentMana -= ability.manaCost;
        // Execute ability
    }
}
```

### Adding NPC Trading

1. **Create Merchant class:**
```java
public class Merchant {
    String name;
    Item[] inventory;
    Map<Item, Integer> prices;
    
    public void trade(Player player, Item item) {
        // Execute trade
    }
}
```

2. **Add to Tower:**
```java
private List<Merchant> merchants;

public void addMerchant(Merchant merchant) {
    merchants.add(merchant);
}
```

---

## 🔐 Best Practices

### Code Organization
- Keep related functionality together
- Use meaningful variable names
- Add comments for complex logic
- Follow Java naming conventions

### Performance Tips
- Cache frequently used objects
- Minimize garbage collection
- Use efficient data structures
- Profile code with profiler tools

### Testing Your Changes
1. Compile without errors
2. Test in different game states
3. Check for memory leaks
4. Verify edge cases

### Version Control
```bash
git init
git add .
git commit -m "Add new feature"
```

---

## 🎨 Customizing Appearance

### Changing Colors

**Player Color:**
```java
// In Player.render()
g.setColor(new Color(100, 200, 255));  // Blue
```

**Enemy Color:**
```java
// In Enemy.render()
g.setColor(new Color(255, 100, 100));  // Red
```

### Adjusting Sizes

**Player Size:**
```java
public Player(...) {
    super(x, y, 40, 40, maxHealth);  // width=40, height=40
}
```

**Enemy Size:**
```java
public Enemy(...) {
    super(x, y, 35, 35, health);  // width=35, height=35
}
```

---

## 📈 Debugging

### Enable Debug Output

Add to `Game.java`:
```java
private static final boolean DEBUG = true;

public static void debug(String message) {
    if (DEBUG) {
        System.out.println("[DEBUG] " + message);
    }
}
```

### Use IDE Debugger
1. Set breakpoint
2. Run in debug mode
3. Add watch expressions
4. Step through code

### Common Bugs

**Collision not working:**
- Check boundary conditions
- Verify entity positions
- Test with larger hitboxes

**Performance lag:**
- Profile heap usage
- Check for infinite loops
- Optimize rendering

**Game crashes:**
- Check null references
- Verify array bounds
- Handle exceptions properly

---

## 🧪 Adding Unit Tests

```java
import org.junit.Test;
import static org.junit.Assert.*;

public class GameTests {
    @Test
    public void testPlayerMovement() {
        Player player = new Player("Test", 100, 50, 0, 0, WeaponType.LONG_SWORD);
        player.moveRight();
        assertTrue(player.getX() > 0);
    }
    
    @Test
    public void testDamageCalculation() {
        Enemy enemy = new Enemy("Test", 0, 0, 1, 50, 10, 10, 10, EnemyType.GOBLIN);
        enemy.takeDamage(20);
        assertEquals(30, enemy.getCurrentHealth(), 1);
    }
}
```

---

## 📦 Packaging for Distribution

### Java Application
```bash
# Create JAR file
jar cfm RPGGame.jar Manifest.txt -C bin com/

# Run JAR
java -jar RPGGame.jar
```

### Web Application
```bash
# Copy web files to server
cp -r web/* /var/www/html/rpg/

# Access via browser
http://localhost/rpg/index.html
```

---

## 🚀 Performance Optimization

### Render Optimization
- Use hardware acceleration
- Batch rendering calls
- Avoid alpha blending when possible
- Optimize collision detection

### Memory Optimization
- Use object pooling for bullets/effects
- Reuse arrays instead of creating new ones
- Clear unused references
- Use primitives instead of objects when possible

### Algorithm Optimization
- Use spatial partitioning for collision
- A* pathfinding for enemy movement
- Cache calculations
- Lazy load assets

---

## 🔗 Class Relationships

```
Entity (abstract)
├── Player
│   ├── PlayerRank
│   ├── WeaponType
│   └── Armor
└── Enemy
    ├── EnemyType
    ├── AI
    └── Boss (extends Enemy)

Game
├── GamePanel
├── TowerManager
│   ├── Tower
│   └── Floor
├── EnemyManager
├── InventorySystem
│   └── Item
├── CraftingSystem
│   └── Recipe
├── SkillTreeSystem
│   └── Skill
├── GuildSystem
├── AudioManager
└── UIRenderer
```

---

## 📚 Further Reading

- **Java Game Development**: https://en.wikipedia.org/wiki/Video_game_graphics
- **UI/UX Design**: https://www.nngroup.com/articles/
- **Performance Testing**: Profile with JProfiler or YourKit

---

**Happy Developing! Make the game even more awesome!** 🎮✨
