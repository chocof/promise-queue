# PromiseQueue

PromiseQueue allows you to write data into a queue and then read them from any other asynchronous callback. Write and read functions are blocking. 

## Usage
To generate a PromiseQueue instance simply provide its size `const pp = new PromiseQueue(size)` if size
is not supplied then the queues' write operation will never block.


In order to use the module you just have to be accustomed to its two main functions:
* `pp.write(data: any)`: Write data on one end of the queue. This operation will block if the queue is full (the number of itams is equal to the size of the queue).
* `pp.read()`: Read data from the other end of the the queue. If the queue is empty the function will  block. Returns objects from the queue in the form `{ data: any }`. If the queue is closed it returns `null`.

To close the queue call `pp.close()`. An example usage is provided bellow:
```javascript
const PromiseQueue = require('../src');

const pp = new PromiseQueue(2);

setTimeout(async () => {
  await pp.write(1)
}, 100);
setTimeout(async () => {
  await pp.write(2)
}, 200);
setTimeout(async () => {
  await pp.write(3)
}, 300);
setTimeout(async () => {
  await pp.write(4)
}, 400);
setTimeout(() => {
  pp.close()
}, 500);

let result;
(async () => {
  while (result  = await pp.read()) {
    console.log("RECEIVED", result.data);
  }
  console.log("FINI");
  // will print 1, 2, 3, 4, FINI
}) ()
```

If you provide a size then `.write()` functions will be blocked until there is some 
free space.
```javascript
const PromiseQueue = require('../src');

const pp = new PromiseQueue(1);
setTimeout(async () => {
  console.log(await pp.read())
}, 100);
setTimeout(async () => {
  console.log(await pp.read())
}, 200);
setTimeout(async () => {
  console.log(await pp.read())
}, 1000);
setTimeout(async () => {
  console.log(await pp.read())
}, 2000);
setTimeout(() => {
  pp.close()
}, 3000);

let result;
(async () => {
  console.log("WRITTING",1)
  await pp.write(1)
  console.log("WRITTING",2)
  console.log("Will have to wait until 1 is consumed to continue")
  await pp.write(2)
  console.log("WRITTING",3)
  console.log("Will have to wait until 2 is consumed to continue")
  await pp.write(3)
  console.log("WRITTING",4)
  console.log("Will have to wait until 3 is consumed to continue")
  await pp.write(4)

  console.log("FINI");
}) ()
```