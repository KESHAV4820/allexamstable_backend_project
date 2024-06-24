'use strict';

/*
1. in this folder, first we setup the server in app.
2. it's here that we add Routes / (path) on the CRUD functions of node.js to the server variable named app in this file. 
3. we also add the middleware functions to the server variable named app in this file.
4. we can name a path anything. It just that when our browser that is frontend, on the some evenlistening sends this value to the server in the addressbar, our server get's a clue to send what kind of content. 
5. But it's better to have a structured naming system. Becouse the system that we make has to scalable and maintainable by anyone in comming years. hence there has to be a logic behind performing 
6. never forget to use try catch within these backend functions, becouse they use asyn, and hence uses promise. And in these case, automatic throw of error fails. Hence you need to do it explicitly. 
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

app.use(express.json());//must come before👇this line
app.use(express.urlencoded({extended: true}));// these two LOC is used againt the bodyparser code that we used to install. Now that's inbuilt in express.js and this the way you get it. 
app.use(cors({origin:[
    'http://127.0.0.1:5500',
    'https://mirrorverse--sscradhe.netlify.app'//Temporary Code
    ]}));// if we don't give parameter, it becomes a general instruction which is good like a shotgun . But if you want security and yet cross sharing you need to be specific like sniper. hence you give exact origin value that has to be allowed. 
app.options('*', cors());

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
        // to Fetch only 100 records from the allexamstable table
         await downloadQueryFunction('split_downloadqueryfunction2',['allexamstable']);
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




//Note: this is for anything else you give in the path that hasn't been declared. So this will fire. 
app.use('*',(request, response, next) =>{
response.status(404).json({
    status:'fail',
    message: `route not found. we Don't have resource that you are looking for.`
});
});


const port=process.env.PORT || 3000;//Take A Good Look
app.listen( 3000, ()=>{
 console.log(" ---SERVER for allexamstable_backend IS LISTENING--- ",port)});
  
