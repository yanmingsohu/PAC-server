# PAC server

Proxy Auto-Configuration (PAC) file server.

Because the loading results of pac are not visible on all platforms, you cannot know exactly whether the script is written correctly. The server can run the pac script online, and test whether the url parsing result of the script meets your expectations.

This is not a proxy server, this is the profile server of the proxy server.

(PAC file)[https://developer.mozilla.org/en-US/docs/Web/HTTP/Proxy_servers_and_tunneling/Proxy_Auto-Configuration_PAC_file]


# start

Put pac file to `pacfile` folder.

`npm start`

Open `http://localhost:9877`


# TODO

Complete implementation of PAC context function