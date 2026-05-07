package com.shadowrpg.systems;

import com.shadowrpg.entities.Player;

/**
 * GuildSystem - Manages player guild interactions and rank ups
 */
public class GuildSystem {
    private String[] rankRequirements = {
        "Complete Tower of Shadows",
        "Complete Crimson Peak",
        "Complete Frozen Abyss",
        "Complete Inferno Citadel",
        "Complete Mystic Spire",
        "Complete Draconic Sanctum"
    };

    public boolean canRankUp(Player player) {
        // Check if player can rank up based on experience and requirements
        int expToNextRank = player.getExperienceToNextRank();
        return player.getExperience() >= expToNextRank;
    }

    public void attemptRankUp(Player player) {
        if (canRankUp(player)) {
            player.rankUp();
        }
    }

    public String getGuildInfo(Player player) {
        StringBuilder info = new StringBuilder();
        info.append("Guild Member: ").append(player.getPlayerName()).append("\n");
        info.append("Current Rank: ").append(player.getRank().getDisplayName()).append("\n");
        info.append("Experience: ").append(player.getExperience()).append("/").append(player.getExperienceToNextRank()).append("\n");
        
        double progressPercent = (double) player.getExperience() / player.getExperienceToNextRank() * 100;
        info.append("Progress: ").append(String.format("%.1f%%", progressPercent)).append("\n");

        return info.toString();
    }

    public String getRankRequirement(int index) {
        if (index >= 0 && index < rankRequirements.length) {
            return rankRequirements[index];
        }
        return "Unknown";
    }

    public int getTotalRanks() {
        return rankRequirements.length;
    }
}
