class PromiseQueueError extends Error {
  /**
   * Creates the error
   * @param {any} data
   * @param {any} code
   */
  constructor(message) {
    super();
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  PromiseQueueError
};
