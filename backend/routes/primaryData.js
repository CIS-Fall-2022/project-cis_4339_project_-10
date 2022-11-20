const express = require("express"); 
const router = express.Router(); 

//importing data model schemas
let { primarydata } = require("../models/models"); 
let { eventdata } = require("../models/models"); 
let organization = process.env.ORGID

//GET all clients
router.get("/", (req, res, next) => { 
    primarydata.find( 
        {'organization_id' : organization}, 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    // Places clients ascending order and only shows 25 clients max 
    ).sort({ 'lastName': 1}).limit(25);
});

//GET single client entry by ID
router.get("/id/:id", (req, res, next) => {
    primarydata.find(
        { _id: req.params.id, 
            organization_id : organization },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//GET clients based on search query
//Ex: '...?firstName=Bob&lastName=&searchBy=name' 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { firstName: { $regex: `^${req.query["firstName"]}`, $options: "i" }, 
                lastName: { $regex: `^${req.query["lastName"]}`, $options: "i" }, organization_id : organization }
    } else if (req.query["searchBy"] === 'number') {
        dbQuery = {
            "phoneNumbers.primaryPhone": { $regex: `^${req.query["phoneNumbers.primaryPhone"]}`, $options: "i" }
        }
    };
    primarydata.find(
        dbQuery, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//POST a new client (create client)
router.post("/", (req, res, next) => { 
    primarydata.create( 
        req.body,
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data); 
            }
        }
    );
    primarydata.createdAt;
    primarydata.updatedAt;
    primarydata.createdAt instanceof Date;
});

//PUT out a client update (make sure req body doesn't have the id)
router.put("/:id", (req, res, next) => { 
    primarydata.findOneAndUpdate(  
        { _id: req.params.id, organization_id : organization }, 
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//DELETE client by id
router.delete('/:id', function (req, res) {
    // Removes Client
    primarydata.findByIdAndRemove({_id: req.params.id, organization_id : organization}) 
    // Removes Client from events 
    eventdata.updateMany({attendees: req.params.id }, { $pull: {attendees: req.params.id }} ) 
    .then (() => primarydata.findByIdAndRemove({_id: req.params.id, organization_id : organization}))
    .then(error => {
        if (!error) {return res.status(404).send({error: "ID not found"});}
        return res.send("ID successfully removed");
    })
});


module.exports = router;