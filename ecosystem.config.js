module.exports = {
    apps: [{
      name: "app",
      script: "./app.js",
      watch: true,
      node_args: "--max-old-space-size=16384",
      env_development: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      output: './out.log',
      error: './error.log',
      log_date_format: "HH:mm Z",
      combine_logs: true,
    }]
  };
