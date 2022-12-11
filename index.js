const pac = require("./pac.js");
const proxy = require("./proxy.js")


pac.createServer(9877);

proxy.proxyTCP("Tor 转发", {
  bind: ["0.0.0.0", 9250],
  server: ['127.0.0.1', 9150]
});


process.on('uncaughtException', (err, origin) => {
  console.log(
    `Caught exception: ${err.stack}\n` +
    `Exception origin: ${origin}`
  );
});

