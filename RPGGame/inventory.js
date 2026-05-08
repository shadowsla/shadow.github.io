/* inventory.js — DOM inventory panel for Shadow's Tower web UI */
(function(){
    function setupInventoryPanel(){
        const panel = document.getElementById('inventoryPanel');
        const list = document.getElementById('inventoryList');
        if (!panel || !list) return;

        function render(){
            list.innerHTML = '';
            if (!window.player || !window.player.inventory) { list.textContent = '(no player data)'; return; }
            if (player.inventory.length === 0) { list.textContent = '(empty)'; return; }

            for (let i = 0; i < player.inventory.length; i++) {
                const it = player.inventory[i];
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';
                row.style.alignItems = 'center';
                row.style.padding = '6px 8px';
                row.style.borderBottom = '1px solid rgba(0,255,0,0.06)';

                const left = document.createElement('div');
                left.innerHTML = '<strong>' + it.name + '</strong> x' + it.quantity + ' <span style="color:#888;margin-left:8px;">(' + (getRarityName ? getRarityName(it.rarity) : 'Unknown') + ')</span>';

                const actions = document.createElement('div');
                actions.style.display = 'flex';
                actions.style.gap = '8px';

                const useBtn = document.createElement('button');
                useBtn.className = 'navBtn';
                useBtn.textContent = 'Use';
                useBtn.onclick = function(){
                    try {
                        if (useItem && useItem(it.name)) { render(); updateSidebarUI && updateSidebarUI(); showNotification && showNotification('Used ' + it.name, 'success', 2000); }
                        else { showNotification && showNotification('Cannot use ' + it.name, 'info', 2000); }
                    } catch(e) { console.warn(e); }
                };

                const dropBtn = document.createElement('button');
                dropBtn.className = 'navBtn';
                dropBtn.textContent = 'Drop';
                dropBtn.onclick = function(){
                    try {
                        if (removeFromInventory && removeFromInventory(it.name, 1)) { render(); updateSidebarUI && updateSidebarUI(); showNotification && showNotification('Dropped ' + it.name, 'info', 1800); }
                    } catch(e) { console.warn(e); }
                };

                actions.appendChild(useBtn);
                actions.appendChild(dropBtn);
                row.appendChild(left);
                row.appendChild(actions);
                list.appendChild(row);
            }
        }

        window.openInventoryPanel = function(){ panel.classList.add('show'); panel.style.display = 'block'; if (UISystem) UISystem.inventory.isOpen = true; render(); };
        window.closeInventoryPanel = function(){ panel.classList.remove('show'); panel.style.display = 'none'; if (UISystem) UISystem.inventory.isOpen = false; };
        window.toggleInventoryPanel = function(){ if (panel.classList.contains('show')) closeInventoryPanel(); else openInventoryPanel(); };

        // Keep panel up-to-date while open
        setInterval(function(){ if (panel.classList.contains('show')) render(); }, 800);

        // Sync with UISystem flag (in case game toggles UI directly) or with gameState
        setInterval(function(){
            try {
                const isOpen = panel.classList.contains('show');
                if (typeof UISystem !== 'undefined' && UISystem && UISystem.inventory) {
                    const shouldOpen = !!UISystem.inventory.isOpen;
                    if (shouldOpen && !isOpen) openInventoryPanel();
                    if (!shouldOpen && isOpen) closeInventoryPanel();
                }
                if (typeof window.gameState !== 'undefined') {
                    if (window.gameState === (GAME_STATES ? GAME_STATES.INVENTORY : 'INVENTORY') && !isOpen) openInventoryPanel();
                    if (window.gameState !== (GAME_STATES ? GAME_STATES.INVENTORY : 'INVENTORY') && isOpen) closeInventoryPanel();
                }
            } catch(e) {}
        }, 300);

        // Keyboard shortcut (I)
        window.addEventListener('keydown', function(e){
            if (e.key === 'i' || e.key === 'I') { e.preventDefault(); toggleInventoryPanel(); }
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupInventoryPanel); else setupInventoryPanel();
})();
