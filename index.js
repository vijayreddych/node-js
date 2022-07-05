import express, { response } from "express";
var app = express();
import fetch from "node-fetch";
import {
	db
}
from "./database.js";
import bodyParser from "body-parser";


app.use(bodyParser.urlencoded({
	extended: false
}));
app.set('view engine', 'ejs');

var urlencodedParser = bodyParser.urlencoded({
	extended: false
});
// Server port
var HTTP_PORT = 8000;
// Start server
app.listen(HTTP_PORT, () => {
	console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});
// Root endpoint
app.get("/", (req, res) => {
	res.render('index');
});

// Insert here other API endpoints
app.get("/api/volcanos", (req, res) => {
	var sql = "select * from volcano";
	var params = [];
	db.all(sql, params, (err, rows) => {
		if (err) {
			res.status(400).json({
				"error": err.message
			});
			return;
		}
		console.log(rows);
		res.json({
			"message": "success",
			"data": rows
		});
	});
});

app.get("/api/volcano/:id", (req, res) => {
	var sql = "select * from volcano where id = ?";
	var params = [req.params.id];
	db.get(sql, params, (err, row) => {
		if (err) {
			res.status(400).json({
				"error": err.message
			});
			return;
		}
		res.json( {
			"message": "success",
			"data": row
		});
	});
});
app.get("/singlevolcanodetails/:id", (req, res) => {
	var sql = "select * from volcano where id = ?";
	var params = [req.params.id];
	db.get(sql, params, (err, row) => {
		if (err) {
			res.status(400).json({
				"error": err.message
			});
			return;
		}
		res.render("volcanoinfo", {
			"message": "success",
			"data": row
		});
	});
});
app.get("/createVolcano", (req, res) => {
	res.render("addvolcano");
});


app.post("/api/volcano/", urlencodedParser, (req, res) => {
	var data = {
		id: req.body.id,
		name: req.body.name,
		location: req.body.location,
		history: req.body.history,
		active: req.body.active
	};
	var sql = 'INSERT INTO volcano (id, name, location, history, active) VALUES (?,?,?,?,?)';
	var params = [data.id, data.name, data.location, data.history, data.active];
	db.run(sql, params, (err, result) => {
		if (err) {
			res.status(400).json({
				"error": err.message
			});
			return;
		}
		res.json({
			"message": "success",
			"data": data
		});
	});
});



app.put("/api/volcano/:id", (req, res) => {
	var data = {
		name: req.body.name,
		location: req.body.location,
		history: req.body.history,
		active: req.body.active,
	};
	db.run(
		`UPDATE volcano set
           name = COALESCE(?,name), 
           location = COALESCE(?,location), 
           history = COALESCE(?,history),
           active = COALESCE(?,active) 
           WHERE id = ?`, [data.name, data.location, data.history, data.active, req.params.id],
		function(err, result) {
			if (err) {
				res.status(400).json({
					"error": res.message
				});
				return;
			}
			res.json({
				message: "success",
				data: result,
				changes: this.changes
			});
		});
});

app.delete("/api/volcano/:id", (req, res, next) => {
    db.run(
        'DELETE FROM volcano WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

app.get("/volcanos", (req, res) => {
	var sql = "select * from volcano";
	var params = [];
	db.all(sql, params, (err, rows) => {
		if (err) {
			res.status(400).json({
				"error": err.message
			});
			return;
		}
		console.log(rows);
		res.render("tablelist", {
			"message": "success",
			"data": rows
		});
	});
});

app.get("/updatevolcanodetails/:id", (req, res) => {
	var sql = "select * from volcano where id = ?";
	var params = [req.params.id];
	db.get(sql, params, (err, row) => {
		if (err) {
			res.status(400).json({
				"error": err.message
			});
			return;
		}
		res.render("updatevolcano", {
			"message": "success",
			"data": row
		});
	});
});



app.get("/updatingvolcanodetails/:id", (req, res) => {
	async function postData(url = '', data = {}) {
		// Default options are marked with *
		const response = await fetch(url, {
		  method: 'PUT', 
		  headers: {
			'Content-Type': 'application/json'
			// 'Content-Type': 'application/x-www-form-urlencoded',
		  },
		 
		  body: JSON.stringify({
            name: req.params.name,
			location: req.params.location,
			history: req.params.history,
			active: req.params.active,
			id: req.params.id
        }) 
		});
		return response.json(); // parses JSON response into native JavaScript objects
	  }
	 const data= JSON.stringify({
		name: req.params.name,
		location: req.params.location,
		history: req.params.history,
		active: req.params.active,
		id: req.params.id
	}) 
	  postData('https://localhost/api/volcano/<%= req.params.id%>', data)
  .then(data => {
    console.log(data); 
  });
});
			
app.get("/deletevolcanodetails/:id",(req,res)=>{
	const responsedata=fetch("http://localhost:8000/api/volcano/:<%=req.params.id%>",{
		method: "DELETE",
	}).then(res => res.json())
	.then((data) =>{ return data;
	});
	const dataAddress = () => {
		data.then((a) => {
		  console.log(a);
		});
	  };
	  dataAddress();
});

// Default response for any other request
app.use(function(req, res) {
	res.status(404);
});