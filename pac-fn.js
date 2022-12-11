module.exports = {
  isPlainHostName,
  dnsDomainIs,
  localHostOrDomainIs,
  isResolvable,
  isInNet,
  dnsResolve,
  convert_addr,
  myIpAddress,
  dnsDomainLevels,
  shExpMatch,
  weekdayRange,
  dateRange,
  timeRange,
  alert,
};


function isPlainHostName(host) {
  return host.split('.') > 1;
}


function dnsDomainIs(host, domain) {
  return host.indexOf(domain) > 0;
}


function localHostOrDomainIs(host, hostdom) {
  throw new Error("unsupport");
}


function isResolvable(host) {
  return true;
}


function isInNet(host, pattern, mask) {
  return true;
}


function dnsResolve(host) {
  return true;
}


function convert_addr(ipaddr) {
  throw new Error('unsupport');
}


function myIpAddress() {
  return "127.0.0.1"
}


function dnsDomainLevels(host) {
  throw new Error('unsupport');
}


function shExpMatch(str, shexp) {
  throw new Error('unsupport');
}


function weekdayRange(wd1, wd2, gmt) {
  throw new Error('unsupport');
}


function dateRange() {
  throw new Error('unsupport');
}


function timeRange(/*<hour1>, <min1>, <sec1>, <hour2>, <min2>, <sec2>, [gmt]*/) {
  throw new Error('unsupport');
}


function alert(message) {
  console.log("alert()", message);
}