var express = require('express');
var actions = require('../methods/actions');

var router = express.Router();



router.post('/authenticate', actions.authenticate);
router.post('/adduser', actions.addNew);
router.get('/getinfo', actions.getinfo);
router.get('/getu', actions.getu);
router.get('/send', actions.send);
router.get('/verify', actions.verify);
router.put('/sendup', actions.sendup);




module.exports = router;
