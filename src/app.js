'use strict';

var express = require('express'),
	request = require('request'),
	  posts = require('./mock/posts.json');

var postsLists = Object.keys(posts).map(function(value) {
							         return posts[value]})

var app = express();

app.use('/static', express.static(__dirname + '/public'))

app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');

var dotapost = [];
request('https://www.reddit.com/r/dota2.json', function(err, resp, body) {
 body = JSON.parse(body);
 
 var resarray = []; 
 for(let i = 3; i < 25; i++)
 {
	 var childdata = body.data.children[i].data;
	 if(childdata.selftext != "")
	 {
		var childobj = {};
		childobj.title = childdata.title;
		childobj.description = childdata.selftext;
		resarray.push(childobj);
	 }
 }
 dotapost = resarray;
});


app.get('/', function(req, res){
	var path = req.path;
	res.locals.path = path;
	// COULD USE
	// res.render('index', {path:path});
	res.render('index');
});



app.get('/blog/:title?', function(req, res){ 
	var title = req.params.title;
	if (title === undefined) {
		res.status(503);
		//res.render('blog', {posts: postsLists})
		res.render('blog', {posts: dotapost});
	} else if (title == 'dota'){		
		res.status(503);
		res.render('blog', {posts: dotapost});
	}else {
		var post = posts[title] || {};
		res.render('post', { post: post});
	}
});

app.listen(3000, function() {
	console.log("The frontend server is running on port 3000!");
});
