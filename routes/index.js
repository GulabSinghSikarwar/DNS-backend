const express = require('express');
const router = express.Router();

const hostedRouter = require('./hostedZones')
const authRouter = require('./auth.routes')

router.use('/hosted-zones', hostedRouter);
router.use('/auth', authRouter)

module.exports = router;
