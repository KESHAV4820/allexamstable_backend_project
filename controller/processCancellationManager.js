const EventEmitter = require('events');

class ProcessCancellationManager {
  constructor() {
    this.cancellationEmitter = new EventEmitter();
    this.activeProcesses = new Map();
  }

  /**
   * this is meant to Generate a unique cancellation token
   * it returns  {string} Unique process identifier
   */
  generateToken() {
    return `process_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  /**
   * this is meant to Start tracking a new process
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
    console.log('token: ',token);//debugging log

    this.activeProcesses.set(token, processEntry);
    console.log('processEntry: ',processEntry);//debugging log
    console.log('activeProcesses: ',this.activeProcesses);//debugging log
    
    
    return processEntry;
  }

  /**
   * Check if a process is cancelled or if not, then has to be cancelled in future is asked
   * @param {string} token - Process token to check
   * @returns {boolean} Whether the process is cancelled
   */
  isCancelled(token) {
    const process = this.activeProcesses.get(token);
    console.log('process: ',process,'with token number: ',token,'is being checked for cancellation 👮🏼🚓');//debugging log
    
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
      console.log('in backend, the process: ', process,' with token: ', token,' got cancelled here👇🏼');//debugging log
      
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
        throw new Error(`Process with token: ${token} was cancelled🙅🏼`);
      }

      try {
        // Add cancellation check mechanism
        const cancellationCheck = () => {
          if (this.isCancelled(token)) {
            throw new Error(`Process ${token} was cancelled`);
          }
        };

        // Periodically check for cancellation during long-running processes
        const cancellationInterval = setInterval(cancellationCheck, 1*1000);// in 1 seconds

        try {
          const result = await processFn(token, ...args, cancellationCheck);
          return result;
        } finally {
          clearInterval(cancellationInterval);
          this.activeProcesses.delete(token);
          console.log('process got terminated after completion of the request.🫡');//debugging log
          
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
    console.log('all listerners for the process with token: ',token,' has been removed as cancellation of the process has occured.👋🏼');//debugging log
    
  }
}

module.exports = new ProcessCancellationManager();