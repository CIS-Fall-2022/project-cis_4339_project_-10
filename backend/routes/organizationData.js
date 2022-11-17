const express = require("express"); 
const router = express.Router(); 

//importing data model schemas

let { orgdata } = require("../models/models"); 

// Imports dot env Variable for Organization Instance
let organization = process.env.ORGID


//GET single entry by orgID
router.get("/", (req, res, next) => {
    orgdata.find(
        { _id: organization},
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