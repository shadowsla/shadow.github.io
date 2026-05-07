package com.shadowrpg.audio;

import java.util.*;

/**
 * AudioManager - Manages game audio and music
 */
public class AudioManager {
    private Map<String, String> musicTracks;
    private Map<String, String> soundEffects;
    private String currentTrack;
    private float musicVolume;
    private float sfxVolume;
    private boolean musicEnabled;
    private boolean sfxEnabled;

    public AudioManager() {
        this.musicTracks = new HashMap<>();
        this.soundEffects = new HashMap<>();
        this.musicVolume = 0.7f;
        this.sfxVolume = 0.8f;
        this.musicEnabled = true;
        this.sfxEnabled = true;
        initializeAudio();
    }

    private void initializeAudio() {
        // Music tracks for different locations
        musicTracks.put("main_menu", "res/audio/main_menu.wav");
        musicTracks.put("exploration", "res/audio/exploration_theme.wav");
        musicTracks.put("tower_calm", "res/audio/tower_calm.wav");
        musicTracks.put("tower_intense", "res/audio/tower_intense.wav");
        musicTracks.put("boss_battle", "res/audio/boss_battle.wav");
        musicTracks.put("villages", "res/audio/village_theme.wav");
        musicTracks.put("victory", "res/audio/victory.wav");
        musicTracks.put("defeat", "res/audio/defeat.wav");

        // Sound effects
        soundEffects.put("sword_swing", "res/audio/sfx/sword_swing.wav");
        soundEffects.put("arrow_shoot", "res/audio/sfx/arrow.wav");
        soundEffects.put("magic_cast", "res/audio/sfx/magic.wav");
        soundEffects.put("hit", "res/audio/sfx/hit.wav");
        soundEffects.put("hurt", "res/audio/sfx/hurt.wav");
        soundEffects.put("death", "res/audio/sfx/death.wav");
        soundEffects.put("level_up", "res/audio/sfx/level_up.wav");
        soundEffects.put("item_pickup", "res/audio/sfx/pickup.wav");
        soundEffects.put("door_open", "res/audio/sfx/door.wav");
        soundEffects.put("ui_select", "res/audio/sfx/select.wav");
    }

    public void playMusic(String trackName, boolean loop) {
        if (!musicEnabled) return;

        String trackPath = musicTracks.get(trackName);
        if (trackPath != null) {
            currentTrack = trackName;
            // In a real implementation, would use Java Audio library
            System.out.println("Playing music: " + trackName);
        }
    }

    public void playSFX(String soundName) {
        if (!sfxEnabled) return;

        String soundPath = soundEffects.get(soundName);
        if (soundPath != null) {
            // In a real implementation, would use Java Audio library
            System.out.println("Playing SFX: " + soundName);
        }
    }

    public void stopMusic() {
        currentTrack = null;
    }

    public void setMusicVolume(float volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }

    public void setSFXVolume(float volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    public void toggleMusic() {
        musicEnabled = !musicEnabled;
    }

    public void toggleSFX() {
        sfxEnabled = !sfxEnabled;
    }

    public float getMusicVolume() { return musicVolume; }
    public float getSFXVolume() { return sfxVolume; }
    public boolean isMusicEnabled() { return musicEnabled; }
    public boolean isSFXEnabled() { return sfxEnabled; }
    public String getCurrentTrack() { return currentTrack; }

    public void playExplorationMusic() {
        playMusic("exploration", true);
    }

    public void playTowerMusic(boolean intense) {
        playMusic(intense ? "tower_intense" : "tower_calm", true);
    }

    public void playBossMusic() {
        playMusic("boss_battle", true);
    }

    public void playVictoryMusic() {
        playMusic("victory", false);
    }

    public void playDefeatMusic() {
        playMusic("defeat", false);
    }

    public void playCombatSFX(String weaponType) {
        switch (weaponType.toLowerCase()) {
            case "sword":
            case "long_sword":
                playSFX("sword_swing");
                break;
            case "bow":
            case "crossbow":
                playSFX("arrow_shoot");
                break;
            case "magic":
            case "staff":
                playSFX("magic_cast");
                break;
            default:
                playSFX("hit");
        }
    }

    public void playHitSFX() { playSFX("hit"); }
    public void playHurtSFX() { playSFX("hurt"); }
    public void playDeathSFX() { playSFX("death"); }
    public void playLevelUpSFX() { playSFX("level_up"); }
    public void playPickupSFX() { playSFX("item_pickup"); }
    public void playUISelectSFX() { playSFX("ui_select"); }
}
