var express = require("express");

var loginRouter = express.Router();


const Captain = require("../models/captain");


loginRouter.post('/', async (req, res) => {

    Captain.findOne({
        mobile_number: req.body.number,
    }).then(captain => {
        if (captain) {
            if (captain.password === req.body.password) {
                if (req.body.fireToken) {

                    captain.fireToken = req.body.fireToken;
                    captain.save()
                        .catch(err => {
                            console.log(err);
                        });
                }
            res.json({
                status: 0,
                message: "Login Successful",
            });
        } else {
            res.json({
                status: 1,
                message: "Incorrect Password",
            });
        }
    } else {
        res.json({
            status: 1,
            message: "Captain not found",
        });
    }
    })
});

module.exports = loginRouter;
