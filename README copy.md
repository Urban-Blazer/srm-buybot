# SRM BuyBot

A Telegram bot that monitors and reports SUI token transactions on SuiRewards.me. This bot automatically detects buy transactions and sends informative notifications to a configured Telegram group.

## Prerequisites

- Node.js (v16+)
- npm or pnpm
- Docker (optional for containerized deployment)
- PM2 (optional for production deployment)
- A Telegram bot token from [@BotFather](https://t.me/BotFather)
- NINJA API key for price data

## Environment Setup

1. Clone the repository
2. Rename `.env.example` to `.env`
   ```shell
   mv .env.example .env
   ```
3. Configure the `.env` file with your credentials:
   ```
   BOT_TOKEN=your_telegram_bot_token
   NINJA_API_KEY=your_ninja_api_key
   NINJA_API_URL=ninja_api_endpoint
   ENVIRONMENT=dev|prod
   ```

## Local Development Setup

1. Install dependencies:
   ```shell
   pnpm install
   # or
   npm install
   ```

2. Run in development mode with auto-reload:
   ```shell
   pnpm dev
   # or
   npm run dev
   ```

## Production Deployment Options

### Option 1: Using Docker

1. Make sure Docker and Docker Compose are installed on your system
2. Build and start the container:
   ```shell
   docker compose up -d
   ```
3. View logs:
   ```shell
   docker compose logs -f
   ```
4. To stop the bot:
   ```shell
   docker compose down
   ```

### Option 2: Using PM2 (Ubuntu Linux)

1. Install PM2 globally:
   ```shell
   npm install -g pm2
   ```

2. Start the bot with PM2:
   ```shell
   pm2 start "npm run start" --name srm-buybot
   ```

3. Configure PM2 to start on system boot:
   ```shell
   pm2 startup
   pm2 save
   ```

4. Useful PM2 commands:
   ```shell
   # Check status
   pm2 status
   
   # View logs
   pm2 logs srm-buybot
   
   # Restart the bot
   pm2 restart srm-buybot
   
   # Stop the bot
   pm2 stop srm-buybot
   ```

## Manual Deployment on Ubuntu

1. Update system packages:
   ```shell
   sudo apt update && sudo apt upgrade -y
   ```

2. Install Node.js and npm (if not already installed):
   ```shell
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

3. Clone the repository:
   ```shell
   git clone <repository-url>
   cd srm-buybot
   ```

4. Configure environment variables:
   ```shell
   cp .env.example .env
   nano .env  # Edit with your credentials
   ```

5. Install dependencies and run the bot:
   ```shell
   npm install
   npm run start
   ```

## Notes

- For production usage, set `ENVIRONMENT=prod` in your `.env` file
- The bot requires proper network access to interact with the SUI blockchain and API services
- Make sure your Telegram bot has the necessary permissions in the target chat group
