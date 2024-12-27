const { Transform } = require('stream');
const { getRecordsByFiltersDataStream } = require('../sqlscripts/queryToStreamDataFromDB');
const processCancellationManager = require('./../controller/processCancellationManager');
const {pool, RequestTracker, QueryManager, comprehensiveRequestMiddleware} = require('../backendMiddlewares/processId_tracking_closing');

const streamRecordsMiddleware = async (req, res) => {
  console.log('Stream request received');// Code Testing
  
  const clientId = req.headers['x-client-id'];
  const processCancellationToken = req.processCancellationToken;

  const streamProcess = processCancellationManager.createCancellableProcess(
    async (processToken, cancellationCheck) => {
      console.log('Starting stream process');//Code Testing
      
      const client = await pool.connect();
      
      try {
        QueryManager.trackQuery(clientId, client);

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // console.log(`streamRecordsMiddleware line:21  ${req.body}, ${client}`);// Code Testing
        
        // const dataStream = await getRecordsByFiltersDataStream(req.body, client);Bug found ConceptNote: dataStream is an object. It has stream, cleanup function in it. we can't use this object directly. We have to destructure it to call .pipe function.
        const {stream, cleanup} = await getRecordsByFiltersDataStream(req.body, client);
        console.log('Stream created');//Code Testing
        
        
        const transform = new Transform({
          objectMode: true,
          transform(chunk, _, callback) {
            // console.log('Processing chunk:', chunk);//Code Testing
            
            if (RequestTracker.shouldCancelRequest(req.path, clientId)) {
              callback(new Error('Request cancelled'));
              return;
            }
            callback(null, `data: ${JSON.stringify(chunk)}\n\n`);
          }
        });

        // dataStream//wrong. we can't use this object itself
        stream
          .pipe(transform)
          .pipe(res)
          .on('error', (error) => {
            console.error('Stream error:', error);
            QueryManager.cancelQuery(clientId);
            res.status(500).end();
          })
          .on('end', () => {
            console.log('Stream ended');// Code Testing
            res.end();
          });

          //Adding debug log for empty results
          let hasData = false;
          stream.on('data', () => {
            hasData = true;
          });// For Code Testing only
          stream.on('end', () => {
            if (!hasData) {
              console.log('Streaming completed with no more data found');
            }
          });//for Code Testing only

        req.on('close', () => {
          console.log('Request closed');//Code Testing
          dataStream.destroy();
          QueryManager.cancelQuery(clientId);
        });

      } finally {
        QueryManager.removeQuery(clientId);
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