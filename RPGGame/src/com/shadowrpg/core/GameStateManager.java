package com.shadowrpg.core;

/**
 * GameStateManager - Manages game state transitions
 */
public class GameStateManager {
    private GameState currentState;
    private GameState previousState;
    private double stateTimer = 0;

    public GameStateManager() {
        this.currentState = GameState.MAIN_MENU;
        this.previousState = GameState.MAIN_MENU;
    }

    public void setState(GameState newState) {
        this.previousState = this.currentState;
        this.currentState = newState;
        this.stateTimer = 0;
    }

    public void update(double deltaTime) {
        stateTimer += deltaTime;
    }

    public GameState getCurrentState() {
        return currentState;
    }

    public GameState getPreviousState() {
        return previousState;
    }

    public double getStateTimer() {
        return stateTimer;
    }

    public boolean isStateChanged() {
        return currentState != previousState;
    }
}
