# Monitor new solana tokens in realtime

This codebase is a demonstration of how to monitor new solana tokens using typescript language and solana rpc methods. By default the script listens for new raydium liquidity pool transactions, extracts the necessary information for additional use, and stores it.

**disclaimer**: Use this code at your own risk as it is here for educational purposes, there is no guarantee of profit! DO NOT use the default solana RPC in production, instead use an RPC provider to ensure reliability, speed and effectiveness of the bot.

A good recommendation is helius labs. You can sign up for free here [helius rpc](https://www.helius.dev/) and use the referal code `3wISAeRX8K` to get 5,000,000 free credits on the paid plan.

Once you've signed up, add the `RPC_ENDPOINT` and `RPC_WEBSOCKET_ENDPOINT` to a `.env` file as per the format in the `.env.example` file.

Running the sniper:

- Install dependencies: `npm install`
- Copy the `.env.example` file into a `.env` file.
- As per disclaimer above, replace default rpc endpoints with a rpc provider endpoints.
- In your terminal, run `npm run monitor`

Your terminal should show `monitoring new token launches..`

<img width="1030" alt="monitor_new_token_image" src="https://github.com/archiesnipes/solana-new-token-monitor/assets/159651488/1afb4714-7106-4d2d-95c0-489ba2021ac0">

## Contact

For community discussions on sniper bots:
[![](https://img.shields.io/discord/1201826085655023616?color=5865F2&logo=Discord&style=flat-square)](https://discord.gg/47ddgNwa3b)

For any business inquiries, reach out at discord: `archiesnipes`
