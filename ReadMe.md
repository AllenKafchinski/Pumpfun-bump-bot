# Solana Pump.fun Token Bump Bot

There are too many scams out there so I wanted to make something legitimate. 

This is a modular Solana Bump bot designed to interact directly with a bonding curve for the Pump.fun tokens. The bot creates trading activity by executing periodic buy and sell transactions using your wallets private key and the bonding curve of the token. It is configurable, secure, and designed to run locally.

---

## Features

- **Automated Trading**: Executes periodic buy and sell orders to simulate token activity.
- **Direct Bonding Curve Interaction**: Trades tokens directly with the bonding curve.
- **Configurable Parameters**: Customize buy/sell percentages, intervals, and thresholds.
- **Safety Mechanisms**: Stops trading if SOL balance falls below a set threshold.
- **Error Handling**: Handles failed transactions and network errors gracefully.
- **Secure**: Uses environment variables to store sensitive data, like your wallet private key.

---

## Prerequisites

1. **Node.js**: Ensure you have [Node.js](https://nodejs.org/) installed (v14 or later recommended).
2. **NPM**: Comes with Node.js and is used to manage dependencies.
3. **Phantom Wallet Private Key**: Export your wallet private key securely and input it into the .env file.
4. **SOL Tokens**: Ensure your wallet is funded with sufficient SOL for transaction fees.

---

## Setup Instructions

### 1. Clone the Repository
```bash
https://github.com/AllenKafchinski/Pumpfun-bump-bot.git
cd Pumpfun-bump-bot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
touch .env
```
Add the following to your `.env` file:
```env
PRIVATE_KEY=your_private_key_here
```
Using your wallet private key allows the bot to sign transactions on your behalf. **Do not share this key with anyone!**
Without the private key, the bot would otherwise have to ask for permission any time it makes a transaction. It allows the bot to run autonomously.

### 4. Update Configuration
Edit the `CONFIG` object in `index.js` to customize the bot's behavior:
```javascript
const CONFIG = {
    buyPercentage: 0.05, // 5% of SOL balance per buy
    sellPercentage: 0.10, // 10% of token balance per sell
    buysBeforeSell: 5,    // Number of buy transactions before a sell
    interval: 30000,      // Time (in ms) between trades
    solThreshold: 0.5,    // Stop trading if SOL balance drops below this threshold
    bondingCurveProgramId: "<YOUR_BONDING_CURVE_PROGRAM_ID>",
    tokenMintAddress: "<YOUR_TOKEN_MINT_ADDRESS>",
};
```

Replace `<YOUR_BONDING_CURVE_PROGRAM_ID>` and `<YOUR_TOKEN_MINT_ADDRESS>` with the appropriate values for your token.

---

## Running the Bot

To start the bot:
```bash
node bot.js
```

The bot will run indefinitely until manually stopped or the SOL balance threshold is reached.

---

## File Structure

```plaintext
solana-pumpfun-bot/
├── bot.js             # Main bot logic
├── package.json       # Project metadata and dependencies
├── .env               # Environment variables (not included in the repository)
├── .gitignore         # Prevents sensitive files from being committed
└── README.md          # Project documentation
```

---

## Configuration Options

| Parameter               | Description                                                                                  | Default Value |
|-------------------------|----------------------------------------------------------------------------------------------|---------------|
| `buyPercentage`         | Percentage of SOL balance to use for each buy transaction.                                   | `0.05` (5%)   |
| `sellPercentage`        | Percentage of token balance to sell after `buysBeforeSell` transactions.                     | `0.10` (10%)  |
| `buysBeforeSell`        | Number of buy transactions to execute before performing a sell.                              | `5`           |
| `interval`              | Time interval (in milliseconds) between trades.                                              | `30000` (30s) |
| `solThreshold`          | Minimum SOL balance. Trading stops if balance falls below this threshold.                    | `0.5`         |
| `bondingCurveProgramId` | Program ID (contract address) for the bonding curve                                          | `<REQUIRED>`  |
| `tokenMintAddress`      | Mint contract address of the Pump.fun token.                                                 | `<REQUIRED>`  |

---

## Security

1. **Do Not Hardcode Sensitive Data**: Store the private key in a `.env` file and add `.env` to your `.gitignore` file to prevent it from being included in version control.
2. **Wallet Security**: Use a wallet specifically for this bot. Do not use your primary wallet for trading.
3. **Monitor Transactions**: Regularly monitor transactions to ensure the bot behaves as expected.

---

## Troubleshooting

- **Error: Private key not found**:
  Ensure the `.env` file is correctly set up with your private key.
- **Error: Token account not found**:
  Ensure the wallet has interacted with the Pump.fun token before running the bot.
- **Low SOL Balance**:
  The bot will stop trading if the SOL balance drops below the configured threshold.

---

## Future Enhancements

- **Advanced Logging**: Add logging for transaction history and error reports.
- **Analytics Dashboard**: Integrate with a dashboard for monitoring trading performance.
- **DEX Integration**: Add support for trading via decentralized exchanges like Serum or Jupiter.
- **Telegram Alerts**: Notify users when certain conditions are met (e.g., low SOL balance).

---

## Contributing

Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request with your changes.

Tips are appreciated! 
Solana wallet: H4H8giY5sZ31gL7bEEYVt3L4oumvQqjvGWUMqivY4Vmo

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Disclaimer

This bot is for educational and demonstration purposes only. Use at your own risk. Ensure compliance with local regulations before deploying. The developers are not responsible for any loss or damage caused by the use of this bot. **THIS BOT IS NOT INTENDED TO BE PROFITABLE!!!** It is designed to simulate trading activity to show that a new token isn't "dead" which may attract buyers and assist in the successful launch of a new token from pump.fun.