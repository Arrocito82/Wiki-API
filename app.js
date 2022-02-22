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
const uri = "mongodb://root:root@mongo:27017/wikiDB?retryWrites=true&w=majority&authSource=admin";
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

// route handlers for /articles
app.route('/articles')
  .get(function (request, response) {

    Article.find({}, function (err, foundArticles) {
      if (err) {
        response.send(err);
      } else {
        response.send(foundArticles);
      }

    });

  })
  .post(function (req, res) {

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

  })
  .delete(function (req, res) {

    Article.deleteMany({}, function (err, result) {
      if (!err) {
        res.send("Successfully deleted " + result.n + " article(s).");
      } else {
        res.send(err);
      }
    });

  });

//route handlers for /articles/title

app.route('/articles/:title')
  .get(function (req, res) {
    const title = req.params.title;
    Article.findOne(
      {
        title: title
      }

      , function (err, foundArticle) {
        if (err) {
          res.send(err);
        } else {
          if (foundArticle) {

            res.send(foundArticle);
          } else {
            res.send("No matches found.");
          }
        }
      });
  })
  .put(function (req, res) {
    /**
     * When it comes to the put method the document is overwritten entirely, and that means that if you forget
     * to specify a paramerer or value, then it'll desapear from the updated document.
     */
    const title = req.params.title;
    const updatedTitle = req.body.title;
    const updatedContent = req.body.content;
    Article.replaceOne({
      title: title
    },
      ccccc,
      function (err) {
        if (!err) {
          res.send('Successfully updated article.');
        } else
          res.send(err);

      });
  })
  .patch(function (req, res) {
    const title = req.params.title;
 
    /**
     * it only update the parameters provided.
     */
    Article.updateOne({
      title: title
      },
      req.body,
      {
        omitUndefined:true
      },
      function (err,result) {
        if(err){
          res.send(err);
        }else if(result.nModified==0){
          res.send("No changes were made.");
        }else{
          res.send("Successfully updated.");

        }
      }
    );

  })
  .delete(function (req, res) {
    const title = req.params.title;
    Article.deleteOne({ title: title }, function (err, result) {
      if (err) {
        res.send(err);
      } else if (result) {
        res.send("Successfully deleted article.");
      } else {
        res.send("No matches found.");
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
