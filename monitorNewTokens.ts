import { rayFee, solanaConnection } from './constants';
import { storeData } from './utils';
import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import { Connection } from '@solana/web3.js';
import { MAINNET_PROGRAM_ID } from '@raydium-io/raydium-sdk';

const dataPath = path.join(__dirname, 'data', 'new_solana_tokens.json');

async function monitorNewTokens(connection: Connection) {
  console.log(chalk.green(`monitoring new solana tokens...`));

  try {
    connection.onLogs(
      rayFee,
      async ({ logs, err, signature }) => {
        try {
          if (err) {
            console.error(`connection contains error, ${err}`);
            return;
          }

          console.log(chalk.bgGreen(`found new token signature: ${signature}`));

          let signer = '';
          let baseAddress = '';
          let baseDecimals = 0;
          let baseLpAmount = 0;
          let quoteAddress = '';
          let quoteDecimals = 0;
          let quoteLpAmount = 0;

          /**You need to use a RPC provider for getparsedtransaction to work properly.
           * Check README.md for suggestions.
           */
          const parsedTransaction = await connection.getParsedTransaction(
            signature,
            {
              maxSupportedTransactionVersion: 0,
              commitment: 'confirmed',
            }
          );

          if (parsedTransaction && parsedTransaction?.meta.err == null) {
            console.log(`successfully parsed transaction`);

            signer =
              parsedTransaction?.transaction.message.accountKeys[0].pubkey.toString();

            console.log(`creator, ${signer}`);

            const postTokenBalances = parsedTransaction?.meta.postTokenBalances;

            const baseInfo = postTokenBalances?.find(
              (balance) =>
                balance.owner ===
                  '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1' &&
                balance.mint !== 'So11111111111111111111111111111111111111112'
            );

            if (baseInfo) {
              baseAddress = baseInfo.mint;
              baseDecimals = baseInfo.uiTokenAmount.decimals;
              baseLpAmount = baseInfo.uiTokenAmount.uiAmount;
            }

            const quoteInfo = postTokenBalances.find(
              (balance) =>
                balance.owner ==
                  '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1' &&
                balance.mint == 'So11111111111111111111111111111111111111112'
            );

            if (quoteInfo) {
              quoteAddress = quoteInfo.mint;
              quoteDecimals = quoteInfo.uiTokenAmount.decimals;
              quoteLpAmount = quoteInfo.uiTokenAmount.uiAmount;
            }
          }

          const newTokenData = {
            lpSignature: signature,
            creator: signer,
            timestamp: new Date().toISOString(),
            baseInfo: {
              baseAddress,
              baseDecimals,
              baseLpAmount,
            },
            quoteInfo: {
              quoteAddress: quoteAddress,
              quoteDecimals: quoteDecimals,
              quoteLpAmount: quoteLpAmount,
            },
            logs: logs,
          };

          //store new tokens data in data folder
          await storeData(dataPath, newTokenData);
        } catch (error) {
          const errorMessage = `error occured in new solana token log callback function, ${JSON.stringify(error, null, 2)}`;
          console.log(chalk.red(errorMessage));
          // Save error logs to a separate file
          fs.appendFile(
            'errorNewLpsLogs.txt',
            `${errorMessage}\n`,
            function (err) {
              if (err) console.log('error writing errorlogs.txt', err);
            }
          );
        }
      },
      'confirmed'
    );
  } catch (error) {
    const errorMessage = `error occured in new sol lp monitor, ${JSON.stringify(error, null, 2)}`;
    console.log(chalk.red(errorMessage));
    // Save error logs to a separate file
    fs.appendFile('errorNewLpsLogs.txt', `${errorMessage}\n`, function (err) {
      if (err) console.log('error writing errorlogs.txt', err);
    });
  }
}

monitorNewTokens(solanaConnection);
