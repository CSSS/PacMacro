# PacMacro Setup

## Dependencies
* [jansson2.11](http://www.digip.org/jansson/releases/jansson-2.11.tar.gz)
    * Follow the compiling and buliding [instructions](https://jansson.readthedocs.io/en/2.11/gettingstarted.html#compiling-and-installing-jansson)

The following must be installed before installing libwebsockets
`These can be installed via apt-get install`
* zliblg-dev
* libssl-dev
* automake
* libtool

Building and installing libwebsockets can become a pain in the ass real quick. So be patient and practice google-fu.
* [libwebsockets(older version)](https://github.com/warmcat/libwebsockets/releases/tag/v1.22-chrome26-firefox18)
    * Follow instructions in the `README.install` file. The ./configure method is recommended over others

## Building Pacmacro
To build run:
1. mkdir build
2. cd build
3. cmake ..
4. make
   
During the make process if errors about the libwebsockets occur run the following: 
`sudo /sbin/ldconfig -v`

## Server setup
[Server readme](pacServer/README.md)

## Running PacMacro

Run: `./pacmacro &`
This start the app and put it into the background.
