/* skilltree.js — DOM skill tree panel for Shadow's Tower web UI */
(function(){
    function setupSkillTreePanel(){
        const panel = document.getElementById('skillTreePanel');
        const content = document.getElementById('skillTreeContent');
        if (!panel || !content) return;

        function render(){
            content.innerHTML = '';
            if (!window.player || !player.className) {
                content.innerHTML = '<p>Select a class first to view and unlock class-specific skills.</p>';
                return;
            }

            const def = CLASS_DEFINITIONS[player.className];
            if (!def || !def.skillPool) { content.textContent = '(no skills)'; return; }

            for (let i = 0; i < def.skillPool.length; i++) {
                const skill = def.skillPool[i];
                const unlocked = player.unlockedClassSkills && player.unlockedClassSkills.includes(skill.name);

                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';
                row.style.alignItems = 'center';
                row.style.padding = '8px';
                row.style.borderBottom = '1px solid rgba(0,255,0,0.06)';

                const left = document.createElement('div');
                left.innerHTML = '<strong>' + skill.name + '</strong><div style="color:#888">' + (skill.desc || '') + '</div>';

                const right = document.createElement('div');
                if (unlocked) {
                    const badge = document.createElement('span'); badge.style.color = '#ffff00'; badge.textContent = 'Unlocked';
                    right.appendChild(badge);
                } else {
                    const btn = document.createElement('button');
                    btn.className = 'navBtn';
                    btn.textContent = 'Unlock (100g)';
                    btn.onclick = function(){
                        try {
                            if (unlockClassSkill && unlockClassSkill(skill.name)) { render(); updateSidebarUI && updateSidebarUI(); showNotification && showNotification('Unlocked ' + skill.name, 'success', 2000); }
                            else { showNotification && showNotification('Cannot unlock - need 100g', 'info', 2000); }
                        } catch(e) { console.warn(e); }
                    };
                    right.appendChild(btn);
                }

                row.appendChild(left);
                row.appendChild(right);
                content.appendChild(row);
            }
        }

        window.openSkillTreePanel = function(){ panel.classList.add('show'); panel.style.display = 'block'; if (UISystem) UISystem.skillTree.isOpen = true; render(); };
        window.closeSkillTreePanel = function(){ panel.classList.remove('show'); panel.style.display = 'none'; if (UISystem) UISystem.skillTree.isOpen = false; };
        window.toggleSkillTreePanel = function(){ if (panel.classList.contains('show')) closeSkillTreePanel(); else openSkillTreePanel(); };

        // Keyboard shortcut (S)
        window.addEventListener('keydown', function(e){ if (e.key === 's' || e.key === 'S') { e.preventDefault(); toggleSkillTreePanel(); } });

        // refresh when open
        setInterval(function(){ if (panel.classList.contains('show')) render(); }, 800);

        // Sync with UISystem flag (in case game toggles UI directly) or with gameState
        setInterval(function(){
            try {
                const isOpen = panel.classList.contains('show');
                if (typeof UISystem !== 'undefined' && UISystem && UISystem.skillTree) {
                    const shouldOpen = !!UISystem.skillTree.isOpen;
                    if (shouldOpen && !isOpen) openSkillTreePanel();
                    if (!shouldOpen && isOpen) closeSkillTreePanel();
                }
                if (typeof window.gameState !== 'undefined') {
                    if (window.gameState === (GAME_STATES ? GAME_STATES.SKILL_TREE : 'SKILL_TREE') && !isOpen) openSkillTreePanel();
                    if (window.gameState !== (GAME_STATES ? GAME_STATES.SKILL_TREE : 'SKILL_TREE') && isOpen) closeSkillTreePanel();
                }
            } catch(e) {}
        }, 300);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupSkillTreePanel); else setupSkillTreePanel();
})();
