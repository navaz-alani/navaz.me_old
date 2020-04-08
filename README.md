# Source Code for `navaz.me`

<img src="frontend/public/favicon.png" height=150/>

This repository contains source code for my personal website currently
hosted [here](https://navaz.me).

The site's backend is written in Golang and the frontend is implemented using
React and NextJS.

## Deployment Instructions

### Reverse Proxy Configuration 

Nginx is used as the reverse proxy and the corresponding configuration is located
in the project root, as well as a Bash script to install the configuration to the
`/etc/nginx/conf.d` directory (intended for Linux servers). To install the 
configuration to the server, first make the script executable with
`chmod +x nginxConfInstaller.sh` and then run `sudo ./nginxConfInstaller.sh <domain>` 
to install the configuration for the given domain name. Then, run `sudo nginx -t` to
test that the configurations present are valid. If so, reload the Nginx service with
`sudo systemctl reload nginx` or `sudo service nginx reload`.

### Instantiate Application Services

The site has been split into three components whose deployments are managed
using Docker. The service configuration can be found in the `docker-compose.yml`
file in the project root. Simply running `docker-compose up -d` in the project
root will start up the core (Golang backend), database (MongoDB) and frontend
services as daemons.

### Firewall

Ensure that the firewall is configured to allow connections to ports 80 and 443.
If not, add the corresponding rules and reload the firewall service.

### Security

This is a good point to ensure that a DNS entry for the domain specified when
installing the Nginx configuration exists, and has propagated to DNS servers
around the world. This usually takes a few hours from when the entry was added.
To check if the entry has propagated, try `curl <domain>` on a machine other than
the server hosting the site to check. If this `curl` command outputs something like
`curl: (6) Could not resolve host: <domain>`, wait for propagation.
Once the DNS entry has properly propagated, run `sudo certbot` and configure SSL
for the site's domain. Ensure that regular `http` connections are redirected to
`https`. This will modify the installed Nginx configuration with SSL parameters and
add the `https` redirect.

At this point, the site should be up and running! The `docker-compose.yml` file can
be edited to scale the services to handle greater loads.
