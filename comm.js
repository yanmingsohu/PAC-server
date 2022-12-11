const stream = require("stream");

module.exports = {
  log,
  error,
  counter,
}


function log(...p) {
  console.log(new Date().toLocaleString(), '-', ...p);
}


function error(...p) {
  console.error(new Date().toLocaleString(), '!', ...p);
}


function counter() {
  const stime = Date.now();
  const SP = "                ";
  let conn = 0;
  let up = 0;
  let down = 0;
  let lup = 0;
  let ldown = 0;
  let ltime = Date.now();

  function bindDown(r) {
    ++conn;
    let srcw = r.write;
    r.on('close', ()=>{
      conn--;
    });
    r.write = function(c, e, b) {
      down += c.length;
      srcw.call(r, c, e, b);
    };
  }

  function bindUp(r) {
    ++conn;
    let srcw = r.write;
    r.on('close', ()=>{
      conn--;
    });
    r.write = function(c, e, b) {
      up += c.length;
      srcw.call(r, c, e, b);
    };
  }

  function info() {
    let t = Date.now();
    let upr = (up - lup) / (t - ltime) * 1000;
    let downr = (down - ldown) / (t - ltime) * 1000;

    lup = up;
    ldown = down;
    ltime = t;
    return ["Conn:", conn, ", UP:", byteUnit(up), ' ', byteUnit(upr), "/s, DN:", 
      byteUnit(down), ' ', byteUnit(downr), "/s, T:", timeUnit(t - stime), SP].join("");
  }

  return {
    bindDown,
    bindUp,
    info,
  };
}


function byteUnit(x) {
  if (x < 1024) {
    return x.toFixed(2)+"B";
  }
  if (x < 1024*1024) {
    return (x/1024).toFixed(2) +"KB";
  }
  if (x < 1024*1024*1024) {
    return (x/1024/1024).toFixed(2) +"MB";
  }
  if (x < 1024*1024*1024*1024) {
    return (x/1024/1024/1024).toFixed(2) +"GB";
  }
  return (x/1024/1024/1024/1024).toFixed(2) +"TB";
}


function timeUnit(x) {
  if (x < 1000) {
    return x+"ms";
  }
  if (x < 1000*60) {
    return (x/1000).toFixed(2) +'s';
  }
  if (x < 1000*60*60) {
    return (x/1000/60).toFixed(2) +'m';
  }
  if (x < 1000*60*60*60) {
    return (x/1000/60/60).toFixed(2) +'h';
  }
  return (x/1000/60/60/24).toFixed(2) +'d';
}