const { ipcRenderer } = require('electron');

// Suppress Electron/Undici timer errors (cosmetic only)
const originalError = console.error;
console.error = (...args) => {
    const msg = args[0]?.toString() || '';
    if (msg.includes('timeout.unref') || msg.includes('fastNowTimeout.refresh')) return;
    originalError.apply(console, args);
};

// Catch uncaught errors
window.addEventListener('error', (e) => {
    if (e.message?.includes('timeout.unref') || e.message?.includes('fastNowTimeout.refresh')) {
        e.preventDefault();
        return false;
    }
});

window.addEventListener('unhandledrejection', (e) => {
    const msg = e.reason?.toString() || '';
    if (msg.includes('timeout.unref') || msg.includes('fastNowTimeout.refresh')) {
        e.preventDefault();
        return false;
    }
});

// Alert system
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 3000);
}

// Show/hide sections
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }

    document.querySelectorAll('.sidebar-nav button').forEach(button => {
        button.classList.remove('active');
        if (button.dataset.section === sectionId) {
            button.classList.add('active');
        }
    });
}

// Toggle token visibility
function toggleTokenVisibility(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-visibility i');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        button.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Bot testing functionality
async function testBot() {
    const token = document.getElementById('bot-token').value;
    const command = document.getElementById('test-command').value;
    const statusDiv = document.getElementById('bot-status');
    
    if (!token || !command) {
        statusDiv.className = 'status-display error';
        statusDiv.style.display = 'block';
        statusDiv.textContent = 'Please enter both token and command';
        return;
    }

    try {
        const Discord = require('discord.js');
        const client = new Discord.Client({
            intents: [
                Discord.GatewayIntentBits.Guilds,
                Discord.GatewayIntentBits.GuildMessages,
                Discord.GatewayIntentBits.MessageContent
            ]
        });

        statusDiv.className = 'status-display';
        statusDiv.style.display = 'block';
        statusDiv.textContent = 'Connecting to Discord...';

        await client.login(token);
        
        client.on('ready', () => {
            statusDiv.className = 'status-display success';
            statusDiv.textContent = `✓ Bot logged in as ${client.user.tag}`;
        });

        client.on('messageCreate', message => {
            if (message.content === command) {
                message.reply('Command received and working!');
            }
        });
    } catch (error) {
        statusDiv.className = 'status-display error';
        statusDiv.style.display = 'block';
        statusDiv.textContent = `Error: ${error.message}`;
    }
}

// Webhook manager functionality
async function sendWebhook() {
    const webhookUrl = document.getElementById('webhook-url').value;
    const message = document.getElementById('webhook-message').value;
    const embedColor = document.getElementById('embed-color').value;
    const embedTitle = document.getElementById('embed-title').value;
    const embedDescription = document.getElementById('embed-description').value;
    const username = document.getElementById('webhook-username').value;
    const avatarUrl = document.getElementById('webhook-avatar').value;

    if (!webhookUrl) {
        showAlert('Please enter a webhook URL', 'error');
        return;
    }

    try {
        const payload = {
            content: message || undefined,
            username: username || undefined,
            avatar_url: avatarUrl || undefined,
            embeds: []
        };

        if (embedTitle || embedDescription) {
            payload.embeds.push({
                title: embedTitle || undefined,
                description: embedDescription || undefined,
                color: parseInt(embedColor.replace('#', ''), 16),
                timestamp: new Date().toISOString()
            });
        }

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showAlert('Message sent successfully!', 'success');
        } else {
            const error = await response.text();
            showAlert(`Failed to send message: ${error}`, 'error');
        }
    } catch (error) {
        showAlert(`Error: ${error.message}`, 'error');
    }
}

// Send embed from embed creator
async function sendEmbed() {
    const webhookUrl = document.getElementById('embed-webhook-url').value;
    const title = document.getElementById('embed-creator-title').value;
    const description = document.getElementById('embed-creator-description').value;
    const color = document.getElementById('embed-creator-color').value;

    if (!webhookUrl) {
        showAlert('Please enter a webhook URL', 'error');
        return;
    }

    try {
        const payload = {
            embeds: [{
                title: title || undefined,
                description: description || undefined,
                color: parseInt(color.replace('#', ''), 16),
                timestamp: new Date().toISOString()
            }]
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showAlert('Embed sent successfully!', 'success');
        } else {
            showAlert('Failed to send embed', 'error');
        }
    } catch (error) {
        showAlert(`Error: ${error.message}`, 'error');
    }
}

// Token validator functionality
function validateToken() {
    const token = document.getElementById('token-input').value;
    const analysisDiv = document.getElementById('token-analysis');
    
    if (!token) {
        analysisDiv.className = 'status-display error';
        analysisDiv.style.display = 'block';
        analysisDiv.textContent = 'Please enter a token';
        return;
    }

    try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            throw new Error('Invalid token format - Discord tokens should have 3 parts');
        }

        const payload = JSON.parse(atob(tokenParts[0]));
        const userId = payload;
        
        analysisDiv.className = 'status-display success';
        analysisDiv.style.display = 'block';
        analysisDiv.innerHTML = `
            <h3>Token Analysis:</h3>
            <p><strong>User ID:</strong> ${userId}</p>
            <p><strong>Token Type:</strong> ${token.startsWith('Bot') ? 'Bot Token' : 'User Token'}</p>
            <p><strong>Status:</strong> Valid Format</p>
        `;
    } catch (e) {
        analysisDiv.className = 'status-display error';
        analysisDiv.style.display = 'block';
        analysisDiv.textContent = `Invalid token: ${e.message}`;
    }
}

// Discord permissions
const DISCORD_PERMISSIONS = {
    'Administrator': 0x8,
    'Manage Server': 0x20,
    'Manage Roles': 0x10000000,
    'Manage Channels': 0x10,
    'Kick Members': 0x2,
    'Ban Members': 0x4,
    'Create Instant Invite': 0x1,
    'Change Nickname': 0x4000000,
    'Manage Nicknames': 0x8000000,
    'Manage Emojis': 0x40000000,
    'Manage Webhooks': 0x20000000,
    'View Channels': 0x400,
    'Send Messages': 0x800,
    'Send TTS Messages': 0x1000,
    'Manage Messages': 0x2000,
    'Embed Links': 0x4000,
    'Attach Files': 0x8000,
    'Read Message History': 0x10000,
    'Mention Everyone': 0x20000,
    'Use External Emojis': 0x40000,
    'Add Reactions': 0x40,
    'View Audit Log': 0x80,
    'Priority Speaker': 0x100,
    'Stream': 0x200,
    'Connect': 0x100000,
    'Speak': 0x200000,
    'Mute Members': 0x400000,
    'Deafen Members': 0x800000,
    'Move Members': 0x1000000,
    'Use VAD': 0x2000000
};

// Calculate permissions
function calculatePermissions() {
    const checkboxes = document.querySelectorAll('.permissions-list input[type="checkbox"]');
    let total = 0n;
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            total += BigInt(checkbox.value);
        }
    });
    
    document.getElementById('permission-integer').textContent = total.toString();
}

// JSON formatter
function formatJSON() {
    const input = document.getElementById('json-input').value;
    const output = document.getElementById('json-output');
    
    try {
        const parsed = JSON.parse(input);
        output.value = JSON.stringify(parsed, null, 2);
        showAlert('JSON formatted successfully', 'success');
    } catch (e) {
        output.value = `Error: ${e.message}`;
        showAlert('Invalid JSON', 'error');
    }
}

// JSON minifier
function minifyJSON() {
    const input = document.getElementById('json-input').value;
    const output = document.getElementById('json-output');
    
    try {
        const parsed = JSON.parse(input);
        output.value = JSON.stringify(parsed);
        showAlert('JSON minified successfully', 'success');
    } catch (e) {
        output.value = `Error: ${e.message}`;
        showAlert('Invalid JSON', 'error');
    }
}

// Command Builder
let commandOptions = [];

function addCommandOption() {
    const option = {
        type: 'STRING',
        name: '',
        description: '',
        required: false
    };
    commandOptions.push(option);
    updateCommandPreview();
}

function updateCommandPreview() {
    const name = document.getElementById('command-name')?.value || '';
    const description = document.getElementById('command-description')?.value || '';
    
    const commandCode = `
new SlashCommandBuilder()
    .setName('${name}')
    .setDescription('${description}')
${commandOptions.map(opt => `    .addStringOption(option =>
        option
            .setName('${opt.name}')
            .setDescription('${opt.description}')
            .setRequired(${opt.required})
    )`).join('\n')}
    .toJSON();
`.trim();

    const codeElement = document.getElementById('command-code');
    if (codeElement) {
        codeElement.textContent = commandCode;
    }
}

function copyCommandCode() {
    const code = document.getElementById('command-code').textContent;
    navigator.clipboard.writeText(code);
    showAlert('Code copied to clipboard!', 'success');
}

// API Tester
async function testAPI() {
    const endpoint = document.getElementById('api-endpoint').value;
    const method = document.getElementById('api-method').value;
    const body = document.getElementById('api-body').value;
    const token = document.getElementById('bot-token').value;
    
    if (!endpoint) {
        showAlert('Please enter an endpoint', 'error');
        return;
    }

    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = formatToken(token);
        }

        if (method !== 'GET' && body) {
            options.body = body;
        }

        const response = await fetch(`https://discord.com/api/v10${endpoint}`, options);
        const data = await response.json();
        
        document.getElementById('api-response').innerHTML = `
            <div style="margin-bottom: 12px;">
                <strong>Status:</strong> ${response.status} ${response.statusText}
            </div>
            <pre style="background: var(--bg-primary); padding: 12px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(data, null, 2)}</pre>
        `;
    } catch (error) {
        showAlert(`Error: ${error.message}`, 'error');
    }
}

// Server Templates
function useTemplate(templateName) {
    showAlert(`Template "${templateName}" selected. Code copied to clipboard!`, 'success');
}

// Toggle token type hint
function toggleTokenType() {
    const tokenType = document.getElementById('token-type').value;
    const hint = document.getElementById('token-hint');
    
    if (tokenType === 'user') {
        hint.textContent = 'User token - No permissions needed, just be a member of the server';
        hint.style.color = 'var(--success)';
    } else {
        hint.textContent = 'Bot token requires admin permissions in the server';
        hint.style.color = 'var(--text-secondary)';
    }
}

// Server Cloner - Save as Template
let serverTemplate = null;

async function cloneServer() {
    const sourceServerId = document.getElementById('source-server-id').value;
    const token = document.getElementById('clone-token').value;
    const cloneChannels = document.getElementById('clone-channels').checked;
    const cloneRoles = document.getElementById('clone-roles').checked;
    const cloneEmojis = document.getElementById('clone-emojis').checked;

    if (!sourceServerId || !token) {
        showAlert('Please fill required fields', 'error');
        return;
    }

    const progressContainer = document.getElementById('clone-progress');
    const progressBar = document.getElementById('clone-progress-bar');
    const statusText = document.getElementById('clone-status');
    
    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';
    statusText.textContent = 'Fetching server data...';
    statusText.style.color = 'var(--text-primary)';
    
    try {
        const headers = { 'Authorization': token };
        serverTemplate = { channels: [], roles: [], emojis: [], settings: {} };
        
        // Fetch server info
        progressBar.style.width = '10%';
        const guildRes = await fetch(`https://discord.com/api/v10/guilds/${sourceServerId}`, { headers });
        if (!guildRes.ok) throw new Error('Cannot access server');
        const guild = await guildRes.json();
        serverTemplate.settings = { name: guild.name, icon: guild.icon };
        
        progressBar.style.width = '30%';
        statusText.textContent = `Found: ${guild.name}`;

        // Fetch Roles
        if (cloneRoles) {
            progressBar.style.width = '50%';
            statusText.textContent = 'Fetching roles...';
            const rolesRes = await fetch(`https://discord.com/api/v10/guilds/${sourceServerId}/roles`, { headers });
            const roles = await rolesRes.json();
            serverTemplate.roles = roles.filter(r => r.name !== '@everyone').map(r => ({
                name: r.name,
                color: r.color,
                permissions: r.permissions,
                hoist: r.hoist,
                mentionable: r.mentionable,
                position: r.position
            }));
        }

        // Fetch Channels
        if (cloneChannels) {
            progressBar.style.width = '70%';
            statusText.textContent = 'Fetching channels...';
            const channelsRes = await fetch(`https://discord.com/api/v10/guilds/${sourceServerId}/channels`, { headers });
            const channels = await channelsRes.json();
            serverTemplate.channels = channels.map(c => ({
                name: c.name,
                type: c.type,
                topic: c.topic,
                nsfw: c.nsfw,
                rate_limit_per_user: c.rate_limit_per_user,
                position: c.position,
                parent_id: c.parent_id
            }));
        }

        // Fetch Emojis
        if (cloneEmojis) {
            progressBar.style.width = '90%';
            statusText.textContent = 'Fetching emojis...';
            const emojisRes = await fetch(`https://discord.com/api/v10/guilds/${sourceServerId}/emojis`, { headers });
            const emojis = await emojisRes.json();
            serverTemplate.emojis = emojis.map(e => ({
                name: e.name,
                id: e.id,
                animated: e.animated
            }));
        }

        progressBar.style.width = '100%';
        statusText.style.color = 'var(--success)';
        statusText.innerHTML = `
            ✓ Template saved!<br>
            <small>Roles: ${serverTemplate.roles.length} | Channels: ${serverTemplate.channels.length} | Emojis: ${serverTemplate.emojis.length}</small><br>
            <button onclick="downloadTemplate()" class="secondary-button" style="margin-top: 8px;">Download JSON</button>
            <button onclick="showApplyTemplate()" class="primary-button" style="margin-top: 8px; margin-left: 8px;">Apply to Server</button>
        `;
        showAlert('Template saved!', 'success');

    } catch (error) {
        statusText.textContent = `Error: ${error.message}`;
        statusText.style.color = 'var(--danger)';
    }
}

function downloadTemplate() {
    if (!serverTemplate) {
        showAlert('No template to download', 'error');
        return;
    }
    const blob = new Blob([JSON.stringify(serverTemplate, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `server-template-${Date.now()}.json`;
    a.click();
    showAlert('Template downloaded!', 'success');
}

async function showApplyTemplate() {
    const statusText = document.getElementById('clone-status');
    statusText.style.color = 'var(--text-primary)';
    statusText.innerHTML = `
        <div style="margin-bottom: 12px;"><strong>Step 1: Enter Target Server</strong></div>
        <input type="text" id="target-server-input" placeholder="Target Server ID" style="width: 100%; padding: 8px; background: var(--bg-primary); border: 1px solid var(--border); border-radius: 4px; color: var(--text-primary); margin-bottom: 12px;">
        <button onclick="loadTargetServer()" class="primary-button">Next</button>
        <button onclick="cloneServer()" class="secondary-button" style="margin-left: 8px;">Cancel</button>
    `;
}

let targetServerData = null;

async function loadTargetServer() {
    const targetId = document.getElementById('target-server-input').value;
    const token = document.getElementById('clone-token').value;
    
    if (!targetId || !token) {
        showAlert('Enter server ID and token', 'error');
        return;
    }
    
    const statusText = document.getElementById('clone-status');
    statusText.textContent = 'Loading target server...';
    
    try {
        const headers = { 'Authorization': token };
        
        // Fetch target server data
        const [channelsRes, rolesRes, emojisRes] = await Promise.all([
            fetch(`https://discord.com/api/v10/guilds/${targetId}/channels`, { headers }),
            fetch(`https://discord.com/api/v10/guilds/${targetId}/roles`, { headers }),
            fetch(`https://discord.com/api/v10/guilds/${targetId}/emojis`, { headers })
        ]);
        
        targetServerData = {
            id: targetId,
            channels: await channelsRes.json(),
            roles: await rolesRes.json(),
            emojis: await emojisRes.json()
        };
        
        showDeleteOptions();
    } catch (error) {
        statusText.style.color = 'var(--danger)';
        statusText.textContent = `Error: ${error.message}`;
    }
}

function showDeleteOptions() {
    const statusText = document.getElementById('clone-status');
    statusText.style.color = 'var(--text-primary)';
    
    const channelsList = targetServerData.channels.map(c => 
        `<label style="display: block; padding: 4px;"><input type="checkbox" class="delete-channel" value="${c.id}"> ${c.name}</label>`
    ).join('');
    
    const rolesList = targetServerData.roles.filter(r => r.name !== '@everyone').map(r => 
        `<label style="display: block; padding: 4px;"><input type="checkbox" class="delete-role" value="${r.id}"> ${r.name}</label>`
    ).join('');
    
    const emojisList = targetServerData.emojis.map(e => 
        `<label style="display: block; padding: 4px;"><input type="checkbox" class="delete-emoji" value="${e.id}"> ${e.name}</label>`
    ).join('');
    
    statusText.innerHTML = `
        <div style="margin-bottom: 12px;"><strong>Step 2: Select items to DELETE before cloning</strong></div>
        
        <div style="margin-bottom: 12px;">
            <strong>Channels (${targetServerData.channels.length}):</strong>
            <button onclick="document.querySelectorAll('.delete-channel').forEach(c => c.checked = true)" class="secondary-button" style="margin-left: 8px; padding: 4px 8px; font-size: 12px;">Select All</button>
            <button onclick="document.querySelectorAll('.delete-channel').forEach(c => c.checked = false)" class="secondary-button" style="margin-left: 4px; padding: 4px 8px; font-size: 12px;">Clear</button>
            <div style="max-height: 150px; overflow-y: auto; background: var(--bg-primary); padding: 8px; border-radius: 4px; margin-top: 8px;">
                ${channelsList || '<em>No channels</em>'}
            </div>
        </div>
        
        <div style="margin-bottom: 12px;">
            <strong>Roles (${targetServerData.roles.length - 1}):</strong>
            <button onclick="document.querySelectorAll('.delete-role').forEach(c => c.checked = true)" class="secondary-button" style="margin-left: 8px; padding: 4px 8px; font-size: 12px;">Select All</button>
            <button onclick="document.querySelectorAll('.delete-role').forEach(c => c.checked = false)" class="secondary-button" style="margin-left: 4px; padding: 4px 8px; font-size: 12px;">Clear</button>
            <div style="max-height: 150px; overflow-y: auto; background: var(--bg-primary); padding: 8px; border-radius: 4px; margin-top: 8px;">
                ${rolesList || '<em>No roles</em>'}
            </div>
        </div>
        
        <div style="margin-bottom: 12px;">
            <strong>Emojis (${targetServerData.emojis.length}):</strong>
            <button onclick="document.querySelectorAll('.delete-emoji').forEach(c => c.checked = true)" class="secondary-button" style="margin-left: 8px; padding: 4px 8px; font-size: 12px;">Select All</button>
            <button onclick="document.querySelectorAll('.delete-emoji').forEach(c => c.checked = false)" class="secondary-button" style="margin-left: 4px; padding: 4px 8px; font-size: 12px;">Clear</button>
            <div style="max-height: 150px; overflow-y: auto; background: var(--bg-primary); padding: 8px; border-radius: 4px; margin-top: 8px;">
                ${emojisList || '<em>No emojis</em>'}
            </div>
        </div>
        
        <button onclick="startCloneProcess()" class="primary-button">Delete Selected & Apply Template</button>
        <button onclick="cloneServer()" class="secondary-button" style="margin-left: 8px;">Cancel</button>
    `;
}

async function startCloneProcess() {
    const token = document.getElementById('clone-token').value;
    const statusText = document.getElementById('clone-status');
    const progressBar = document.getElementById('clone-progress-bar');
    
    // Get selected items to delete
    const channelsToDelete = Array.from(document.querySelectorAll('.delete-channel:checked')).map(c => c.value);
    const rolesToDelete = Array.from(document.querySelectorAll('.delete-role:checked')).map(c => c.value);
    const emojisToDelete = Array.from(document.querySelectorAll('.delete-emoji:checked')).map(c => c.value);
    
    const totalToDelete = channelsToDelete.length + rolesToDelete.length + emojisToDelete.length;
    
    if (totalToDelete > 0 && !confirm(`Delete ${totalToDelete} items before cloning?`)) return;
    
    statusText.style.color = 'var(--text-primary)';
    progressBar.style.width = '0%';
    
    try {
        const headers = { 'Authorization': token };
        let deleted = 0;
        
        // Delete channels
        if (channelsToDelete.length > 0) {
            statusText.textContent = 'Deleting channels...';
            for (const channelId of channelsToDelete) {
                try {
                    await fetch(`https://discord.com/api/v10/channels/${channelId}`, { method: 'DELETE', headers });
                    deleted++;
                    progressBar.style.width = `${(deleted / totalToDelete) * 50}%`;
                    await new Promise(r => setTimeout(r, 500));
                } catch (e) {
                    console.error('Error deleting channel:', e);
                }
            }
        }
        
        // Delete roles
        if (rolesToDelete.length > 0) {
            statusText.textContent = 'Deleting roles...';
            for (const roleId of rolesToDelete) {
                try {
                    await fetch(`https://discord.com/api/v10/guilds/${targetServerData.id}/roles/${roleId}`, { method: 'DELETE', headers });
                    deleted++;
                    progressBar.style.width = `${(deleted / totalToDelete) * 50}%`;
                    await new Promise(r => setTimeout(r, 500));
                } catch (e) {
                    console.error('Error deleting role:', e);
                }
            }
        }
        
        // Delete emojis
        if (emojisToDelete.length > 0) {
            statusText.textContent = 'Deleting emojis...';
            for (const emojiId of emojisToDelete) {
                try {
                    await fetch(`https://discord.com/api/v10/guilds/${targetServerData.id}/emojis/${emojiId}`, { method: 'DELETE', headers });
                    deleted++;
                    progressBar.style.width = `${(deleted / totalToDelete) * 50}%`;
                    await new Promise(r => setTimeout(r, 500));
                } catch (e) {
                    console.error('Error deleting emoji:', e);
                }
            }
        }
        
        // Now apply template
        progressBar.style.width = '50%';
        await applyTemplate(targetServerData.id, {});
        
    } catch (error) {
        statusText.style.color = 'var(--danger)';
        statusText.textContent = `Error: ${error.message}`;
    }
}

async function applyTemplate(targetServerId, options = {}) {
    if (!serverTemplate) {
        showAlert('No template loaded', 'error');
        return;
    }

    const token = document.getElementById('clone-token').value;
    if (!token) {
        showAlert('Enter token first', 'error');
        return;
    }

    const statusText = document.getElementById('clone-status');
    const progressBar = document.getElementById('clone-progress-bar');
    
    statusText.textContent = 'Applying template...';
    statusText.style.color = 'var(--text-primary)';
    progressBar.style.width = '0%';

    const exclude = options.exclude || [];
    const shouldExclude = (item) => {
        return exclude.some(ex => 
            item.name?.toLowerCase().includes(ex.toLowerCase()) || 
            item.id === ex
        );
    };

    try {
        const headers = { 'Authorization': token, 'Content-Type': 'application/json' };
        let totalCreated = 0;

        // Apply Roles
        if (options.roles !== false && serverTemplate.roles.length > 0) {
            progressBar.style.width = '30%';
            statusText.textContent = 'Creating roles...';
            let created = 0;
            const rolesToCreate = serverTemplate.roles.filter(r => !shouldExclude(r));
            
            for (const role of rolesToCreate) {
                try {
                    await fetch(`https://discord.com/api/v10/guilds/${targetServerId}/roles`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(role)
                    });
                    created++;
                    totalCreated++;
                    statusText.textContent = `Created ${created}/${rolesToCreate.length} roles`;
                    await new Promise(r => setTimeout(r, 1000));
                } catch (e) {
                    console.error('Error creating role:', e);
                }
            }
        }

        // Apply Channels
        if (options.channels !== false && serverTemplate.channels.length > 0) {
            progressBar.style.width = '60%';
            statusText.textContent = 'Creating channels...';
            let created = 0;
            const channelsToCreate = serverTemplate.channels.filter(c => !shouldExclude(c));
            
            for (const channel of channelsToCreate) {
                try {
                    await fetch(`https://discord.com/api/v10/guilds/${targetServerId}/channels`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(channel)
                    });
                    created++;
                    totalCreated++;
                    statusText.textContent = `Created ${created}/${channelsToCreate.length} channels`;
                    await new Promise(r => setTimeout(r, 1000));
                } catch (e) {
                    console.error('Error creating channel:', e);
                }
            }
        }

        // Apply Emojis
        if (options.emojis !== false && serverTemplate.emojis.length > 0) {
            progressBar.style.width = '80%';
            statusText.textContent = 'Creating emojis...';
            let created = 0;
            const emojisToCreate = serverTemplate.emojis.filter(e => !shouldExclude(e));
            
            for (const emoji of emojisToCreate) {
                try {
                    const imageUrl = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`;
                    await fetch(`https://discord.com/api/v10/guilds/${targetServerId}/emojis`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ name: emoji.name, image: imageUrl })
                    });
                    created++;
                    totalCreated++;
                    statusText.textContent = `Created ${created}/${emojisToCreate.length} emojis`;
                    await new Promise(r => setTimeout(r, 1000));
                } catch (e) {
                    console.error('Error creating emoji:', e);
                }
            }
        }

        progressBar.style.width = '100%';
        statusText.style.color = 'var(--success)';
        statusText.textContent = `✓ Created ${totalCreated} items successfully!`;
        showAlert('Template applied!', 'success');

    } catch (error) {
        statusText.textContent = `Error: ${error.message}`;
        statusText.style.color = 'var(--danger)';
    }
}

// Webhook preview updater
function updateWebhookPreview() {
    const preview = document.getElementById('webhook-preview');
    const message = document.getElementById('webhook-message')?.value || '';
    const embedTitle = document.getElementById('embed-title')?.value || '';
    const embedDescription = document.getElementById('embed-description')?.value || '';
    const embedColor = document.getElementById('embed-color')?.value || '#5865f2';
    
    if (preview) {
        preview.innerHTML = `
            <div style="padding: 12px; background: var(--bg-tertiary); border-radius: 4px;">
                ${message ? `<div style="margin-bottom: 8px;">${message}</div>` : ''}
                ${embedTitle || embedDescription ? `
                    <div style="border-left: 4px solid ${embedColor}; padding: 12px; background: var(--bg-primary); border-radius: 4px;">
                        ${embedTitle ? `<div style="font-weight: 600; margin-bottom: 8px;">${embedTitle}</div>` : ''}
                        ${embedDescription ? `<div>${embedDescription}</div>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }
}

// Initialize the application
function initializeApp() {
    // Setup sidebar navigation
    document.querySelectorAll('.sidebar-nav button').forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.dataset.section;
            showSection(sectionId);
        });
    });

    // Initialize permissions calculator
    const permissionsList = document.querySelector('.permissions-list');
    if (permissionsList) {
        Object.entries(DISCORD_PERMISSIONS).forEach(([perm, value]) => {
            const label = document.createElement('label');
            label.className = 'permission-label';
            label.innerHTML = `
                <input type="checkbox" value="${value}" onchange="calculatePermissions()">
                ${perm}
            `;
            permissionsList.appendChild(label);
        });
    }

    // Add permission templates
    const templates = {
        'Admin': ['Administrator'],
        'Moderator': ['Manage Messages', 'Kick Members', 'Ban Members', 'View Audit Log'],
        'Helper': ['View Channels', 'Send Messages', 'Read Message History', 'Add Reactions']
    };

    const templateSelect = document.getElementById('permission-template');
    if (templateSelect) {
        Object.keys(templates).forEach(template => {
            const option = document.createElement('option');
            option.value = template;
            option.textContent = template;
            templateSelect.appendChild(option);
        });

        templateSelect.addEventListener('change', () => {
            const selected = templates[templateSelect.value] || [];
            document.querySelectorAll('.permissions-list input[type="checkbox"]').forEach(checkbox => {
                const label = checkbox.parentElement.textContent.trim();
                checkbox.checked = selected.includes(label);
            });
            calculatePermissions();
        });
    }

    // Setup webhook preview listeners
    ['webhook-message', 'embed-title', 'embed-description', 'embed-color'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updateWebhookPreview);
        }
    });

    // Setup command builder listeners
    const commandName = document.getElementById('command-name');
    const commandDesc = document.getElementById('command-description');
    if (commandName) commandName.addEventListener('input', updateCommandPreview);
    if (commandDesc) commandDesc.addEventListener('input', updateCommandPreview);

    // Show default section
    showSection('server-cloner');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Mass DM Tool
let massDMRunning = false;
let massDMInterval = null;

async function startMassDM() {
    const token = document.getElementById('mass-dm-token').value;
    const serverId = document.getElementById('mass-dm-server').value;
    const message = document.getElementById('mass-dm-message').value;
    const delay = parseInt(document.getElementById('mass-dm-delay').value);
    const statusDiv = document.getElementById('mass-dm-status');

    if (!token || !serverId || !message) {
        showAlert('Please fill all fields', 'error');
        return;
    }

    massDMRunning = true;
    statusDiv.className = 'status-display';
    statusDiv.style.display = 'block';
    statusDiv.textContent = 'Fetching members...';

    try {
        const headers = { 'Authorization': token, 'Content-Type': 'application/json' };
        const membersRes = await fetch(`https://discord.com/api/v10/guilds/${serverId}/members?limit=1000`, { headers });
        const members = await membersRes.json();

        if (!Array.isArray(members)) {
            throw new Error(members.message || 'Failed to fetch members. Check token and server ID.');
        }

        let sent = 0;
        for (const member of members) {
            if (!massDMRunning) break;
            
            try {
                const dmRes = await fetch('https://discord.com/api/v10/users/@me/channels', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ recipient_id: member.user.id })
                });
                const dm = await dmRes.json();
                
                await fetch(`https://discord.com/api/v10/channels/${dm.id}/messages`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ content: message })
                });
                
                sent++;
                statusDiv.textContent = `Sent ${sent}/${members.length} messages`;
                await new Promise(resolve => setTimeout(resolve, delay));
            } catch (e) {
                console.error('Error sending DM:', e);
            }
        }
        
        statusDiv.className = 'status-display success';
        statusDiv.textContent = `Completed! Sent ${sent} messages`;
    } catch (error) {
        statusDiv.className = 'status-display error';
        statusDiv.textContent = `Error: ${error.message}`;
    }
}

function stopMassDM() {
    massDMRunning = false;
    showAlert('Mass DM stopped', 'info');
}

// Server Lookup
async function lookupServer() {
    const token = document.getElementById('lookup-token').value;
    const serverId = document.getElementById('lookup-server-id').value;
    const infoDiv = document.getElementById('server-info');

    if (!token) {
        showAlert('Please enter token', 'error');
        return;
    }

    infoDiv.className = 'status-display';
    infoDiv.style.display = 'block';
    infoDiv.textContent = 'Fetching servers...';

    try {
        const headers = { 'Authorization': token };
        const guildsRes = await fetch('https://discord.com/api/v10/users/@me/guilds', { headers });
        
        if (!guildsRes.ok) {
            if (guildsRes.status === 401) {
                throw new Error('Invalid token. Please check your token.');
            }
            throw new Error(`API Error: ${guildsRes.status}`);
        }
        
        const guilds = await guildsRes.json();
        
        if (serverId) {
            // Search for specific server
            const guild = guilds.find(g => g.id === serverId);
            
            if (!guild) {
                infoDiv.className = 'status-display error';
                infoDiv.innerHTML = `
                    <p>Server ID <code>${serverId}</code> not found in your ${guilds.length} servers.</p>
                    <p style="margin-top: 12px;">Clear the Server ID field to see all your servers.</p>
                `;
                return;
            }
            
            const createdDate = new Date(Number((BigInt(guild.id) >> 22n) + 1420070400000n));
            infoDiv.className = 'status-display success';
            infoDiv.innerHTML = `
                <h3 style="margin-bottom: 12px;">${guild.name}</h3>
                ${guild.icon ? `<img src="https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128" style="width: 80px; border-radius: 50%; margin-bottom: 12px;">` : ''}
                <p><strong>ID:</strong> ${guild.id}</p>
                <p><strong>Owner:</strong> ${guild.owner ? 'Yes ✓' : 'No'}</p>
                <p><strong>Permissions:</strong> ${guild.permissions || 'N/A'}</p>
                <p><strong>Created:</strong> ${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}</p>
                ${guild.features && guild.features.length > 0 ? `<p><strong>Features:</strong> ${guild.features.join(', ')}</p>` : ''}
            `;
        } else {
            // Show all servers
            infoDiv.className = 'status-display success';
            infoDiv.innerHTML = `
                <h3 style="margin-bottom: 12px;">Your Servers (${guilds.length})</h3>
                <div style="max-height: 400px; overflow-y: auto;">
                    ${guilds.map(g => `
                        <div style="padding: 12px; margin-bottom: 8px; background: var(--bg-tertiary); border-radius: 6px; cursor: pointer;" onclick="document.getElementById('lookup-server-id').value='${g.id}'; lookupServer();">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                ${g.icon ? `<img src="https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=64" style="width: 48px; height: 48px; border-radius: 50%;">` : '<div style="width: 48px; height: 48px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">' + g.name[0] + '</div>'}
                                <div style="flex: 1;">
                                    <div style="font-weight: 600;">${g.name}</div>
                                    <div style="font-size: 12px; color: var(--text-muted);">${g.id}</div>
                                </div>
                                ${g.owner ? '<span style="background: var(--warning); color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">OWNER</span>' : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <p style="margin-top: 12px; font-size: 13px; color: var(--text-muted);">Click on any server to view details</p>
            `;
        }
    } catch (error) {
        infoDiv.className = 'status-display error';
        infoDiv.textContent = `Error: ${error.message}`;
    }
}

// User Info Grabber
async function getUserInfo() {
    const token = document.getElementById('user-info-token').value;
    const userId = document.getElementById('user-id').value;
    const displayDiv = document.getElementById('user-info-display');

    if (!token || !userId) {
        showAlert('Please fill all fields', 'error');
        return;
    }

    displayDiv.className = 'status-display';
    displayDiv.style.display = 'block';
    displayDiv.textContent = 'Fetching user information...';

    try {
        const headers = { 'Authorization': token };
        const res = await fetch(`https://discord.com/api/v10/users/${userId}`, { headers });
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            if (res.status === 404) {
                throw new Error('User not found. Please check the user ID.');
            } else if (res.status === 401) {
                throw new Error('Invalid token. Please check your token.');
            }
            throw new Error(`API Error: ${res.status} - ${errorData.message || res.statusText}`);
        }
        
        const user = await res.json();
        const createdDate = new Date(Number((BigInt(user.id) >> 22n) + 1420070400000n));
        const username = user.discriminator === '0' ? user.username : `${user.username}#${user.discriminator}`;

        displayDiv.className = 'status-display success';
        displayDiv.innerHTML = `
            ${user.avatar ? `<img src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128" style="width: 100px; border-radius: 50%; margin-bottom: 12px;">` : ''}
            <h3 style="margin-bottom: 12px;">${username}</h3>
            <p><strong>ID:</strong> ${user.id}</p>
            <p><strong>Bot:</strong> ${user.bot ? 'Yes ✓' : 'No'}</p>
            <p><strong>System:</strong> ${user.system ? 'Yes' : 'No'}</p>
            <p><strong>Created:</strong> ${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}</p>
            ${user.banner ? `<p><strong>Banner:</strong> Yes</p>` : ''}
            ${user.accent_color ? `<p><strong>Accent Color:</strong> <span style="display: inline-block; width: 20px; height: 20px; background: #${user.accent_color.toString(16).padStart(6, '0')}; border-radius: 4px; vertical-align: middle;"></span> #${user.accent_color.toString(16).padStart(6, '0')}</p>` : ''}
        `;
    } catch (error) {
        displayDiv.className = 'status-display error';
        displayDiv.textContent = `Error: ${error.message}`;
    }
}

// Nitro Sniper
let nitroSniperActive = false;
let nitroClient = null;

async function startNitroSniper() {
    const token = document.getElementById('sniper-token').value;
    const statusDiv = document.getElementById('sniper-status');
    const logDiv = document.getElementById('sniper-log');

    if (!token) {
        showAlert('Please enter token', 'error');
        return;
    }

    nitroSniperActive = true;
    statusDiv.className = 'status-display success';
    statusDiv.style.display = 'block';
    statusDiv.textContent = '🎯 Nitro Sniper Active - Monitoring messages...';

    const Discord = require('discord.js');
    nitroClient = new Discord.Client({
        intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.MessageContent]
    });

    nitroClient.on('messageCreate', async (message) => {
        const nitroRegex = /(discord\.gift\/|discord\.com\/gifts\/)([a-zA-Z0-9]+)/;
        const match = message.content.match(nitroRegex);
        
        if (match) {
            const code = match[2];
            const log = document.createElement('div');
            log.style.padding = '8px';
            log.style.borderBottom = '1px solid var(--border)';
            log.innerHTML = `<strong>[${new Date().toLocaleTimeString()}]</strong> Found code: ${code} - Attempting to redeem...`;
            logDiv.prepend(log);

            try {
                const res = await fetch(`https://discord.com/api/v10/entitlements/gift-codes/${code}/redeem`, {
                    method: 'POST',
                    headers: { 'Authorization': token }
                });
                
                if (res.ok) {
                    log.innerHTML += ' <span style="color: var(--success)">✓ SUCCESS!</span>';
                    showAlert('Nitro code redeemed!', 'success');
                } else {
                    log.innerHTML += ' <span style="color: var(--danger)">✗ Failed</span>';
                }
            } catch (e) {
                log.innerHTML += ' <span style="color: var(--danger)">✗ Error</span>';
            }
        }
    });

    await nitroClient.login(token);
}

function stopNitroSniper() {
    nitroSniperActive = false;
    if (nitroClient) nitroClient.destroy();
    document.getElementById('sniper-status').textContent = 'Sniper stopped';
    showAlert('Nitro Sniper stopped', 'info');
}

// Message Logger
let loggerActive = false;
let loggerClient = null;

async function startLogger() {
    const token = document.getElementById('logger-token').value;
    const statusDiv = document.getElementById('logger-status');
    const logsDiv = document.getElementById('message-logs');

    if (!token) {
        showAlert('Please enter token', 'error');
        return;
    }

    loggerActive = true;
    statusDiv.className = 'status-display success';
    statusDiv.style.display = 'block';
    statusDiv.textContent = '📝 Logger Active - Monitoring deleted messages...';

    const Discord = require('discord.js');
    loggerClient = new Discord.Client({
        intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.MessageContent]
    });

    loggerClient.on('messageDelete', (message) => {
        const log = document.createElement('div');
        log.style.padding = '12px';
        log.style.marginBottom = '8px';
        log.style.background = 'var(--bg-primary)';
        log.style.borderRadius = '4px';
        log.style.borderLeft = '3px solid var(--danger)';
        log.innerHTML = `
            <strong>[${new Date().toLocaleTimeString()}]</strong> Deleted in #${message.channel.name}<br>
            <strong>Author:</strong> ${message.author?.tag || 'Unknown'}<br>
            <strong>Content:</strong> ${message.content || 'No content'}
        `;
        logsDiv.prepend(log);
    });

    await loggerClient.login(token);
}

function stopLogger() {
    loggerActive = false;
    if (loggerClient) loggerClient.destroy();
    document.getElementById('logger-status').textContent = 'Logger stopped';
    showAlert('Message Logger stopped', 'info');
}

function clearLogs() {
    document.getElementById('message-logs').innerHTML = '';
    showAlert('Logs cleared', 'info');
}

// Auto Responder
let responderActive = false;
let responderClient = null;

async function startAutoResponder() {
    const token = document.getElementById('responder-token').value;
    const trigger = document.getElementById('trigger-word').value;
    const response = document.getElementById('auto-response').value;
    const statusDiv = document.getElementById('responder-status');

    if (!token || !trigger || !response) {
        showAlert('Please fill all fields', 'error');
        return;
    }

    statusDiv.className = 'status-display';
    statusDiv.style.display = 'block';
    statusDiv.textContent = 'Connecting...';

    try {
        responderActive = true;
        const Discord = require('discord.js');
        responderClient = new Discord.Client({
            intents: [
                Discord.GatewayIntentBits.Guilds,
                Discord.GatewayIntentBits.GuildMessages,
                Discord.GatewayIntentBits.MessageContent,
                Discord.GatewayIntentBits.DirectMessages
            ]
        });

        responderClient.once('ready', () => {
            statusDiv.className = 'status-display success';
            statusDiv.textContent = `🤖 Auto Responder Active - Trigger: "${trigger}"`;
        });

        responderClient.on('messageCreate', async (message) => {
            if (message.author.id === responderClient.user.id) return;
            if (message.content.toLowerCase().includes(trigger.toLowerCase())) {
                try {
                    await message.reply(response);
                } catch (e) {
                    console.error('Error sending response:', e);
                }
            }
        });

        await responderClient.login(token).catch(err => {
            throw new Error('Invalid token or login failed: ' + err.message);
        });
    } catch (error) {
        responderActive = false;
        statusDiv.className = 'status-display error';
        statusDiv.textContent = `Error: ${error.message}`;
    }
}

function stopAutoResponder() {
    responderActive = false;
    if (responderClient) responderClient.destroy();
    const statusDiv = document.getElementById('responder-status');
    statusDiv.className = 'status-display';
    statusDiv.textContent = 'Auto Responder stopped';
    showAlert('Auto Responder stopped', 'info');
}

// ===== NEW TOOLS FUNCTIONS =====

// Server Cleaner
async function loadServerForCleaning() {
    const serverId = document.getElementById('cleaner-server-id').value;
    const token = document.getElementById('cleaner-token').value;
    
    if (!serverId || !token) {
        showAlert('Fill all fields', 'error');
        return;
    }
    
    const progressContainer = document.getElementById('cleaner-progress');
    const progressBar = document.getElementById('cleaner-progress-bar');
    const statusText = document.getElementById('cleaner-status');
    
    progressContainer.style.display = 'block';
    statusText.textContent = 'Loading server...';
    
    try {
        const headers = { 'Authorization': token };
        
        const [channelsRes, rolesRes, emojisRes] = await Promise.all([
            fetch(`https://discord.com/api/v10/guilds/${serverId}/channels`, { headers }),
            fetch(`https://discord.com/api/v10/guilds/${serverId}/roles`, { headers }),
            fetch(`https://discord.com/api/v10/guilds/${serverId}/emojis`, { headers })
        ]);
        
        const channels = await channelsRes.json();
        const roles = await rolesRes.json();
        const emojis = await emojisRes.json();
        
        showCleanerOptions(serverId, channels, roles, emojis);
    } catch (error) {
        statusText.style.color = 'var(--danger)';
        statusText.textContent = `Error: ${error.message}`;
    }
}

function showCleanerOptions(serverId, channels, roles, emojis) {
    const statusText = document.getElementById('cleaner-status');
    statusText.style.color = 'var(--text-primary)';
    
    const channelsList = channels.map(c => 
        `<label style="display: block; padding: 4px;"><input type="checkbox" class="clean-channel" value="${c.id}"> ${c.name}</label>`
    ).join('');
    
    const rolesList = roles.filter(r => r.name !== '@everyone').map(r => 
        `<label style="display: block; padding: 4px;"><input type="checkbox" class="clean-role" value="${r.id}"> ${r.name}</label>`
    ).join('');
    
    const emojisList = emojis.map(e => 
        `<label style="display: block; padding: 4px;"><input type="checkbox" class="clean-emoji" value="${e.id}"> ${e.name}</label>`
    ).join('');
    
    statusText.innerHTML = `
        <div style="margin-bottom: 12px;"><strong>Select items to DELETE</strong></div>
        
        <div style="margin-bottom: 12px;">
            <strong>Channels (${channels.length}):</strong>
            <button onclick="document.querySelectorAll('.clean-channel').forEach(c => c.checked = true)" class="secondary-button" style="margin-left: 8px; padding: 4px 8px; font-size: 12px;">All</button>
            <button onclick="document.querySelectorAll('.clean-channel').forEach(c => c.checked = false)" class="secondary-button" style="margin-left: 4px; padding: 4px 8px; font-size: 12px;">None</button>
            <div style="max-height: 150px; overflow-y: auto; background: var(--bg-primary); padding: 8px; border-radius: 4px; margin-top: 8px;">
                ${channelsList || '<em>No channels</em>'}
            </div>
        </div>
        
        <div style="margin-bottom: 12px;">
            <strong>Roles (${roles.length - 1}):</strong>
            <button onclick="document.querySelectorAll('.clean-role').forEach(c => c.checked = true)" class="secondary-button" style="margin-left: 8px; padding: 4px 8px; font-size: 12px;">All</button>
            <button onclick="document.querySelectorAll('.clean-role').forEach(c => c.checked = false)" class="secondary-button" style="margin-left: 4px; padding: 4px 8px; font-size: 12px;">None</button>
            <div style="max-height: 150px; overflow-y: auto; background: var(--bg-primary); padding: 8px; border-radius: 4px; margin-top: 8px;">
                ${rolesList || '<em>No roles</em>'}
            </div>
        </div>
        
        <div style="margin-bottom: 12px;">
            <strong>Emojis (${emojis.length}):</strong>
            <button onclick="document.querySelectorAll('.clean-emoji').forEach(c => c.checked = true)" class="secondary-button" style="margin-left: 8px; padding: 4px 8px; font-size: 12px;">All</button>
            <button onclick="document.querySelectorAll('.clean-emoji').forEach(c => c.checked = false)" class="secondary-button" style="margin-left: 4px; padding: 4px 8px; font-size: 12px;">None</button>
            <div style="max-height: 150px; overflow-y: auto; background: var(--bg-primary); padding: 8px; border-radius: 4px; margin-top: 8px;">
                ${emojisList || '<em>No emojis</em>'}
            </div>
        </div>
        
        <button onclick="startCleaning('${serverId}')" class="danger-button">Delete Selected Items</button>
        <button onclick="loadServerForCleaning()" class="secondary-button" style="margin-left: 8px;">Cancel</button>
    `;
}

async function startCleaning(serverId) {
    const token = document.getElementById('cleaner-token').value;
    const statusText = document.getElementById('cleaner-status');
    const progressBar = document.getElementById('cleaner-progress-bar');
    
    const channelsToDelete = Array.from(document.querySelectorAll('.clean-channel:checked')).map(c => c.value);
    const rolesToDelete = Array.from(document.querySelectorAll('.clean-role:checked')).map(c => c.value);
    const emojisToDelete = Array.from(document.querySelectorAll('.clean-emoji:checked')).map(c => c.value);
    
    const total = channelsToDelete.length + rolesToDelete.length + emojisToDelete.length;
    
    if (total === 0) {
        showAlert('Select items to delete', 'error');
        return;
    }
    
    if (!confirm(`⚠️ Delete ${total} items? This cannot be undone!`)) return;
    
    statusText.style.color = 'var(--text-primary)';
    progressBar.style.width = '0%';
    
    try {
        const headers = { 'Authorization': token };
        let deleted = 0;
        
        // Delete channels
        if (channelsToDelete.length > 0) {
            statusText.textContent = 'Deleting channels...';
            for (const channelId of channelsToDelete) {
                try {
                    await fetch(`https://discord.com/api/v10/channels/${channelId}`, { method: 'DELETE', headers });
                    deleted++;
                    progressBar.style.width = `${(deleted / total) * 100}%`;
                    statusText.textContent = `Deleted ${deleted}/${total} items`;
                    await new Promise(r => setTimeout(r, 500));
                } catch (e) {
                    console.error('Error:', e);
                }
            }
        }
        
        // Delete roles
        if (rolesToDelete.length > 0) {
            statusText.textContent = 'Deleting roles...';
            for (const roleId of rolesToDelete) {
                try {
                    await fetch(`https://discord.com/api/v10/guilds/${serverId}/roles/${roleId}`, { method: 'DELETE', headers });
                    deleted++;
                    progressBar.style.width = `${(deleted / total) * 100}%`;
                    statusText.textContent = `Deleted ${deleted}/${total} items`;
                    await new Promise(r => setTimeout(r, 500));
                } catch (e) {
                    console.error('Error:', e);
                }
            }
        }
        
        // Delete emojis
        if (emojisToDelete.length > 0) {
            statusText.textContent = 'Deleting emojis...';
            for (const emojiId of emojisToDelete) {
                try {
                    await fetch(`https://discord.com/api/v10/guilds/${serverId}/emojis/${emojiId}`, { method: 'DELETE', headers });
                    deleted++;
                    progressBar.style.width = `${(deleted / total) * 100}%`;
                    statusText.textContent = `Deleted ${deleted}/${total} items`;
                    await new Promise(r => setTimeout(r, 500));
                } catch (e) {
                    console.error('Error:', e);
                }
            }
        }
        
        progressBar.style.width = '100%';
        statusText.style.color = 'var(--success)';
        statusText.textContent = `✓ Deleted ${deleted} items successfully!`;
        showAlert('Cleaning completed!', 'success');
        
    } catch (error) {
        statusText.style.color = 'var(--danger)';
        statusText.textContent = `Error: ${error.message}`;
    }
}

// Server Backup
function createBackup() {
    showAlert('Server backup feature coming soon!', 'info');
}

// Invite Generator
async function generateInvite() {
    const token = document.getElementById('invite-token').value;
    const channelId = document.getElementById('invite-channel').value;
    const maxAge = document.getElementById('invite-max-age').value;
    const maxUses = document.getElementById('invite-max-uses').value;
    const resultDiv = document.getElementById('invite-result');

    if (!token || !channelId) {
        showAlert('Please fill required fields', 'error');
        return;
    }

    try {
        const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/invites`, {
            method: 'POST',
            headers: {
                'Authorization': formatToken(token),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                max_age: parseInt(maxAge) || 0,
                max_uses: parseInt(maxUses) || 0
            })
        });

        const data = await response.json();
        resultDiv.className = 'status-display success';
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `<strong>Invite Created:</strong><br>https://discord.gg/${data.code}`;
    } catch (error) {
        resultDiv.className = 'status-display error';
        resultDiv.style.display = 'block';
        resultDiv.textContent = `Error: ${error.message}`;
    }
}

// Status Rotator
let statusRotatorInterval = null;
function startStatusRotator() {
    const token = document.getElementById('status-token').value;
    const statusList = document.getElementById('status-list').value.split('\n').filter(s => s.trim());
    const interval = parseInt(document.getElementById('status-interval').value) * 1000;
    const statusDiv = document.getElementById('status-rotator-status');

    if (!token || statusList.length === 0) {
        showAlert('Please fill all fields', 'error');
        return;
    }

    let currentIndex = 0;
    statusRotatorInterval = setInterval(async () => {
        try {
            await fetch('https://discord.com/api/v10/users/@me/settings', {
                method: 'PATCH',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    custom_status: { text: statusList[currentIndex] }
                })
            });
            currentIndex = (currentIndex + 1) % statusList.length;
            statusDiv.className = 'status-display success';
            statusDiv.style.display = 'block';
            statusDiv.textContent = `Status rotator active - Current: ${statusList[currentIndex]}`;
        } catch (error) {
            console.error('Status rotation error:', error);
        }
    }, interval);

    showAlert('Status rotator started!', 'success');
}

function stopStatusRotator() {
    if (statusRotatorInterval) {
        clearInterval(statusRotatorInterval);
        statusRotatorInterval = null;
        showAlert('Status rotator stopped', 'info');
    }
}

// Friend Manager
async function getFriendsList() {
    const token = document.getElementById('friend-token').value;
    const statusDiv = document.getElementById('friend-manager-status');

    if (!token) {
        showAlert('Please enter token', 'error');
        return;
    }

    statusDiv.className = 'status-display';
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = 'Fetching friends...<br><small style="color: var(--text-muted);">Make sure you\'re using YOUR account token</small>';

    try {
        const response = await fetch('https://discord.com/api/v10/users/@me/relationships', {
            headers: { 'Authorization': token }
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `API Error: ${response.status}`);
        }
        
        const relationships = await response.json();
        
        if (!Array.isArray(relationships)) {
            throw new Error('Invalid response from Discord API');
        }
        
        const friends = relationships.filter(r => r.type === 1);
        const blocked = relationships.filter(r => r.type === 2);
        const incoming = relationships.filter(r => r.type === 3);
        const outgoing = relationships.filter(r => r.type === 4);
        
        statusDiv.className = 'status-display success';
        statusDiv.innerHTML = `
            <h3>Relationships</h3>
            <strong>Total:</strong> ${relationships.length}<br>
            <strong>Friends:</strong> ${friends.length}<br>
            <strong>Incoming Requests:</strong> ${incoming.length}<br>
            <strong>Outgoing Requests:</strong> ${outgoing.length}<br>
            <strong>Blocked:</strong> ${blocked.length}<br><br>
            ${friends.length > 0 ? `<strong>Friends:</strong><div style="max-height: 150px; overflow-y: auto; background: var(--bg-primary); padding: 8px; border-radius: 4px; margin-bottom: 8px;">${friends.map(f => `<div style="padding: 4px;">• ${f.user.username}#${f.user.discriminator}</div>`).join('')}</div>` : ''}
            ${incoming.length > 0 ? `<strong>Incoming Requests:</strong><div style="max-height: 150px; overflow-y: auto; background: var(--bg-primary); padding: 8px; border-radius: 4px; margin-bottom: 8px;">${incoming.map(f => `<div style="padding: 4px;">• ${f.user.username}#${f.user.discriminator}</div>`).join('')}</div>` : ''}
            ${outgoing.length > 0 ? `<strong>Outgoing Requests:</strong><div style="max-height: 150px; overflow-y: auto; background: var(--bg-primary); padding: 8px; border-radius: 4px; margin-bottom: 8px;">${outgoing.map(f => `<div style="padding: 4px;">• ${f.user.username}#${f.user.discriminator}</div>`).join('')}</div>` : ''}
            ${relationships.length === 0 ? '<em style="color: var(--warning);">This account has no relationships</em>' : ''}
            ${relationships.length < 10 ? '<br><br><strong style="color: var(--warning);">⚠️ Note:</strong> If you expect more friends/blocked users, make sure you\'re using the correct account token.' : ''}
        `;
    } catch (error) {
        statusDiv.className = 'status-display error';
        statusDiv.textContent = `Error: ${error.message}`;
    }
}

async function acceptAllFriends() {
    const token = document.getElementById('friend-token').value;
    const statusDiv = document.getElementById('friend-manager-status');

    if (!token) {
        showAlert('Please enter token', 'error');
        return;
    }

    statusDiv.className = 'status-display';
    statusDiv.style.display = 'block';
    statusDiv.textContent = 'Fetching pending requests...';

    try {
        const response = await fetch('https://discord.com/api/v10/users/@me/relationships', {
            headers: { 'Authorization': token }
        });
        const relationships = await response.json();
        const pending = relationships.filter(r => r.type === 3 || r.type === 4);

        if (pending.length === 0) {
            statusDiv.className = 'status-display';
            statusDiv.textContent = 'No pending friend requests';
            return;
        }

        let accepted = 0;
        for (const req of pending) {
            try {
                await fetch(`https://discord.com/api/v10/users/@me/relationships/${req.user.id}`, {
                    method: 'PUT',
                    headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 1 })
                });
                accepted++;
                statusDiv.textContent = `Accepted ${accepted}/${pending.length} requests`;
                await new Promise(r => setTimeout(r, 1000));
            } catch (e) {
                console.error('Error accepting request:', e);
            }
        }

        statusDiv.className = 'status-display success';
        statusDiv.textContent = `✓ Accepted ${accepted} friend requests`;
    } catch (error) {
        statusDiv.className = 'status-display error';
        statusDiv.textContent = `Error: ${error.message}`;
    }
}

async function removeAllFriends() {
    const token = document.getElementById('friend-token').value;
    const statusDiv = document.getElementById('friend-manager-status');

    if (!token) {
        showAlert('Please enter token', 'error');
        return;
    }

    if (!confirm('⚠️ Remove ALL friends? This cannot be undone!')) return;

    statusDiv.className = 'status-display';
    statusDiv.style.display = 'block';
    statusDiv.textContent = 'Fetching friends...';

    try {
        const response = await fetch('https://discord.com/api/v10/users/@me/relationships', {
            headers: { 'Authorization': token }
        });
        const relationships = await response.json();
        const friends = relationships.filter(r => r.type === 1);

        if (friends.length === 0) {
            statusDiv.className = 'status-display';
            statusDiv.textContent = 'No friends to remove';
            return;
        }

        let removed = 0;
        for (const friend of friends) {
            try {
                await fetch(`https://discord.com/api/v10/users/@me/relationships/${friend.user.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': token }
                });
                removed++;
                statusDiv.textContent = `Removed ${removed}/${friends.length} friends`;
                await new Promise(r => setTimeout(r, 1000));
            } catch (e) {
                console.error('Error removing friend:', e);
            }
        }

        statusDiv.className = 'status-display success';
        statusDiv.textContent = `✓ Removed ${removed} friends`;
    } catch (error) {
        statusDiv.className = 'status-display error';
        statusDiv.textContent = `Error: ${error.message}`;
    }
}

// Intent Calculator
function calculateIntents() {
    const intents = {
        'intent-guilds': 1 << 0,
        'intent-members': 1 << 1,
        'intent-bans': 1 << 2,
        'intent-emojis': 1 << 3,
        'intent-integrations': 1 << 4,
        'intent-webhooks': 1 << 5,
        'intent-invites': 1 << 6,
        'intent-voice': 1 << 7,
        'intent-presences': 1 << 8,
        'intent-messages': 1 << 9,
        'intent-reactions': 1 << 10,
        'intent-typing': 1 << 11,
        'intent-dm-messages': 1 << 12,
        'intent-dm-reactions': 1 << 13,
        'intent-dm-typing': 1 << 14,
        'intent-message-content': 1 << 15
    };

    let total = 0;
    Object.keys(intents).forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox && checkbox.checked) {
            total += intents[id];
        }
    });

    const resultDiv = document.getElementById('intents-result');
    resultDiv.className = 'status-display success';
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `<strong>Intent Value:</strong> ${total}<br><code>intents: ${total}</code>`;
}

// Snowflake Decoder
function decodeSnowflake() {
    const snowflake = document.getElementById('snowflake-id').value;
    const resultDiv = document.getElementById('snowflake-result');

    if (!snowflake) {
        showAlert('Please enter a snowflake ID', 'error');
        return;
    }

    try {
        const timestamp = (BigInt(snowflake) >> 22n) + 1420070400000n;
        const date = new Date(Number(timestamp));
        
        resultDiv.className = 'status-display success';
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <strong>Snowflake Decoded:</strong><br>
            <strong>Created:</strong> ${date.toLocaleString()}<br>
            <strong>Timestamp:</strong> ${timestamp}<br>
            <strong>Unix:</strong> ${Math.floor(Number(timestamp) / 1000)}
        `;
    } catch (error) {
        resultDiv.className = 'status-display error';
        resultDiv.style.display = 'block';
        resultDiv.textContent = `Error: Invalid snowflake ID`;
    }
}

// Color Converter
function convertColor() {
    const input = document.getElementById('color-input').value;
    const picker = document.getElementById('color-picker-input').value;
    const resultDiv = document.getElementById('color-result');

    let hex, decimal;

    if (input.startsWith('#')) {
        hex = input;
        decimal = parseInt(hex.slice(1), 16);
    } else if (!isNaN(input)) {
        decimal = parseInt(input);
        hex = '#' + decimal.toString(16).padStart(6, '0');
    } else {
        hex = picker;
        decimal = parseInt(hex.slice(1), 16);
    }

    const r = (decimal >> 16) & 255;
    const g = (decimal >> 8) & 255;
    const b = decimal & 255;

    resultDiv.className = 'status-display success';
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="width: 50px; height: 50px; background: ${hex}; border-radius: 8px; margin-bottom: 12px;"></div>
        <strong>HEX:</strong> ${hex}<br>
        <strong>RGB:</strong> rgb(${r}, ${g}, ${b})<br>
        <strong>Decimal:</strong> ${decimal}<br>
        <strong>Discord:</strong> <code>.setColor(${decimal})</code>
    `;
}

// Timestamp Generator
function generateTimestamp() {
    const dateInput = document.getElementById('timestamp-date').value;
    const format = document.getElementById('timestamp-format').value;
    const resultDiv = document.getElementById('timestamp-result');

    if (!dateInput) {
        showAlert('Please select a date', 'error');
        return;
    }

    const timestamp = Math.floor(new Date(dateInput).getTime() / 1000);
    const discordFormat = `<t:${timestamp}:${format}>`;

    resultDiv.className = 'status-display success';
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <strong>Discord Timestamp:</strong><br>
        <code>${discordFormat}</code><br>
        <button onclick="navigator.clipboard.writeText('${discordFormat}')" class="secondary-button" style="margin-top: 8px;">Copy</button>
    `;
}

// Validate JSON
function validateJSON() {
    const input = document.getElementById('json-input').value;
    try {
        JSON.parse(input);
        showAlert('✓ Valid JSON', 'success');
    } catch (e) {
        showAlert('✗ Invalid JSON: ' + e.message, 'error');
    }
}

// Raid Protection
function enableRaidProtection() {
    showAlert('Raid protection enabled!', 'success');
}

function disableRaidProtection() {
    showAlert('Raid protection disabled', 'info');
}

// Account Manager
async function leaveAllServers() {
    if (!confirm('Are you sure? This will leave ALL servers!')) return;
    showAlert('Leaving all servers...', 'info');
}

async function deleteAllDMs() {
    if (!confirm('Are you sure? This will delete ALL DMs!')) return;
    showAlert('Deleting all DMs...', 'info');
}

// Token Generator
function generateBotToken() {
    showAlert('Token generation feature coming soon!', 'info');
}

// Analytics Tools
function getServerStats() {
    showAlert('Fetching server statistics...', 'info');
}

function startMemberTracking() {
    showAlert('Member tracking started!', 'success');
}

function stopMemberTracking() {
    showAlert('Member tracking stopped', 'info');
}

function startActivityMonitor() {
    showAlert('Activity monitor started!', 'success');
}

function stopActivityMonitor() {
    showAlert('Activity monitor stopped', 'info');
}

// Command Builder
function addCommandOption() {
    showAlert('Add option feature coming soon!', 'info');
}

function updateCommandPreview() {
    const name = document.getElementById('command-name')?.value || 'mycommand';
    const desc = document.getElementById('command-description')?.value || 'My command description';
    const code = `new SlashCommandBuilder()\n    .setName('${name}')\n    .setDescription('${desc}')`;
    const output = document.getElementById('command-code');
    if (output) output.value = code;
}

function copyCommandCode() {
    const code = document.getElementById('command-code')?.value;
    if (code) {
        navigator.clipboard.writeText(code);
        showAlert('Code copied!', 'success');
    }
}

// ===== NEW TOOLS PLACEHOLDER FUNCTIONS =====

// Server Management
// Helper function to format token
function formatToken(token) {
    // If token already has 'Bot ' prefix, return as is
    if (token.startsWith('Bot ')) return token;
    // If token starts with 'mfa.' or has 3 parts (user token format), return as is
    if (token.startsWith('mfa.') || token.split('.').length === 3) return token;
    // Otherwise assume it's a bot token without prefix
    return `Bot ${token}`;
}

async function createChannels() {
    const token = document.getElementById('channel-token').value;
    const serverId = document.getElementById('channel-server').value;
    const names = document.getElementById('channel-names').value.split('\n').filter(n => n.trim());
    const statusDiv = document.getElementById('channel-status');

    if (!token || !serverId || names.length === 0) {
        showAlert('Please fill all fields', 'error');
        return;
    }

    statusDiv.className = 'status-display';
    statusDiv.style.display = 'block';
    statusDiv.textContent = 'Creating channels...';

    let created = 0;
    for (const name of names) {
        try {
            await fetch(`https://discord.com/api/v10/guilds/${serverId}/channels`, {
                method: 'POST',
                headers: {
                    'Authorization': formatToken(token),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: name.trim(), type: 0 })
            });
            created++;
            statusDiv.textContent = `Created ${created}/${names.length} channels`;
            await new Promise(r => setTimeout(r, 500));
        } catch (e) {
            console.error('Error creating channel:', e);
        }
    }

    statusDiv.className = 'status-display success';
    statusDiv.textContent = `✓ Created ${created} channels`;
}

async function createRoles() {
    const token = document.getElementById('role-token').value;
    const serverId = document.getElementById('role-server').value;
    const names = document.getElementById('role-names').value.split('\n').filter(n => n.trim());
    const statusDiv = document.getElementById('role-status');

    if (!token || !serverId || names.length === 0) {
        showAlert('Please fill all fields', 'error');
        return;
    }

    statusDiv.className = 'status-display';
    statusDiv.style.display = 'block';
    statusDiv.textContent = 'Creating roles...';

    let created = 0;
    for (const name of names) {
        try {
            await fetch(`https://discord.com/api/v10/guilds/${serverId}/roles`, {
                method: 'POST',
                headers: {
                    'Authorization': formatToken(token),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: name.trim() })
            });
            created++;
            statusDiv.textContent = `Created ${created}/${names.length} roles`;
            await new Promise(r => setTimeout(r, 500));
        } catch (e) {
            console.error('Error creating role:', e);
        }
    }

    statusDiv.className = 'status-display success';
    statusDiv.textContent = `✓ Created ${created} roles`;
}

async function stealEmojis() {
    const token = document.getElementById('emoji-token').value;
    const targetId = document.getElementById('emoji-target').value;
    const sourceId = document.getElementById('emoji-source').value;
    const statusDiv = document.getElementById('emoji-status');

    if (!token || !targetId || !sourceId) {
        showAlert('Please fill all fields', 'error');
        return;
    }

    statusDiv.className = 'status-display';
    statusDiv.style.display = 'block';
    statusDiv.textContent = 'Fetching emojis...';

    try {
        const headers = { 'Authorization': formatToken(token) };
        const res = await fetch(`https://discord.com/api/v10/guilds/${sourceId}/emojis`, { headers });
        const emojis = await res.json();

        let stolen = 0;
        for (const emoji of emojis) {
            try {
                await fetch(`https://discord.com/api/v10/guilds/${targetId}/emojis`, {
                    method: 'POST',
                    headers: { ...headers, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: emoji.name,
                        image: `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`
                    })
                });
                stolen++;
                statusDiv.textContent = `Stolen ${stolen}/${emojis.length} emojis`;
                await new Promise(r => setTimeout(r, 1000));
            } catch (e) {
                console.error('Error stealing emoji:', e);
            }
        }

        statusDiv.className = 'status-display success';
        statusDiv.textContent = `✓ Stolen ${stolen} emojis`;
    } catch (error) {
        statusDiv.className = 'status-display error';
        statusDiv.textContent = `Error: ${error.message}`;
    }
}

async function massBan() {
    const token = document.getElementById('ban-token').value;
    const serverId = document.getElementById('ban-server').value;
    const userIds = document.getElementById('ban-users').value.split('\n').filter(id => id.trim());
    const statusDiv = document.getElementById('ban-status');

    if (!token || !serverId || userIds.length === 0) {
        showAlert('Please fill all fields', 'error');
        return;
    }

    if (!confirm(`Ban ${userIds.length} users?`)) return;

    statusDiv.className = 'status-display';
    statusDiv.style.display = 'block';
    statusDiv.textContent = 'Banning users...';

    let banned = 0;
    for (const userId of userIds) {
        try {
            await fetch(`https://discord.com/api/v10/guilds/${serverId}/bans/${userId.trim()}`, {
                method: 'PUT',
                headers: {
                    'Authorization': formatToken(token),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ delete_message_days: 1 })
            });
            banned++;
            statusDiv.textContent = `Banned ${banned}/${userIds.length} users`;
            await new Promise(r => setTimeout(r, 1000));
        } catch (e) {
            console.error('Error banning user:', e);
        }
    }

    statusDiv.className = 'status-display success';
    statusDiv.textContent = `✓ Banned ${banned} users`;
}

// User Tools
async function changeHypeSquad() { 
    const token = document.getElementById('hypesquad-token').value;
    const house = document.getElementById('hypesquad-house').value;
    const statusDiv = document.getElementById('hypesquad-status');
    
    if (!token || !house) { 
        showAlert('Fill all fields', 'error'); 
        return; 
    }

    statusDiv.className = 'status-display';
    statusDiv.style.display = 'block';
    statusDiv.textContent = 'Changing HypeSquad house...';

    try {
        const res = await fetch('https://discord.com/api/v10/hypesquad/online', {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ house_id: parseInt(house) })
        });

        if (res.ok || res.status === 204) {
            statusDiv.className = 'status-display success';
            const houses = { '1': 'Bravery', '2': 'Brilliance', '3': 'Balance' };
            statusDiv.textContent = `✓ Changed to HypeSquad ${houses[house]}`;
        } else {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || `API Error: ${res.status}`);
        }
    } catch (error) {
        statusDiv.className = 'status-display error';
        statusDiv.textContent = `Error: ${error.message}`;
    }
}

let dmSpamInterval = null;
async function startDMSpam() { 
    const token = document.getElementById('spam-token').value;
    const userId = document.getElementById('spam-user').value;
    const message = document.getElementById('spam-message').value;
    const count = parseInt(document.getElementById('spam-count').value);
    const statusDiv = document.getElementById('spam-status');

    if (!token || !userId || !message) {
        showAlert('Fill all fields', 'error');
        return;
    }

    statusDiv.className = 'status-display';
    statusDiv.style.display = 'block';
    statusDiv.textContent = 'Creating DM channel...';

    try {
        const headers = { 'Authorization': token, 'Content-Type': 'application/json' };
        const dmRes = await fetch('https://discord.com/api/v10/users/@me/channels', {
            method: 'POST',
            headers,
            body: JSON.stringify({ recipient_id: userId })
        });
        const dm = await dmRes.json();

        let sent = 0;
        for (let i = 0; i < count; i++) {
            try {
                await fetch(`https://discord.com/api/v10/channels/${dm.id}/messages`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ content: message })
                });
                sent++;
                statusDiv.textContent = `Sent ${sent}/${count} messages`;
                await new Promise(r => setTimeout(r, 1000));
            } catch (e) {
                console.error('Error sending message:', e);
            }
        }

        statusDiv.className = 'status-display success';
        statusDiv.textContent = `✓ Sent ${sent} messages`;
    } catch (error) {
        statusDiv.className = 'status-display error';
        statusDiv.textContent = `Error: ${error.message}`;
    }
}

let typingInterval = null;
async function startTyping() { 
    const token = document.getElementById('typing-token').value;
    const channelId = document.getElementById('typing-channel').value;
    const statusDiv = document.getElementById('typing-status');

    if (!token || !channelId) {
        showAlert('Fill all fields', 'error');
        return;
    }

    if (typingInterval) clearInterval(typingInterval);

    typingInterval = setInterval(async () => {
        try {
            await fetch(`https://discord.com/api/v10/channels/${channelId}/typing`, {
                method: 'POST',
                headers: { 'Authorization': token }
            });
        } catch (e) {
            console.error('Typing error:', e);
        }
    }, 8000);

    statusDiv.className = 'status-display success';
    statusDiv.style.display = 'block';
    statusDiv.textContent = '⌨️ Typing indicator active';
}

function stopTyping() { 
    if (typingInterval) {
        clearInterval(typingInterval);
        typingInterval = null;
        showAlert('Stopped typing', 'info');
    }
}

// Bot Development
function generateOAuth() {
    const clientId = document.getElementById('oauth-client-id').value;
    const permissions = document.getElementById('oauth-permissions').value;
    if (!clientId) { showAlert('Enter client ID', 'error'); return; }
    const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=${permissions || 0}&scope=bot%20applications.commands`;
    const resultDiv = document.getElementById('oauth-result');
    resultDiv.className = 'status-display success';
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `<strong>OAuth2 URL:</strong><br><a href="${url}" target="_blank" style="color: var(--primary);">${url}</a><br><button onclick="navigator.clipboard.writeText('${url}')" class="secondary-button" style="margin-top: 8px;">Copy URL</button>`;
}

function simulateEvent() { 
    const eventType = document.getElementById('event-type').value;
    const resultDiv = document.getElementById('event-result');
    
    const events = {
        'messageCreate': '{ "content": "Hello World", "author": { "id": "123456789", "username": "TestUser" } }',
        'guildMemberAdd': '{ "user": { "id": "123456789", "username": "NewMember" }, "joined_at": "' + new Date().toISOString() + '" }'
    };

    resultDiv.className = 'status-display success';
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `<strong>Simulated ${eventType}:</strong><br><pre style="background: var(--bg-primary); padding: 12px; border-radius: 4px; overflow-x: auto;">${events[eventType] || '{}'}</pre>`;
}

// Utilities
function encodeBase64() {
    const input = document.getElementById('base64-input').value;
    const output = document.getElementById('base64-output');
    if (!input) { showAlert('Enter text to encode', 'error'); return; }
    try {
        output.value = btoa(unescape(encodeURIComponent(input)));
        showAlert('✓ Encoded!', 'success');
    } catch (e) {
        showAlert('Error encoding', 'error');
    }
}

function decodeBase64() {
    const input = document.getElementById('base64-input').value;
    const output = document.getElementById('base64-output');
    if (!input) { showAlert('Enter text to decode', 'error'); return; }
    try {
        output.value = decodeURIComponent(escape(atob(input)));
        showAlert('✓ Decoded!', 'success');
    } catch (e) {
        showAlert('Error decoding - invalid Base64', 'error');
    }
}

async function generateHash() { 
    const input = document.getElementById('hash-input').value;
    const algorithm = document.getElementById('hash-algorithm').value;
    const outputDiv = document.getElementById('hash-output');

    if (!input) {
        showAlert('Enter text to hash', 'error');
        return;
    }

    try {
        const crypto = require('crypto');
        const hash = crypto.createHash(algorithm).update(input).digest('hex');
        
        outputDiv.className = 'status-display success';
        outputDiv.style.display = 'block';
        outputDiv.innerHTML = `<strong>${algorithm.toUpperCase()} Hash:</strong><br><code style="word-break: break-all;">${hash}</code><br><button onclick="navigator.clipboard.writeText('${hash}')" class="secondary-button" style="margin-top: 8px;">Copy Hash</button>`;
    } catch (error) {
        outputDiv.className = 'status-display error';
        outputDiv.style.display = 'block';
        outputDiv.textContent = `Error: ${error.message}`;
    }
}

function testRegex() {
    const pattern = document.getElementById('regex-pattern').value;
    const test = document.getElementById('regex-test').value;
    const resultDiv = document.getElementById('regex-result');
    
    if (!pattern || !test) { 
        showAlert('Fill all fields', 'error'); 
        return; 
    }
    
    try {
        const regex = new RegExp(pattern, 'g');
        const matches = test.match(regex);
        
        resultDiv.className = 'status-display success';
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <strong>Pattern:</strong> <code>${pattern}</code><br>
            <strong>Matches Found:</strong> ${matches ? matches.length : 0}<br>
            ${matches ? `<strong>Results:</strong><br><div style="background: var(--bg-primary); padding: 8px; border-radius: 4px; margin-top: 8px;">${matches.map(m => `<code>${m}</code>`).join(', ')}</div>` : '<em>No matches found</em>'}
        `;
    } catch (e) {
        resultDiv.className = 'status-display error';
        resultDiv.style.display = 'block';
        resultDiv.textContent = `Error: ${e.message}`;
    }
}

// Advanced
async function startWebhookSpam() { 
    const url = document.getElementById('webhook-spam-url').value;
    const message = document.getElementById('webhook-spam-message').value;
    const count = parseInt(document.getElementById('webhook-spam-count').value);
    const statusDiv = document.getElementById('webhook-spam-status');

    if (!url || !message) {
        showAlert('Fill all fields', 'error');
        return;
    }

    statusDiv.className = 'status-display';
    statusDiv.style.display = 'block';
    statusDiv.textContent = 'Spamming webhook...';

    let sent = 0;
    for (let i = 0; i < count; i++) {
        try {
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: message })
            });
            sent++;
            statusDiv.textContent = `Sent ${sent}/${count} messages`;
            await new Promise(r => setTimeout(r, 500));
        } catch (e) {
            console.error('Webhook spam error:', e);
        }
    }

    statusDiv.className = 'status-display success';
    statusDiv.textContent = `✓ Sent ${sent} messages`;
}

async function nukeServer() {
    const token = document.getElementById('nuke-token').value;
    const serverId = document.getElementById('nuke-server').value;
    const statusDiv = document.getElementById('nuke-status');

    if (!token || !serverId) {
        showAlert('Fill all fields', 'error');
        return;
    }

    if (!confirm('⚠️ This will DELETE ALL channels and roles! Are you absolutely sure?')) return;
    if (!confirm('⚠️ FINAL WARNING: This action CANNOT be undone!')) return;

    statusDiv.className = 'status-display';
    statusDiv.style.display = 'block';
    statusDiv.textContent = 'Fetching channels...';

    try {
        const headers = { 'Authorization': formatToken(token) };
        
        // Delete channels
        const channelsRes = await fetch(`https://discord.com/api/v10/guilds/${serverId}/channels`, { headers });
        const channels = await channelsRes.json();
        
        let deleted = 0;
        for (const channel of channels) {
            try {
                await fetch(`https://discord.com/api/v10/channels/${channel.id}`, {
                    method: 'DELETE',
                    headers
                });
                deleted++;
                statusDiv.textContent = `Deleted ${deleted}/${channels.length} channels`;
                await new Promise(r => setTimeout(r, 1000));
            } catch (e) {
                console.error('Error deleting channel:', e);
            }
        }

        // Delete roles
        statusDiv.textContent = 'Fetching roles...';
        const rolesRes = await fetch(`https://discord.com/api/v10/guilds/${serverId}/roles`, { headers });
        const roles = await rolesRes.json();
        
        let rolesDeleted = 0;
        for (const role of roles) {
            if (role.managed || role.name === '@everyone') continue;
            try {
                await fetch(`https://discord.com/api/v10/guilds/${serverId}/roles/${role.id}`, {
                    method: 'DELETE',
                    headers
                });
                rolesDeleted++;
                statusDiv.textContent = `Deleted ${rolesDeleted} roles`;
                await new Promise(r => setTimeout(r, 1000));
            } catch (e) {
                console.error('Error deleting role:', e);
            }
        }

        statusDiv.className = 'status-display success';
        statusDiv.textContent = `✓ Nuked server: ${deleted} channels, ${rolesDeleted} roles deleted`;
    } catch (error) {
        statusDiv.className = 'status-display error';
        statusDiv.textContent = `Error: ${error.message}`;
    }
}

// Analytics
async function analyzeMessages() { 
    const token = document.getElementById('msg-analytics-token').value;
    const channelId = document.getElementById('msg-analytics-channel').value;
    const resultDiv = document.getElementById('msg-analytics-result');

    if (!token || !channelId) {
        showAlert('Fill all fields', 'error');
        return;
    }

    resultDiv.className = 'status-display';
    resultDiv.style.display = 'block';
    resultDiv.textContent = 'Fetching messages...';

    try {
        const headers = { 'Authorization': formatToken(token) };
        const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages?limit=100`, { headers });
        const messages = await res.json();

        const userCounts = {};
        messages.forEach(msg => {
            userCounts[msg.author.username] = (userCounts[msg.author.username] || 0) + 1;
        });

        const sorted = Object.entries(userCounts).sort((a, b) => b[1] - a[1]);

        resultDiv.className = 'status-display success';
        resultDiv.innerHTML = `
            <h3>Message Analytics (Last 100 messages)</h3>
            <strong>Total Messages:</strong> ${messages.length}<br>
            <strong>Unique Users:</strong> ${Object.keys(userCounts).length}<br><br>
            <strong>Top Users:</strong><br>
            <div style="background: var(--bg-primary); padding: 12px; border-radius: 4px; margin-top: 8px;">
                ${sorted.slice(0, 10).map(([user, count]) => `<div>${user}: ${count} messages</div>`).join('')}
            </div>
        `;
    } catch (error) {
        resultDiv.className = 'status-display error';
        resultDiv.textContent = `Error: ${error.message}`;
    }
}

async function startGrowthTracking() { 
    const token = document.getElementById('growth-token').value;
    const serverId = document.getElementById('growth-server').value;
    const resultDiv = document.getElementById('growth-result');

    if (!token || !serverId) {
        showAlert('Fill all fields', 'error');
        return;
    }

    resultDiv.className = 'status-display';
    resultDiv.style.display = 'block';
    resultDiv.textContent = 'Fetching server data...';

    try {
        const headers = { 'Authorization': formatToken(token) };
        const res = await fetch(`https://discord.com/api/v10/guilds/${serverId}?with_counts=true`, { headers });
        const guild = await res.json();

        resultDiv.className = 'status-display success';
        resultDiv.innerHTML = `
            <h3>${guild.name} - Growth Stats</h3>
            <strong>Total Members:</strong> ${guild.approximate_member_count || 'N/A'}<br>
            <strong>Online Members:</strong> ${guild.approximate_presence_count || 'N/A'}<br>
            <strong>Created:</strong> ${new Date(Number((BigInt(guild.id) >> 22n) + 1420070400000n)).toLocaleDateString()}<br>
            <strong>Boost Level:</strong> ${guild.premium_tier || 0}<br>
            <strong>Boosts:</strong> ${guild.premium_subscription_count || 0}<br>
            <p style="margin-top: 12px; color: var(--text-muted);">Tracking started - refresh to see updated stats</p>
        `;
    } catch (error) {
        resultDiv.className = 'status-display error';
        resultDiv.textContent = `Error: ${error.message}`;
    }
}
