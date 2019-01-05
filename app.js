const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const path = require("path");

//APP CONFIG
var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

//DATABASE CONNECTION
mongoose.connect("mongodb://localhost/myblog", { useMongoClient: true });
mongoose.Promise = global.Promise;

//MONGOOSE MODEL/CONFIG
var blogSchema = new mongoose.Schema({
   title: {type: String, default: "No Title provided"},
   image: {type: String, default: "placeholderimage.jpg"},
   body: String,
   created: {type: Date, default: Date.now}
});

var Blogposts = mongoose.model("Blogposts", blogSchema);

//RESTFUL ROUTES
app.get("/", function(req, res) {
   res.redirect('/blog');
})

//INDEX ROUTE
app.get('/blog', function(req, res) {
   Blogposts.find({}, function(err, blogs) {
      if(err) return console.log(err);
      else {
         res.render('blog', {blogs: blogs});
      }
   });
});
//NEW ROUTE
app.get('/blog/new', function(req, res) {
   res.render("new");
});
//SHOW ROUTE
app.get('/blog/:id', (req, res) => {
   Blogposts.findById(req.params.id, (err, blog) => {
      if(err)
         res.redirect('/blog');
      else
         res.render('show', {blog: blog});
   });
});
//EDIT ROUTE
app.get('/blog/:id/edit', (req, res) => {
   Blogposts.findById(req.params.id, (err, blog) => {
      if(err)
         res.redirect('/blog');
      else {
         res.render('edit', {blog:blog});
      }
   });   
});
//NEW BLOG
app.post('/blog', (req, res) => {
   //create blog
   req.body.blog.body = req.sanitize(req.body.blog.body);
   Blogposts.create(req.body.blog, (err, newBlog) => {
      if(err)
         res.redirect('/blog/new');
      else
         res.redirect('/blog');
   });
});

//UPDATE ROUTE
app.put('/blog/:id', (req, res) => {
   req.body.blog.body = req.sanitize(req.body.blog.body);
   Blogposts.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
      if(err)
         res.redirect("/blog");
      else
         res.redirect('/blog/'+req.params.id);
   });
});

//DELETE BLOG
app.delete('/blog/:id', (req, res) => {
   Blogposts.findByIdAndRemove(req.params.id, (err) => {
      if(err)
         res.redirect('/blog');
      else 
         res.redirect('/blog');
   });
});
//APP LISTEN
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("The montser has started on PORT" + process.env.PORT + " and IP "+process.env.IP);
});