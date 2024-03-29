import { ethers } from 'ethers';
import { writeStringToFile } from './../utils';

const mySecret = process.env['RPC_URL'];
const provider = new ethers.JsonRpcProvider(mySecret);

export async function getTransactionsType3(txCount: number) {
  let blockNumber = await provider.getBlockNumber();
  let type3TransactionsCount = 0;
  // Initialize a Set to store unique addresses
  const uniqueAddresses = new Set<string>();

  while (type3TransactionsCount < txCount) {
    const block = await provider.getBlock(blockNumber, true);

    for (const transaction of block!.prefetchedTransactions) {
      // Checking if the transaction is of type 3
      if (transaction.type === 3) {
        //const receipt = await provider.getTransactionReceipt(transaction.hash);
        //console.log(`Transaction Receipt for Hash: ${transaction.hash}`, receipt);

        // Add the 'to' and 'from' addresses to the set, if they exist
        if (transaction.to) uniqueAddresses.add(transaction.to);
        if (transaction.from) uniqueAddresses.add(transaction.from);

        type3TransactionsCount++;
        if (type3TransactionsCount >= txCount) {
          break;
        }
      }
    }

    blockNumber--;

    // Prevent the loop from going too far back if transactions of type 3 are scarce
    if (blockNumber < 0 || type3TransactionsCount >= txCount) {
      break;
    }
  }

  // Check if we found any type 3 transactions
  if (type3TransactionsCount === 0) {
    console.log("No transactions of type 3 found in the recent blocks.");
  } else {
    // Print the unique addresses set
    console.log("Unique addresses from transactions of type 3:", Array.from(uniqueAddresses));

    // write results
    const results = JSON.stringify(Array.from(uniqueAddresses), null, 2);
    writeStringToFile(results, './output/uniqueAddresses.json');
  }
}