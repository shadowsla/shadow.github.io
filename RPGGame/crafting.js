/* crafting.js — DOM crafting panel for Shadow's Tower web UI */
(function(){
    function setupCraftingPanel(){
        const panel = document.getElementById('craftingPanel');
        const list = document.getElementById('craftingList');
        if (!panel || !list) return;

        function render(){
            list.innerHTML = '';
            const recipes = (UISystem && UISystem.crafting && UISystem.crafting.recipes) ? UISystem.crafting.recipes : [];
            if (recipes.length === 0) { list.textContent = 'No recipes available.'; return; }

            recipes.forEach((r, idx) => {
                const row = document.createElement('div');
                row.style.padding = '8px';
                row.style.borderBottom = '1px solid rgba(0,255,0,0.06)';

                const title = document.createElement('div');
                title.innerHTML = '<strong>' + r.name + '</strong>';

                const materials = document.createElement('div');
                materials.style.color = '#888';
                materials.style.marginTop = '6px';
                materials.textContent = r.materials.map(m => m.name + ' x' + m.quantity).join(', ');

                const btn = document.createElement('button');
                btn.className = 'navBtn';
                btn.textContent = 'Craft';
                btn.style.marginTop = '8px';
                btn.onclick = function(){
                    try {
                        if (craftRecipe && craftRecipe(r)) { render(); updateSidebarUI && updateSidebarUI(); showNotification && showNotification('Crafted ' + r.result.name, 'success', 2000); }
                        else { showNotification && showNotification('Missing materials', 'info', 2000); }
                    } catch(e) { console.warn(e); }
                };

                row.appendChild(title);
                row.appendChild(materials);
                row.appendChild(btn);
                list.appendChild(row);
            });
        }

        window.openCraftingPanel = function(){ panel.classList.add('show'); panel.style.display = 'block'; if (UISystem) UISystem.crafting.isOpen = true; render(); };
        window.closeCraftingPanel = function(){ panel.classList.remove('show'); panel.style.display = 'none'; if (UISystem) UISystem.crafting.isOpen = false; };
        window.toggleCraftingPanel = function(){ if (panel.classList.contains('show')) closeCraftingPanel(); else openCraftingPanel(); };

        // Keyboard shortcut (C)
        window.addEventListener('keydown', function(e){ if (e.key === 'c' || e.key === 'C') { e.preventDefault(); toggleCraftingPanel(); } });

        setInterval(function(){ if (panel.classList.contains('show')) render(); }, 800);

        // Sync with UISystem flag (in case game toggles UI directly) or with gameState
        setInterval(function(){
            try {
                const isOpen = panel.classList.contains('show');
                if (typeof UISystem !== 'undefined' && UISystem && UISystem.crafting) {
                    const shouldOpen = !!UISystem.crafting.isOpen;
                    if (shouldOpen && !isOpen) openCraftingPanel();
                    if (!shouldOpen && isOpen) closeCraftingPanel();
                }
                if (typeof window.gameState !== 'undefined') {
                    if (window.gameState === (GAME_STATES ? GAME_STATES.CRAFTING : 'CRAFTING') && !isOpen) openCraftingPanel();
                    if (window.gameState !== (GAME_STATES ? GAME_STATES.CRAFTING : 'CRAFTING') && isOpen) closeCraftingPanel();
                }
            } catch(e) {}
        }, 300);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupCraftingPanel); else setupCraftingPanel();
})();
