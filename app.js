'use strict';

const dotenv = require('dotenv');
dotenv.config({path:`${process.cwd()}/config.env`});//is recipe! not concept these two lines now gives eyes to our rest of code to see what's present in config.env file.😎🙏

const express = require('express');
const app = express();
const authRouter = require('./route/authRoute');
const allexamstableModel = require('./db/models/allexamstablemodel');
const {callProcedure, callProcedtesting11} = require('./sqlscripts/dbpool');

app.use(express.json());//must come before👇this line
app.use(express.urlencoded({extended: true}));// these two LOC is used againt the bodyparser code that we used to install. Now that's inbuilt in express.js and this the way you get it. 

app.get('/', (request, response) => {
    response.status(200).json({
    status: '200',
    //requestedAt: request.requestTime,
    message: 'restAPI is working'
    });
});

//this is the area where all the routes will be placed.
app.use('/api/v1/auth',authRouter);

app.get('/api/v1/100allexamstable', async (request, response) => {	
    try {
        // to Fetch only 100 records from the allexamstable table
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

app.get('/api/v1/10000allexamstable', async (request, response) => {	
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

// path to call first callProcedure function
app.get('/api/v1/callProcedureFunction', async (request, response) => {	
    try {
        // to Fetch only 100 records from the allexamstable table
        const records= await callProcedure('proceduretesting1',['allexamstable']);
        response.status(200).json({
            status: '200',
            message: 'procedure executed successfully',
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
app.get('/api/v1/callProcedtesting11Function', async (request, response) => {	
    try {
        // to Fetch only 100 records from the allexamstable table
         await callProcedure('procedtesting11',['allexamstable']);
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





app.use('*',(request, response, next) =>{
response.status(404).json({
    status:'fail',
    message: `route not found. we Don't have resource that you are looking for.`
});
});


const port=process.env.PORT || 3000;//Take A Good Look
app.listen( 3000, ()=>{
 console.log(" ---SERVER for allexamstable_backend IS LISTENING--- ",port)});

//Code Testing  (async () => {
//     try {
//       await db.sequelize.authenticate
//       console.log('Connection to database established successfully.');
//     } catch (error) {
//       console.error('Unable to connect to database:', error);
//     }
//   })();
  
