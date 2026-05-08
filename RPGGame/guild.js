/* guild.js — DOM guild panel for Shadow's Tower web UI */
(function(){
    function setupGuildPanel(){
        const panel = document.getElementById('guildPanel');
        const content = document.getElementById('guildContent');
        if (!panel || !content) return;

        function render(){
            content.innerHTML = '';
            if (!window.player) { content.textContent = '(no player data)'; return; }

            const stats = getPlayerStats ? getPlayerStats() : {
                name: player.name, rank: PLAYER_RANKS[player.rank], level: player.level, experience: player.experience, nextRankExp: player.experienceToNextRank, gold: player.gold
            };

            const lines = [
                'Name: ' + stats.name,
                'Rank: ' + stats.rank,
                'Level: ' + stats.level,
                'Experience: ' + Math.round(stats.experience) + ' / ' + stats.nextRankExp,
                'Gold: ' + stats.gold
            ];

            for (let ln of lines) {
                const p = document.createElement('div'); p.textContent = ln; content.appendChild(p);
            }

            const btnWrap = document.createElement('div'); btnWrap.style.marginTop = '12px';
            const btn = document.createElement('button'); btn.className = 'navBtn'; btn.textContent = 'Request Promotion';
            btn.onclick = function(){
                try {
                    if (player.experience >= player.experienceToNextRank) {
                        rankUp && rankUp();
                        updateSidebarUI && updateSidebarUI();
                        render();
                        showNotification && showNotification('Promoted!', 'success', 2200);
                    } else {
                        showNotification && showNotification('Not enough experience to promote', 'info', 2200);
                    }
                } catch(e) { console.warn(e); }
            };
            btnWrap.appendChild(btn);
            content.appendChild(btnWrap);
        }

        window.openGuildPanel = function(){ panel.classList.add('show'); panel.style.display = 'block'; if (UISystem) UISystem.guild.isOpen = true; render(); };
        window.closeGuildPanel = function(){ panel.classList.remove('show'); panel.style.display = 'none'; if (UISystem) UISystem.guild.isOpen = false; };
        window.toggleGuildPanel = function(){ if (panel.classList.contains('show')) closeGuildPanel(); else openGuildPanel(); };

        // Keyboard shortcut (G)
        window.addEventListener('keydown', function(e){ if (e.key === 'g' || e.key === 'G') { e.preventDefault(); toggleGuildPanel(); } });

        setInterval(function(){ if (panel.classList.contains('show')) render(); }, 1000);

        // Sync with UISystem flag (in case game toggles UI directly) or with gameState
        setInterval(function(){
            try {
                const isOpen = panel.classList.contains('show');
                if (typeof UISystem !== 'undefined' && UISystem && UISystem.guild) {
                    const shouldOpen = !!UISystem.guild.isOpen;
                    if (shouldOpen && !isOpen) openGuildPanel();
                    if (!shouldOpen && isOpen) closeGuildPanel();
                }
                if (typeof window.gameState !== 'undefined') {
                    if (window.gameState === (GAME_STATES ? GAME_STATES.GUILD : 'GUILD') && !isOpen) openGuildPanel();
                    if (window.gameState !== (GAME_STATES ? GAME_STATES.GUILD : 'GUILD') && isOpen) closeGuildPanel();
                }
            } catch(e) {}
        }, 500);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupGuildPanel); else setupGuildPanel();
})();
