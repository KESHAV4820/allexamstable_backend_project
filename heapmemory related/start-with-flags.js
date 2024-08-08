const v8 = require('v8');

try {
  v8.setFlagsFromString('--max_old_space_size=16384');
  console.log(`Heap Size Limit set to: ${v8.getHeapStatistics().heap_size_limit / 1024 / 1024 / 1024} GB`);
} catch (error) {
  console.error('Failed to set heap size:', error);
}

console.log('NODE_OPTIONS:', process.env.NODE_OPTIONS);
console.log('Initial heap statistics:', v8.getHeapStatistics());

// Import your main app
try {
  require('./app.js');
} catch (error) {
  console.error('Error loading app.js:', error);
}

// Log heap statistics again after a short delay
setTimeout(() => {
  console.log('Heap statistics after app load:', v8.getHeapStatistics());
}, 1000);