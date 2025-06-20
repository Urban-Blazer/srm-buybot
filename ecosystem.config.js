module.exports = {
    apps: [
      {
        name: 'srm-buybot',
        // use your npm “start” script (which runs tsx ./main.ts)
        script: 'npm',
        args: 'run start',
        exec_mode: 'cluster',        // enable cluster mode
        instances: 'max',            // spawn one process per CPU core
        max_memory_restart: '900M',  // restart if it exceeds 200 MB
        env: {
          NODE_ENV: 'production'
        }
      }
    ]
  }
  