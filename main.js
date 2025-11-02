const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: 'NOAPI',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// Handle server cloning
ipcMain.on('clone-server', async (event, { sourceServerId, token, tokenType, options }) => {
    try {
        event.reply('clone-progress', { progress: 10, status: 'Connecting to Discord...' });

        if (tokenType === 'user') {
            // User token - Use Discord API directly
            const headers = {
                'Authorization': token,
                'Content-Type': 'application/json'
            };

            // Fetch source guild data
            const guildResponse = await fetch(`https://discord.com/api/v10/guilds/${sourceServerId}`, { headers });
            if (!guildResponse.ok) throw new Error('Cannot access server. Make sure you are a member.');
            
            const guildData = await guildResponse.json();
            event.reply('clone-progress', { progress: 20, status: 'Found source server: ' + guildData.name });

            // Fetch channels
            if (options.channels) {
                event.reply('clone-progress', { progress: 40, status: 'Fetching channels...' });
                const channelsResponse = await fetch(`https://discord.com/api/v10/guilds/${sourceServerId}/channels`, { headers });
                const channels = await channelsResponse.json();
                event.reply('clone-progress', { progress: 50, status: `Found ${channels.length} channels` });
            }

            // Fetch roles
            if (options.roles) {
                event.reply('clone-progress', { progress: 60, status: 'Fetching roles...' });
                const rolesResponse = await fetch(`https://discord.com/api/v10/guilds/${sourceServerId}/roles`, { headers });
                const roles = await rolesResponse.json();
                event.reply('clone-progress', { progress: 70, status: `Found ${roles.length} roles` });
            }

            // Fetch emojis
            if (options.emojis) {
                event.reply('clone-progress', { progress: 80, status: 'Fetching emojis...' });
                const emojisResponse = await fetch(`https://discord.com/api/v10/guilds/${sourceServerId}/emojis`, { headers });
                const emojis = await emojisResponse.json();
                event.reply('clone-progress', { progress: 90, status: `Found ${emojis.length} emojis` });
            }

            event.reply('clone-progress', { progress: 100, status: 'Data fetched successfully! Ready to clone.' });

        } else {
            // Bot token - Use discord.js
            const client = new Client({
                intents: [
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildMembers,
                    GatewayIntentBits.GuildEmojisAndStickers
                ]
            });

            await client.login(token);
            event.reply('clone-progress', { progress: 20, status: 'Bot connected successfully' });

            const sourceGuild = await client.guilds.fetch(sourceServerId);
            if (!sourceGuild) throw new Error('Could not find source server');

            event.reply('clone-progress', { progress: 40, status: 'Found source server: ' + sourceGuild.name });

            if (options.channels) {
                event.reply('clone-progress', { progress: 60, status: 'Fetching channels...' });
                const channels = await sourceGuild.channels.fetch();
                event.reply('clone-progress', { progress: 70, status: `Found ${channels.size} channels` });
            }

            if (options.roles) {
                event.reply('clone-progress', { progress: 80, status: 'Fetching roles...' });
                const roles = await sourceGuild.roles.fetch();
                event.reply('clone-progress', { progress: 90, status: `Found ${roles.size} roles` });
            }

            event.reply('clone-progress', { progress: 100, status: 'Data fetched successfully!' });
            client.destroy();
        }

    } catch (error) {
        console.error('Error during cloning:', error);
        event.reply('clone-error', error.message);
    }
});
