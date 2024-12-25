const { Transform } = require('stream');
const { getRecordsByFiltersDataStream } = require('../sqlscripts/queryToStreamDataFromDB');
const {pool, RequestTracker, QueryManager, comprehensiveRequestMiddleware} = require('../backendMiddlewares/processId_tracking_closing');

const streamRecordsMiddleware = async (req, res) => {
  const clientId = req.headers['x-client-id'];
  const processCancellationToken = req.processCancellationToken;

  const streamProcess = processCancellationManager.createCancellableProcess(
    async (processToken, cancellationCheck) => {
      const client = await pool.connect();
      
      try {
        QueryManager.trackQuery(clientId, client);

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const dataStream = await getRecordsByFiltersDataStream(req.body.filters, client);
        
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

        dataStream
          .pipe(transform)
          .pipe(res)
          .on('error', (error) => {
            console.error('Stream error:', error);
            QueryManager.cancelQuery(clientId);
            res.status(500).end();
          })
          .on('end', () => {
            res.end();
          });

        req.on('close', () => {
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

module.exports = streamRecordsMiddleware;