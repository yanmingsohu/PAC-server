var useproxy = [
  "facebook", 'google.com', 'fbcdn.net', 'instagram.com', 'youtube.com', 'ggpht.com', 'ytimg.com', 'googlevideo.com',
  'hinge.co', 'tinyurl.com', 'strandfabrik.eu.org', 'google.lv', 'youporn.com', 'phncdn.com', 'ypncdn.com',
  'google.de', 'tumblr.com', 'jsfiddle.net', 'fiddle.jshell.net', 'twitter.com', 'reddit.com', 'redditstatic.com',
  'news.tut.by', 'wikipedia.org', 'torproject.org', 'duckduckgo.com', 'porn', 'xvideos.com', 'cloudfront.net',
  'githubusercontent.com', 'brb.duolingo.com', 'gotinder.com', 't.me', 'telegram.org', 'steamcommunity.com',
  'imgur.com', 'sstatic.net',
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
  return "DIRECT; "+ tor_proxy; 
} 
