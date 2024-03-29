import fetch from 'node-fetch';
import { TransactionDetail } from './../types';

const mySecret = process.env['ETHERSCAN_API_KEY'];

export async function getTransactionsForAddressEtherscan(address: string, numberOfTransactions: number): Promise<TransactionDetail[]> {
  const apiKey = mySecret;
  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${numberOfTransactions}&sort=desc&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    let data: any;
    data = await response.json();

    if (data.status !== "1") {
      throw new Error(`Etherscan API error: ${data.message}`);
    }

    const transactions = data.result.map((tx: any) => ({
      from: tx.from,
      to: tx.to,
      hash: tx.hash,
    }));

    return transactions;
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    throw error; // caller to handle
  }
}
