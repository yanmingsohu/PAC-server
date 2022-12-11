const net = require('net');
const {log, error, counter} = require("./comm.js");
const tcp_counter = counter();


module.exports = {
  proxyTCP,
  proxyUDP,
};


setInterval(() => {
  process.stdout.write(tcp_counter.info() + '\r');
}, 1000);


function proxyTCP(key, conf) {
  let [bind, server] = [conf.bind, conf.server];

  let tcpServer = net.createServer((c) => {
      log(`[${key}] - TCP Client connect ${c.remoteAddress}:${c.remotePort}`);

      let client = net.connect({ port: server[1], host: server[0] }, () => {
          c.pipe(client);
          tcp_counter.bindUp(client);
      });
      client.on('error', (err) => {
          error(`[${key}] - ${err}`);
          c.destroy();
      });
      c.on('error', (err) => {
          error(`[${key}] -  ${err}`);
          client.destroy();
      });

      c.once('close', ()=>{
        client.destroy();
        c.destroy();
      });
      client.once('close', ()=>{
        c.destroy();
        client.destroy();
      });
      
      client.pipe(c);
      tcp_counter.bindDown(c);
  });

  tcpServer.listen({ host: bind[0], port: bind[1], }, () => {
      log(`[${key}] - TCP Server start ${bind[0]}:${bind[1]}`);
  });
  return tcpServer;
}


function proxyUDP(key, conf) {
  let [bind, server] = [conf.bind, conf.server];
  const serverUDP = dgram.createSocket('udp4');

  serverUDP.on('error', (err) => {
      error(`[${key}] - ${err}`);
  });

  serverUDP.on('message', (msg, rinfo) => {
      log(`[${key}] - UDP Client connect ${rinfo.address}:${rinfo.port} `);
      let client = dgram.createSocket('udp4');
      client.on('error', (err) => {
          error(`[${key}] - ${err}`);
          client.close();
      });
      client.on('message', (fbMsg, fbRinfo) => {
          serverUDP.send(fbMsg, rinfo.port, rinfo.address, (err) => {
              if (err) error(`[${key}] - ${err}`);
          });
          client.close();
      });
      client.send(msg, server[1], server[0], (err) => {
          if (err) {
              error(`[${key}] - ${err}`);
              client.close();
          }
      });
  });

  serverUDP.bind(bind[1], bind[0], () => {
      log(`[${key}] - UDP Server start ${bind[0]}:${bind[1]}`);
  });
  return serverUDP;
}