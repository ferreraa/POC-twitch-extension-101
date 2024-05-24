/* Importing Libraries */
var express = require("express");
var bodyParser = require('body-parser');
var mongoose = require("mongoose");


/* Express Step 1: Creating an express application */
var app = express();
//set port 
var port = 3000;

/* Express Step 2: Start Server */
app.listen(port, () => {
 console.log("Server listening on port " + port);
});

// Express Step 3: Use body-parser library to help parse incoming request bodies
app.use(bodyParser.json());


/* Mongoose Step 1: Connecting to Mongoose */
mongoose.connect("mongodb://localhost:27017/WYR-test", {useNewUrlParser: true}); 

/* Mongoose Step 2: Define Model */
const QuestionSchema = mongoose.Schema({
    optionA: String,
    optionB: String
});

const Question = mongoose.model("Question", QuestionSchema);

const OptionSchema = mongoose.Schema({
  option: String
});

const Option = mongoose.model("Option", OptionSchema);

/* This is included because its allows extenion to run external javascript. 
If you are interested in learning more, check out: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  // Note that the origin of an extension iframe will be null
  // so the Access-Control-Allow-Origin has to be wildcard.
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/options-list', async (req, res) => {
  console.log(req.method + ' ' + req.url);
  const options = await Option.find() 
  res.send(options.map(option => option.option));
});

app.post('/options-list', async (req, res) => {
  if (!req.body.forEach) {
    console.log(req.body);
    res.statusCode = 400;
    res.send('wrong body format');
    return;
  }
  await Option.deleteMany({});
  req.body.forEach(async (option) => {
    const newOption = new Option({ option });
    await newOption.save();
  });
  res.send('ok');
});

app.get('/questions', async (req, res) => {
  console.log(req.method + ' ' + req.url);
  const questions = await Question.find();
  Question.deleteMany();
  res.send(questions.map(question => ({optionA: question.optionA, optionB: question.optionB})));
});

app.post('/question', async (req, res) => {
  if (!req.body.optionA || !req.body.optionB) {
    console.log(req.body);
    res.statusCode = 400;
    res.send('wrong body format');
    return;
  }
  const newQuestion = new Question({optionA: req.body.optionA, optionB: req.body.optionB});
  await newQuestion.save();
  res.send('ok');
});