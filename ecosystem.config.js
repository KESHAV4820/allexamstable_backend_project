module.exports = {
    apps: [{
      name: "app",// sets the name that pm2 will recognise with.
      script: "./app.js",// tells the file that has the server and API endpoints in it.
      watch: true,//tells PM2 to monitor the files in the project and automatically restart the app when ▶️CHANGES◀️ are detected.
      restart_delay: 8000,// this is in the milli seconds. It the time after which server will restart if it has crashed.
      max_restarts: 3, // tells the number of Attempt to restart the app before pm2 gives up
      node_args: "--max-old-space-size=10240",//increases the heap space to be used to avoid heapspace limitation.
      env_development: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      output: './out.log',// tells to show the output in the backend server terminal interface
      error: './error.log',// tells also to show the log when there is error
      log_date_format: "HH:mm Z",// tells to show the time of execution of instruction
      combine_logs: true,// tells to merge the above logs
    }]
  };

  /*SuperNoteVIE: This code below has to be replaced in the package.json if you want to use the pm2 process manager. and command to start the server is 👉🏼npm run start:dev and to stop the server it is 👉🏼npm run stop.
  "scripts": {
   "start:dev": "pm2 start ecosystem.config.js --env development --no-daemon",
  "start:prod": "pm2 start ecosystem.config.js --env production --no-daemon",
        "stop": "pm2 stop ecosystem.config.js"
  },

  Take A Good Look that config file for nodemon.json is json and i can't write any comment in there, it's not allowed. hence i am also mentioning the code for nodemon in there🧑🏼sorry. Below is the script if you want to use the nodemon for the server. you are going to use 👉🏼npm run start:dev and 👉🏼ctrl+c to stop the server.
  "scripts": {
   "start:dev": "nodemon --config nodemon.json",
  "start:prod": "set NODE_ENV=production && nodemon --config nodemon.json"
  },
  NoteRemember It now it is possible to use this script becouse we made a file nodemon.json that has all it's properties to otherate in it. VIEfor pm2, we made ecosystem.config.js file.

  💡💡actually we can use pm2 for the production🏭 and nodemon for development😎. that is in the script, we can put code like 
  "scripts": {
   "start:dev": "nodemon --config nodemon.json",
  "start:prod": "pm2 start ecosystem.config.js --env production --no-daemon",
        "stop": "pm2 stop ecosystem.config.js"
  },
  */
