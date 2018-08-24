# Server setup

## Dependencies
* nodejs
* npm
* pm2 
    * Installed via npm but use the global flag: --global
  
For everything else run `npm install` in this directory and the package.json file will take care of everything.

## Allow pm2 to run on port 80/433 without root
* Follow this guide including the aliasing step: [Guide](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#allow-pm2-to-bind-applications-on-ports-80-443-without-root)

## Setting up the environment
* Choose a password needed to access the control panel and run: 
`export PASSWORD='password'`
Where password is your chosen password.

* By default the server will use `port: 80`. If you want to use another port, do so by running the following: 
`export PORT=port`
Where port is your chosen port.



## Running the server
**Its recommended that you read the basics about [pm2](http://pm2.keymetrics.io/). Home page is enough for basic usage.**

Run: `pm2 start server.js`