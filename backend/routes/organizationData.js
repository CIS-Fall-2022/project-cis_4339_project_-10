const express = require("express"); 
const router = express.Router(); 

//importing data model schemas

let { orgdata } = require("../models/models"); 

//GET all entries
router.get("/", (req, res, next) => { 
    orgdata.find( 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1}).limit(10);
});


//GET single entry by orgID
router.get("/id/:id", (req, res, next) => {
    orgdata.find(
        { _id: req.params.id},
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

module.exports = router;