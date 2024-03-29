import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import dotenv from 'dotenv';
dotenv.config();


const RPC_ENDPOINT = process.env.RPC_ENDPOINT ?? clusterApiUrl('mainnet-beta');
const RPC_WEBSOCKET_ENDPOINT =
  process.env.RPC_WEBSOCKET_ENDPOINT ?? 'wss://api.mainnet-beta.solana.com';

const solanaConnection = new Connection(RPC_ENDPOINT, {
    wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
  });
  
const rayFee = new PublicKey(
    '7YttLkHDoNj9wyDur5pM1ejNaAvT9X4eqaYcHQqtj2G5'
  );
  
async function monitorNewTokens(connection){
    try {
        connection.onLogs(
            rayFee,
            async({logs, err, signature}) => {
                if (err) {
                    throw new Error(`log contains error, ${err.toString()}`);
                }

                console.log(chalk.bgGreen(`found new token signature: ${signature}`));
            }
        ) 
    } catch (error) {
        
    }
}
