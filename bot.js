require('dotenv').config();
const solanaWeb3 = require("@solana/web3.js");

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
    throw new Error("Private key not found in environment variables.");
}


// Adjustable Configurations
const CONFIG = {
    buyPercentage: 0.05, // 5% of SOL balance per buy
    sellPercentage: 0.10, // 10% of token balance per sell
    buysBeforeSell: 5,
    interval: 30000, // 30 seconds between trades
    solThreshold: 0.05, // Stop trading if SOL balance falls below 0.05 SOL
    bondingCurveProgramId: "<YOUR_BONDING_CURVE_PROGRAM_ID>",
    tokenMintAddress: "<YOUR_TOKEN_MINT_ADDRESS>",
};

// Global Variables
let connection;
let wallet;
let tokenAccount;
let buyCount = 0;

// Initialize Wallet
async function initializeWallet(privateKey) {
    const keypair = solanaWeb3.Keypair.fromSecretKey(Buffer.from(privateKey));
    wallet = keypair;
    console.log("Wallet initialized:", wallet.publicKey.toBase58());
}

// Fetch Token Account
async function getTokenAccount() {
    const accounts = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
        mint: new solanaWeb3.PublicKey(CONFIG.tokenMintAddress),
    });
    if (accounts.value.length === 0) {
        throw new Error("No token account found for the specified mint.");
    }
    tokenAccount = accounts.value[0].pubkey;
    console.log("Token account found:", tokenAccount.toBase58());
}

// Get SOL Balance
async function getSolBalance() {
    const balance = await connection.getBalance(wallet.publicKey);
    return balance / solanaWeb3.LAMPORTS_PER_SOL;
}

// Get Token Balance
async function getTokenBalance() {
    const accountInfo = await connection.getTokenAccountBalance(tokenAccount);
    return parseFloat(accountInfo.value.amount);
}

// Execute Buy on Bonding Curve
async function executeBuy() {
    const solBalance = await getSolBalance();
    const buyAmount = solBalance * CONFIG.buyPercentage;

    if (buyAmount < 0.01) {
        console.log("Insufficient SOL to execute buy.");
        return;
    }

    const transaction = new solanaWeb3.Transaction();
    const programId = new solanaWeb3.PublicKey(CONFIG.bondingCurveProgramId);

    // Add instruction to buy from bonding curve
    const instruction = new solanaWeb3.TransactionInstruction({
        keys: [
            { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
            { pubkey: tokenAccount, isSigner: false, isWritable: true },
        ],
        programId,
        data: Buffer.from(Uint8Array.of(0, ...new solanaWeb3.u64(buyAmount * solanaWeb3.LAMPORTS_PER_SOL).toBuffer())),
    });

    transaction.add(instruction);
    await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [wallet]);
    console.log(`Bought ${buyAmount} SOL worth of tokens.`);
}

// Execute Sell on Bonding Curve
async function executeSell() {
    const tokenBalance = await getTokenBalance();
    const sellAmount = tokenBalance * CONFIG.sellPercentage;

    if (sellAmount < 1) {
        console.log("Insufficient tokens to execute sell.");
        return;
    }

    const transaction = new solanaWeb3.Transaction();
    const programId = new solanaWeb3.PublicKey(CONFIG.bondingCurveProgramId);

    // Add instruction to sell to bonding curve
    const instruction = new solanaWeb3.TransactionInstruction({
        keys: [
            { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
            { pubkey: tokenAccount, isSigner: false, isWritable: true },
        ],
        programId,
        data: Buffer.from(Uint8Array.of(1, ...new solanaWeb3.u64(sellAmount).toBuffer())),
    });

    transaction.add(instruction);
    await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [wallet]);
    console.log(`Sold ${sellAmount} tokens.`);
}

// Main Trading Loop
async function startTrading() {
    while (true) {
        const solBalance = await getSolBalance();
        if (solBalance < CONFIG.solThreshold) {
            console.log("SOL balance below threshold. Selling tokens to continue.");
            await executeSell(); // Try to recoup SOL
            break;
        }

        if (buyCount < CONFIG.buysBeforeSell) {
            await executeBuy();
            buyCount++;
        } else {
            await executeSell();
            buyCount = 0;
        }

        await new Promise((resolve) => setTimeout(resolve, CONFIG.interval));
    }
}

// Entry Point
async function main(privateKey) {
    if (!privateKey) {
        throw new Error("Private key not found in environment variables.");
    }

    connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"), "confirmed");

    try {
        await initializeWallet(privateKey);
        await getTokenAccount();
        await startTrading();
    } catch (error) {
        console.error("Error:", error);
    }
}

// Replace with your private key
main(privateKey);
