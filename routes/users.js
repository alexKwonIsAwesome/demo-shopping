const express = require('express');
const router = express.Router();
const _ = require('lodash');

const { User } = require('./../models/user');

// POST users
router.post('/', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const userInstance = new User(body);
        const user = await userInstance.save();
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;