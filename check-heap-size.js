// check-heap-size.js
// const v8 = require('v8');
// console.log(v8.getHeapStatistics());

const v8 = require('v8');
const heapStatistics = v8.getHeapStatistics();
console.log(`Heap Size Limit: ${heapStatistics.heap_size_limit / 1024 / 1024/1024} GB`);
console.log(heapStatistics);