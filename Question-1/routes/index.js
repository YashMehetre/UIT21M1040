var express = require('express');
var router = express.Router();
const { handleNumbers } = require('../controllers/numbersControllers');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/numbers', handleNumbers);

module.exports = router;
