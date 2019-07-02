const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/signup', (req, res, next) => {
     //The second argument to the hash function which is the salt is used to avoid cases of use of dictionary to get
     //passwords as it adds random strings to the plain password.
     User.find({email: req.body.email})
     .exec()
     .then(user => {
         if (user.length >= 1) {
            return res.status(409).json({
                message: 'Mail already exists'
            })
         }else{
            bcrypt.hash(req.body.password, 10, (err, hash)=>{
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                    .then(result => {
                        console.log(result)
                        res.status(201).json({
                            message: 'User created'
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })
                    })
                }
        });
         }
     })
});

router.post('/login', (req, res, next) => {
    User.findOne({email: req.body.email})
    .exec()
    .then(user => { //User returns an array if the find method is used
        if (user.length < 1) {
            res.status(401).json({
                message: 'Auth failed'
            });
        }else{
            bcrypt.compare(req.body.password, user.password, (err, result)=>{
                if (err){
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result){
                    //THe key is in the nodemon.json file which has env 
                    const token = jwt.sign({
                        email: user.email,
                        userId: user._id
                    }, 
                    process.env.JWT_KEY, 
                    {
                        expiresIn: "1h"
                    }
                    //There's one last argument for call back here which returns the token but another approach is used
                );
                    return res.status(200).json({
                        message: 'Auth successful',
                        token
                    })
                }
                res.status(401).json({
                    message: 'Auth failed'
                })
            })
           
            //The main reason for giving the status code 401 and this response is so as not to give an indication whether
            //its a wrong password or mail thereby stopping a brute force attack
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
})

router.delete('/:userId', (req, res, next)=>{
    User.deleteOne({_id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
});



module.exports = router;