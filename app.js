//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//defining the Article Schema
const uri = "mongodb+srv://admin:AECa6Br9n683rst@cluster0.b8koz.mongodb.net/wikiDB?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// creating schemas
const ArticleSchema = {

  title: {
    type: String,
    require: true
  },
  content: {
    type: String,
    require: true
  }
}
const Article = mongoose.model("Article", ArticleSchema);


app.get('/articles', function (request, response) {
  Article.find({}, function (err, foundArticles) {
    if (err) {
      response.send(err);
    } else {
      response.send(foundArticles);
    }

  });
});


app.post('/articles', function (req, res) {

  const title = req.body.title;
  const content = req.body.content;
  const newArticle = new Article({
    title: title,
    content: content
  });
  newArticle.save(function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send("Succesfully added a new article.");
    }
  });
});

app.delete('/articles',function (req,res){
  Article.deleteMany({},function (err,result) {
    if(!err){
      res.send("Sucessfully deleted "+result.n+" article(s).");
    }else{
      res.send(err);
    }
  });

});



app.listen(3000, function () {
  console.log("Server started on port 3000");
});
