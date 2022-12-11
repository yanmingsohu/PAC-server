var useproxy = [
  "facebook", 'google.com', 'fbcdn.net', 'instagram.com', 'youtube.com', 'ggpht.com', 'ytimg.com', 'googlevideo.com',
  'hinge.co', 'tinyurl.com', 'strandfabrik.eu.org', 'google.lv', 'youporn.com', '__phncdn.com', '__ypncdn.com',
  'google.de', 'tumblr.com', 'jsfiddle.net', 'fiddle.jshell.net', 'twitter.com', 'reddit.com', 'redditstatic.com', 'redditmedia.com',
  'news.tut.by', 'wikipedia.org', 'wikimedia.org', 'torproject.org', 'duckduckgo.com', 'xvideos.com', 'cloudfront.net',
  'githubusercontent.com', 'brb.duolingo.com', 't.me', 'telegram.org', 'steamcommunity.com',
  'imgur.com', 'sstatic.net', 'google.at', 'ackcdn.net', 'googleapis.com', 'xnxx.com', 'z-lib.org', 'ok.xyz',
  'googleusercontent.com', 'twimg.com', 'github.com', 'bannedbook.org', 'patreon.com', 'porngameshub.com',
  'porngame.cc', 'theporndude.com',
];
// 'images-ssl.gotinder.com', 'porn', 

var passurl = [];

// "SOCKS5 127.0.0.1:9150"; "SOCKS5 10.0.0.4:9150";
var tor_proxy = "SOCKS5 10.0.0.3:9250";


function FindProxyForURL(url, host) {
  if (host.indexOf('.onion') >= 0) {
    return tor_proxy;
  }

  if (!isResolvable(host)) {
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
