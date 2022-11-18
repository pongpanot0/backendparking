var mysql  = require('mysql2');
var connection = ({
  host:`${process.env.db_host}`,
  user:`${process.env.db_user}`,
  password:`${process.env.db_password}`,
  database:`${process.env.db_database}`,
  port:`${process.env.db_port}`,
})

let db=null;

function handleDisconnect() {
  db = mysql.createPool(connection); // Recreate the connection, since

  db.getConnection(function(err) { // The server is either down
      if (err) { // or restarting (takes a while sometimes).
          console.log('error when connecting to db:', err);
          setTimeout(handleDisconnect, 1000); // We introduce a delay before attempting to reconnect,
      } // to avoid a hot lo1op, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're als1o serving http, display a 503 erro0r.
  db.on('error', function(err) {
      console.log('db error', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
          handleDisconnect(); // lost due to either server restart, or a

      } else if(err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT"){

      console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
      handleDisconnect(); // lost due to either server restart, or a

      } else if(err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"){

        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        handleDisconnect(); // lost due to either server restart, or a

      } else { // connnection idle timeout (the wait_timeout
          throw err; // server variable configures this)
      }
  });
}

setInterval(function () {
  db.query('SELECT 1');
}, 1200);
handleDisconnect(); 


module.exports = db






