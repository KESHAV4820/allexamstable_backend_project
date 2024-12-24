const processCancellationManager = require('../controller/processCancellationManager');
const { Pool } = require('pg');
const pool = new Pool({
  // the connection configuration
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
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

// Enhanced Middleware to integrate all tracking mechanisms
//newly added 9/12/2024
const comprehensiveRequestMiddleware = (req, res, next) => {	
  const endpoint = req.path;
  const clientId = req.headers['x-client-id'];

  // Generate process cancellation token
  req.processCancellationManager = processCancellationManager.generateToken();

  // Track request in RequestTracker
  RequestTracker.trackRequest(endpoint, clientId);

  // Start tracking process
  processCancellationManager.startProcess(req.processCancellationToken, {
    endpoint,
    clientId,
    method: req.method,
  });
  next();
};

module.exports = {pool, RequestTracker, QueryManager, comprehensiveRequestMiddleware};