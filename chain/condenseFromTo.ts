import { GraphFromTo, TransactionDetail } from './../types';

/**
 * Condenses an array of TransactionDetail into an array of GraphFromTo,
 * making it unique based on the combination of 'from' and 'to' properties,
 * and counts the occurrences of each unique pair.
 */
export function condenseFromTo(transactions: TransactionDetail[]): GraphFromTo[] {
  // Object to store the count of each unique 'from' to 'to' pair
  const pairsCount: Record<string, GraphFromTo> = {};

  // Iterate over the input transactions array
  transactions.forEach(({ from, to }) => {
    // Create a unique string identifier for the pair
    const pairIdentifier = `${from}->${to}`;

    // If this pair hasn't been seen before, initialize it in the pairsCount object
    if (!pairsCount[pairIdentifier]) {
      pairsCount[pairIdentifier] = { from, to, count: 0 };
    }

    // Increment the count for this pair
    pairsCount[pairIdentifier].count++;
  });

  // Convert the pairsCount object back into an array of GraphFromTo
  return Object.values(pairsCount);
}