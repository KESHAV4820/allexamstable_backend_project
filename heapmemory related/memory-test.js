const v8 = require('v8');

console.log(`Initial heap size limit: ${v8.getHeapStatistics().heap_size_limit / 1024 / 1024 / 1024} GB`);

// Allocate a large array
const arr = new Array(1e7).fill('test');

console.log(`Heap size limit after allocation: ${v8.getHeapStatistics().heap_size_limit / 1024 / 1024 / 1024} GB`);