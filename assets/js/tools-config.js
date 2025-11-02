// Comprehensive Tools Configuration
const TOOLS_CONFIG = {
    categories: [
        {
            name: 'Server Management',
            icon: 'fa-server',
            tools: [
                {
                    id: 'server-cloner',
                    name: 'Server Cloner',
                    icon: 'fa-copy',
                    description: 'Save server as template (no admin needed) then apply to any server',
                    inputs: [
                        { id: 'source-server-id', label: 'Source Server ID', type: 'text', placeholder: 'Server to copy from' },
                        { id: 'clone-token', label: 'Token', type: 'password', placeholder: 'User or Bot token' },
                        { id: 'clone-options', label: 'What to Copy', type: 'checkboxes', options: [
                            { id: 'clone-channels', label: 'Channels', checked: true },
                            { id: 'clone-roles', label: 'Roles', checked: true },
                            { id: 'clone-emojis', label: 'Emojis', checked: true }
                        ]}
                    ],
                    buttons: [{ label: 'Save as Template', action: 'cloneServer', class: 'primary-button' }],
                    outputs: [{ id: 'clone-progress', type: 'progress' }]
                },
                {
                    id: 'server-cleaner',
                    name: 'Server Cleaner',
                    icon: 'fa-broom',
                    description: 'Selectively delete channels, roles, and emojis from a server',
                    inputs: [
                        { id: 'cleaner-server-id', label: 'Server ID', type: 'text', placeholder: 'Server to clean' },
                        { id: 'cleaner-token', label: 'Token', type: 'password', placeholder: 'Bot or User token' }
                    ],
                    buttons: [{ label: 'Load Server', action: 'loadServerForCleaning', class: 'primary-button' }],
                    outputs: [{ id: 'cleaner-progress', type: 'progress' }]
                },
                {
                    id: 'server-lookup',
                    name: 'Server Lookup',
                    icon: 'fa-search',
                    description: 'Get detailed information about any Discord server',
                    inputs: [
                        { id: 'lookup-token', label: 'Token', type: 'password', placeholder: 'Enter token' },
                        { id: 'lookup-server-id', label: 'Server ID', type: 'text', placeholder: 'Enter server ID' }
                    ],
                    buttons: [{ label: 'Lookup Server', action: 'lookupServer', class: 'primary-button' }],
                    outputs: [{ id: 'server-info', type: 'status' }]
                },
                {
                    id: 'server-backup',
                    name: 'Server Backup',
                    icon: 'fa-download',
                    description: 'Backup server data to JSON file',
                    inputs: [
                        { id: 'backup-token', label: 'Token', type: 'password', placeholder: 'Enter token' },
                        { id: 'backup-server-id', label: 'Server ID', type: 'text', placeholder: 'Enter server ID' }
                    ],
                    buttons: [{ label: 'Create Backup', action: 'createBackup', class: 'primary-button' }],
                    outputs: [{ id: 'backup-status', type: 'status' }]
                },
                {
                    id: 'invite-generator',
                    name: 'Invite Generator',
                    icon: 'fa-link',
                    description: 'Generate custom invite links with options',
                    inputs: [
                        { id: 'invite-token', label: 'Bot Token', type: 'password', placeholder: 'Enter bot token' },
                        { id: 'invite-channel', label: 'Channel ID', type: 'text', placeholder: 'Enter channel ID' },
                        { id: 'invite-max-age', label: 'Max Age (seconds)', type: 'number', value: '0', placeholder: '0 = never expires' },
                        { id: 'invite-max-uses', label: 'Max Uses', type: 'number', value: '0', placeholder: '0 = unlimited' }
                    ],
                    buttons: [{ label: 'Generate Invite', action: 'generateInvite', class: 'primary-button' }],
                    outputs: [{ id: 'invite-result', type: 'status' }]
                },
                {
                    id: 'channel-manager',
                    name: 'Channel Manager',
                    icon: 'fa-hashtag',
                    description: 'Bulk create, delete, or modify channels',
                    inputs: [
                        { id: 'channel-token', label: 'Bot Token', type: 'password', placeholder: 'Enter bot token' },
                        { id: 'channel-server', label: 'Server ID', type: 'text', placeholder: 'Enter server ID' },
                        { id: 'channel-names', label: 'Channel Names (one per line)', type: 'textarea', placeholder: 'general\nannouncements\nmemes' }
                    ],
                    buttons: [{ label: 'Create Channels', action: 'createChannels', class: 'primary-button' }],
                    outputs: [{ id: 'channel-status', type: 'status' }]
                },
                {
                    id: 'role-manager',
                    name: 'Role Manager',
                    icon: 'fa-user-tag',
                    description: 'Bulk create, delete, or assign roles',
                    inputs: [
                        { id: 'role-token', label: 'Bot Token', type: 'password', placeholder: 'Enter bot token' },
                        { id: 'role-server', label: 'Server ID', type: 'text', placeholder: 'Enter server ID' },
                        { id: 'role-names', label: 'Role Names (one per line)', type: 'textarea', placeholder: 'Admin\nModerator\nMember' }
                    ],
                    buttons: [{ label: 'Create Roles', action: 'createRoles', class: 'primary-button' }],
                    outputs: [{ id: 'role-status', type: 'status' }]
                },
                {
                    id: 'emoji-stealer',
                    name: 'Emoji Stealer',
                    icon: 'fa-smile',
                    description: 'Steal emojis from other servers',
                    inputs: [
                        { id: 'emoji-token', label: 'Bot Token', type: 'password', placeholder: 'Enter bot token' },
                        { id: 'emoji-target', label: 'Target Server ID', type: 'text', placeholder: 'Server to add emojis' },
                        { id: 'emoji-source', label: 'Source Server ID', type: 'text', placeholder: 'Server to steal from' }
                    ],
                    buttons: [{ label: 'Steal Emojis', action: 'stealEmojis', class: 'primary-button' }],
                    outputs: [{ id: 'emoji-status', type: 'status' }]
                },
                {
                    id: 'ban-manager',
                    name: 'Ban Manager',
                    icon: 'fa-ban',
                    description: 'Mass ban or unban users',
                    inputs: [
                        { id: 'ban-token', label: 'Bot Token', type: 'password', placeholder: 'Enter bot token' },
                        { id: 'ban-server', label: 'Server ID', type: 'text', placeholder: 'Enter server ID' },
                        { id: 'ban-users', label: 'User IDs (one per line)', type: 'textarea', placeholder: '123456789\n987654321' }
                    ],
                    buttons: [{ label: 'Mass Ban', action: 'massBan', class: 'danger-button' }],
                    outputs: [{ id: 'ban-status', type: 'status' }]
                }
            ]
        },
        {
            name: 'User Tools',
            icon: 'fa-users',
            tools: [
                {
                    id: 'mass-dm',
                    name: 'Mass DM',
                    icon: 'fa-envelope-bulk',
                    description: 'Send messages to multiple users at once',
                    inputs: [
                        { id: 'mass-dm-token', label: 'User Token', type: 'password', placeholder: 'Enter your user token' },
                        { id: 'mass-dm-server', label: 'Server ID', type: 'text', placeholder: 'Enter server ID' },
                        { id: 'mass-dm-message', label: 'Message', type: 'textarea', placeholder: 'Enter message to send' },
                        { id: 'mass-dm-delay', label: 'Delay (ms)', type: 'number', value: '1000', placeholder: 'Delay between messages' }
                    ],
                    buttons: [
                        { label: 'Start Mass DM', action: 'startMassDM', class: 'primary-button' },
                        { label: 'Stop', action: 'stopMassDM', class: 'danger-button' }
                    ],
                    outputs: [{ id: 'mass-dm-status', type: 'status' }]
                },
                {
                    id: 'user-info',
                    name: 'User Info Grabber',
                    icon: 'fa-user-circle',
                    description: 'Get detailed information about any Discord user',
                    inputs: [
                        { id: 'user-info-token', label: 'Token', type: 'password', placeholder: 'Enter token' },
                        { id: 'user-id', label: 'User ID', type: 'text', placeholder: 'Enter user ID' }
                    ],
                    buttons: [{ label: 'Get User Info', action: 'getUserInfo', class: 'primary-button' }],
                    outputs: [{ id: 'user-info-display', type: 'status' }]
                },
                {
                    id: 'auto-responder',
                    name: 'Auto Responder',
                    icon: 'fa-reply',
                    description: 'Automatically respond to messages with trigger words',
                    inputs: [
                        { id: 'responder-token', label: 'User Token', type: 'password', placeholder: 'Enter your user token' },
                        { id: 'trigger-word', label: 'Trigger Word', type: 'text', placeholder: 'Word to trigger response' },
                        { id: 'auto-response', label: 'Auto Response', type: 'textarea', placeholder: 'Message to send when triggered' }
                    ],
                    buttons: [
                        { label: 'Start Auto Responder', action: 'startAutoResponder', class: 'primary-button' },
                        { label: 'Stop', action: 'stopAutoResponder', class: 'danger-button' }
                    ],
                    outputs: [{ id: 'responder-status', type: 'status' }]
                },
                {
                    id: 'status-rotator',
                    name: 'Status Rotator',
                    icon: 'fa-sync',
                    description: 'Rotate between multiple custom statuses',
                    inputs: [
                        { id: 'status-token', label: 'User Token', type: 'password', placeholder: 'Enter your user token' },
                        { id: 'status-list', label: 'Status List (one per line)', type: 'textarea', placeholder: 'Playing Game\nWatching YouTube\nListening to Music' },
                        { id: 'status-interval', label: 'Interval (seconds)', type: 'number', value: '60', placeholder: 'Time between rotations' }
                    ],
                    buttons: [
                        { label: 'Start Rotation', action: 'startStatusRotator', class: 'primary-button' },
                        { label: 'Stop', action: 'stopStatusRotator', class: 'danger-button' }
                    ],
                    outputs: [{ id: 'status-rotator-status', type: 'status' }]
                },
                {
                    id: 'friend-manager',
                    name: 'Friend Manager',
                    icon: 'fa-user-friends',
                    description: 'Manage friend requests and relationships',
                    inputs: [
                        { id: 'friend-token', label: 'User Token', type: 'password', placeholder: 'Enter your user token' }
                    ],
                    buttons: [
                        { label: 'Get Friends List', action: 'getFriendsList', class: 'primary-button' },
                        { label: 'Accept All Requests', action: 'acceptAllFriends', class: 'secondary-button' },
                        { label: 'Remove All Friends', action: 'removeAllFriends', class: 'danger-button' }
                    ],
                    outputs: [{ id: 'friend-manager-status', type: 'status' }]
                },
                {
                    id: 'hypesquad-changer',
                    name: 'HypeSquad Changer',
                    icon: 'fa-flag',
                    description: 'Change your HypeSquad house',
                    inputs: [
                        { id: 'hypesquad-token', label: 'User Token', type: 'password', placeholder: 'Enter your user token' },
                        { id: 'hypesquad-house', label: 'House', type: 'select', options: [
                            { value: '1', label: 'Bravery (Purple)' },
                            { value: '2', label: 'Brilliance (Red)' },
                            { value: '3', label: 'Balance (Green)' }
                        ]}
                    ],
                    buttons: [{ label: 'Change House', action: 'changeHypeSquad', class: 'primary-button' }],
                    outputs: [{ id: 'hypesquad-status', type: 'status' }]
                },
                {
                    id: 'dm-spammer',
                    name: 'DM Spammer',
                    icon: 'fa-comment-dots',
                    description: 'Spam messages to a user',
                    inputs: [
                        { id: 'spam-token', label: 'User Token', type: 'password', placeholder: 'Enter your user token' },
                        { id: 'spam-user', label: 'Target User ID', type: 'text', placeholder: 'Enter user ID' },
                        { id: 'spam-message', label: 'Message', type: 'textarea', placeholder: 'Message to spam' },
                        { id: 'spam-count', label: 'Count', type: 'number', value: '10' }
                    ],
                    buttons: [{ label: 'Start Spam', action: 'startDMSpam', class: 'danger-button' }],
                    outputs: [{ id: 'spam-status', type: 'status' }]
                },
                {
                    id: 'typing-simulator',
                    name: 'Typing Simulator',
                    icon: 'fa-keyboard',
                    description: 'Show typing indicator',
                    inputs: [
                        { id: 'typing-token', label: 'User Token', type: 'password', placeholder: 'Enter your user token' },
                        { id: 'typing-channel', label: 'Channel ID', type: 'text', placeholder: 'Enter channel ID' }
                    ],
                    buttons: [{ label: 'Start Typing', action: 'startTyping', class: 'primary-button' }],
                    outputs: [{ id: 'typing-status', type: 'status' }]
                }
            ]
        },
        {
            name: 'Bot Development',
            icon: 'fa-robot',
            tools: [
                {
                    id: 'bot-testing',
                    name: 'Bot Testing',
                    icon: 'fa-robot',
                    description: 'Test your Discord bot functionality',
                    inputs: [
                        { id: 'bot-token', label: 'Bot Token', type: 'password', placeholder: 'Enter your bot token' },
                        { id: 'test-command', label: 'Test Command', type: 'text', placeholder: 'Enter a command to test' },
                        { id: 'test-channel', label: 'Test Channel ID (optional)', type: 'text', placeholder: 'Enter channel ID' }
                    ],
                    buttons: [{ label: 'Test Bot', action: 'testBot', class: 'primary-button' }],
                    outputs: [{ id: 'bot-status', type: 'status' }]
                },
                {
                    id: 'webhook-manager',
                    name: 'Webhook Manager',
                    icon: 'fa-webhook',
                    description: 'Create and manage Discord webhooks',
                    inputs: [
                        { id: 'webhook-url', label: 'Webhook URL', type: 'text', placeholder: 'Enter webhook URL' },
                        { id: 'webhook-message', label: 'Message', type: 'textarea', placeholder: 'Enter your message' },
                        { id: 'webhook-username', label: 'Custom Username', type: 'text', placeholder: 'Custom username' },
                        { id: 'webhook-avatar', label: 'Avatar URL', type: 'text', placeholder: 'Avatar URL' },
                        { id: 'embed-title', label: 'Embed Title', type: 'text', placeholder: 'Embed title' },
                        { id: 'embed-description', label: 'Embed Description', type: 'textarea', placeholder: 'Embed description' },
                        { id: 'embed-color', label: 'Embed Color', type: 'color', value: '#5865f2' }
                    ],
                    buttons: [{ label: 'Send Message', action: 'sendWebhook', class: 'primary-button' }],
                    outputs: [{ id: 'webhook-preview', type: 'preview' }]
                },
                {
                    id: 'command-builder',
                    name: 'Slash Command Builder',
                    icon: 'fa-terminal',
                    description: 'Build Discord slash commands with code generation',
                    inputs: [
                        { id: 'command-name', label: 'Command Name', type: 'text', placeholder: 'Enter command name' },
                        { id: 'command-description', label: 'Description', type: 'text', placeholder: 'Command description' }
                    ],
                    buttons: [
                        { label: 'Add Option', action: 'addCommandOption', class: 'secondary-button' },
                        { label: 'Generate Code', action: 'updateCommandPreview', class: 'primary-button' },
                        { label: 'Copy Code', action: 'copyCommandCode', class: 'primary-button' }
                    ],
                    outputs: [{ id: 'command-code', type: 'textarea' }]
                },
                {
                    id: 'intent-calculator',
                    name: 'Intent Calculator',
                    icon: 'fa-calculator',
                    description: 'Calculate Discord bot intents',
                    inputs: [
                        { id: 'intents-list', label: 'Select Intents', type: 'checkboxes', options: [
                            { id: 'intent-guilds', label: 'Guilds', checked: true },
                            { id: 'intent-members', label: 'Guild Members', checked: false },
                            { id: 'intent-bans', label: 'Guild Bans', checked: false },
                            { id: 'intent-emojis', label: 'Guild Emojis', checked: false },
                            { id: 'intent-integrations', label: 'Guild Integrations', checked: false },
                            { id: 'intent-webhooks', label: 'Guild Webhooks', checked: false },
                            { id: 'intent-invites', label: 'Guild Invites', checked: false },
                            { id: 'intent-voice', label: 'Guild Voice States', checked: false },
                            { id: 'intent-presences', label: 'Guild Presences', checked: false },
                            { id: 'intent-messages', label: 'Guild Messages', checked: true },
                            { id: 'intent-reactions', label: 'Guild Message Reactions', checked: false },
                            { id: 'intent-typing', label: 'Guild Message Typing', checked: false },
                            { id: 'intent-dm-messages', label: 'Direct Messages', checked: false },
                            { id: 'intent-dm-reactions', label: 'Direct Message Reactions', checked: false },
                            { id: 'intent-dm-typing', label: 'Direct Message Typing', checked: false },
                            { id: 'intent-message-content', label: 'Message Content', checked: false }
                        ]}
                    ],
                    buttons: [{ label: 'Calculate Intents', action: 'calculateIntents', class: 'primary-button' }],
                    outputs: [{ id: 'intents-result', type: 'status' }]
                },
                {
                    id: 'oauth-generator',
                    name: 'OAuth2 URL Generator',
                    icon: 'fa-link',
                    description: 'Generate OAuth2 invite URLs',
                    inputs: [
                        { id: 'oauth-client-id', label: 'Client ID', type: 'text', placeholder: 'Enter bot client ID' },
                        { id: 'oauth-permissions', label: 'Permissions', type: 'text', placeholder: 'Enter permissions integer' }
                    ],
                    buttons: [{ label: 'Generate URL', action: 'generateOAuth', class: 'primary-button' }],
                    outputs: [{ id: 'oauth-result', type: 'status' }]
                },
                {
                    id: 'event-simulator',
                    name: 'Event Simulator',
                    icon: 'fa-play-circle',
                    description: 'Simulate Discord events',
                    inputs: [
                        { id: 'event-type', label: 'Event Type', type: 'select', options: [
                            { value: 'messageCreate', label: 'Message Create' },
                            { value: 'guildMemberAdd', label: 'Member Join' }
                        ]}
                    ],
                    buttons: [{ label: 'Simulate', action: 'simulateEvent', class: 'primary-button' }],
                    outputs: [{ id: 'event-result', type: 'status' }]
                }
            ]
        },
        {
            name: 'Utilities',
            icon: 'fa-tools',
            tools: [
                {
                    id: 'token-validator',
                    name: 'Token Validator',
                    icon: 'fa-key',
                    description: 'Validate and analyze Discord tokens',
                    inputs: [
                        { id: 'token-input', label: 'Discord Token', type: 'password', placeholder: 'Enter token to validate' }
                    ],
                    buttons: [{ label: 'Validate Token', action: 'validateToken', class: 'primary-button' }],
                    outputs: [{ id: 'token-analysis', type: 'status' }]
                },
                {
                    id: 'permissions-calculator',
                    name: 'Permissions Calculator',
                    icon: 'fa-lock',
                    description: 'Calculate Discord permission integers',
                    inputs: [
                        { id: 'permission-template', label: 'Quick Template', type: 'select', options: [
                            { value: '', label: 'Select a template...' },
                            { value: 'admin', label: 'Administrator' },
                            { value: 'moderator', label: 'Moderator' },
                            { value: 'helper', label: 'Helper' }
                        ]}
                    ],
                    buttons: [{ label: 'Calculate', action: 'calculatePermissions', class: 'primary-button' }],
                    outputs: [{ id: 'permission-integer', type: 'status' }]
                },
                {
                    id: 'embed-creator',
                    name: 'Embed Creator',
                    icon: 'fa-palette',
                    description: 'Create beautiful Discord embeds visually',
                    inputs: [
                        { id: 'embed-webhook-url', label: 'Webhook URL', type: 'text', placeholder: 'Enter webhook URL' },
                        { id: 'embed-creator-title', label: 'Title', type: 'text', placeholder: 'Embed title' },
                        { id: 'embed-creator-description', label: 'Description', type: 'textarea', placeholder: 'Embed description' },
                        { id: 'embed-creator-color', label: 'Color', type: 'color', value: '#5865f2' }
                    ],
                    buttons: [{ label: 'Send Embed', action: 'sendEmbed', class: 'primary-button' }],
                    outputs: [{ id: 'embed-preview', type: 'preview' }]
                },
                {
                    id: 'json-tools',
                    name: 'JSON Tools',
                    icon: 'fa-brackets-curly',
                    description: 'Format, minify, and validate JSON',
                    inputs: [
                        { id: 'json-input', label: 'JSON Input', type: 'textarea', placeholder: 'Paste your JSON here...' }
                    ],
                    buttons: [
                        { label: 'Format JSON', action: 'formatJSON', class: 'primary-button' },
                        { label: 'Minify JSON', action: 'minifyJSON', class: 'secondary-button' },
                        { label: 'Validate', action: 'validateJSON', class: 'secondary-button' }
                    ],
                    outputs: [{ id: 'json-output', type: 'textarea', readonly: true }]
                },
                {
                    id: 'api-tester',
                    name: 'Discord API Tester',
                    icon: 'fa-code',
                    description: 'Test Discord API endpoints directly',
                    inputs: [
                        { id: 'api-endpoint', label: 'Endpoint', type: 'text', placeholder: '/users/@me' },
                        { id: 'api-method', label: 'Method', type: 'select', options: [
                            { value: 'GET', label: 'GET' },
                            { value: 'POST', label: 'POST' },
                            { value: 'PUT', label: 'PUT' },
                            { value: 'PATCH', label: 'PATCH' },
                            { value: 'DELETE', label: 'DELETE' }
                        ]},
                        { id: 'api-token', label: 'Authorization Token', type: 'password', placeholder: 'Enter token' },
                        { id: 'api-body', label: 'Request Body (JSON)', type: 'textarea', placeholder: 'Enter request body' }
                    ],
                    buttons: [{ label: 'Send Request', action: 'testAPI', class: 'primary-button' }],
                    outputs: [{ id: 'api-response', type: 'status' }]
                },
                {
                    id: 'snowflake-decoder',
                    name: 'Snowflake Decoder',
                    icon: 'fa-snowflake',
                    description: 'Decode Discord snowflake IDs to timestamps',
                    inputs: [
                        { id: 'snowflake-id', label: 'Snowflake ID', type: 'text', placeholder: 'Enter Discord ID' }
                    ],
                    buttons: [{ label: 'Decode', action: 'decodeSnowflake', class: 'primary-button' }],
                    outputs: [{ id: 'snowflake-result', type: 'status' }]
                },
                {
                    id: 'color-converter',
                    name: 'Color Converter',
                    icon: 'fa-palette',
                    description: 'Convert between HEX, RGB, and Discord color integers',
                    inputs: [
                        { id: 'color-input', label: 'Color Input', type: 'text', placeholder: '#5865f2 or 5793522' },
                        { id: 'color-picker-input', label: 'Or Pick Color', type: 'color', value: '#5865f2' }
                    ],
                    buttons: [{ label: 'Convert', action: 'convertColor', class: 'primary-button' }],
                    outputs: [{ id: 'color-result', type: 'status' }]
                },
                {
                    id: 'timestamp-generator',
                    name: 'Timestamp Generator',
                    icon: 'fa-clock',
                    description: 'Generate Discord timestamp formats',
                    inputs: [
                        { id: 'timestamp-date', label: 'Date & Time', type: 'datetime-local' },
                        { id: 'timestamp-format', label: 'Format', type: 'select', options: [
                            { value: 't', label: 'Short Time (16:20)' },
                            { value: 'T', label: 'Long Time (16:20:30)' },
                            { value: 'd', label: 'Short Date (20/04/2021)' },
                            { value: 'D', label: 'Long Date (20 April 2021)' },
                            { value: 'f', label: 'Short Date/Time' },
                            { value: 'F', label: 'Long Date/Time' },
                            { value: 'R', label: 'Relative Time (2 months ago)' }
                        ]}
                    ],
                    buttons: [{ label: 'Generate', action: 'generateTimestamp', class: 'primary-button' }],
                    outputs: [{ id: 'timestamp-result', type: 'status' }]
                },
                {
                    id: 'base64-tool',
                    name: 'Base64 Tool',
                    icon: 'fa-code',
                    description: 'Encode/decode Base64',
                    inputs: [
                        { id: 'base64-input', label: 'Input', type: 'textarea', placeholder: 'Enter text' }
                    ],
                    buttons: [
                        { label: 'Encode', action: 'encodeBase64', class: 'primary-button' },
                        { label: 'Decode', action: 'decodeBase64', class: 'secondary-button' }
                    ],
                    outputs: [{ id: 'base64-output', type: 'textarea' }]
                },
                {
                    id: 'hash-generator',
                    name: 'Hash Generator',
                    icon: 'fa-hashtag',
                    description: 'Generate hashes',
                    inputs: [
                        { id: 'hash-input', label: 'Input', type: 'textarea', placeholder: 'Enter text' },
                        { id: 'hash-algorithm', label: 'Algorithm', type: 'select', options: [
                            { value: 'md5', label: 'MD5' },
                            { value: 'sha256', label: 'SHA-256' }
                        ]}
                    ],
                    buttons: [{ label: 'Generate', action: 'generateHash', class: 'primary-button' }],
                    outputs: [{ id: 'hash-output', type: 'status' }]
                },
                {
                    id: 'regex-tester',
                    name: 'Regex Tester',
                    icon: 'fa-search',
                    description: 'Test regular expressions',
                    inputs: [
                        { id: 'regex-pattern', label: 'Pattern', type: 'text', placeholder: 'Enter regex' },
                        { id: 'regex-test', label: 'Test String', type: 'textarea', placeholder: 'Test string' }
                    ],
                    buttons: [{ label: 'Test', action: 'testRegex', class: 'primary-button' }],
                    outputs: [{ id: 'regex-result', type: 'status' }]
                }
            ]
        },
        {
            name: 'Advanced',
            icon: 'fa-fire',
            tools: [
                {
                    id: 'nitro-sniper',
                    name: 'Nitro Sniper',
                    icon: 'fa-gift',
                    description: 'Automatically detect and claim Nitro codes',
                    inputs: [
                        { id: 'sniper-token', label: 'User Token', type: 'password', placeholder: 'Enter your user token' }
                    ],
                    buttons: [
                        { label: 'Start Sniper', action: 'startNitroSniper', class: 'primary-button' },
                        { label: 'Stop Sniper', action: 'stopNitroSniper', class: 'danger-button' }
                    ],
                    outputs: [
                        { id: 'sniper-status', type: 'status' },
                        { id: 'sniper-log', type: 'log' }
                    ]
                },
                {
                    id: 'message-logger',
                    name: 'Message Logger',
                    icon: 'fa-history',
                    description: 'Log deleted and edited messages',
                    inputs: [
                        { id: 'logger-token', label: 'User Token', type: 'password', placeholder: 'Enter your user token' }
                    ],
                    buttons: [
                        { label: 'Start Logger', action: 'startLogger', class: 'primary-button' },
                        { label: 'Stop Logger', action: 'stopLogger', class: 'danger-button' },
                        { label: 'Clear Logs', action: 'clearLogs', class: 'secondary-button' }
                    ],
                    outputs: [
                        { id: 'logger-status', type: 'status' },
                        { id: 'message-logs', type: 'log' }
                    ]
                },
                {
                    id: 'raid-protection',
                    name: 'Raid Protection',
                    icon: 'fa-shield-alt',
                    description: 'Protect your server from raids',
                    inputs: [
                        { id: 'raid-token', label: 'Bot Token', type: 'password', placeholder: 'Enter bot token' },
                        { id: 'raid-server', label: 'Server ID', type: 'text', placeholder: 'Enter server ID' },
                        { id: 'raid-threshold', label: 'Join Threshold (users/minute)', type: 'number', value: '10' }
                    ],
                    buttons: [
                        { label: 'Enable Protection', action: 'enableRaidProtection', class: 'primary-button' },
                        { label: 'Disable', action: 'disableRaidProtection', class: 'danger-button' }
                    ],
                    outputs: [{ id: 'raid-status', type: 'status' }]
                },
                {
                    id: 'account-nuker',
                    name: 'Account Manager',
                    icon: 'fa-trash-alt',
                    description: 'Manage account data (leave servers, delete DMs)',
                    inputs: [
                        { id: 'nuker-token', label: 'User Token', type: 'password', placeholder: 'Enter your user token' }
                    ],
                    buttons: [
                        { label: 'Leave All Servers', action: 'leaveAllServers', class: 'danger-button' },
                        { label: 'Delete All DMs', action: 'deleteAllDMs', class: 'danger-button' },
                        { label: 'Remove All Friends', action: 'removeAllFriends', class: 'danger-button' }
                    ],
                    outputs: [{ id: 'nuker-status', type: 'status' }]
                },
                {
                    id: 'token-generator',
                    name: 'Token Generator',
                    icon: 'fa-key',
                    description: 'Generate Discord bot tokens',
                    inputs: [
                        { id: 'token-gen-app-id', label: 'Application ID', type: 'text', placeholder: 'Enter application ID' },
                        { id: 'token-gen-secret', label: 'Client Secret', type: 'password', placeholder: 'Enter client secret' }
                    ],
                    buttons: [{ label: 'Generate Token', action: 'generateBotToken', class: 'primary-button' }],
                    outputs: [{ id: 'token-gen-result', type: 'status' }]
                },
                {
                    id: 'webhook-spammer',
                    name: 'Webhook Spammer',
                    icon: 'fa-bolt',
                    description: 'Spam through webhooks',
                    inputs: [
                        { id: 'webhook-spam-url', label: 'Webhook URL', type: 'text', placeholder: 'Enter webhook URL' },
                        { id: 'webhook-spam-message', label: 'Message', type: 'textarea', placeholder: 'Message' },
                        { id: 'webhook-spam-count', label: 'Count', type: 'number', value: '10' }
                    ],
                    buttons: [{ label: 'Start', action: 'startWebhookSpam', class: 'danger-button' }],
                    outputs: [{ id: 'webhook-spam-status', type: 'status' }]
                },
                {
                    id: 'server-nuker',
                    name: 'Server Nuker',
                    icon: 'fa-bomb',
                    description: 'Mass delete channels/roles',
                    inputs: [
                        { id: 'nuke-token', label: 'Bot Token', type: 'password', placeholder: 'Enter bot token' },
                        { id: 'nuke-server', label: 'Server ID', type: 'text', placeholder: 'Enter server ID' }
                    ],
                    buttons: [{ label: 'Nuke Server', action: 'nukeServer', class: 'danger-button' }],
                    outputs: [{ id: 'nuke-status', type: 'status' }]
                }
            ]
        },
        {
            name: 'Analytics',
            icon: 'fa-chart-line',
            tools: [
                {
                    id: 'server-stats',
                    name: 'Server Statistics',
                    icon: 'fa-chart-bar',
                    description: 'Get detailed server statistics and analytics',
                    inputs: [
                        { id: 'stats-token', label: 'Bot Token', type: 'password', placeholder: 'Enter bot token' },
                        { id: 'stats-server', label: 'Server ID', type: 'text', placeholder: 'Enter server ID' }
                    ],
                    buttons: [{ label: 'Get Statistics', action: 'getServerStats', class: 'primary-button' }],
                    outputs: [{ id: 'stats-result', type: 'status' }]
                },
                {
                    id: 'member-tracker',
                    name: 'Member Tracker',
                    icon: 'fa-users',
                    description: 'Track member joins and leaves',
                    inputs: [
                        { id: 'tracker-token', label: 'Bot Token', type: 'password', placeholder: 'Enter bot token' },
                        { id: 'tracker-server', label: 'Server ID', type: 'text', placeholder: 'Enter server ID' }
                    ],
                    buttons: [
                        { label: 'Start Tracking', action: 'startMemberTracking', class: 'primary-button' },
                        { label: 'Stop', action: 'stopMemberTracking', class: 'danger-button' }
                    ],
                    outputs: [{ id: 'tracker-log', type: 'log' }]
                },
                {
                    id: 'activity-monitor',
                    name: 'Activity Monitor',
                    icon: 'fa-eye',
                    description: 'Monitor server activity in real-time',
                    inputs: [
                        { id: 'activity-token', label: 'Bot Token', type: 'password', placeholder: 'Enter bot token' },
                        { id: 'activity-server', label: 'Server ID', type: 'text', placeholder: 'Enter server ID' }
                    ],
                    buttons: [
                        { label: 'Start Monitoring', action: 'startActivityMonitor', class: 'primary-button' },
                        { label: 'Stop', action: 'stopActivityMonitor', class: 'danger-button' }
                    ],
                    outputs: [{ id: 'activity-log', type: 'log' }]
                },
                {
                    id: 'message-analytics',
                    name: 'Message Analytics',
                    icon: 'fa-comments',
                    description: 'Analyze message patterns',
                    inputs: [
                        { id: 'msg-analytics-token', label: 'Bot Token', type: 'password', placeholder: 'Enter bot token' },
                        { id: 'msg-analytics-channel', label: 'Channel ID', type: 'text', placeholder: 'Enter channel ID' }
                    ],
                    buttons: [{ label: 'Analyze', action: 'analyzeMessages', class: 'primary-button' }],
                    outputs: [{ id: 'msg-analytics-result', type: 'status' }]
                },
                {
                    id: 'growth-tracker',
                    name: 'Growth Tracker',
                    icon: 'fa-chart-line',
                    description: 'Track server growth',
                    inputs: [
                        { id: 'growth-token', label: 'Bot Token', type: 'password', placeholder: 'Enter bot token' },
                        { id: 'growth-server', label: 'Server ID', type: 'text', placeholder: 'Enter server ID' }
                    ],
                    buttons: [{ label: 'Start Tracking', action: 'startGrowthTracking', class: 'primary-button' }],
                    outputs: [{ id: 'growth-result', type: 'status' }]
                }
            ]
        }
    ]
};
