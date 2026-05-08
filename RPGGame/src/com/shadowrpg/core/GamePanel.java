package com.shadowrpg.core;

import java.awt.*;
import java.awt.event.*;
import java.awt.image.BufferedImage;
import javax.swing.*;

/**
 * GamePanel - Main rendering and input handler
 */
public class GamePanel extends JPanel {
    private Game game;
    private BufferedImage backBuffer;
    private Graphics2D backGraphics;
    private int fps = 0;
    private boolean[] keys = new boolean[256];

    public GamePanel(Game game) {
        this.game = game;
        // Preferred size must match game's constants
        setPreferredSize(new Dimension(1280, 720));
        this.backBuffer = new BufferedImage(1280, 720, BufferedImage.TYPE_INT_RGB);
        this.backGraphics = backBuffer.createGraphics();

        setFocusable(true);
        setBackground(Color.BLACK);

        // Ensure focusable and request focus when shown
        addHierarchyListener(new java.awt.event.HierarchyListener() {
            @Override
            public void hierarchyChanged(java.awt.event.HierarchyEvent e) {
                if ((e.getChangeFlags() & java.awt.event.HierarchyEvent.SHOWING_CHANGED) != 0 && isShowing()) {
                    requestFocusInWindow();
                }
            }
        });

        addKeyListener(new KeyListener() {
            @Override
            public void keyPressed(KeyEvent e) {
                keys[e.getKeyCode()] = true;
                handleKeyPress(e.getKeyCode());
            }

            @Override
            public void keyReleased(KeyEvent e) {
                keys[e.getKeyCode()] = false;
            }

            @Override
            public void keyTyped(KeyEvent e) {
            }
        });

        addMouseListener(new MouseListener() {
            @Override
            public void mouseClicked(MouseEvent e) {
                handleMouseClick(e.getX(), e.getY());
            }

            @Override
            public void mousePressed(MouseEvent e) {
            }

            @Override
            public void mouseReleased(MouseEvent e) {
            }

            @Override
            public void mouseEntered(MouseEvent e) {
            }

            @Override
            public void mouseExited(MouseEvent e) {
            }
        });

        addMouseMotionListener(new MouseMotionListener() {
            @Override
            public void mouseDragged(MouseEvent e) {
            }

            @Override
            public void mouseMoved(MouseEvent e) {
                updateMousePosition(e.getX(), e.getY());
            }
        });
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        game.render(backGraphics);
        g.drawImage(backBuffer, 0, 0, null);
    }

    private void handleKeyPress(int keyCode) {
        switch (keyCode) {
            case KeyEvent.VK_UP:
            case KeyEvent.VK_W:
                game.getPlayer().moveUp();
                break;
            case KeyEvent.VK_DOWN:
            case KeyEvent.VK_S:
                game.getPlayer().moveDown();
                break;
            case KeyEvent.VK_LEFT:
            case KeyEvent.VK_A:
                game.getPlayer().moveLeft();
                break;
            case KeyEvent.VK_RIGHT:
            case KeyEvent.VK_D:
                game.getPlayer().moveRight();
                break;
            case KeyEvent.VK_SPACE:
                game.getPlayer().attack();
                break;
            case KeyEvent.VK_I:
                game.getGameStateManager().setState(GameState.INVENTORY);
                break;
            case KeyEvent.VK_G:
                game.getGameStateManager().setState(GameState.GUILD);
                break;
            case KeyEvent.VK_C:
                game.getGameStateManager().setState(GameState.CRAFTING);
                break;
            case KeyEvent.VK_ENTER:
                if (game.getGameStateManager().getCurrentState() == GameState.MAIN_MENU) {
                    game.getGameStateManager().setState(GameState.TOWER_SELECTION);
                }
                break;
            case KeyEvent.VK_ESCAPE:
                game.getGameStateManager().setState(GameState.MAIN_MENU);
                break;
            case KeyEvent.VK_1:
            case KeyEvent.VK_2:
            case KeyEvent.VK_3:
            case KeyEvent.VK_4:
            case KeyEvent.VK_5:
            case KeyEvent.VK_6:
            case KeyEvent.VK_7:
                handleNumberKeyPress(keyCode);
                break;
        }
    }

    private void handleNumberKeyPress(int keyCode) {
        int towerIndex = keyCode - KeyEvent.VK_1;
        if (game.getGameStateManager().getCurrentState() == GameState.TOWER_SELECTION) {
            game.getTowerManager().selectTower(towerIndex);
            game.getGameStateManager().setState(GameState.TOWER_FLOOR);
            game.getEnemyManager().generateFloorEnemies(towerIndex, 1);
        }
    }

    private void handleMouseClick(int x, int y) {
        // Handle mouse interactions for UI
    }

    private void updateMousePosition(int x, int y) {
        // Update mouse position for hover effects
    }

    public void setFPS(int fps) {
        this.fps = fps;
    }

    public int getFPS() {
        return fps;
    }

    public boolean isKeyPressed(int keyCode) {
        return keys[keyCode];
    }
}
