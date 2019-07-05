const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsersControllers = require('../controllers/users')

router.post('/signup', UsersControllers.users_signup);

router.post('/login', UsersControllers.users_login)

router.delete('/:userId', UsersControllers.users_delete);

module.exports = router;