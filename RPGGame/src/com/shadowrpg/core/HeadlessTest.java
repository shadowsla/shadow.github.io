package com.shadowrpg.core;

import com.shadowrpg.entities.Player;
import com.shadowrpg.entities.WeaponType;
import com.shadowrpg.systems.EnemyManager;
import com.shadowrpg.systems.InventorySystem;
import com.shadowrpg.world.TowerManager;

public class HeadlessTest {
    public static void main(String[] args) {
        System.out.println("Headless test starting...");

        Player player = new Player("Tester", 100, 50, 100, 100, WeaponType.LONG_SWORD);
        InventorySystem inventory = new InventorySystem(20);
        EnemyManager enemyManager = new EnemyManager();
        TowerManager towerManager = new TowerManager();

        // Generate enemies for tower 0 floor 1
        enemyManager.generateFloorEnemies(0, 1);
        System.out.println("Generated enemies: " + enemyManager.getEnemyCount());

        // Simulate a few update ticks
        for (int tick = 0; tick < 120; tick++) {
            double dt = 1.0 / 60.0;
            player.update(dt);
            enemyManager.update(dt, player);
        }

        System.out.println("After simulation - enemies remaining: " + enemyManager.getEnemyCount());
        System.out.println("Player health: " + player.getCurrentHealth());
        System.out.println("Inventory size: " + inventory.getItems().size());
        System.out.println("Headless test completed.");
    }
}
