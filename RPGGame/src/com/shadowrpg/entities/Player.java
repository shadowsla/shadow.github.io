package com.shadowrpg.entities;

import java.awt.*;
import java.util.*;

/**
 * Player - Main player character
 */
public class Player extends Entity {
    private String playerName;
    private PlayerRank rank;
    private int experience;
    private int level;
    private WeaponType currentWeapon;
    private Map<WeaponType, Double> weaponSynchronization;
    private Map<WeaponType, Integer> weaponLevels;
    private double healthRegenRate;
    private double manaRegenRate;
    private int currentMana;
    private int maxMana;
    private Armor currentArmor;
    private AttackState attackState;
    private double attackCooldown;
    private double attackTimer;
    private Vector attackDirection;

    public Player(String name, int maxHealth, int maxMana, int x, int y, WeaponType startingWeapon) {
        super(x, y, 40, 40, maxHealth);
        this.playerName = name;
        this.maxMana = maxMana;
        this.currentMana = maxMana;
        this.rank = PlayerRank.F;
        this.experience = 0;
        this.level = 1;
        this.currentWeapon = startingWeapon;
        this.currentArmor = new Armor("Leather Armor", 10, 0);
        this.attackState = AttackState.IDLE;
        this.attackTimer = 0;
        this.attackCooldown = 1.0 / currentWeapon.getAttackSpeed();
        this.healthRegenRate = 0.5;
        this.manaRegenRate = 0.3;
        this.attackDirection = new Vector(1, 0);

        // Initialize weapon synchronization and levels
        this.weaponSynchronization = new HashMap<>();
        this.weaponLevels = new HashMap<>();
        for (WeaponType weapon : WeaponType.values()) {
            weaponSynchronization.put(weapon, 0.0);
            weaponLevels.put(weapon, 1);
        }
        weaponSynchronization.put(startingWeapon, 10.0);
    }

    @Override
    public void update(double deltaTime) {
        // Update position
        x += (int) velocityX;
        y += (int) velocityY;
        velocityX = 0;
        velocityY = 0;

        // Regenerate health and mana
        if (currentHealth < maxHealth) {
            currentHealth += healthRegenRate * deltaTime;
            if (currentHealth > maxHealth) {
                currentHealth = maxHealth;
            }
        }

        if (currentMana < maxMana) {
            currentMana += manaRegenRate * deltaTime;
            if (currentMana > maxMana) {
                currentMana = maxMana;
            }
        }

        // Update attack cooldown
        if (attackTimer < attackCooldown) {
            attackTimer += deltaTime;
        } else {
            attackState = AttackState.IDLE;
        }
    }

    @Override
    public void render(Graphics2D g) {
        // Draw player body
        g.setColor(new Color(100, 200, 255));
        g.fillRect(x, y, width, height);

        // Draw armor color overlay if wearing armor
        if (currentArmor != null) {
            g.setColor(new Color(150, 150, 150, 100));
            g.fillRect(x, y, width, height);
        }

        // Draw player outline
        g.setColor(Color.CYAN);
        g.setStroke(new BasicStroke(2));
        g.drawRect(x, y, width, height);

        // Draw weapon
        renderWeapon(g);

        // Draw attack effect if attacking
        if (attackState == AttackState.ATTACKING) {
            renderAttackEffect(g);
        }

        // Draw health bar
        drawHealthBar(g);
    }

    private void renderWeapon(Graphics2D g) {
        g.setColor(Color.ORANGE);
        g.setStroke(new BasicStroke(3));

        double angle = Math.atan2(attackDirection.y, attackDirection.x);
        int targetX = x + 20 + (int) (Math.cos(angle) * 30);
        int targetY = y + 20 + (int) (Math.sin(angle) * 30);

        switch (currentWeapon) {
            case SHORT_SWORD:
            case LONG_SWORD:
            case KATANA:
                g.drawLine(x + 20, y + 20, targetX, targetY);
                break;
            case SPEAR:
            case HALBERD:
                g.drawLine(x + 20, y + 20, targetX, targetY);
                g.drawOval(targetX - 3, targetY - 3, 6, 6);
                break;
            case AXE:
            case MACE:
            case WARHAMMER:
                g.fillOval(targetX - 8, targetY - 8, 16, 16);
                break;
            case BOW:
            case CROSSBOW:
                g.drawLine(x + 20, y + 10, x + 20, y + 30);
                g.drawLine(x + 15, y + 20, x + 25, y + 20);
                break;
            case GAUNTLETS:
                g.drawOval(x + 15, y + 15, 10, 10);
                break;
            case SCYTHE:
                g.drawLine(x + 20, y + 20, targetX, targetY);
                g.drawArc(targetX - 10, targetY - 10, 20, 20, 0, 180);
                break;
        }
    }

    private void renderAttackEffect(Graphics2D g) {
        g.setColor(new Color(255, 255, 0, 100));
        double angle = Math.atan2(attackDirection.y, attackDirection.x);
        int effectX = x + 20 + (int) (Math.cos(angle) * 40);
        int effectY = y + 20 + (int) (Math.sin(angle) * 40);
        g.fillOval(effectX - 15, effectY - 15, 30, 30);
    }

    private void drawHealthBar(Graphics2D g) {
        int barWidth = 50;
        int barHeight = 5;
        int barX = x - 5;
        int barY = y - 10;

        // Background
        g.setColor(Color.DARK_GRAY);
        g.fillRect(barX, barY, barWidth, barHeight);

        // Health
        int healthWidth = (int) ((currentHealth / (double) maxHealth) * barWidth);
        g.setColor(Color.GREEN);
        g.fillRect(barX, barY, healthWidth, barHeight);

        // Border
        g.setColor(Color.WHITE);
        g.setStroke(new BasicStroke(1));
        g.drawRect(barX, barY, barWidth, barHeight);
    }

    public void moveUp() {
        y -= 5;
        velocityY = -5;
    }

    public void moveDown() {
        y += 5;
        velocityY = 5;
    }

    public void moveLeft() {
        x -= 5;
        velocityX = -5;
        attackDirection.x = -1;
        attackDirection.y = 0;
    }

    public void moveRight() {
        x += 5;
        velocityX = 5;
        attackDirection.x = 1;
        attackDirection.y = 0;
    }

    public void attack() {
        if (attackTimer >= attackCooldown) {
            attackState = AttackState.ATTACKING;
            attackTimer = 0;
            
            // Increase weapon synchronization
            double currentSync = weaponSynchronization.getOrDefault(currentWeapon, 0.0);
            weaponSynchronization.put(currentWeapon, currentSync + 0.1);
        }
    }

    public void switchWeapon(WeaponType newWeapon) {
        this.currentWeapon = newWeapon;
        this.attackCooldown = 1.0 / currentWeapon.getAttackSpeed();
    }

    public void gainExperience(int amount) {
        this.experience += amount;
        
        // Check for rank up
        if (experience >= rank.getNextRank().getExperienceRequired() && !rank.isMaxRank()) {
            rankUp();
        }
    }

    public void rankUp() {
        if (!rank.isMaxRank()) {
            rank = rank.getNextRank();
            maxHealth += 50;
            currentHealth = maxHealth;
            maxMana += 25;
            currentMana = maxMana;
        }
    }

    public boolean isCollidingWith(Entity other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }

    @Override
    public void takeDamage(int damage) {
        // Apply armor defense
        int armorDefense = currentArmor != null ? currentArmor.getDefense() : 0;
        int actualDamage = Math.max(1, damage - armorDefense);
        super.takeDamage(actualDamage);
    }

    // Getters and Setters
    public String getPlayerName() { return playerName; }
    public PlayerRank getRank() { return rank; }
    public int getExperience() { return experience; }
    public int getExperienceToNextRank() { return rank.getNextRank().getExperienceRequired(); }
    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }
    public WeaponType getCurrentWeapon() { return currentWeapon; }
    public Map<WeaponType, Double> getWeaponSynchronization() { return weaponSynchronization; }
    public double getWeaponSync(WeaponType weapon) { 
        return weaponSynchronization.getOrDefault(weapon, 0.0); 
    }
    public int getCurrentMana() { return (int) currentMana; }
    public int getMaxMana() { return maxMana; }
    public AttackState getAttackState() { return attackState; }
}
