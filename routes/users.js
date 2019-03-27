var express = require('express');
var router = express.Router();
const Stats = require('../model/stats')
const StatsIG = require('../model/statsig')

/* GET home page. 
router.get('/', function (req, res, next) {
  res.json([
    { id: 1, username: "somebody" },
    { id: 2, username: "somebody_else" }

  ]);
});

*/

router.get('/', (req, res) => {
  Stats.find()
    .sort({ date: -1 }).limit(7)
    .then(stats => res.json(stats))
});


router.get('/ig', (req, res) => {
  StatsIG.find()
    .sort({ date: -1 }).limit(7)
    .then(stats => res.json(stats))
});


router.get('/monthlyfb', (req, res) => {
  Stats.find({date: {$in: ['2019-01-31', '2019-02-28','2019-03-31','2019-04-30','2019-05-31','2019-06-30','2019-06-30','2019-07-31','2019-08-31','2019-09-30','2019-10-31','2019-11-30','2019-12-31']}})
    .sort({ date: 1 }).limit(12)
    .then(stats => res.json(stats))
});


router.get('/monthlyig', (req, res) => {
  StatsIG.find({date: {$in: ['2019-01-31', '2019-02-28','2019-03-31','2019-04-30','2019-05-31','2019-06-30','2019-06-30','2019-07-31','2019-08-31','2019-09-30','2019-10-31','2019-11-30','2019-12-31']}})
    .sort({ date: 1 }).limit(12)
    .then(stats => res.json(stats))
});






var cron = require('node-cron');
 
cron.schedule('1,20,21,25,30,35,40 * * * *', () => {
  console.log('running every minute 1, 2, 4 and 5');
});

module.exports = router;
