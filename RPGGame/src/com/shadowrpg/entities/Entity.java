package com.shadowrpg.entities;

import java.awt.*;

/**
 * Entity - Base class for all entities in the game
 */
public abstract class Entity {
    protected int x;
    protected int y;
    protected int width;
    protected int height;
    protected int maxHealth;
    protected double currentHealth;
    protected double velocityX;
    protected double velocityY;
    protected boolean isAlive;

    public Entity(int x, int y, int width, int height, int maxHealth) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isAlive = true;
    }

    public abstract void update(double deltaTime);
    public abstract void render(Graphics2D g);

    public void takeDamage(int damage) {
        currentHealth -= damage;
        if (currentHealth <= 0) {
            isAlive = false;
            currentHealth = 0;
        }
    }

    public void heal(int amount) {
        currentHealth += amount;
        if (currentHealth > maxHealth) {
            currentHealth = maxHealth;
        }
    }

    public boolean isCollidingWith(Entity other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }

    // Getters
    public int getX() { return x; }
    public int getY() { return y; }
    public int getWidth() { return width; }
    public int getHeight() { return height; }
    public int getMaxHealth() { return maxHealth; }
    public double getCurrentHealth() { return currentHealth; }
    public double getHealthPercentage() { return (currentHealth / maxHealth) * 100; }
    public boolean isAlive() { return isAlive; }
    public double getVelocityX() { return velocityX; }
    public double getVelocityY() { return velocityY; }

    // Setters
    public void setX(int x) { this.x = x; }
    public void setY(int y) { this.y = y; }
    public void setVelocityX(double v) { this.velocityX = v; }
    public void setVelocityY(double v) { this.velocityY = v; }
}
