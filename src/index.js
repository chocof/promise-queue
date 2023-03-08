const DeferredPromise = require("./deferred_promise");
const { PromiseQueueError } = require("./errors");

/**
 * So, a promise queue is practically a way to communicate and exchange data
 * with another callback scope executed asynchronously. It is basically a queue on which
 * somebody may write or read data. PromiseQueue.write() is a blocking operation only
 * if the queue is full. On the other hand PromiseQueue.read() blocks only if the queue is empty.
 * If a maximum queue size is not defined then writing data in the queue will never block.
 */
class PromiseQueue {
  constructor(size = 0) {
    if (size < 0) throw new PromiseQueueError("Invalid Queue Size");
    this.size = size;
    this.queue = [];
    this.waitEmpty = new DeferredPromise();
    this.waitFull = null;
  }

  /**
   * Returns true if the queue is currently full
   * If the queue has been defined without setting a size
   * then the queue will never be marked as full
   * @returns {boolean}
   */
  isFull() {
    return this.size && this.queue.length == this.size;
  }

  /**
   * Returns true if the queue is currently empty
   * @returns {boolean}
   */
  isEmpty() {
    return !this.queue.length;
  }

  /**
   * Pushes data into the queue. If the queue is full then
   * this will wait for an item to be read
   * @param {*} data
   * @returns Promise
   */
  async write(data) {
    try {
      while (this.isFull()) {
        if (!this.waitFull) {
          this.waitFull = new DeferredPromise();
        }
        const exit = await this.waitFull.promise;
        if (exit) return;
      }
      this.queue.push(data);
      if (this.waitEmpty) {
        this.waitEmpty.resolve();
        this.waitEmpty = null;
      }
    } catch (err) {
      this.close(err);
    }
  }

  /**
   * We do not wish to exchange any more data. Close the queue
   */
  close(error) {
    if (error) throw new PromiseQueueError(error.message);
    if (this.waitEmpty) this.waitEmpty.resolve(true);
    if (this.waitFull) this.waitFull.resolve(true);
  }

  /**
   * Reads data
   * @returns Promise<{ data: any }>
   */
  async read() {
    try {
      while (this.isEmpty()) {
        if (!this.waitEmpty) {
          this.waitEmpty = new DeferredPromise();
        }
        const exit = await this.waitEmpty.promise;
        if (exit) return;
      }
      if (this.waitFull) {
        this.waitFull.resolve();
        this.waitFull = null;
      }
      return { data: this.queue.shift() };
    } catch (err) {
      return this.close(err);
    }
  }
}

module.exports = PromiseQueue;
