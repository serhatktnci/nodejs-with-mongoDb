const recordController = require('./controllers/recordController'),
    express = require('express');


module.exports = function (app) {
const apiRoutes = express.Router();


// @route Post /getRecords
// @desc getRecords params{startDate,endDate,minCount,maxCount}
// @access Public
apiRoutes.post('/getRecords', recordController.getRecords);


// @route Get /
// @desc Create a Todo Item
// @access Public
apiRoutes.get('/', function(req, res){
  res.send('Welcome. <a href="https://github.com/serhatktnci/nodejs-with-mangoDb">Github Repo</a>');
});

app.use('/',apiRoutes);

};