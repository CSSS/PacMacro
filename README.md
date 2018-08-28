# CSSS PacMacro

![Captain America PSA](captain_pacmacro_psa.jpg)  
  
## Table of Contents
 - [Necessary Commands before building the game](#commands-you-need-to-go-through-first-to-before-trying-to-build-the-game)
   - [1. Installing jansson-2.11](#1-installing-jansson-211)
   - [2. Installing websockets](#2-installing-libwebsockets)
   - [3. Installing some other commands](#3-installing-some-other-commands)
 - [Building and Setting up PacMacro](#building-and-setting-up-pacmacro)
   - [1. Create PacMacro User and allow login via publickeys only](#1-create-pacmacro-user-and-allowing-pacmacro-user-to-log-in-with-pubkeys)
   - [2. Building PacMacro](#2-building-pacmacro)
   - [3. Setting up Nodejs and NPM](#3-setting-up-nodejs-and-npm)
   - [4. Installing pm2 and allowing it to run on port 80/433 without root](#4-installing-pm2-and-allowing-it-to-run-on-port-80433-without-root)
   - [5. Setting up the Environment](#5-setting-up-the-environment)
 - [Running PacMacro](#running-pacmacro)
 - [Links to Version 2](https://github.com/pacmacro)  


This game was built on Ubuntu 16.04 due to a dependency that exists on an old websockets library.

## Commands you need to go through first to before trying to build the game

>Recommend to run `apt-get update` before anything else

### 1. Installing jansson-2.11
>Adapted from [Compiling and Installing Jansson](https://jansson.readthedocs.io/en/2.11/gettingstarted.html#compiling-and-installing-jansson)
```shell
apt-get install -y make gcc
wget http://www.digip.org/jansson/releases/jansson-2.11.tar.bz2
bunzip2 -c jansson-2.11.tar.bz2 | tar xf -
cd jansson-2.11
./configure
make
make check
make install
cd -
```

### 2. Installing libwebsockets

   2.1. commands to install before installing libwebsockets
```shell
apt-get install -y zlib1g-dev libssl-dev automake libtool
```
   2.2. install libwebsockets [instructions can also be found in `README.install` in `libwebsockets-1.22-chrome26-firefox18` folder]
```shell
wget https://github.com/warmcat/libwebsockets/archive/v1.22-chrome26-firefox18.tar.gz
tar -xzf v1.22-chrome26-firefox18.tar.gz
cd libwebsockets-1.22-chrome26-firefox18/
./autogen.sh
./configure
make
make install
cd -
```
   2.3. To test if it was succesful, run `libwebsockets-test-server`. If error arise, run `/sbin/ldconfig -v` to get rid of them

### 3. Installing some other commands
```shell
apt-get install -y git g++ cmake
```

## Building and Setting up PacMacro

### 1. Create PacMacro user and allowing PacMacro user to log in with pubkeys
>Adapted from [this StackOverFlow Answer](https://unix.stackexchange.com/a/210232)
```shell
useradd -m -d /home/pacmacro -s /bin/bash pacmacro
mkdir /home/pacmacro/.ssh
touch /home/pacmacro/.ssh/authorized_keys
chown -R pacmacro:pacmacro  /home/pacmacro
chmod 700 /home/pacmacro/.ssh
chmod 0600 /home/pacmacro/.ssh/authorized_keys
echo 'PubkeyAuthentication yes' >> /etc/ssh/sshd_config
```

### 2. Building PacMacro
```
git clone https://github.com/CSSS/PacMacro.git
cd PacMacro
mkdir build
cd build
cmake ..
make
```

### 3. Setting up Nodejs and NPM
```shell
apt-get update
```
>Adapted from [How To Install Node.js on Ubuntu 16.04: How To Install Using NVM](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04#how-to-install-using-nvm)
```shell
apt-get install -y build-essential libssl-dev
su - pacmacro
curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash -
source .profile
nvm install 10.9.0
exit
```

>Acquired from [Installing Node.js via package manager on Debian and Ubuntu based Linux distributions](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
```shell
#curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
#apt-get install -y nodejs
```

### 4. Installing pm2 and allowing it to run on port 80/433 without root
>Adapted from [Allow PM2 to bind applications on ports 80/443 without root](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#allow-pm2-to-bind-applications-on-ports-80-443-without-root)
```shell
su - pacmacro
npm install -g pm2
echo 'alias pm2="authbind --deep pm2"' >> /home/pacmacro/.bashrc
exit

apt-get install authbind
touch /etc/authbind/byport/80
chown pacmacro /etc/authbind/byport/80
chmod 755 /etc/authbind/byport/80
```
### 5. Setting up the environment
 - Choose a password needed to access the control panel and run: `export PASSWORD='password'` Where password is your chosen password.
 - By default the server will use `port: 80`. If you want to use another port, do so by running the following: `export PORT=port` Where `port` is your chosen port.

## Running PacMacro

1. Running the Server
>Its recommended that you read the basics about [pm2](http://pm2.keymetrics.io/). Home page is enough for basic usage.

```shell
pm2 start server.js
```

2. Running PacMacro
```shell
./pacmacro &
```