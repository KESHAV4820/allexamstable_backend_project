'use strict';

//👇🏼this is to increase the heap size of node.js
// const v8 = require('v8');
// v8.setFlagsFromString('--max_old_space_size=16384');Usless Coding it failed to work

/*SuperVIENoteRemember It: nodemon will crash saying node ran out of heap memory. to avoid such case, you need to run you backend without using nodemon using the command 
👉🏼VIE "node --max-old-space-size=16384 app.js". Becouse, nodemon isn't using the allocated heap size assigned to node environment variables using the code in cmd👈🏼⚡⚡
LearnByHeartJust Beautiful⚡⚡you can also use ➡️node --prof --max-old-space-size=16384 app.js this will create the log file which starts with 'isolate-' <filename> ends with '-v8.log', use the command to covert the file into text to see the log of which function is eating more memory ➡️node --prof-process isolate-<filenamelikesomelongnumber>-v8.log > processed_or_anynameyoulike.txt⚡⚡
👉🏼 setx NODE_OPTIONS --max-old-space-size=12288 and then to check if the assignment has been done, restart your system and then go to cmd and enter 
👉🏼 echo %NODE_OPTIONS%
👉🏼VIE➡️ even this command can also be used "nodemon --exec 'node --max-old-space-size=16384' app.js". using this, the nodemon runs the app without crashing.👈🏼⚡⚡ 

⚡➡️Super👉🏼 we are using new process manager for hosting server named "pm2". Actually, this is the mostly used tool in the industry and it has very rich tools into it which nodemon can't even match. But, Ofcourse, this has a bit of learning curve. Not very big curve, but just a bit of learning curve. So following are the commands that needs to be use to run the same app with pm2 process manager. 👉🏼⚡VIEfirst write this in package.json in script for "start:dev":"pm2 start app.js --node-args=\"--max-old-space-size=16384\" --watch --no-daemon", 
    ⚡➡️ to start server using pm2:- pm2 start app.js
    ⚡➡️ to stop the server in pm2:- pm2 stop app
    ⚡➡️ to see the logs in pm2:- pm2 logs
    ⚡➡️ to view list of process running:- pm2 list
    ⚡➡️ to monitor your application: pm2 monit
    Remember you don't need these command

just to remember this script from package.js becouse i can't comment in .json file hence i am writting it in here.😊. It's meant to remember what was there before switching from "nodemon" to "pm2".
"scripts": {
    "start:dev": "NODE_ENV=development nodemon --max-old-space-size=16384 app.js",
    "start:prod": "NODE_ENV=production nodemon --max-old-space-size=16384 app.js"
  }, and this has been replaced by pm2 commands in script. and nodemon isn't using "ecosystem.config.js". This file has been introduced when we were switching to pm2 from nodemon. becouse i wanted to use standered way to run the program instead of special commands like i mentioned above. after this file, now i can use➡️ npm run start:dev, or➡️ npm run start:prod. or ➡️npm run stop to stop the server all together. Note➡️ ctrl+c will stop just the current process going on in the pm2. not the whole server. 
*/

/* SuperNote
1. in this folder, first we setup the server in app.
2. it's here that we add Routes / (path) on the CRUD functions of node.js to the server variable named app in this file. 
3. we also add the middleware functions to the server variable named app in this file.
4. we can name a path anything. It just that when our browser that is frontend, on the some evenlistening sends this value to the server in the addressbar, our server get's a clue to send what kind of content. 
5. But it's better to have a structured naming system. Becouse the system that we make has to scalable and maintainable by anyone in comming years. hence there has to be a logic behind performing 
6. never forget to use try catch within these backend functions, becouse they use asyn, and hence uses promise. And in these case, automatic throw of error fails. Hence you need to do it explicitly. 
7.Remember It I didn't knew where to write this important thing. Hence i am writing it here. When database is very big, like crores of data. Your querying will be very slow. Hence, you will need to optimise your database. process of optimization has many steps in it. i am writing them as you will need to do starting from first, being the first step to optimise your database and so on. 1️⃣"partition" the database(on the fields that can break the table into major chunks) 👉2️⃣"indexing" the database(single filed and multiple field basis as well. index those fields with less number of null value in them) 👉3️⃣"enable parallel querying process"(that is you will set the number of "workers" doing query from the database; simultaneously; for your query. The number of workers that your computer can afford exactly depends on the number of cores in your computer. At max, you can you number of worker= number of cores in your sytem - 1) 👉4️⃣"create materialised view" of queries that you deem important or most used ones or the most time taking ones. 👉5️⃣Keep "Refreshing the materialised view" so that if any change has been made in database, it get recorded by materialised view as well 👉6️⃣to keep materialised view update automatically, we need to "SCHEDULE the Refreshing of materialised view" 👉7️⃣to avoid stale data in materialised view, you need "Real-time Refreshing" of materialised view as well.

8. Remember It: How to create database dump and how to import it. 
👉1️⃣ nagivate to the bin folder of the postgresql program files in the C drive. 
👉2️⃣ to dump an entire database: pg_dump -U username -d databasename > "C:\Program Files\PostgreSQL\[version]\bin\dumpfile.sql"
here username in ourcase was postgres and name of database was sscdatabase. 
e.g:- pg_dump -U postgres -d sscdatabase > "C:\Program Files\PostgreSQL\15\bin\allexamstable_partitioned.sql"
👉2️⃣to dump a table of a database: pg_dump -U postgres -d sscdatabase -t allexamstable_partitioned > "C:\Program Files\PostgreSQL\15\bin\allexamstable_partitionedtesting.sql"
👉3️⃣ in each case, after entering this command you will be prompted to enter the password of the database and mindyou, while entering the password of the database, you won't see the keystrokes. It's for security reasons.
👉4️⃣why you create database dump of a database and sometime only for the table. Becouse sometimes, we just have a table that is small and we don't need to optimise it. So no partitioning or indexing. that table is standalone thing and hence, we need only one thing which is that table. But if you table is huge, contains 50 to 60 millions of records/rows and you need to optimise it to speedup the query. So you will need to partition and index the table. that will create additional separate table and indexes from the big table and the whole partitioned table and the big table is a connected system. So you no more has one table that you need to dump. Hence, you will need to dump the whole database like sscdatabase in our case.
👉5️⃣ the database dump so created will have .sql extension, may look like notepad icon file
 
9.Remember It: steps to import the database dump into another system. 
 👉1️⃣ first, navigate to the bin folder of postgres in the terminal or cmd using cd command. like: cd "C:\Program Files\PostgreSQL\15\bin" 
 👉2️⃣then create the database possibly named the same as in the previous system using the command "createdb -U username databasename".  like this: "createdb -U postgres sscdatabase". you will need to enter the password of the database according to the password set in the new system when postgres was installed. 
 👉3️⃣ then import the database with command: psql -U username -d databasename -f "C:\path\to\your\dumpfile.sql" which in ourcase looks like: psql -U postgres -d sscdatabase -f "C:\Users\YourUsername\Desktop\allexamstable_partitioned.sql"
 4️⃣ then you will need to change the password for the postgres database access previously mentioned in you program config or .env file in the backend section or frontend if needed.
*/

const dotenv = require('dotenv');
dotenv.config({path:`${process.cwd()}/config.env`});//is recipe! not concept these two lines now gives eyes to our rest of code to see what's present in config.env file.😎🙏

const express = require('express');
const cors = require('cors');// this will avoid CORS error. that is differnt ports talking to each other are considered different origin and hence not allowed generally.
const app = express();
const authRouter = require('./route/authRoute');
const allexamstableModel = require('./db/models/allexamstablemodel');
const {callProcedure, callProcedtesting11, callStoredFunction, callRecordViewFunction, downloadQueryFunction} = require('./sqlscripts/dbpool');
const { getRecordsByFilters, getRecordsCountByFilters, downloadRecord } = require('./sqlscripts/queryBuilder');
const {citycodeDataprocessor, getModelData, modelCitycodeDataprocessor} = require('./dataprocesser/citycodeDataprocessor');
const {calculateAllStats} = require('./dataprocesser/statsCalculator');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const os = require('os');
const { Pool } = require('pg');
const { timeStamp } = require('console');
//newly added 04/12/2024
const pool = new Pool({
  // the connection configuration
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

app.use(express.json());//must come before👇this line
app.use(express.urlencoded({extended: true}));// these two LOC is used againt the bodyparser code that we used to install. Now that's inbuilt in express.js and this the way you get it. 
app.use(cors({origin:[
    'http://127.0.0.1:5500',
    'https://mirrorverse--sscradhe.netlify.app',
    'https://sscradhe.netlify.app'//Temporary Code
    ]}));// if we don't give parameter, it becomes a general instruction which is good like a shotgun . But if you want security and yet cross sharing you need to be specific like sniper. hence you give exact origin value that has to be allowed. 
app.options('*', cors());


// newly added 5/12/2024
// here we are creating a mechanism to keep track of requests being made from frontend to backend
const RequestTracker = {
  activeRequests: new Map(),

  // Now tracking the requests coming for each endpoint
  trackRequest(endpoint, clientId){
    const previousRequest = this.activeRequests.get(endpoint);

    //If there was a previous request, mark it for cancellation using 'shouldCancel' flag.
    if (previousRequest) {
      previousRequest.shouldCancel = true;
    };

    // For tracking the new request,
    this.activeRequests.set(endpoint, {
      clientId,
      shouldCancel: false,
      timeStamp: Date.now()
    });
  },

  //Place where actually the cancellation of the request is decided
  shouldCancelRequest(endpoint, currentClientId){
    const trackedRequest = this.activeRequests.get(endpoint);
    return  trackedRequest && trackedRequest.clientId !== currentClientId && trackedRequest.shouldCancel;
  },

  //to Clear old requests to prevent memory Leaks. It's optional and should be suppressed becouse it uses active wait to clean the memory. we don't need it. It's intention was to avoid any memory leakages. But my project architecture is such that from request is being sent from frontend to backend, the request are ultralight weight. Not even a KB in size.
/*  
  cleanupOldRequests(){
    const now= Date.now();
    for(const [endpoint, request] of this.activeRequests.entries()){
      //Removing requests older than 5 minutes. We can use any other condition as well
      if (now - request.timeStamp > 5*60*1000) {
        this.activeRequests.delete(endpoint);
      } 
    }
  },
*/
};
//newly added 5/12/2024
//Middleware to track requests
const requestTrackerMiddleware =(req, res, next) => {	
  const endpoint = req.path;// Here we are puting the path name of the API endpoint which is making the call. 
  const clientId = req.headers['x-client-id'];// here we are passing the client id that has been passed from the frontend in the request header

  //Saying the program to track the new request
  RequestTracker.trackRequest(endpoint, clientId);

  // Optional: periodically clean up old requests
  // RequestTracker.cleanupOldRequests();

  next();
	};
//newly added 4/12/2024
const QueryManager = {
  activeQueries:  new Map(),

  //here we shall track queries
  trackQuery(clientId, pgClient, queryContext){
    this.activeQueries.set(clientId, {
      pgClient,
      queryContext,
      startTime: Date.now()
    });
  },

  //VIE canceling a specific query
  async cancelQuery(clientId) {
    const queryEntry=this.activeQueries.get(clientId);
    if(queryEntry && queryEntry.pgClient){
      try {
        // promptly cancel the query using PostgreSQL's command pg_cancel_backend
        await queryEntry.pgClient.query(`SELECT pg_cancel_backend(pg_backend_pid())`);
        console.log(`Query for client ${clientId} cancelled`);//Code Testing
        
      } catch (error) {
        console.log('Query already completed or could not be cancelled', error);
      } finally{
        this.removeQuery(clientId);
      };
    };
  },
  //remove a completed or cancelled query
  removeQuery(clientId){
    this.activeQueries.delete(clientId);
  },
};
//newly added 5/12/2024
app.use(requestTrackerMiddleware);// Here we finally applied our middleware

app.get('/', (request, response) => {
    response.status(200).json({
    status: '200',
    //requestedAt: request.requestTime,
    message: 'restAPI is working'
    });
});

//this is the area where all the routes will be placed.
app.use('/api/v1/auth',authRouter);

//SuperConceptVIERemember It:
app.get('/api/v1/100allexamstable', async (request, response) => {	// for Code Testing
    try {
        // to Fetch only 100 records from the allexamstable table Marvel
        /*Note that there is no 'id' field declared. it's default field that postgres adds to you database. But we suppressed it's default behaviour in allexamstablemodel.js */
        const records = await allexamstableModel.findAll({attributes: ['EXAMNAME','REGID','ROLL','NAME','FATHERNAME','MOTHERNAME', 'DOB','GENDER','CAT1','CAT2','CAT3','WRTN1_APP','WRTN1_QLY','WRTN2_APP','WRTN2_QLY','WRTN3_APP','WRTN3_QLY','INTVW_APP','SKILL_APP','SKILL_QLY','PET_APP','PET_QLY','DME_APP','DME_QLY',    'RME_APP','RME_QLY','SELECTED','MARKS',      'ALLOC_POST','ALLOC_STAT','ALLOC_AREA', 'ALLOC_CAT','RANK','WITHHELD'],limit:100});
        response.status(200).json({
            status: '200',
            message: 'allexamstable table records fetched successfully',
            data: records,
        });
    }catch(error){
        console.error('Error fetching data from allexamstable:', error)
        response.status(500).json({
            status: '500',
            message: 'Internal Server Error',
        });
	}
});
app.get('/api/v1/10000allexamstable', async (request, response) => {	// for Code Testing 
    try {
        // to Fetch only 100 records from the allexamstable table
        const records = await allexamstableModel.findAll({attributes: ['EXAMNAME','REGID','ROLL','NAME','FATHERNAME','MOTHERNAME', 'DOB','GENDER','CAT1','CAT2','CAT3','WRTN1_APP','WRTN1_QLY','WRTN2_APP','WRTN2_QLY','WRTN3_APP','WRTN3_QLY','INTVW_APP','SKILL_APP','SKILL_QLY','PET_APP','PET_QLY','DME_APP','DME_QLY',    'RME_APP','RME_QLY','SELECTED','MARKS',      'ALLOC_POST','ALLOC_STAT','ALLOC_AREA', 'ALLOC_CAT','RANK','WITHHELD'],limit:10000});
        response.status(200).json({
            status: '200',
            message: 'allexamstable table records fetched successfully',
            data: records,
        });
    }catch(error){
        console.error('Error fetching data from allexamstable:', error)
        response.status(500).json({
            status: '500',
            message: 'Internal Server Error',
        });
	}
});// this is route for Code Testing

//Super path to call first callProcedure function
app.get('/api/v1/viewQuery', async (request, response) => {	
    try {
        // to Fetch only 100 records from the allexamstable table
        const records= await callStoredFunction('viewQueryFunction1',['allexamstable']);
        response.status(200).json({
            status: '200',
            message: 'function executed successfully',
            data: records,
        });
    }catch(error){
        console.error('Error fetching data from allexamstable:', error);
        response.status(500).json({
            status: '500',
            message: 'Internal Server Error',
        });
	}
});
app.get('/api/v1/viewNumberOfRecords', async (request, response) => {	
    try {
        // to Fetch only 100 records from the allexamstable table
        const records= await callRecordViewFunction('viewrecords1',['allexamstable']);
        response.status(200).json({
            status: '200',
            message: 'function executed successfully',
            data: records,
        });
    }catch(error){
        console.error('Error fetching data from allexamstable:', error);
        response.status(500).json({
            status: '500',
            message: 'Internal Server Error',
        });
	}
});
// path to call second callProcedure function
app.get('/api/v1/downloadQuery1', async (request, response) => {
    try {
      const filePaths = await downloadQueryFunction('split_downloadqueryfunctionsscdatabase1', ['allexamstable']);
      
      // Create a zip file
      const zipFilename = `download_${Date.now()}.zip`;
      const zipFilePath = path.join(process.env.DB_File_DownloadedAt, zipFilename);
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', { zlib: { level: 9 } });
  
      output.on('close', () => {
        console.log('Archive created successfully');
        
        // Send the zip file
        response.download(zipFilePath, zipFilename, (err) => {
          if (err) {
            console.error('Error sending file:', err);
            response.status(500).send('Error sending file');
          }
          
          // Clean up: delete the zip file and original CSV files
          fs.unlinkSync(zipFilePath);
          filePaths.forEach(filePath => fs.unlinkSync(filePath));
        });
      });
  
      archive.on('error', (err) => {
        throw err;
      });
  
      archive.pipe(output);
  
      // Add CSV files to the zip
      filePaths.forEach(filePath => {
        archive.file(filePath, { name: path.basename(filePath) });
      });
  
      archive.finalize();
  
    } catch (error) {
      console.error('Error fetching data from allexamstable:', error);
      response.status(500).json({
        status: '500',
        message: 'Failed to download successfully.🥴',
      });
    }
  });
/*legacy code👇code upgrade👆
app.get('/api/v1/downloadQuery1', async (request, response) => {	
    try {
        // to Fetch only 100 records from the allexamstable table
         await downloadQueryFunction('split_downloadqueryfunctionsscdatabase',['allexamstable']);
        response.status(200).json({
            status: '200',
            message: `Download successful. check folder ${process.env.DB_File_DownloadedAt}`,
        });
    }catch(error){
        console.error('Error fetching data from allexamstable:', error);
        response.status(500).json({
            status: '500',
            message: 'Failed to download successfully.🥴',
        });
	}
});
*/


//---------------------REAL USE STARTS FROM HERE---------------------
// Super: from here on, i am using Sequelize and node.js itself to do the query and get the output from the database based on the filter that we have made in node.js for sequelize. Note: we are choosing to receive the parameters for the filter from "request body" not the "request query". Becouse request body is better suited to deal with complex filters and large amount of data to be handled. 
app.post('/api/v1/records', async (req, res) => {
    try {
      const filters = req.body;// i am not using request query like "req.query.EXAMNAME". It's useful for straigh forward, less complex shit.
      const limit = req.query.limit || 1000;
      const offset=req.query.offset || 0;
      const records = await getRecordsByFilters(filters,limit,offset);
      res.status(200).json(records);
    } catch (error) {
      console.error('Error fetching records:', error);
      res.status(500).json({ 
        error: 'Failed to fetch records',
        status:'500',
        message: 'Failed to fetch.'
        });
    }
  });
app.post('/api/v1/downloadrecords', async (req, res) => {
    try {
      const filters = req.body;
      const limit = req.query.limit || 20000;
      const offset=req.query.offset || 0; 
      console.log(filters);//Code Testing

      const zipFilePath=await downloadRecord(filters,limit,offset);
      res.download(zipFilePath, 'downloaded_data.zip', (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).send('Error sending file');
        }
        // Delete the temporary zip file after sending
        fs.unlinkSync(zipFilePath);
      });
    } catch (error) {
      console.error('Error Downloading records:', error);
      res.status(500).json({ 
        error: 'Failed to download the records',
        status: '500',
        message: 'Failed to Download.'
      });
    };
     /* legacy code👇code in progress👆
      const recordsDownloaded = await downloadRecord(filters,limit,offset);
      res.status(200).json(recordsDownloaded);
    } catch (error) {
      console.error('Error Downloading records:', error);
      res.status(500).json({ 
        error: 'Failed to download the records',
        status:'500',
        message: 'Failed to Download.'
        });
    }
    */
  });
app.post('/api/v1/recordcount', async (req, res) => {
    try {
      const filters = req.body;
      //const limit = req.query.limit || 1000;
      //const offset=req.query.offset || 0; 
      const totalRecordCount = await getRecordsCountByFilters(filters);
      res.status(200).json(totalRecordCount);
    } catch (error) {
      console.error('Error fetching records:', error);
      res.status(500).json({ error: 'Failed to fetch records' });
    }
  });

/*forced stop Reason: working on another API endpoint with client facility
app.post('/api/v1/summarytablestats', async (req, res) => {
    try {
        const filters = req.body;
        const limit = req.query.limit || 1000;
        const offset=req.query.offset || 0;
        const stats = await calculateAllStats(filters, limit, offset);
        console.log(filters);
        
        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching the Stats for the summary table:', error);
        res.status(500).json({ error: 'Failed to fetch the summary table records' });
    };
});
*/
//code in progress newly added 4/12/2024
app.post('/api/v1/summarytablestats', async (req, res) => {

  const clientId= req.headers['x-client-id'];// this data will come from the frontend🫡

  //Set up abort handler
  res.on('close', async () => {
    if (!res.writableEnded) {
      await QueryManager.cancelQuery(clientId);
    }
  });

    try {
        const filters = req.body;
        const limit = req.query.limit || 1000;
        const offset=req.query.offset || 0;

        //Get a client from the pool for this specific query
        const client = await pool.connect();
        QueryManager.trackQuery(clientId,client);

        console.log(filters);//Code Testing
        try {
          const stats = await calculateAllStats(filters, limit, offset, client);
          res.status(200).json(stats);
        }finally{
          QueryManager.removeQuery(clientId);
          client.release();
        }
        } catch (error) {
        if (error.code === '57014') {//VIE'57014' is postgres query cancellation error code
          res.status(499).json({error: 'Query cancelled'});
        } else {
          console.error('Error fetching the Stats from the summary Table:', error);
          res.status(500).json({error: 'Failed to fetch the summary table records'});
        }  
        }
});

/*forced stop Reason: working on another API endpoint that has clientId facility in it. 
app.post('/api/v1/venuerecords', async (req, res) => {
    try {
        const filters = req.body;
        const limit = req.query.limit || 1000;
        const offset = req.query.offset || 0;
        
        //to get the model data
        const examName = filters.EXAMNAME;
        const modelData = await getModelData(examName, limit, offset);
        // console.log(modelData);// Code Testing
        const modelStats = modelCitycodeDataprocessor(modelData);
        console.log(modelStats);// Code Testing
        
        
        
        // Process the records to get counts of the student based on user conditions
        const records = await getRecordsByFilters(filters, limit, offset);
        const processedData = citycodeDataprocessor(records, modelStats);
        
        res.status(200).json({
            records: processedData,
            //statistics: processedData//SuperConcept in this parameter we send any other data that we may have calculated using the main records that we have fetched from the data base. like some kind of percentage of students being SC or ST. In this parameter we send those parameters like {totalSCPercent,averageAgeSc,}, where totalSCPercent or averageAgeSc is are variables that holds the calculated data from the records fetched.
        });
    } catch (error) {
        console.error('Error fetching Venue Records:', error);
      res.status(500).json({
        error: 'Failed to fetch the venue records',
        status:'500',
        message: 'Failed to fetch.'
        });
    }
});
*/
//code in progress newly added 4/12/2024
app.post('/api/v1/venuerecords', async (req, res) => {
  const clientId = req.headers['x-client-id'];
  const endpoint =req.path;

    try {
        // Checking if this request need to cancel the previous one which was running before it. That is, you need to cancel if something is already running out there. 
        if (RequestTracker.shouldCancelRequest(endpoint, clientId)) {
          await QueryManager.cancelQuery(clientId);
        };

        const filters = req.body;
        const limit = req.query.limit || 1000;
        const offset = req.query.offset || 0;

        // getting a client from the pool for this specific query
        const pgClient = await pool.connect();
        console.log(pgClient);//Code Testing
        
        
        try {
        QueryManager.trackQuery(clientId, pgClient,{
          endpoint:'/api/v1/venuerecords',
          filters: req.body
        });
        
        //to get the model data
        const examName = filters.EXAMNAME;
        const modelData = await getModelData(examName, limit, offset, pgClient);
        // console.log(modelData);// Code Testing
        const modelStats = modelCitycodeDataprocessor(modelData);
        console.log(modelStats);// Code Testing
        
        
        
        // Process the records to get counts of the student based on user conditions
        const records = await getRecordsByFilters(filters, limit, offset, pgClient);
        const processedData = citycodeDataprocessor(records, modelStats);
        
        res.status(200).json({
            records: processedData,
            //statistics: processedData//SuperConcept in this parameter we send any other data that we may have calculated using the main records that we have fetched from the data base. like some kind of percentage of students being SC or ST. In this parameter we send those parameters like {totalSCPercent,averageAgeSc,}, where totalSCPercent or averageAgeSc is are variables that holds the calculated data from the records fetched.
        });
      }finally{
        QueryManager.removeQuery(clientId);
        pgClient.release();
      }
    } catch (error) {
        if (error.code === '57014'){
          res.status(499).json({error: 'Query cancelled'});
        } else {
          console.error('Error fetching Venue Records:', error);
          res.status(500).json({
            error: 'Failed to fetch the venue records',
            status:'500',
            message: 'Failed to fetch.'
          });
        }
    }
});


//Note: this is for anything else you give in the path that hasn't been declared. So this will fire. 
app.use('*',(request, response, next) =>{
response.status(404).json({
    status:'fail',
    message: `route not found. we Don't have resource that you are looking for.`
});
});


const port=process.env.PORT || 3000;//Take A Good Look
app.listen( port, ()=>{
 console.log(" ---SERVER: allexamstable_backend : LISTENING--- PORT NUMBER: ",port)});
  
//SuperNoteLearnByHeart: if some program is already using the port value in the "port" or 3000(as written above), you can either change the port number in .env file or use these👇🏼 commands in cmd to kill the process running at this port and then your server will work.  👉🏼 netstat -ano | findstr :3000 this will the process ID running at that port number. YOu need this process id to excute kill commmand to free the port. 👉🏼 taskkill /PID <PID> /F this will kill the process running on let's say port number 3000. Don't forget to write /F, it means that you are forceing to stop the process, else it will not terminate on it's free will. 👉🏼 tasklist /FI "PID eq <PID>" this command will help you know more about the process running with that porcess ID, so that you know more the process you are about to kill or general investigation. 
