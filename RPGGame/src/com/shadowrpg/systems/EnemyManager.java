package com.shadowrpg.systems;

import com.shadowrpg.entities.*;
import java.util.*;

/**
 * EnemyManager - Manages enemy spawning and updates
 */
public class EnemyManager {
    private List<Enemy> enemies;
    private List<Enemy> enemiesToRemove;
    private Random random;

    public EnemyManager() {
        this.enemies = new ArrayList<>();
        this.enemiesToRemove = new ArrayList<>();
        this.random = new Random();
    }

    public void generateFloorEnemies(int towerIndex, int floorNumber) {
        enemies.clear();
        int enemyCount = 3 + (floorNumber * 2);
        int baseDifficulty = (towerIndex + 1) * 5;

        EnemyType[] enemyTypes = EnemyType.values();

        for (int i = 0; i < enemyCount; i++) {
            EnemyType type = enemyTypes[random.nextInt(Math.min(i + 3, enemyTypes.length))];
            int x = 150 + random.nextInt(1000);
            int y = 200 + random.nextInt(400);

            Enemy enemy = createEnemy(type, x, y, baseDifficulty + floorNumber);
            enemies.add(enemy);
        }

        // Add mini-bosses
        if (floorNumber > 2 && floorNumber % 3 == 0) {
            Enemy miniBoss = createMiniBoss(
                600 + random.nextInt(80),
                300 + random.nextInt(200),
                baseDifficulty + floorNumber + 5
            );
            enemies.add(miniBoss);
        }
    }

    private Enemy createEnemy(EnemyType type, int x, int y, int difficulty) {
        int health = type.getBaseHealth() + (difficulty * 5);
        int damage = type.getBaseDamage() + difficulty;
        int expReward = 50 * difficulty;
        int goldReward = 10 * difficulty;

        Enemy enemy = new Enemy(type.getName(), x, y, type.getLevel() + difficulty / 5, 
                                health, damage, expReward, goldReward, type);

        // Add loot
        addLootToEnemy(enemy, type, difficulty);
        return enemy;
    }

    private Enemy createMiniBoss(int x, int y, int difficulty) {
        Enemy miniBoss = new Enemy(
            "Mini Boss", x, y, difficulty,
            200 + (difficulty * 10),
            30 + difficulty,
            500 * difficulty,
            100 * difficulty,
            EnemyType.DEMON
        );
        
        // Mini-boss gets better loot
        miniBoss.addLoot(new Item("Rare Essence", "Powerful essence", ItemType.CRAFTING_MATERIAL, 2, 1, 200));
        miniBoss.addLoot(new Item("Mini Boss Trophy", "Victory proof", ItemType.TREASURE, 2, 1, 500));
        
        return miniBoss;
    }

    private void addLootToEnemy(Enemy enemy, EnemyType type, int difficulty) {
        // Common drops
        enemy.addLoot(new Item(type.getName() + " Loot", ItemType.CRAFTING_MATERIAL, 1));
        
        // Chance for weapon material
        if (Math.random() < 0.2) {
            enemy.addLoot(new Item("Metal Scrap", ItemType.CRAFTING_MATERIAL, 1));
        }

        // Chance for rarer items based on difficulty
        if (Math.random() < (difficulty * 0.01)) {
            enemy.addLoot(new Item("Rare Gem", "Shiny gem", ItemType.TREASURE, 2, 1, 100 * difficulty));
        }
    }

    public void update(double deltaTime, Player player) {
        enemiesToRemove.clear();

        for (Enemy enemy : enemies) {
            if (!enemy.isAlive()) {
                enemiesToRemove.add(enemy);
            } else {
                enemy.update(deltaTime);
                // use getter to access AI (ai is protected)
                enemy.getAI().update(deltaTime, enemy, player);
                
                // Check if enemy can attack player
                if (enemy.canAttack() && enemy.isCollidingWith(player)) {
                    player.takeDamage(enemy.getDamage());
                    enemy.resetAttackTimer();
                }
            }
        }

        enemies.removeAll(enemiesToRemove);
    }

    public void removeAllEnemies() {
        enemies.clear();
    }

    public List<Enemy> getEnemies() { return enemies; }
    public int getEnemyCount() { return enemies.size(); }
}
