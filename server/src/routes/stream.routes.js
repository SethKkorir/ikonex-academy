const express = require('express');
const router = express.Router();
const streamController = require('../controllers/stream.controller');

router.post('/', streamController.createStream);
router.get('/', streamController.getAllStreams);
router.get('/:id', streamController.getStream);
router.put('/:id', streamController.updateStream);
router.delete('/:id', streamController.deleteStream);

module.exports = router;
