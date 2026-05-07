package com.shadowrpg.entities;

import java.awt.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Enemy - Base class for all enemies
 */
public class Enemy extends Entity {
    protected String name;
    protected int level;
    protected int damage;
    protected int experienceReward;
    protected int goldReward;
    protected double attackCooldown;
    protected double attackTimer;
    protected AI ai;
    protected java.util.List<Item> lootTable;
    protected Vector targetDirection;
    protected EnemyType type;
    
    public AI getAI() { return ai; }

    public Enemy(String name, int x, int y, int level, int health, int damage, 
                 int expReward, int goldReward, EnemyType type) {
        super(x, y, 35, 35, health);
        this.name = name;
        this.level = level;
        this.damage = damage;
        this.experienceReward = expReward;
        this.goldReward = goldReward;
        this.attackCooldown = 1.5 + (Math.random() * 1.0);
        this.attackTimer = attackCooldown;
        this.ai = new AI();
        this.lootTable = new ArrayList<>();
        this.targetDirection = new Vector(1, 0);
        this.type = type;
        this.velocityX = (Math.random() - 0.5) * 3;
        this.velocityY = (Math.random() - 0.5) * 3;
    }

    @Override
    public void update(double deltaTime) {
        if (!isAlive) return;

        // Update position
        x += (int) (velocityX * deltaTime * 60);
        y += (int) (velocityY * deltaTime * 60);

        // Random movement
        if (Math.random() < 0.01) {
            velocityX = (Math.random() - 0.5) * 4;
            velocityY = (Math.random() - 0.5) * 4;
        }

        // Boundary checking
        if (x < 100) velocityX = Math.abs(velocityX);
        if (x > 1180) velocityX = -Math.abs(velocityX);
        if (y < 150) velocityY = Math.abs(velocityY);
        if (y > 650) velocityY = -Math.abs(velocityY);

        // Update attack timer
        attackTimer += deltaTime;
    }

    @Override
    public void render(Graphics2D g) {
        // Draw enemy based on type
        switch (type) {
            case GOBLIN:
                g.setColor(new Color(100, 150, 100));
                break;
            case ORC:
                g.setColor(new Color(150, 100, 100));
                break;
            case SKELETON:
                g.setColor(Color.WHITE);
                break;
            case ZOMBIE:
                g.setColor(new Color(100, 150, 100));
                break;
            case DEMON:
                g.setColor(new Color(200, 50, 50));
                break;
            case DRAGON:
                g.setColor(new Color(200, 150, 50));
                break;
            case GOLEM:
                g.setColor(Color.GRAY);
                break;
            default:
                g.setColor(Color.RED);
        }

        g.fillRect(x, y, width, height);

        // Draw outline
        g.setColor(Color.YELLOW);
        g.setStroke(new BasicStroke(2));
        g.drawRect(x, y, width, height);

        // Draw health bar
        drawHealthBar(g);
    }

    private void drawHealthBar(Graphics2D g) {
        int barWidth = 40;
        int barHeight = 4;
        int barX = x - 2;
        int barY = y - 8;

        g.setColor(Color.DARK_GRAY);
        g.fillRect(barX, barY, barWidth, barHeight);

        int healthWidth = (int) ((currentHealth / (double) maxHealth) * barWidth);
        g.setColor(Color.RED);
        g.fillRect(barX, barY, healthWidth, barHeight);

        g.setColor(Color.WHITE);
        g.setStroke(new BasicStroke(1));
        g.drawRect(barX, barY, barWidth, barHeight);
    }

    public void addLoot(Item item) {
        lootTable.add(item);
    }

    public java.util.List<Item> dropLoot() {
        java.util.List<Item> dropped = new ArrayList<>();
        for (Item item : lootTable) {
            if (Math.random() < 0.3) { // 30% drop chance per item
                dropped.add(item);
            }
        }
        return dropped;
    }

    public boolean canAttack() {
        return attackTimer >= attackCooldown;
    }

    public void resetAttackTimer() {
        attackTimer = 0;
    }

    // Getters
    public String getName() { return name; }
    public int getLevel() { return level; }
    public int getDamage() { return damage; }
    public int getExperienceReward() { return experienceReward; }
    public int getGoldReward() { return goldReward; }
    public EnemyType getType() { return type; }
}
