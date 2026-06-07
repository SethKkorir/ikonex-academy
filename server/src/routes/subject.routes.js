const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subject.controller');

router.get('/', subjectController.getAllSubjects);
router.get('/stream/:streamId', subjectController.getSubjectsByStream);
router.get('/:id', subjectController.getSubject);
router.post('/', subjectController.createSubject);
router.put('/:id', subjectController.updateSubject);
router.delete('/:id', subjectController.deleteSubject);
router.post('/:id/assign', subjectController.assignSubjectToStream);

module.exports = router;