// Sistema de Crafting - Permite criar novos itens combinando recursos

class CraftingRecipe {
    constructor(name, result, ingredients, description = '') {
        this.name = name;          // Nome da receita
        this.result = result;      // Item resultante
        this.ingredients = ingredients;  // { itemType: quantidade }
        this.description = description;
    }
}

class CraftingSystem {
    constructor() {
        // Define todas as receitas disponíveis no jogo
        this.recipes = [
            new CraftingRecipe(
                'Machado',
                'axe',
                { 'stone': 2, 'grass': 3 },
                'Ferramenta básica para cortar árvores'
            ),
            new CraftingRecipe(
                'Picareta',
                'pickaxe',
                { 'stone': 5, 'grass': 1 },
                'Ferramenta para minerar pedras'
            ),
            new CraftingRecipe(
                'Corda',
                'rope',
                { 'grass': 10 },
                'Útil para construções'
            ),
            // Adicione mais receitas aqui
        ];

        this.menuOpen = false;
    }

    // Tenta craftar um item pela receita
    craft(inventory, recipeIndex) {
        if (recipeIndex >= 0 && recipeIndex < this.recipes.length) {
            const recipe = this.recipes[recipeIndex];
            const success = inventory.craftItem(recipe);
            
            if (success) {
                this.showCraftMessage(recipe.result, true);
                this.playCraftSound();
            } else {
                this.showCraftMessage(recipe.result, false);
            }
            
            return success;
        }
        return false;
    }

    // Mostra mensagem de crafting
    showCraftMessage(itemType, success) {
        const itemConfig = {
            'axe': { emoji: '🪓', name: 'Machado' },
            'pickaxe': { emoji: '⛏️', name: 'Picareta' },
            'rope': { emoji: '🪢', name: 'Corda' }
        };

        const item = itemConfig[itemType] || { emoji: '❓', name: 'Item' };
        
        if (success) {
            console.log(`✨ ${item.emoji} ${item.name} craftado com sucesso!`);
        } else {
            console.log(`❌ Ingredientes insuficientes para craftar ${item.name}`);
        }
    }

    // Efeito sonoro de crafting (placeholder)
    playCraftSound() {
        console.log('🔨 *Som de crafting*');
    }

    // Renderiza menu de crafting no HTML
    renderMenu(inventory) {
        const container = document.getElementById('crafting-recipes');
        if (!container) return;

        container.innerHTML = '';

        this.recipes.forEach((recipe, index) => {
            const recipeDiv = document.createElement('div');
            recipeDiv.className = 'recipe-item';

            // Verifica se pode craftar
            const canCraft = inventory.hasItems(recipe);

            // Monta lista de ingredientes
            let ingredientsHTML = '<div class="recipe-ingredients">Requer: ';
            const ingredientsList = [];
            
            for (const [item, qty] of Object.entries(recipe.ingredients)) {
                const itemInfo = inventory.getItemInfo(item);
                const hasEnough = inventory.getItemCount(item) >= qty;
                const color = hasEnough ? '#4CAF50' : '#f44336';
                
                ingredientsList.push(
                    `<span style="color: ${color}">${itemInfo.emoji} ${qty}x ${itemInfo.name}</span>`
                );
            }
            
            ingredientsHTML += ingredientsList.join(', ') + '</div>';

            // Resultado
            const resultInfo = inventory.getItemInfo(recipe.result);
            
            recipeDiv.innerHTML = `
                <h4>${resultInfo.emoji} ${recipe.name}</h4>
                ${ingredientsHTML}
                ${recipe.description ? `<p style="font-size: 0.8em; color: #888; margin: 5px 0;">${recipe.description}</p>` : ''}
                <button 
                    class="craft-button" 
                    data-recipe="${index}"
                    ${!canCraft ? 'disabled' : ''}
                >
                    ${canCraft ? '✨ Craftar' : '🔒 Ingredientes insuficientes'}
                </button>
            `;

            container.appendChild(recipeDiv);
        });

        // Adiciona event listeners aos botões
        document.querySelectorAll('.craft-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const recipeIndex = parseInt(e.target.getAttribute('data-recipe'));
                if (this.craft(inventory, recipeIndex)) {
                    // Atualiza o menu e inventário
                    this.renderMenu(inventory);
                    inventory.updateDisplay();
                }
            });
        });
    }

    // Abre menu de crafting
    open(inventory) {
        this.menuOpen = true;
        const menu = document.getElementById('crafting-menu');
        if (menu) {
            menu.classList.remove('hidden');
            this.renderMenu(inventory);
        }
    }

    // Fecha menu de crafting
    close() {
        this.menuOpen = false;
        const menu = document.getElementById('crafting-menu');
        if (menu) {
            menu.classList.add('hidden');
        }
    }

    // Toggle menu
    toggle(inventory) {
        if (this.menuOpen) {
            this.close();
        } else {
            this.open(inventory);
        }
    }
}
