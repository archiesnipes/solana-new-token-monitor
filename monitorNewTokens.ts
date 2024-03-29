import { rayFee, solanaConnection } from './constants';
import { storeData } from './utils';
import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import { Connection } from '@solana/web3.js';

const dataPath = path.join(__dirname, 'data', 'new_solana_tokens.json');

async function monitorNewTokens(connection: Connection) {
  try {
    connection.onLogs(
      rayFee,
      async ({ logs, err, signature }) => {
        if (err) {
          throw new Error(`log contains error, ${err.toString()}`);
        }

        console.log(chalk.bgGreen(`found new token signature: ${signature}`));

        console.log(`new token logs: ${logs}`);

        const newTokenData = {
          lpSignature: signature,
          timestamp: new Date().toISOString(),
          logs: logs,
        };

        //store new tokens
        await storeData(dataPath, newTokenData);
      },
      'confirmed'
    );
  } catch (error) {
    const errorMessage = `error occured in new sol lp monitor, ${error}`;
    console.log(chalk.red(errorMessage));
    // Save error logs to a separate file
    fs.appendFile('errorNewLpsLogs.txt', `${errorMessage}\n`, function (err) {
      if (err) console.log('error writing errorlogs.txt', err);
    });
  }
}

monitorNewTokens(solanaConnection);
