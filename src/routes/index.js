const express = require('express');
const router = express.Router();
const securityController = require('../controllers/securityController');

router.get('/', securityController.spring4ShellProd);
router.get('/spring4ShellProd', securityController.spring4ShellProd);

module.exports = router;