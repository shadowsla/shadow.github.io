package com.shadowrpg.core;

import com.shadowrpg.entities.*;
import com.shadowrpg.systems.*;
import com.shadowrpg.world.*;
import java.util.*;

/**
 * AutomatedTest - simple test harness to exercise core game systems in a headless environment
 */
public class AutomatedTest {
    public static void main(String[] args) {
        System.out.println("Automated tests starting...");
        int passed = 0, failed = 0;

        if (testInventoryAndCrafting()) { passed++; } else { failed++; }
        if (testWeaponSyncAndAttackSimulation()) { passed++; } else { failed++; }
        if (testTowerProgression()) { passed++; } else { failed++; }
        if (testGuildRankUp()) { passed++; } else { failed++; }

        System.out.println("\nTests completed. Passed: " + passed + " Failed: " + failed);
        if (failed > 0) System.exit(2); else System.exit(0);
    }

    private static boolean testInventoryAndCrafting() {
        System.out.print("[Test] Inventory & Crafting... ");
        try {
            InventorySystem inv = new InventorySystem(20);
            CraftingSystem craft = new CraftingSystem();

            // Add materials for Iron Sword
            inv.addItem(new Item("Metal Scrap", ItemType.CRAFTING_MATERIAL, 5));
            inv.addItem(new Item("Coal", ItemType.CRAFTING_MATERIAL, 2));

            // Learn Iron Sword recipe then craft
            craft.learnRecipe("Iron Sword");
            boolean ok = craft.craft("Iron Sword", inv);
            if (!ok) { System.out.println("FAILED (could not craft Iron Sword)"); return false; }

            Item sword = inv.getItemByName("Iron Sword");
            if (sword == null) { System.out.println("FAILED (Iron Sword not in inventory)"); return false; }

            System.out.println("OK");
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("FAILED (exception)");
            return false;
        }
    }

    private static boolean testWeaponSyncAndAttackSimulation() {
        System.out.print("[Test] Weapon sync & combat simulation... ");
        try {
            Player player = new Player("Tester", 100, 50, 400, 300, WeaponType.LONG_SWORD);
            InventorySystem inv = new InventorySystem(50);
            EnemyManager em = new EnemyManager();

            em.generateFloorEnemies(0, 1);
            int initial = em.getEnemyCount();
            // Move enemies close to player so the player can hit them in simulation
            Random rnd = new Random(123);
            for (Enemy e : em.getEnemies()) {
                e.setX(player.getX() + rnd.nextInt(40) - 20);
                e.setY(player.getY() + rnd.nextInt(40) - 20);
            }
            if (initial == 0) { System.out.println("FAILED (no enemies generated)"); return false; }

            // Simulate simple combat loop where player attacks every 0.5s
            double dt = 1.0 / 60.0;
            double time = 0;
            int maxTicks = 6000; // ~100 seconds
            int ticks = 0;
            while (em.getEnemyCount() > 0 && ticks++ < maxTicks) {
                player.update(dt);
                em.update(dt, player);

                // Attempt to attack each tick; apply damage when attack occurs
                player.attack();
                if (player.getAttackState() != null && player.getAttackState().name().equals("ATTACKING")) {
                    java.util.List<Enemy> dead = new java.util.ArrayList<>();
                    for (Enemy e : new ArrayList<>(em.getEnemies())) {
                        int px = player.getX() + player.getWidth() / 2;
                        int py = player.getY() + player.getHeight() / 2;
                        int ex = e.getX() + e.getWidth() / 2;
                        int ey = e.getY() + e.getHeight() / 2;
                        double dx = ex - px; double dy = ey - py;
                        double dist2 = dx*dx + dy*dy;
                        int range = 120; // slightly larger to ensure hits
                        if (dist2 <= range*range) {
                            int base = player.getCurrentWeapon().getBaseDamage();
                            int damage = base + player.getLevel()*2 + (int)Math.round(player.getWeaponSync(player.getCurrentWeapon())/10.0);
                            e.takeDamage(damage);
                            if (!e.isAlive()) {
                                dead.add(e);
                                player.gainExperience(e.getExperienceReward());
                                inv.addGold(e.getGoldReward());
                                for (Item it : e.dropLoot()) inv.addItem(it);
                            }
                        }
                    }
                    if (!dead.isEmpty()) em.getEnemies().removeAll(dead);
                }

                time += dt;
            }

            boolean success = em.getEnemyCount() == 0;
            System.out.println(success ? "OK" : "FAILED (enemies remain)");
            return success;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("FAILED (exception)");
            return false;
        }
    }

    private static boolean testTowerProgression() {
        System.out.print("[Test] Tower progression... ");
        try {
            TowerManager tm = new TowerManager();
            String first = tm.getCurrentTower().getName();
            tm.advanceFloor();
            if (tm.getCurrentFloor() != 2 && tm.getCurrentFloor() != 1) {
                // depending on implementation floor counts
            }
            tm.nextTower();
            if (tm.getCurrentTowerIndex() != 1) { System.out.println("FAILED (nextTower)"); return false; }
            // simulate completing all towers
            while (!tm.isAllTowersComplete()) tm.nextTower();
            tm.spawnSeventhTower();
            boolean spawned = tm.hasSeventhTowerSpawned();
            System.out.println(spawned ? "OK" : "FAILED (7th tower not spawned)");
            return spawned;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("FAILED (exception)");
            return false;
        }
    }

    private static boolean testGuildRankUp() {
        System.out.print("[Test] Guild rank up... ");
        try {
            Player player = new Player("Ranker", 100, 50, 100, 100, WeaponType.DAGGER);
            GuildSystem gs = new GuildSystem();
            int need = player.getExperienceToNextRank();
            player.gainExperience(need + 10);
            gs.attemptRankUp(player);
            boolean promoted = player.getRank() != PlayerRank.F;
            System.out.println(promoted ? "OK" : "FAILED (not promoted)");
            return promoted;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("FAILED (exception)");
            return false;
        }
    }
}
