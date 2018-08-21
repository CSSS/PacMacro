# CSSS PacMacro

![Captain America PSA](captain_pacmacro_psa.jpg)  
  
This game was built on Ubuntu 16.04 due to a dependency that exists on an old websockets library.

## Commands you need to go through first to before trying to build the game
```shell
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
libwebsockets-test-server
sudo apt-get install -y node
sudo apt-get install -y nodejs
sudo apt-get upgrade nodejs
wget https://nodejs.org/dist/v10.9.0/node-v10.9.0-linux-x64.tar.xz
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
npm install -g pm2
sudo apt-get install -y npm
```

## Commands to Built the Program
```shell
enter commands here
```

## Potential library needed after program is built

```shell
sudo apt-get install -y libwebsockets-dev
```

## Links that could be useful  
 - https://github.com/creationix/nvm#install-script
 - https://askubuntu.com/questions/849270/how-can-i-install-a-tar-xz-file-from-nodejs-org
 - https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04
 - https://nodejs.org/en/download/current/
 - https://github.com/warmcat/libwebsockets/tree/v1.22-chrome26-firefox18
 - https://jansson.readthedocs.io/en/2.11/gettingstarted.html#compiling-and-installing-jansson