const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/results.controller');

router.get('/student/:studentId', resultsController.getStudentResults);
router.get('/class/:streamId', resultsController.getStreamResults);

module.exports = router;