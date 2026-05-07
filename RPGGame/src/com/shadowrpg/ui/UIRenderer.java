package com.shadowrpg.ui;

import com.shadowrpg.entities.Player;
import java.awt.*;

/**
 * UIRenderer - Renders game UI elements
 */
public class UIRenderer {
    private int screenWidth;
    private int screenHeight;

    public UIRenderer(int screenWidth, int screenHeight) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
    }

    public void renderHUD(Graphics2D g, Player player, int fps) {
        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.PLAIN, 14));

        // Player info top-left
        g.drawString("Player: " + player.getPlayerName(), 10, 25);
        g.drawString("Rank: " + player.getRank().getDisplayName(), 10, 45);
        g.drawString("Level: " + player.getLevel(), 10, 65);

        // Health and Mana top-left
        renderHealthBar(g, 10, 85, player);
        renderManaBar(g, 10, 105, player);

        // Current weapon top-left
        g.drawString("Weapon: " + player.getCurrentWeapon().getWeaponName(), 10, 140);
        double sync = player.getWeaponSync(player.getCurrentWeapon());
        g.drawString("Sync: " + String.format("%.1f%%", sync), 10, 160);

        // FPS top-right
        g.setColor(new Color(0, 255, 0));
        g.drawString("FPS: " + fps, screenWidth - 100, 25);

        // Gold bottom-left
        g.setColor(Color.YELLOW);
        g.drawString("Gold: 0", 10, screenHeight - 20);
    }

    private void renderHealthBar(Graphics2D g, int x, int y, Player player) {
        int barWidth = 200;
        int barHeight = 15;

        // Background
        g.setColor(Color.DARK_GRAY);
        g.fillRect(x, y, barWidth, barHeight);

        // Health
        int healthWidth = (int) ((player.getCurrentHealth() / (double) player.getMaxHealth()) * barWidth);
        g.setColor(Color.GREEN);
        g.fillRect(x, y, healthWidth, barHeight);

        // Border
        g.setColor(Color.WHITE);
        g.setStroke(new BasicStroke(1));
        g.drawRect(x, y, barWidth, barHeight);

        // Text
        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.PLAIN, 12));
        g.drawString((int) player.getCurrentHealth() + "/" + player.getMaxHealth(), x + 70, y + 13);
    }

    private void renderManaBar(Graphics2D g, int x, int y, Player player) {
        int barWidth = 200;
        int barHeight = 15;

        // Background
        g.setColor(Color.DARK_GRAY);
        g.fillRect(x, y, barWidth, barHeight);

        // Mana
        int manaWidth = (int) ((player.getCurrentMana() / (double) player.getMaxMana()) * barWidth);
        g.setColor(Color.BLUE);
        g.fillRect(x, y, manaWidth, barHeight);

        // Border
        g.setColor(Color.WHITE);
        g.setStroke(new BasicStroke(1));
        g.drawRect(x, y, barWidth, barHeight);

        // Text
        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.PLAIN, 12));
        g.drawString(player.getCurrentMana() + "/" + player.getMaxMana(), x + 70, y + 13);
    }

    public void renderMenu(Graphics2D g, String title, String[] options, int selectedIndex) {
        g.setColor(new Color(0, 0, 0, 150));
        g.fillRect(0, 0, screenWidth, screenHeight);

        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.BOLD, 32));
        g.drawString(title, screenWidth / 2 - title.length() * 8, 100);

        g.setFont(new Font("Arial", Font.PLAIN, 24));
        for (int i = 0; i < options.length; i++) {
            if (i == selectedIndex) {
                g.setColor(Color.YELLOW);
                g.drawString("> " + options[i] + " <", screenWidth / 2 - 100, 200 + i * 50);
            } else {
                g.setColor(Color.WHITE);
                g.drawString("  " + options[i], screenWidth / 2 - 100, 200 + i * 50);
            }
        }
    }

    public void renderInventoryScreen(Graphics2D g, java.util.List<com.shadowrpg.entities.Item> items) {
        g.setColor(new Color(0, 0, 0, 200));
        g.fillRect(100, 50, screenWidth - 200, screenHeight - 100);

        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.BOLD, 24));
        g.drawString("INVENTORY", screenWidth / 2 - 80, 90);

        g.setFont(new Font("Arial", Font.PLAIN, 16));
        int itemY = 130;
        for (com.shadowrpg.entities.Item item : items) {
            g.drawString(item.getName() + " x" + item.getQuantity(), 120, itemY);
            itemY += 25;

            if (itemY > screenHeight - 100) break;
        }
    }
}
