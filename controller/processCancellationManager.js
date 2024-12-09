const EventEmitter = require('events');

class ProcessCancellationManager {
  constructor() {
    this.cancellationEmitter = new EventEmitter();
    this.activeProcesses = new Map();
  }

  /**
   * Generate a unique cancellation token
   * @returns {string} Unique process identifier
   */
  generateToken() {
    return `process_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Start tracking a new process
   * @param {string} token - Unique process token
   * @param {Object} context - Additional process context
   * @returns {Object} Process tracking object
   */
  startProcess(token, context = {}) {
    const processEntry = {
      token,
      context,
      startTime: Date.now(),
      isCancelled: false,// initially
      cancellationReason: null
    };

    this.activeProcesses.set(token, processEntry);
    return processEntry;
  }

  /**
   * Check if a process is cancelled or if not, then has to be cancelled in future is asked
   * @param {string} token - Process token to check
   * @returns {boolean} Whether the process is cancelled
   */
  isCancelled(token) {
    const process = this.activeProcesses.get(token);
    return process ? process.isCancelled : false;
  }

  /**
   * Cancel a specific process: this is the teeth where real cuting is being done. 
   * @param {string} token - Process token to cancel
   * @param {string} reason - Reason for cancellation
   */
  cancelProcess(token, reason = 'User requested cancellation due to arrival of new request') {
    const process = this.activeProcesses.get(token);
    if (process) {
      process.isCancelled = true;
      process.cancellationReason = reason;
      
      // Punch line: Emit cancellation event
      this.cancellationEmitter.emit(`cancel:${token}`, {// the real punch has come from here. 
        token,
        reason
      });
    }
  }

  /**
   * Create a cancellation-aware processing wrapper
   * @param {function} processFn - Processing function to wrap
   * @returns {function} Wrapped processing function
   */
  createCancellableProcess(processFn) {
    return async (token, ...args) => {
      if (this.isCancelled(token)) {
        throw new Error(`Process ${token} was cancelled`);
      }

      try {
        // Add cancellation check mechanism
        const cancellationCheck = () => {
          if (this.isCancelled(token)) {
            throw new Error(`Process ${token} was cancelled`);
          }
        };

        // Periodically check for cancellation during long-running processes
        const cancellationInterval = setInterval(cancellationCheck, 2*1000);// in 2 seconds

        try {
          const result = await processFn(token, ...args, cancellationCheck);
          return result;
        } finally {
          clearInterval(cancellationInterval);
          this.activeProcesses.delete(token);
        }
      } catch (error) {
        if (this.isCancelled(token)) {
          // Handle specific cancellation scenario
          return {
            cancelled: true,
            reason: this.activeProcesses.get(token)?.cancellationReason
          };
        }
        throw error;
      }
    };
  }

  /**
   * Listen for cancellation of a specific process
   * @param {string} token - Process token to listen for
   * @param {function} callback - Callback function
   */
  onProcessCancellation(token, callback) {
    this.cancellationEmitter.on(`cancel:${token}`, callback);
  }

  /**
   * Remove all listeners for a specific process
   * @param {string} token - Process token
   */
  removeProcessListeners(token) {
    this.cancellationEmitter.removeAllListeners(`cancel:${token}`);
  }
}

module.exports = new ProcessCancellationManager();