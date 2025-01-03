const { Transform } = require('stream');
const { getRecordsByFiltersDataStream } = require('../sqlscripts/queryToStreamDataFromDB');
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
      let recordCount = 0;
      
      try {
        QueryManager.trackQuery(clientId, client);

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // console.log(`streamRecordsMiddleware line:21  ${req.body}, ${client}`);// Code Testing
        
        // const dataStream = await getRecordsByFiltersDataStream(req.body, client);Bug found ConceptNote: dataStream is an object. It has stream, cleanup function in it. we can't use this object directly. We have to destructure it to call .pipe function.
        // const {stream, cleanup} = await getRecordsByFiltersDataStream(req.body, client);
        const streamObj = await getRecordsByFiltersDataStream(req.body.filters || req.body, client);//newly added1/1/2025
        console.log('Stream created');//Code Testing
        
        //Geting total count before streaming
        const countResult = await client.query('SELECT COUNT(*) as total FROM allexamstable WHERE '+ streamObj.query.text.split('WHERE')[1].split('ORDER BY')[0]);
        const totalCount = parseInt(countResult.rows[0].total, 10);
        res.setHeader('X-Total-Count', totalCount.toString());
        
        const transform = new Transform({
          objectMode: true,
          highWaterMark: 50,// Match batch size
          transform(chunk, _, callback) {
            // console.log('Processing chunk:', chunk);//Code Testing
            
            if (RequestTracker.shouldCancelRequest(req.path, clientId)) {
              callback(new Error('Request cancelled'));
              return;
            }

            recordCount++;
            const data = `data: ${JSON.stringify(chunk)}\n\n`;
            callback(null, data);
          }
        });

        await new Promise((resolve, reject) => {	
          streamObj.stream.pipe(transform)
                          .pipe(res)
                          .on('error', reject)
                          .on('finish', resolve);
        	});
        // streamObj.stream//newly added
        //   .pipe(transform)
        //   .pipe(res)
        //   .on('error', (error) => {
        //     console.error('Stream error:', error);
        //     QueryManager.cancelQuery(clientId);
        //     res.status(500).end();
        //   })
        //   .on('end', () => {
        //     console.log('Stream ended');// Code Testing
        //     res.end();
        //   });

        //   //Adding debug log for empty results
        //   let hasData = false;
        //   streamObj.stream.on('data', () => {//newly added
        //     hasData = true;
        //   });// For Code Testing only
        //   streamObj.stream.on('end', () => {//newly added
        //     if (!hasData) {
        //       console.log('Streaming completed with no more data found');
        //     }
        //   });//for Code Testing only

        // req.on('close', () => {
        //   console.log('Request closed');//Code Testing
        //   // dataStream.destroy();//Issue Foundfrom where did dataStream variable came!! it's no more in use at the first place. we destructured this object in the first place.
        //   if(streamObj && streamObj.stream){//newly added
        //   streamObj.stream.destroy();//Issue Resolved
        //   };
        //   QueryManager.cancelQuery(clientId);
        // });

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
//
/* Note with destructured streaming object
const streamRecordsMiddleware = async (req, res) => {
  console.log('Stream request received');
  
  const clientId = req.headers['x-client-id'];
  const processCancellationToken = req.processCancellationToken;

  const streamProcess = processCancellationManager.createCancellableProcess(
    async (processToken, cancellationCheck) => {
      console.log('Starting stream process');
      
      const client = await pool.connect();
      
      try {
        QueryManager.trackQuery(clientId, client);

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        // Properly destructure the stream and cleanup
        const { stream, cleanup } = await getRecordsByFiltersDataStream(req.body.filters || req.body, client);
        console.log('Stream created');
        
        const transform = new Transform({
          objectMode: true,
          transform(chunk, _, callback) {
            if (RequestTracker.shouldCancelRequest(req.path, clientId)) {
              callback(new Error('Request cancelled'));
              return;
            }
            callback(null, `data: ${JSON.stringify(chunk)}\n\n`);
          }
        });

        stream
          .pipe(transform)
          .pipe(res)
          .on('error', (error) => {
            console.error('Stream error:', error);
            QueryManager.cancelQuery(clientId);
            res.status(500).end();
          })
          .on('end', () => {
            console.log('Stream ended');
            res.end();
          });

        let hasData = false;
        stream.on('data', () => {
          hasData = true;
        });
        
        stream.on('end', () => {
          if (!hasData) {
            console.log('Streaming completed with no more data found');
          }
        });

        req.on('close', () => {
          console.log('Request closed');
          if (stream) {
            stream.destroy();
          }
          QueryManager.cancelQuery(clientId);
        });

      } finally {
        QueryManager.removeQuery(clientId);
        if (cleanup) {
          await cleanup();
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
*/
module.exports = {streamRecordsMiddleware};