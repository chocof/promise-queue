/**
 * A quick and easy way to generate a deferred promise
 * which can be resolved from a different part of the code
 */
class DeferredPromise {
  constructor() {
    this.rejected = false;
    this.fullfiled = false;
    this.pending = true;
    const self = this;
    this.promise = new Promise((resolve, reject) => {
      self.rejectfn = reject;
      self.resolvefn = resolve;
    });
  }

  resolve(data) {
    this.resolvefn(data);
    this.fullfiled = true;
    this.pending = false;
  }

  reject(error) {
    this.rejectfn(error);
    this.rejected = true;
    this.pending = false;
  }
}

module.exports = DeferredPromise;
