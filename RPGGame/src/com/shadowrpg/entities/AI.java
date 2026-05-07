package com.shadowrpg.entities;

/**
 * AI - Simple AI for enemy behavior
 */
public class AI {
    private AIState state;
    private double stateTimer;
    private double decisionTimer;
    private static final double DECISION_INTERVAL = 2.0;

    public AI() {
        this.state = AIState.WANDERING;
        this.stateTimer = 0;
        this.decisionTimer = 0;
    }

    public void update(double deltaTime, Enemy enemy, Player player) {
        stateTimer += deltaTime;
        decisionTimer += deltaTime;

        if (decisionTimer >= DECISION_INTERVAL) {
            decisionTimer = 0;
            makeDecision(enemy, player);
        }

        switch (state) {
            case WANDERING:
                updateWandering(enemy);
                break;
            case CHASING:
                updateChasing(enemy, player);
                break;
            case ATTACKING:
                updateAttacking(enemy, player);
                break;
            case FLEEING:
                updateFleeing(enemy, player);
                break;
        }
    }

    private void makeDecision(Enemy enemy, Player player) {
        double distanceToPlayer = Math.sqrt(
            Math.pow(enemy.getX() - player.getX(), 2) + 
            Math.pow(enemy.getY() - player.getY(), 2)
        );

        if (distanceToPlayer < 150 && enemy.getCurrentHealth() > enemy.getMaxHealth() * 0.3) {
            state = AIState.CHASING;
        } else if (distanceToPlayer < 250) {
            state = AIState.ATTACKING;
        } else if (enemy.getCurrentHealth() < enemy.getMaxHealth() * 0.2) {
            state = AIState.FLEEING;
        } else {
            state = AIState.WANDERING;
        }
    }

    private void updateWandering(Enemy enemy) {
        // Idle or slow patrol
        if (Math.random() < 0.02) {
            enemy.setVelocityX((Math.random() - 0.5) * 2);
            enemy.setVelocityY((Math.random() - 0.5) * 2);
        }
    }

    private void updateChasing(Enemy enemy, Player player) {
        // Move toward player
        double dx = player.getX() - enemy.getX();
        double dy = player.getY() - enemy.getY();
        double distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            double speed = 2.5;
            enemy.setVelocityX((dx / distance) * speed);
            enemy.setVelocityY((dy / distance) * speed);
        }
    }

    private void updateAttacking(Enemy enemy, Player player) {
        // Stay in place and attack
        enemy.setVelocityX(enemy.getVelocityX() * 0.5);
        enemy.setVelocityY(enemy.getVelocityY() * 0.5);
    }

    private void updateFleeing(Enemy enemy, Player player) {
        // Move away from player
        double dx = player.getX() - enemy.getX();
        double dy = player.getY() - enemy.getY();
        double distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            double speed = 3.5;
            enemy.setVelocityX(-(dx / distance) * speed);
            enemy.setVelocityY(-(dy / distance) * speed);
        }
    }

    public AIState getState() {
        return state;
    }

    public enum AIState {
        WANDERING,
        CHASING,
        ATTACKING,
        FLEEING
    }
}
