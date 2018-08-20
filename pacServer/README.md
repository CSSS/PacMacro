# Server setup

## Dependencies
Run `npm install` in this directory and the package.json file will take care of everything.

## Setting up the environment
* Choose a password needed to access the control panel and run: 
`export PASSWORD='password'`
Where password is your chosen password.

* By default the server will use `port: 80`. If you want to use another port, do so by running the following: 
`export PORT=port`
Where port is your chosen port.

## Running the server
Run: `pm2 start server.js`

Done.
