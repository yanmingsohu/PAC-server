var passurl = [];

// "SOCKS5 127.0.0.1:9150"; "SOCKS5 10.0.0.4:9150";
var tor_proxy = "SOCKS5 10.0.0.4:9250";


function FindProxyForURL(url, host) {
  return tor_proxy;
} 
