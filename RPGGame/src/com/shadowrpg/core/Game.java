package com.shadowrpg.core;

import com.shadowrpg.entities.*;
import com.shadowrpg.systems.*;
import com.shadowrpg.world.*;
import com.shadowrpg.ui.*;
import com.shadowrpg.audio.*;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.*;

/**
 * Main RPG Game Engine - Shadow's Tower RPG
 * A comprehensive tower-climbing RPG with ranks, weapons, towers, and progression systems
 */
public class Game extends JFrame {
    private static final int WIDTH = 1280;
    private static final int HEIGHT = 720;
    private static final int TARGET_FPS = 60;

    private GamePanel gamePanel;
    private Player player;
    private TowerManager towerManager;
    private GameStateManager gameStateManager;
    private AudioManager audioManager;
    private InventorySystem inventorySystem;
    private CraftingSystem craftingSystem;
    private SkillTreeSystem skillTreeSystem;
    private GuildSystem guildSystem;
    private EnemyManager enemyManager;
    private UIRenderer uiRenderer;

    public Game() {
        setTitle("Shadow's Tower RPG - Tower Climbing Adventure");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(WIDTH, HEIGHT);
        setLocationRelativeTo(null);
        setResizable(false);
        setUndecorated(false);

        // Initialize systems
        audioManager = new AudioManager();
        gameStateManager = new GameStateManager();
        towerManager = new TowerManager();
        inventorySystem = new InventorySystem(50);
        craftingSystem = new CraftingSystem();
        skillTreeSystem = new SkillTreeSystem();
        guildSystem = new GuildSystem();
        enemyManager = new EnemyManager();
        uiRenderer = new UIRenderer(WIDTH, HEIGHT);

        // Initialize player
        player = new Player("Adventurer", 100, 50, 1, 1, WeaponType.LONG_SWORD);

        // Create game panel
        gamePanel = new GamePanel(this);
        add(gamePanel);

        setVisible(true);
        startGameLoop();
    }

    private void startGameLoop() {
        new Thread(() -> {
            long lastTime = System.nanoTime();
            long frameCounter = 0;
            long fpsTimer = System.currentTimeMillis();

            while (true) {
                long currentTime = System.nanoTime();
                double deltaTime = (currentTime - lastTime) / 1_000_000_000.0;
                lastTime = currentTime;

                update(deltaTime);
                gamePanel.repaint();

                frameCounter++;
                long elapsed = System.currentTimeMillis() - fpsTimer;
                if (elapsed >= 1000) {
                    gamePanel.setFPS((int) frameCounter);
                    frameCounter = 0;
                    fpsTimer = System.currentTimeMillis();
                }

                try {
                    Thread.sleep(1000 / TARGET_FPS);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    private void update(double deltaTime) {
        gameStateManager.update(deltaTime);

        switch (gameStateManager.getCurrentState()) {
            case MAIN_MENU:
                updateMainMenu();
                break;
            case TOWER_SELECTION:
                updateTowerSelection();
                break;
            case TOWER_FLOOR:
                updateTower(deltaTime);
                break;
            case GUILD:
                updateGuild();
                break;
            case CRAFTING:
                updateCrafting();
                break;
            case INVENTORY:
                updateInventory();
                break;
            case SKILL_TREE:
                updateSkillTree();
                break;
            case BOSS_BATTLE:
                updateBossBattle(deltaTime);
                break;
        }
    }

    private void updateMainMenu() {
        // Main menu logic
    }

    private void updateTowerSelection() {
        // Tower selection UI
    }

    private void updateTower(double deltaTime) {
        player.update(deltaTime);
        enemyManager.update(deltaTime, player);

        // Handle collisions and combat
        for (Enemy enemy : enemyManager.getEnemies()) {
            if (player.isCollidingWith(enemy)) {
                player.takeDamage(enemy.getDamage());
            }
        }

        // Check if all enemies defeated on floor
        if (enemyManager.getEnemies().isEmpty()) {
            towerManager.advanceFloor();
            if (towerManager.isCurrentTowerComplete()) {
                towerManager.nextTower();
                if (towerManager.isAllTowersComplete()) {
                    towerManager.spawnSeventhTower();
                }
            }
        }
    }

    private void updateGuild() {
        // Guild ranking logic
    }

    private void updateCrafting() {
        // Crafting system logic
    }

    private void updateInventory() {
        // Inventory management
    }

    private void updateSkillTree() {
        // Skill tree updates
    }

    private void updateBossBattle(double deltaTime) {
        // Boss battle logic
    }

    public void render(Graphics2D g) {
        // Clear screen
        g.setColor(Color.BLACK);
        g.fillRect(0, 0, WIDTH, HEIGHT);

        switch (gameStateManager.getCurrentState()) {
            case MAIN_MENU:
                renderMainMenu(g);
                break;
            case TOWER_SELECTION:
                renderTowerSelection(g);
                break;
            case TOWER_FLOOR:
                renderTower(g);
                break;
            case GUILD:
                renderGuild(g);
                break;
            case CRAFTING:
                renderCrafting(g);
                break;
            case INVENTORY:
                renderInventory(g);
                break;
            case SKILL_TREE:
                renderSkillTree(g);
                break;
            case BOSS_BATTLE:
                renderBossBattle(g);
                break;
        }

        // Draw HUD
        uiRenderer.renderHUD(g, player, gamePanel.getFPS());
    }

    private void renderMainMenu(Graphics2D g) {
        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.BOLD, 48));
        g.drawString("SHADOW'S TOWER RPG", WIDTH / 2 - 300, 100);

        g.setFont(new Font("Arial", Font.PLAIN, 24));
        g.drawString("Press ENTER to Start", WIDTH / 2 - 150, 250);
        g.drawString("Press I for Inventory", WIDTH / 2 - 150, 300);
        g.drawString("Press S for Skill Tree", WIDTH / 2 - 150, 350);
        g.drawString("Press G for Guild", WIDTH / 2 - 150, 400);
    }

    private void renderTowerSelection(Graphics2D g) {
        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.BOLD, 32));
        g.drawString("SELECT TOWER", WIDTH / 2 - 150, 50);

        g.setFont(new Font("Arial", Font.PLAIN, 20));
        String[] towerNames = towerManager.getTowerNames();
        for (int i = 0; i < towerNames.length; i++) {
            g.drawString((i + 1) + ". " + towerNames[i], 100, 150 + i * 60);
        }
    }

    private void renderTower(Graphics2D g) {
        // Render game world
        g.setColor(new Color(40, 40, 40));
        g.fillRect(0, 0, WIDTH, HEIGHT);

        // Render floor
        g.setColor(new Color(60, 60, 60));
        g.fillRect(100, 150, 1080, 500);

        // Render player
        player.render(g);

        // Render enemies
        for (Enemy enemy : enemyManager.getEnemies()) {
            enemy.render(g);
        }
    }

    private void renderGuild(Graphics2D g) {
        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.BOLD, 32));
        g.drawString("GUILD", WIDTH / 2 - 100, 50);

        g.setFont(new Font("Arial", Font.PLAIN, 20));
        g.drawString("Current Rank: " + player.getRank(), 100, 150);
        g.drawString("Experience: " + player.getExperience() + "/" + player.getExperienceToNextRank(), 100, 200);
    }

    private void renderCrafting(Graphics2D g) {
        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.BOLD, 32));
        g.drawString("CRAFTING", WIDTH / 2 - 120, 50);
    }

    private void renderInventory(Graphics2D g) {
        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.BOLD, 32));
        g.drawString("INVENTORY", WIDTH / 2 - 120, 50);
        
        g.setFont(new Font("Arial", Font.PLAIN, 16));
        g.drawString("Items: " + inventorySystem.getItems().size() + "/" + inventorySystem.getMaxCapacity(), 100, 150);
    }

    private void renderSkillTree(Graphics2D g) {
        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.BOLD, 32));
        g.drawString("SKILL TREE", WIDTH / 2 - 120, 50);
    }

    private void renderBossBattle(Graphics2D g) {
        g.setColor(Color.DARK_GRAY);
        g.fillRect(0, 0, WIDTH, HEIGHT);
        g.setColor(Color.RED);
        g.setFont(new Font("Arial", Font.BOLD, 40));
        g.drawString("BOSS BATTLE!", WIDTH / 2 - 200, 100);
    }

    public Player getPlayer() {
        return player;
    }

    public GameStateManager getGameStateManager() {
        return gameStateManager;
    }

    public TowerManager getTowerManager() {
        return towerManager;
    }

    public InventorySystem getInventorySystem() {
        return inventorySystem;
    }

    public EnemyManager getEnemyManager() {
        return enemyManager;
    }

    public AudioManager getAudioManager() {
        return audioManager;
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new Game());
    }
}
