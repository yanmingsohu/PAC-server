var useproxy = [
  "facebook", 'google.com', 'fbcdn.net', 'instagram.com',
];

var passurl = [];

var tor_proxy = "SOCKS5 127.0.0.1:9050";


function FindProxyForURL(url, host) {
  if (host.indexOf('.onion') >= 0) {
    return tor_proxy;
  }

  if (isPlainHostName(host)) {
    return "DIRECT"; 
  }
    
  for (var i=0; i<useproxy.length; ++i) {
    if (host.indexOf(useproxy[i]) >= 0) {
      return tor_proxy;
    }
  }  
  return "DIRECT"; 
} 
