#! /bin/bash

pre_config_file=nginx.conf
tmp=/tmp/navaz.me
tmp_conf=$tmp/$pre_config_file
nginx_conf=/etc/nginx/conf.d/navaz.me.conf

if [[ -z $1 ]]; then
  echo "navaz.me: [error] hosting domiain not specified";
  exit 1;
elif [[ -z $pre_config_file ]]; then
  echo "navaz.me: [error] nginx pre-config file not set";
  exit 1
elif [[ ! -f $pre_config_file ]]; then
  echo "navaz.me: [error] nginx pre-config file not found";
  exit 1;
fi

# Set hosting domain, create nginx configuration
mkdir $tmp;
sed "s/SITE_DOMAIN/$1/" $pre_config_file > $tmp_conf;
# Copy nginx configuration over
cp "$tmp_conf"  $nginx_conf;
# Clean up tmp
rm -rf $tmp;
