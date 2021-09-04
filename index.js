const http = require("http");
const fs = require("fs");
const url = require('url');
const path = require("path");
const vm = require("vm");
const pacfn = require("./pac-fn.js");
const querystring = require ('querystring');
const port = 9877;

const serviceMap = {
  listfile,
  getfile,
  testfile,
  savefile,
};


process.on('uncaughtException', (err, origin) => {
  console.log(
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}`
  );
});


const ps = http.createServer((req, res) => {
  console.log(new Date(), req.method, req.url, req.headers['user-agent']);

  let rawUrl = url.parse(req.url, true);
  let serviceName = rawUrl.pathname;

  if (serviceName == '/') {
    serviceName = '/listfile';
  }

  let spname = serviceName.split('/');
  let sf = serviceMap[spname[1]];

  if (sf) {
    req.query = rawUrl.query;
    return sf(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end();
    return;
  }
});


ps.listen(port, '0.0.0.0', () => {
  console.log("Pac server on", port);
});


function wrapStream(out) {
  let _push = (...p)=>{
    for (let i=0; i<p.length; ++i) {
      out.write(p[i]);
    }
    return _push;
  };

  _push.end = function(x) {
    out.end(x);
  };
  return _push;
}


function listfile(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  let p = wrapStream(res);
  let dirs = fs.readdirSync(__dirname +'/pacfile');
  dirs.forEach(f=>{
    p('<li><a href="getfile?file=', f, '">', f, '</a> <a href="testfile?file=', f, '&url=facebook.com">[Test]</a></li>');
  });
  p.end();
}


function getfile(req, res) {
  let f = path.join(__dirname, 'pacfile', path.normalize(req.query.file));

  let ret = testPac(f);
  if (ret.err) {
    res.writeHead(500);
    res.end(ret.err.stack);
    console.error(ret.err);
  } else {
    res.writeHead(200, { 'Content-Type': 'application/x-ns-proxy-autoconfig' });
    fs.createReadStream(f).pipe(res);
  }
}


function readAllText(reader) {
  return new Promise((ok, fail)=>{
    let buf = [];
    reader.on('error', e=>fail(e));
    reader.on("data", d=>buf.push(d));
    reader.on('end', ()=>{
      console.log('en')
      if (!reader.complete) {
        fail(new Error("The connection was terminated while the message was still being sent"));
      } else {
        ok(Buffer.concat(buf).toString("utf8"));
      }
    });
  });
}


function savefile(req, res) {
  readAllText(req).then(txt=>{
    let q = querystring.parse(txt);
    let file = path.join(__dirname, 'pacfile', path.normalize(q.file));
    let code = q.code;

    fs.writeFileSync(file, code);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<div>ok, '+ file +"</div> <a href='javascript:history.back()'>return</a>");
  }).catch(err=>{
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(err.stack);
  });
}


function testfile(req, res) {
  let p = wrapStream(res);
  let file = req.query.file;
  let qurl = req.query.url;
  if (!file) {
    return p("<div> need file parameter").end();
  }
  if (!qurl) {
    return p("<div> need url parameter").end();
  }

  let f = path.join(__dirname, 'pacfile', path.normalize(file));
  let ret = testPac(f);
  let parsedurl = url.parse(qurl);
  let host;

  if (parsedurl.protocol) {
    host = parsedurl.hostname;
  } else {
    host = qurl;
    qurl = 'http://'+ qurl;;
  }

  if (ret.err) {
    responsePage("error", ret.code, ret.err);
    return;
  }
    
  try {
    let what = ret.ctx.FindProxyForURL(qurl, host);
    responsePage(what, ret.code);

  } catch(err) {
    responsePage('error', ret.code, err);
  }

  function responsePage(what, code, err) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    p('<form>');
    p('<div>Url: <input name="url" style="width: 200px" value="', qurl, '"/> <input type="submit" value="Test"/> ');
    p('<input name="file" type="hidden" value="', file, '"/>');
    p('<div>Host: ', host, "</div>");
    p('<div>Proxy: ', what, "</div>");
    p('</form>');

    p('<p>Code:</p>');
    p('<form action="savefile" method="post">');
    p('<input name="file" type="hidden" value="', file, '"/>');
    p('<textarea name="code" style="width: 80%; height: 50%">', code, "</textarea><br/>");
    p('<input type="submit" value="Save"/>')
    p('<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Proxy_servers_and_tunneling/Proxy_Auto-Configuration_PAC_file">PAC api doc</a>');
    p('</form>');

    if (err) {
      p('<pre style="color: red;">', err.stack, "</pre>");
      console.error(err);
    }
    p.end();
  }
}


function testPac(filepath) {
  let err, code, ctx;
  try {
    code = fs.readFileSync(filepath);
    ctx = vm.createContext(pacfn);
    vm.runInContext(code, ctx, {filename: filepath});
  } catch(e) {
    err = e;
  }
  return { ctx, code, err };
}