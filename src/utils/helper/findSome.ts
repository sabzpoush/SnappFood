export function findMostRepeatedItem(array:number[]): null | number {
    // Create a hash table to store item counts
    const counts = {};
  
    // Iterate over the array and increment counts
    for (const item of array) {
      counts[item] = (counts[item] || 0) + 1;
    }
  
    // Find the item with the highest count
    let mostRepeatedItem = null;
    let maxCount = 0;
    for (const item in counts) {
      if (counts[item] > maxCount) {
        mostRepeatedItem = item;
        maxCount = counts[item];
      }
    }
  
    return mostRepeatedItem;
}