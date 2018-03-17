const express = require('express');
const router = express.Router();
const _ = require('lodash');

const { User } = require('./../models/user');
const { authenticate } = require('./../middleware/authenticate');

// POST users
router.post('/', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = new User(body);
        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/me', authenticate, async (req, res) => {
    try {
        res.send(req.user);
    } catch (e) {
        res.status(401).send(e);
    }
})

module.exports = router;