// UI Generator with Navbar + Sidebar
class UIGenerator {
    constructor(config) {
        this.config = config;
        this.currentCategory = 0;
        this.currentTool = null;
        this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        this.recent = JSON.parse(localStorage.getItem('recent') || '[]');
        this.allTools = [];
    }

    init() {
        this.generateCategoryTabs();
        this.collectAllTools();
        this.loadCategory(0);
        this.setupSearch();
        this.setupKeyboardShortcuts();
        this.setupSidebarToggle();
        this.setupTabNavigation();
    }

    collectAllTools() {
        this.config.categories.forEach(category => {
            category.tools.forEach(tool => {
                this.allTools.push({ ...tool, category: category.name });
            });
        });
    }

    generateCategoryTabs() {
        const tabsContainer = document.getElementById('category-tabs');
        
        // Add Favorites tab
        const favTab = document.createElement('button');
        favTab.className = 'tab-btn';
        favTab.innerHTML = `<i class="fas fa-star"></i> <span>Favorites</span>`;
        favTab.addEventListener('click', () => this.loadFavorites());
        tabsContainer.appendChild(favTab);
        
        // Add Recent tab
        const recentTab = document.createElement('button');
        recentTab.className = 'tab-btn';
        recentTab.innerHTML = `<i class="fas fa-clock"></i> <span>Recent</span>`;
        recentTab.addEventListener('click', () => this.loadRecent());
        tabsContainer.appendChild(recentTab);
        
        // Add category tabs
        this.config.categories.forEach((category, index) => {
            const tab = document.createElement('button');
            tab.className = 'tab-btn' + (index === 0 ? ' active' : '');
            tab.innerHTML = `<i class="fas ${category.icon}"></i> <span>${category.name}</span>`;
            tab.addEventListener('click', () => this.loadCategory(index));
            tabsContainer.appendChild(tab);
        });
    }

    loadCategory(index) {
        this.currentCategory = index;
        const category = this.config.categories[index];
        
        // Update active tab (offset by 2 for Favorites and Recent)
        document.querySelectorAll('.tab-btn').forEach((tab, i) => {
            tab.classList.toggle('active', i === index + 2);
        });
        
        // Update tools list
        this.updateToolsList(category.tools);
        
        // Show welcome message
        this.showWelcomeMessage();
    }

    loadFavorites() {
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach((tab, i) => {
            tab.classList.toggle('active', i === 0);
        });
        
        const favoriteTools = this.allTools.filter(t => this.favorites.includes(t.id));
        
        if (favoriteTools.length === 0) {
            this.showEmptyState('star', 'No Favorites Yet', 'Click the star icon on any tool to add it to your favorites');
        } else {
            this.updateToolsList(favoriteTools);
            this.showWelcomeMessage();
        }
    }

    loadRecent() {
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach((tab, i) => {
            tab.classList.toggle('active', i === 1);
        });
        
        const recentTools = this.recent.map(id => this.allTools.find(t => t.id === id)).filter(Boolean);
        
        if (recentTools.length === 0) {
            this.showEmptyState('clock', 'No Recent Tools', 'Tools you use will appear here');
        } else {
            this.updateToolsList(recentTools);
            this.showWelcomeMessage();
        }
    }

    updateToolsList(tools) {
        const list = document.getElementById('tools-list');
        list.innerHTML = '';
        
        tools.forEach(tool => {
            list.appendChild(this.createToolListItem(tool));
        });
    }

    createToolListItem(tool) {
        const item = document.createElement('div');
        item.className = 'tool-list-item';
        item.title = tool.description || '';
        item.dataset.toolId = tool.id;
        
        const isFavorite = this.favorites.includes(tool.id);
        
        item.innerHTML = `
            <i class="fas ${tool.icon} tool-icon"></i>
            <span class="tool-name">${tool.name}</span>
            <i class="fas fa-star favorite-star ${isFavorite ? 'favorited' : ''}"></i>
        `;
        
        // Click anywhere on item to load tool (except star)
        item.addEventListener('click', (e) => {
            console.log('Tool clicked:', tool.name);
            if (!e.target.classList.contains('favorite-star')) {
                this.loadTool(tool, item);
            }
        });
        
        // Click on star to toggle favorite
        item.querySelector('.favorite-star').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite(tool.id);
        });
        
        return item;
    }

    showWelcomeMessage() {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="welcome-message">
                <i class="fas fa-hand-pointer"></i>
                <h2>Select a tool from the sidebar</h2>
                <p>Choose a tool to get started</p>
                <div class="keyboard-shortcuts">
                    <span><kbd>Ctrl</kbd> + <kbd>K</kbd> Search</span>
                    <span><kbd>←</kbd> <kbd>→</kbd> Navigate Tabs</span>
                    <span><kbd>Esc</kbd> Clear</span>
                </div>
            </div>
        `;
    }

    showEmptyState(icon, title, message) {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-${icon}"></i>
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
        
        // Clear sidebar
        document.getElementById('tools-list').innerHTML = '';
    }

    loadTool(tool, itemElement) {
        console.log('Loading tool:', tool.name);
        this.currentTool = tool;
        
        // Add to recent
        this.addToRecent(tool.id);
        
        // Update active sidebar item
        document.querySelectorAll('.tool-list-item').forEach(item => {
            item.classList.remove('active');
        });
        if (itemElement) {
            itemElement.classList.add('active');
        }
        
        // Generate tool content
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = '';
        
        const toolContent = document.createElement('div');
        toolContent.className = 'tool-content';
        
        // Header
        const header = document.createElement('div');
        header.className = 'tool-header';
        
        const isFavorite = this.favorites.includes(tool.id);
        
        header.innerHTML = `
            <h2><i class="fas ${tool.icon}"></i> ${tool.name}</h2>
            ${tool.description ? `<p class="tool-description">${tool.description}</p>` : ''}
            <div class="tool-actions">
                <button onclick="window.uiGenerator.toggleFavorite('${tool.id}')" class="${isFavorite ? 'favorited' : ''}">
                    <i class="fas fa-star"></i> ${isFavorite ? 'Favorited' : 'Add to Favorites'}
                </button>
            </div>
        `;
        toolContent.appendChild(header);
        
        // Body
        const body = document.createElement('div');
        body.className = 'tool-body';
        
        // Generate inputs
        if (tool.inputs) {
            tool.inputs.forEach(input => {
                const inputElement = this.createInput(input);
                body.appendChild(inputElement);
            });
        }
        
        // Generate buttons
        if (tool.buttons) {
            const buttonGroup = document.createElement('div');
            buttonGroup.style.marginTop = '16px';
            
            tool.buttons.forEach(btn => {
                const button = document.createElement('button');
                button.className = btn.class;
                button.textContent = btn.label;
                button.onclick = () => window[btn.action]?.();
                buttonGroup.appendChild(button);
            });
            
            body.appendChild(buttonGroup);
        }
        
        // Generate outputs
        if (tool.outputs) {
            tool.outputs.forEach(output => {
                const outputElement = this.createOutput(output);
                body.appendChild(outputElement);
            });
        }
        
        toolContent.appendChild(body);
        contentArea.appendChild(toolContent);
    }

    toggleFavorite(toolId) {
        const index = this.favorites.indexOf(toolId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(toolId);
        }
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        
        // Update star icons in sidebar
        document.querySelectorAll('.tool-list-item').forEach(item => {
            if (item.dataset.toolId === toolId) {
                const star = item.querySelector('.favorite-star');
                star.classList.toggle('favorited', this.favorites.includes(toolId));
            }
        });
        
        // Refresh current tool if it's the one being toggled
        if (this.currentTool && this.currentTool.id === toolId) {
            this.loadTool(this.currentTool);
        }
    }

    addToRecent(toolId) {
        this.recent = this.recent.filter(id => id !== toolId);
        this.recent.unshift(toolId);
        this.recent = this.recent.slice(0, 10);
        localStorage.setItem('recent', JSON.stringify(this.recent));
    }

    setupSearch() {
        const searchInput = document.getElementById('sidebar-search');
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const items = document.querySelectorAll('#tools-list .tool-list-item');
            
            items.forEach(item => {
                const name = item.querySelector('.tool-name').textContent.toLowerCase();
                item.style.display = name.includes(query) ? 'flex' : 'none';
            });
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('sidebar-search').focus();
            }
            
            // Esc to clear search
            if (e.key === 'Escape') {
                const searchInput = document.getElementById('sidebar-search');
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
                searchInput.blur();
            }
            
            // Arrow keys to navigate tabs (when not in input)
            if (!e.target.matches('input, textarea')) {
                const tabs = document.querySelectorAll('.tab-btn');
                const activeIndex = Array.from(tabs).findIndex(t => t.classList.contains('active'));
                
                if (e.key === 'ArrowLeft' && activeIndex > 0) {
                    e.preventDefault();
                    tabs[activeIndex - 1].click();
                    tabs[activeIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                } else if (e.key === 'ArrowRight' && activeIndex < tabs.length - 1) {
                    e.preventDefault();
                    tabs[activeIndex + 1].click();
                    tabs[activeIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            }
        });
    }

    setupSidebarToggle() {
        const toggle = document.getElementById('sidebar-toggle');
        const sidebar = document.querySelector('.sidebar');
        
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    setupTabNavigation() {
        const leftArrow = document.getElementById('nav-arrow-left');
        const rightArrow = document.getElementById('nav-arrow-right');
        const tabsContainer = document.getElementById('category-tabs');
        
        leftArrow.addEventListener('click', () => {
            tabsContainer.scrollBy({ left: -200, behavior: 'smooth' });
        });
        
        rightArrow.addEventListener('click', () => {
            tabsContainer.scrollBy({ left: 200, behavior: 'smooth' });
        });
        
        // Update arrow states on scroll
        const updateArrows = () => {
            leftArrow.disabled = tabsContainer.scrollLeft <= 0;
            rightArrow.disabled = tabsContainer.scrollLeft >= tabsContainer.scrollWidth - tabsContainer.clientWidth - 1;
        };
        
        tabsContainer.addEventListener('scroll', updateArrows);
        updateArrows();
    }



    createInput(input) {
        const group = document.createElement('div');
        group.className = 'input-group';

        if (input.type === 'checkboxes') {
            const optionsGroup = document.createElement('div');
            optionsGroup.className = 'options-group';
            
            const title = document.createElement('h3');
            title.textContent = input.label;
            optionsGroup.appendChild(title);

            input.options.forEach(opt => {
                const label = document.createElement('label');
                label.innerHTML = `
                    <input type="checkbox" id="${opt.id}" ${opt.checked ? 'checked' : ''}>
                    ${opt.label}
                `;
                optionsGroup.appendChild(label);
            });

            return optionsGroup;
        }

        const label = document.createElement('label');
        label.setAttribute('for', input.id);
        label.textContent = input.label;
        group.appendChild(label);

        if (input.type === 'password') {
            const inputEl = document.createElement('input');
            inputEl.type = 'password';
            inputEl.id = input.id;
            inputEl.placeholder = input.placeholder || '';
            group.appendChild(inputEl);
        } else if (input.type === 'textarea') {
            const textarea = document.createElement('textarea');
            textarea.id = input.id;
            textarea.placeholder = input.placeholder || '';
            if (input.readonly) textarea.readOnly = true;
            group.appendChild(textarea);
        } else if (input.type === 'select') {
            const select = document.createElement('select');
            select.id = input.id;
            if (input.options) {
                input.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.value;
                    option.textContent = opt.label;
                    select.appendChild(option);
                });
            }
            group.appendChild(select);
        } else {
            const inputEl = document.createElement('input');
            inputEl.type = input.type;
            inputEl.id = input.id;
            inputEl.placeholder = input.placeholder || '';
            if (input.value) inputEl.value = input.value;
            group.appendChild(inputEl);
        }

        return group;
    }

    createOutput(output) {
        const container = document.createElement('div');

        if (output.type === 'progress') {
            container.id = output.id;
            container.className = 'progress-container';
            container.style.display = 'none';
            container.innerHTML = `
                <div class="progress-bar">
                    <div class="progress" id="${output.id}-bar"></div>
                </div>
                <p id="${output.id.replace('progress', 'status')}" style="margin-top: 10px; text-align: center; font-size: 13px; color: var(--text-muted);"></p>
            `;
        } else if (output.type === 'status') {
            container.id = output.id;
            container.className = 'status-display';
        } else if (output.type === 'log') {
            container.id = output.id;
            container.style.marginTop = '16px';
            container.style.maxHeight = '300px';
            container.style.overflowY = 'auto';
            container.style.background = 'var(--bg-tertiary)';
            container.style.padding = '12px';
            container.style.borderRadius = '6px';
        } else if (output.type === 'preview') {
            container.id = output.id;
            container.className = 'preview-container';
        } else if (output.type === 'textarea') {
            const group = document.createElement('div');
            group.className = 'input-group';
            group.style.marginTop = '16px';
            
            const label = document.createElement('label');
            label.textContent = 'Output';
            group.appendChild(label);

            const textarea = document.createElement('textarea');
            textarea.id = output.id;
            textarea.readOnly = true;
            group.appendChild(textarea);

            return group;
        }

        return container;
    }








}



// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing UI Generator...');
    console.log('Tools config:', TOOLS_CONFIG);
    window.uiGenerator = new UIGenerator(TOOLS_CONFIG);
    window.uiGenerator.init();
    console.log('UI Generator initialized');
});
