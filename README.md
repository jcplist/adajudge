# ADA Judge https://ada-judge.csie.ntu.edu.tw

# Original Project
https://github.com/bobogei81123/adajudge  
https://github.com/tzupengwang/adajudge

# Installation
```
# install nvm
# https://github.com/creationix/nvm

# install node
nvm install v10.10.0

# install mongodb
sudo apt update
sudo apt install mongodb

# install gulp and forever
# npm update; npm audit fix;
npm install -g gulp forever

# Install package. It would take a while. Use default configuration is fine when being prompted.
npm install

# Install needed packages
sudo apt install libseccomp-dev libseccomp2 seccomp libcap-dev asciidoc gcc g++ make python numactl
# Install python2 setuptools for git upload hook (git submission only)

# Init
gulp init
# Semantic auto install is bugged
# So choose extend my settings > automatic manually when prompted

# Build semantic again...
(cd semantic; gulp build)
# Copy (or symbolic link) ./semantic/dist to dist/static/semantic
# cp -r semantic/dist dist/static/
# use RELATIVE PATH instead of realpath:
ln -s ../../semantic/dist dist/static/semantic

# IMPORTANT! MUST DO:
# Create src/server/config.js
# example: config.example.js
# SHOULD check the number of numa pool and edit the config
# maximum number of numaPool: view by `numactl --hardware` command (type: Array<{cpu:${id},mem:${id}}>. The array length MUST NOT greater than the number of numa nodes, the ids of the nodes can also be found from the command output.)
# maxWorkers: the maximum number of total workers
# maxNodeWorkers: unknown
# You can copy most attributes from previous year

# Build
# be sure that the default checker `src/server/cfiles/default_checker.cpp` can be compiled successfully 
gulp build
cp src/server/scripts/*.sh dist/scripts/; cp src/server/scripts/*.py dist/scripts/;

# Build and copy isolate (and make sure `dist/judger/isolate` exists and has setuid and execute permission (rwsr-sr-x))
gulp isolate # and enter sudo password, sometimes it fails to prompt for password, you may need to run the below commands manually (or perhaps run 'sudo echo hi' beforehand)
# After running the above command, check if dist/judger/isolate exist, otherwise do the follows
# sudo rm -f isolate/isolate; sudo rm -f dist/judger/isolate;
# (cd isolate; make isolate)
# cp ./isolate/isolate dist/judger/
# sudo chown root:root dist/judger/isolate
# sudo chmod +s dist/judger/isolate
# sudo chmod a+x dist/judger/isolate

# Unzip fonts.tar.gz in dist/static
tar xvf fonts.tar.gz -C dist/static/

# Link MathJax
ln -s ../../node_modules/mathjax/ dist/static/MathJax

# Edit isolate config
sudo mkdir /usr/local/etc
sudo cp isolate.conf /usr/local/etc/isolate
# Modify isolate sandbox permission if they exist
sudo chown -R root:root /dev/shm/isolate
sudo chmod 755 /dev/shm/isolate
sudo chmod 755 /dev/shm/isolate/META

# Run server on port 3333
./start.sh

# `forever list` to view process status
# `node dist/scripts/add_admin.js` to add an admin account
# source codes change: `gulp build; forever restartall;`
# semantic change: `(cd semantic; gulp build); forever restartall;`

# install apache2 server or nginx server and redirect connection to port 80 to http://localhost:3333/ and start the server
# install pymongo from pip3
# many judge_name, domain_name, email_address, ... need to be changed

# to stop the judge
# forever list
# forever stop [id]
```

# Misc

## Nginx config
file `/etc/nginx/sites-enabled/ada-judge`
```
server {
  server_name ada-judge.csie.ntu.edu.tw ada-judge.csie.org;

        client_max_body_size 800M;

        location / {
                proxy_pass http://127.0.0.1:9999/;
        }
        location ^~ /static/ {
                root   /home/ada/adajudge2023/dist/;
        }
        location ^~ /semantic/ {
                root   /home/ada/adajudge2023/dist/static/;
        }
        location ^~ /favicon.ico {
                root   /home/ada/adajudge2023/dist/static/;
        }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/ada-judge.csie.ntu.edu.tw/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/ada-judge.csie.ntu.edu.tw/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}



server {
    if ($host = ada-judge.csie.org) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = ada-judge.csie.ntu.edu.tw) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    server_name ada-judge.csie.ntu.edu.tw ada-judge.csie.org;


    listen 80;
    return 404; # managed by Certbot
}
```

## override semantic css
file `semantic/src/site/collections/table.overrides`
```
/*******************************
         Site Overrides
*******************************/

.ui.definition.table tr td.definition, .ui.definition.table > tbody > tr > td:first-child:not(.ignored), .ui.definition.table > tfoot > tr > td:first-child:not(.ignored), .ui.definition.table > tr > td:first-child:not(.ignored) {
    background: rgba(0, 0, 0, .03);
    font-weight: 700;
    color: rgba(255, 255, 255, 1);
    text-transform: '';
    -webkit-box-shadow: '';
    box-shadow: '';
    text-align: '';
    font-size: 1em;
    padding-left: '';
    padding-right: ''
}
```

## Title color

DSA: teal
ADA: olive

In file `src/client/js/components/root/menu.pug`, the menu-font color:
DSA: #6dffff
ADA: #b5cc18

If the website did not change after rebuild, delete the node_modules directory and reinstall and rebuild everything again.  
Also, check if website caches are cleared.

# Issue
Kindly submit any issue you found on github.  
TODO: fix addUsersByHand.js or use add_user.js
