console.log(JSON.stringify(process.env, null, 2));
console.log(`NODE_OPTIONS: ${process.env.NODE_OPTIONS}`);


console.log(`NODE_OPTIONS: ${process.env.NODE_OPTIONS}`);
const v8 = require('v8');
const heapStatistics = v8.getHeapStatistics();
console.log(`Heap Size Limit: ${heapStatistics.heap_size_limit / 1024 / 1024/1024} GB`);
console.log(heapStatistics);
