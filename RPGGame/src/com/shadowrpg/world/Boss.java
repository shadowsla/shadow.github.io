package com.shadowrpg.world;

import com.shadowrpg.entities.*;
import java.awt.*;
import java.util.*;

/**
 * Boss - Special boss enemies for tower culminations
 */
public class Boss extends Enemy {
    private int phase;
    private double phaseTimer;
    private java.util.List<BossAttack> attacks;
    private String specialAbility;
    private int miniBossDefeated;

    public Boss(String name, int x, int y, int floorNumber, int health, int damage, 
                int expReward, int tier) {
        super(name, x, y, floorNumber, health, damage, expReward, 0, EnemyType.DRAGON);
        this.phase = 1;
        this.phaseTimer = 0;
        this.attacks = new ArrayList<>();
        this.miniBossDefeated = 0;
        initializeBossAttacks(tier);
        initializeBossLoot(tier);
    }

    private void initializeBossAttacks(int tier) {
        attacks.add(new BossAttack("Slam", 25 + (tier * 5), 2.0));
        attacks.add(new BossAttack("Breath Attack", 35 + (tier * 5), 3.0));
        attacks.add(new BossAttack("Stomp", 30 + (tier * 4), 2.5));
        
        if (tier >= 3) {
            attacks.add(new BossAttack("Whirlwind", 40 + (tier * 5), 3.5));
        }
        if (tier >= 5) {
            attacks.add(new BossAttack("Ultimate Attack", 60 + (tier * 10), 5.0));
        }
    }

    private void initializeBossLoot(int tier) {
        // Add rare and epic loot
        lootTable.add(new Item("Boss Soul", ItemType.CRAFTING_MATERIAL, tier));
        lootTable.add(new Item("Ancient Relic", "Powerful artifact", ItemType.TREASURE, 3, 1, tier * 100));
        lootTable.add(new Item("Legendary Weapon", "Ultimate weapon", ItemType.WEAPON, 4, 1, tier * 500));
    }

    @Override
    public void update(double deltaTime) {
        super.update(deltaTime);
        phaseTimer += deltaTime;

        // Boss changes phase at 66% and 33% health
        if (currentHealth < maxHealth * 0.66 && phase == 1) {
            phase = 2;
            phaseTimer = 0;
        } else if (currentHealth < maxHealth * 0.33 && phase == 2) {
            phase = 3;
            phaseTimer = 0;
        }
    }

    @Override
    public void render(Graphics2D g) {
        // Draw boss (larger and more detailed)
        switch (phase) {
            case 1:
                g.setColor(new Color(200, 100, 50)); // Orange
                break;
            case 2:
                g.setColor(new Color(255, 100, 0)); // Red-orange
                break;
            case 3:
                g.setColor(new Color(255, 0, 0)); // Red
                break;
        }

        // Draw larger boss sprite
        g.fillRect(x - 15, y - 15, 70, 70);
        
        // Draw boss outline
        g.setColor(Color.YELLOW);
        g.setStroke(new BasicStroke(3));
        g.drawRect(x - 15, y - 15, 70, 70);

        // Draw phase indicator
        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.BOLD, 16));
        g.drawString("Phase: " + phase, x - 10, y - 20);

        // Draw health bar
        drawBossHealthBar(g);
    }

    private void drawBossHealthBar(Graphics2D g) {
        int barWidth = 200;
        int barHeight = 20;
        int barX = x - barWidth / 2;
        int barY = y - 80;

        // Background
        g.setColor(Color.DARK_GRAY);
        g.fillRect(barX, barY, barWidth, barHeight);

        // Health
        int healthWidth = (int) ((currentHealth / (double) maxHealth) * barWidth);
        g.setColor(Color.GREEN);
        g.fillRect(barX, barY, healthWidth, barHeight);

        // Border
        g.setColor(Color.WHITE);
        g.setStroke(new BasicStroke(2));
        g.drawRect(barX, barY, barWidth, barHeight);

        // Health text
        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.BOLD, 14));
        g.drawString((int) currentHealth + "/" + maxHealth, barX + barWidth / 2 - 40, barY + 15);
    }

    public BossAttack getRandomAttack() {
        return attacks.get((int) (Math.random() * attacks.size()));
    }

    public int getPhase() { return phase; }
    public java.util.List<BossAttack> getAttacks() { return attacks; }

    public static class BossAttack {
        public String name;
        public int damage;
        public double cooldown;
        public double timer;

        public BossAttack(String name, int damage, double cooldown) {
            this.name = name;
            this.damage = damage;
            this.cooldown = cooldown;
            this.timer = 0;
        }
    }
}
