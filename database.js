
import sqlite3 from "sqlite3"
//var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db =  new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE volcano (
            id INTEGER PRIMARY KEY,
            name text, 
            location text, 
            history text, 
            active text
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO volcano (id, name, location, history, active) VALUES (?,?,?,?)'
                db.run(insert, [3,"Himl Island","hi of barren island", "Active"])
                db.run(insert, [4,"D plateu","deccan  Hill in india", "Not Active"])
            }
        });  
    }
});

export {db};