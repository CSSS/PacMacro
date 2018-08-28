# CSSS PacMacro

![Captain America PSA](captain_pacmacro_psa.jpg)  
  
## Table of Contents
 - [Necessary Commands before building the game](#commands-you-need-to-go-through-first-to-before-trying-to-build-the-game)
 - [Commands to Build the Program](#commands-to-built-the-program)
 - [Potential Library to add after Program built](#potential-library-needed-after-program-is-built)
 - [Potentially Useful Link](#links-that-could-be-useful)
 - [Links to Version 2](https://github.com/pacmacro)  
   - [Server-Code](https://github.com/pacmacro/pm-server)
   - [Android App Repo](https://github.com/pacmacro/pm-android)
   - [iOS App Repo](https://github.com/pacmacro/pm-iOS)
   - [PacMacro Specification](https://github.com/pacmacro/pm-specification)


This game was built on Ubuntu 16.04 due to a dependency that exists on an old websockets library.

## Commands you need to go through first to before trying to build the game
```shell
apt-get update

#setting up the necessary libraries for PacMacro
apt-get install -y git gcc g++ make cmake zlib1g-dev libssl-dev automake libtool
wget http://www.digip.org/jansson/releases/jansson-2.11.tar.bz2
bunzip2 -c jansson-2.11.tar.bz2 | tar xf -
cd jansson-2.11
./configure
make
make check
make install
cd ~/
wget https://github.com/warmcat/libwebsockets/archive/v1.22-chrome26-firefox18.tar.gz
tar -xzf v1.22-chrome26-firefox18.tar.gz
cd libwebsockets-1.22-chrome26-firefox18/
./autogen.sh
./configure
make
make install
/sbin/ldconfig -v
#libwebsockets-test-server

#installing nodejs and npm
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
apt-get install -y nodejs
npm install -g pm2

#allowing PacMacro user to log in with pubkeys
chown pacmacro:pacmacro -R  /home/pacmacro
chmod 700 /home/pacmacro/.ssh
chmod 0600 /home/pacmacro/.ssh/authorized_keys

#following adapted from http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#allow-pm2-to-bind-applications-on-ports-80-443-without-root
echo 'alias pm2="authbind --deep pm2"' >> /home/pacmacro/.bashrc
apt-get install authbind
touch /etc/authbind/byport/80
chown pacmacro /etc/authbind/byport/80
chmod 755 /etc/authbind/byport/80
```

## Commands to Built the Program
```shell
enter commands here
```

## Links that could be useful  
 - https://github.com/creationix/nvm#install-script
 - https://askubuntu.com/questions/849270/how-can-i-install-a-tar-xz-file-from-nodejs-org
 - https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04
 - https://nodejs.org/en/download/current/
 - https://github.com/warmcat/libwebsockets/tree/v1.22-chrome26-firefox18
 - https://jansson.readthedocs.io/en/2.11/gettingstarted.html#compiling-and-installing-jansson