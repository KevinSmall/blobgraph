import { GraphFromTo } from './../types';

// Function to prepare GraphML content from an array of GraphFromTo
export function prepareGraphML(data: GraphFromTo[]): string {
  // Basic structure of a GraphML file
  let graphML = `<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns 
     http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">
  <graph id="G" edgedefault="directed">
`;

  // Extract unique addresses to create nodes
  const addresses = new Set(data.flatMap(edge => [edge.from, edge.to]));
  addresses.forEach(address => {
    graphML += `    <node id="${address}"/>\n`;
  });

  // Add edges with the count attribute
  data.forEach(edge => {
    graphML += `    <edge source="${edge.from}" target="${edge.to}">
      <data key="count">${edge.count}</data>
    </edge>\n`;
  });

  graphML += '  </graph>\n</graphml>';

  return graphML;
}