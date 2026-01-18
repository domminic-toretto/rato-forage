// Sistema de Inventário - Gerencia itens coletados pelo jogador

class Inventory {
    constructor() {
        // Itens disponíveis no inventário
        this.items = {
            'apple': 0,
            'grass': 0,
            'stone': 0,
            'wood': 0,
            'axe': 0,        // Machado (ferramenta)
            'pickaxe': 0,    // Picareta (ferramenta)
            'rope': 0        // Corda (item craftado)
        };
        
        this.maxSlots = 20;
        this.totalItems = 0;
        
        // Configurações de exibição dos itens
        this.itemConfig = {
            'apple': { emoji: '🍎', name: 'Maçã' },
            'grass': { emoji: '🌿', name: 'Grama' },
            'stone': { emoji: '🪨', name: 'Pedra' },
            'wood': { emoji: '🪵', name: 'Madeira' },
            'axe': { emoji: '🪓', name: 'Machado' },
            'pickaxe': { emoji: '⛏️', name: 'Picareta' },
            'rope': { emoji: '🪢', name: 'Corda' }
        };
    }

    // Adiciona item ao inventário
    addItem(itemType, quantity = 1) {
        if (itemType in this.items) {
            this.items[itemType] += quantity;
            this.totalItems += quantity;
            console.log(`➕ Adicionado: ${quantity}x ${this.itemConfig[itemType].name}`);
            return true;
        }
        console.warn(`❌ Item desconhecido: ${itemType}`);
        return false;
    }

    // Remove item do inventário
    removeItem(itemType, quantity = 1) {
        if (this.items[itemType] >= quantity) {
            this.items[itemType] -= quantity;
            this.totalItems -= quantity;
            console.log(`➖ Removido: ${quantity}x ${this.itemConfig[itemType].name}`);
            return true;
        }
        console.warn(`❌ Não há ${quantity}x ${this.itemConfig[itemType].name} suficiente`);
        return false;
    }

    // Verifica se tem os itens necessários para uma receita
    hasItems(recipe) {
        for (const [item, qty] of Object.entries(recipe.ingredients)) {
            if (!this.items[item] || this.items[item] < qty) {
                return false;
            }
        }
        return true;
    }

    // Crafta um item usando uma receita
    craftItem(recipe) {
        // Verifica se tem todos os ingredientes
        if (this.hasItems(recipe)) {
            // Remove os ingredientes
            for (const [item, qty] of Object.entries(recipe.ingredients)) {
                this.removeItem(item, qty);
            }
            
            // Adiciona o item craftado
            this.addItem(recipe.result, 1);
            
            console.log(`✨ Craftado: ${this.itemConfig[recipe.result].name}`);
            return true;
        }
        
        console.warn(`❌ Ingredientes insuficientes para craftar ${recipe.name}`);
        return false;
    }

    // Obtém quantidade de um item
    getItemCount(itemType) {
        return this.items[itemType] || 0;
    }

    // Retorna todos os itens não-vazios
    getNonEmptyItems() {
        const nonEmpty = {};
        for (const [item, quantity] of Object.entries(this.items)) {
            if (quantity > 0) {
                nonEmpty[item] = quantity;
            }
        }
        return nonEmpty;
    }

    // Limpa o inventário (para debug/reset)
    clear() {
        for (const item in this.items) {
            this.items[item] = 0;
        }
        this.totalItems = 0;
    }

    // Retorna informações formatadas do item
    getItemInfo(itemType) {
        if (itemType in this.itemConfig) {
            return {
                ...this.itemConfig[itemType],
                quantity: this.items[itemType]
            };
        }
        return null;
    }

    // Atualiza display HTML do inventário
    updateDisplay() {
        const container = document.getElementById('inventory-items');
        if (!container) return;

        container.innerHTML = '';

        const nonEmpty = this.getNonEmptyItems();
        
        // Se não tiver nada, mostra mensagem
        if (Object.keys(nonEmpty).length === 0) {
            container.innerHTML = '<p style="color: #888; font-size: 0.9em;">Inventário vazio</p>';
            return;
        }

        // Cria elemento para cada item
        for (const [itemType, quantity] of Object.entries(nonEmpty)) {
            const info = this.getItemInfo(itemType);
            if (!info) continue;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item';
            itemDiv.innerHTML = `
                <div class="icon">${info.emoji}</div>
                <div class="name">${info.name}</div>
                <div class="quantity">×${quantity}</div>
            `;
            
            container.appendChild(itemDiv);
        }
    }
}
