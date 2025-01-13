const dotenv = require('dotenv');
dotenv.config({path:`${process.cwd()}/config.env`});//is recipe! not concept these two lines now gives eyes to our rest of code to see what's present in config.env file.😎🙏

const { Transform } = require('stream');
const { getRecordsByFiltersDataStream, buildWhereClause } = require('../sqlscripts/queryToStreamDataFromDB');
const processCancellationManager = require('./../controller/processCancellationManager');
const {pool, RequestTracker, QueryManager, comprehensiveRequestMiddleware} = require('../backendMiddlewares/processId_tracking_closing');

//Note without destructuing the streamingObject named streamObj
const streamRecordsMiddleware = async (req, res) => {
  console.log('Stream request received');// Code Testing
  
  const clientId = req.headers['x-client-id'];
  const processCancellationToken = req.processCancellationToken;

  const streamProcess = processCancellationManager.createCancellableProcess(
    async (processToken, cancellationCheck) => {
      console.log('Starting stream process');//Code Testing
      
      const client = await pool.connect();
      let streamObj;// newly added1/1/2025
      let recordCount = 0;// newly added 3/1/25
      
      try {
        QueryManager.trackQuery(clientId, client);

        //Get the where clause for both count and stream
        const whereClause = buildWhereClause(req.body.filters || req.body);

        //Get total count first
        const countQuery = {
          text: `SELECT COUNT(*) as total FROM allexamstable ${whereClause.text ? `WHERE ${whereClause.text}`:''}`,
          values: whereClause.values
        };

        const countResult = await client.query(countQuery);
        const totalCount = parseInt(countResult.rows[0].total, 10);

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Total-Count', totalCount.toString());

        // console.log(`streamRecordsMiddleware line:21  ${req.body}, ${client}`);// Code Testing
        
        // const dataStream = await getRecordsByFiltersDataStream(req.body, client);Bug found ConceptNote: dataStream is an object. It has stream, cleanup function in it. we can't use this object directly. We have to destructure it to call .pipe function.
        // const {stream, cleanup} = await getRecordsByFiltersDataStream(req.body, client);
         streamObj = await getRecordsByFiltersDataStream(req.body.filters || req.body, client);//newly added1/1/2025
        console.log('Stream created');//Code Testing
        
        
        const transform = new Transform({
          objectMode: true,
          highWaterMark: 100,//process.env.streaming_buffersize_limit,//100,
          transform(chunk, _, callback) {
            // console.log('Processing chunk:', chunk);//Code Testing
            
            if (RequestTracker.shouldCancelRequest(req.path, clientId)) {
              callback(new Error('Request cancelled'));
              return;
            };

            //Sending each record with its unique identifier
            const record = {
              ...chunk,
              _id: `${chunk.REGID}|${chunk.ROLL}`
            };
            recordCount++;
            callback(null, `data: ${JSON.stringify(record)}\n\n`);
          }
        });

 
        await new Promise((resolve, reject) => {	
          streamObj.stream.pipe(transform)
                          .pipe(res)
                          .on('error', reject)
                          .on('finish', resolve);
        	});

      } finally {
        QueryManager.removeQuery(clientId);
        if (streamObj && streamObj.cleanup) {
          await streamObj.cleanup();
        }
        client.release();
      }
    }
  );

  try {
    await streamProcess(processCancellationToken);
  } catch (error) {
    if (error.code === '57014') {
      res.status(499).json({ error: 'Query cancelled' });
    } else {
      console.error('Error streaming records:', error);
      res.status(500).json({ error: 'Failed to stream records' });
    }
  }
};
module.exports = {streamRecordsMiddleware};