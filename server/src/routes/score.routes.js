const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/score.controller');

router.get('/', scoreController.getAllScores);
router.get('/student/:studentId', scoreController.getScoresByStudent);
router.get('/class/:streamId/subject/:subjectId', scoreController.getScoresByClassAndSubject);
router.post('/', scoreController.createScore);
router.put('/:id', scoreController.updateScore);
router.delete('/:id', scoreController.deleteScore);

module.exports = router;