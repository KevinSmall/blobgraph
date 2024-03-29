import { getTransactionsType3 } from './getTransactionsType3';
import { condenseFromTo } from './chain/condenseFromTo';
import { getTransactionsWithDepth } from './chain/getTransactionsWithDepth';
import { prepareGraphML } from './graph/prepareGraphML';
import { writeStringToFile } from './utils';

// find starting address, must be associated with a type3 transaction
//getTransactionsType3(10);
//.catch((error) => {
//  console.error("Error:", error);
//});

// Get all transactions for the given address, write to graphML
const addr = "0x3527439923a63F8C13CF72b8Fe80a77f6e572092";
//const addr = "0x4A32f0947E94306090a84d92E7f3fEEC7863606B";
console.log(addr);

// Params:
// root address 
// total tx to study
// tx to collect per address
const kev = await getTransactionsWithDepth(addr, 2000, 200);

// condense the txs, leave only unique from/to pairs with a count of tx inside that pair 
const condensed = condenseFromTo(kev);
console.log(condensed);

// prepare the graphml
const graphML = prepareGraphML(condensed);
console.log(graphML);

// write the graphml to file
writeStringToFile(graphML, './output/graph5.graphml');