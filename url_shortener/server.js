const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const URL = require("./models/url.model");
const request = require("request-promise");
const cheerio = require("cheerio");

app.set("view engine", "pug");
app.set("views", "./views/");
const PORT = process.env.PORT || 4000;
const db_name = "url_shortener";

mongoose.connect("mongodb://127.0.0.1:27017/" + db_name, {
  useNewUrlParser: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB conenction Success");
});

app.post("/", (req, res) => {
  URL.create({ url: req.body.url, description: req.body.description, title: req.body.title, image: req.body.image})
    .then((docs) => {
      res.send({
        message: "Successfully added",
        err: null,
        short_url: docs.short,
      });
    })
    .catch((err) => {
      res.send({ message: "Failure", err: err });
    });

  // This would add the meta data from the website once we have given the website to it.
});

app.get("/ok", (req, res) => {
  res.send("OK");
});

// THis will get you the short variable if the URL exists, if it doesn't then, it just, tells that it doesn't exist.
app.get("/", (req, res) => {
  const full = req.query.full;
  if (full) {
    URL.findOne({ full: full }, (err, url) => {
      res.send(url.short);
    });
  } else {
    res.send("Does not Exist");
  }
});

app.get("/:short", (req, res) => {
  const short = req.params.short; // Params is for the situation in which we send the URL and pass the short one.
  URL.findOneAndUpdate(
    { short: short },
    { $inc: { clicks: 1 } },
    (err, docs) => {
      if (docs) {
        console.log(docs);
        res.render("view_1", {
          // og_description_content: "Buy food from known people."
          url: docs.url,
          description: docs.description,
          image: docs.image,
          title: docs.title,
          redirect_content: "0; " + docs.url,
        });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

// Take frontend too.
