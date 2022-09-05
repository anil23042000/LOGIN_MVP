const express = require('express');
const alert = require('alert');
var router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');


router.get('/', (req, res) => {
    res.render("user/addOrEdit", {
        viewTitle: "Insert Users"
    });
});


router.post('/login', (req, res) => {

    User.findOne({ 'email': req.body.email }, (err, docs) => {
        if (err) {
            return res.send("No data found!");
        } else {
            if (docs.User_Type == 'admin') {
                if (docs.Password == req.body.Password) {
                    res.redirect('/user/list');
                } else {
                    res.send('oops!! Please enter Correct Password')
                }
            }
            else
                res.send('Oops!! Admin can only access this ')
        }
    })

});


router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);

});


function insertRecord(req, res) {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.Password = req.body.Password;
    user.User_Type = req.body.User_Type;
    user.mobile = req.body.mobile;
    user.city = req.body.city;
    user.save((err, doc) => {
        if (!err) {
            res.redirect("user/addOrEdit");
        }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("user/addOrEdit", {
                    viewTitle: "Insert Employee",
                    user: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    User.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('user/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("user/addOrEdit", {
                    viewTitle: 'Update User',
                    user: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    User.find((err, docs) => {
        if (!err) {
            res.render("user/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving User list :' + err);
        }
    }).lean();
});

router.get('/admin', (req, res) => {
    User.find((err, docs) => {
        if (!err) {
            res.render("user/admin", {
                admin: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    }).lean();
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("user/addOrEdit", {
                viewTitle: "Update User",
                user: doc
            });
        }
    }).lean();
});

router.get('/delete/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/user/list');
        }
        else { console.log('Error in user delete :' + err); }
    }).lean();
});

module.exports = router;