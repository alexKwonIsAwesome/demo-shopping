const express = require('express');
const router = express.Router();
const _ = require('lodash');

const { User } = require('./../models/user');
const { authenticate } = require('./../middleware/authenticate');

// POST users sign up
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

// POST usres sign in
router.post('/signin', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);

        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        if (e.message === 404) {
            res.status(404).send(e);
        } else {
            res.status(400).send(e);
        }
    }
})

router.get('/me', authenticate, async (req, res) => {
    try {
        res.send(req.user);
    } catch (e) {
        res.status(401).send(e);
    }
});

router.delete('/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        res.status(400).send();
    }
});

module.exports = router;