import { TransactionDetail } from './../types';
import { getTransactionsForAddressEtherscan } from './getTransactionsForAddressEtherscan';
import { sleep } from './../utils';

export async function getTransactionsWithDepth(address: string, txTotalCutoff: number, txPerAddress: number): Promise<TransactionDetail[]> {
    const collectedTransactions = new Set<string>();
    let addressesToProcess = new Set<string>([address]); // Now a Set
    const transactions: TransactionDetail[] = [];
    let processedTransactions = 0;
    const logInterval = txTotalCutoff / 10;
    const processedAddresses = new Set<string>(); // To avoid reprocessing

    async function collectTransactions(currentDepth: number): Promise<void> {
        console.log(`Collecting transactions at depth ${currentDepth}`);
        if (processedTransactions >= txTotalCutoff) {
            return;
        }

        const nextAddresses = new Set<string>();

        for (const address of addressesToProcess) {
            if (processedAddresses.has(address)) continue; // Skip if already processed
            processedAddresses.add(address); // Mark as processed

            await sleep(200); // Enforce a delay between calls
            const txs = await getTransactionsForAddressEtherscan(address, txPerAddress);
            console.log(`etherscan gave ${txs.length} transactions for address ${address}`);
            for (const tx of txs) {
                const txHash = tx.hash;
                if (!collectedTransactions.has(txHash)) {
                    collectedTransactions.add(txHash);
                    transactions.push(tx);
                    processedTransactions++;

                    if (processedTransactions % logInterval === 0 || processedTransactions >= txTotalCutoff) {
                        console.log(`Processed ${processedTransactions} transactions (${(processedTransactions / txTotalCutoff * 100).toFixed(0)}% complete)`);
                    }

                    if (processedTransactions >= txTotalCutoff) {
                        console.log('Transaction collection complete. 100% complete.');
                        return; // Properly exit when transaction cutoff is reached
                    }
                }

                // Efficiently add addresses for the next depth
                nextAddresses.add(tx.from);
                nextAddresses.add(tx.to);
            }
        }

        addressesToProcess = new Set([...nextAddresses].filter(addr => !processedAddresses.has(addr))); // Filter out already processed
        if (addressesToProcess.size > 0) {
            await collectTransactions(currentDepth + 1);
        }
    }

    await collectTransactions(1);

    console.log('Transaction collection process completed.');
    return Array.from(transactions);
}