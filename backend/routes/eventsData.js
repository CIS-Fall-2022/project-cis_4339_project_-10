const express = require("express");
const router = express.Router();

//importing data model schemas
let { eventdata } = require("../models/models"); 

// dot env orgID imported
let organization = process.env.ORGID

//Current Date 
let currentdate = new Date(Date());
let moddate = new Date(Date());

//GET all event entries
router.get("/", (req, res, next) => { 
    eventdata.find(
        {organization_id : organization},  
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});


// moddate finds date of 2 months ago
moddate.setMonth(currentdate.getMonth() - 2);
//GET count of all attendees per event for past 2 months 
router.get("/historical/", (req, res, next) => { 
    eventdata.aggregate([ 
        { $match: {organization_id : organization , date : { $gte : moddate } }}, 
            // query section for attendee count, rqeturns number
            { $project : { eventName: '$eventName', NumberAttendees: {$size: '$attendees'} } }],  
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    )
});

//GET a single event entry by ID
router.get("/id/:id", (req, res, next) => { 
    eventdata.find({ _id: req.params.id, 
        organization_id : organization }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

//GET event entries based on search query
//Ex: '...?eventName=Food&searchBy=name' 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { eventName: { $regex: `^${req.query["eventName"]}`, $options: "i" }, organization_id : organization  }
    } else if (req.query["searchBy"] === 'date') {
        dbQuery = {
            date:  req.query["eventDate"]
        }
    };
    eventdata.find( 
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

//GET events for which a client is signed up
router.get("/client/:id", (req, res, next) => { 
    eventdata.find( 
        { attendees: req.params.id, organization_id : organization }, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//POST a new event
router.post("/", (req, res, next) => { 
    eventdata.create( 
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

//PUT an event update out based upon that event's ID
router.put("/:id", (req, res, next) => {
    eventdata.findOneAndUpdate(
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

//PUT an attendee into an event
router.put("/addAttendee/:id", (req, res, next) => {
    //only add attendee if not yet signed up
    eventdata.find( 
        { _id: req.params.id, attendees: req.body.attendee }, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                if (data.length == 0) {
                    eventdata.updateOne(
                        { _id: req.params.id }, 
                        { $push: { attendees: req.body.attendee } },
                        (error, data) => {
                            if (error) {
                                consol
                                return next(error);
                            } else {
                                res.json(data);
                            }
                        }
                    );
                }
                
            }
        }
    );
    
});

//DELETE an attendee from an event
router.delete('/delAttendee/:id/:event', function (req, res) {
    eventdata.find({_id: req.params.event})
    eventdata.findOneAndUpdate({attendees: req.params.id }, { $pull: {attendees: req.params.id }} )
    .then(error => {
        if (!error) {return res.status(404).send({error: "ID not found"});}
        return res.send("ID successfully removed");
    })
});

//DELETE event by id
router.delete('/:id', function (req, res) {
    eventdata.findByIdAndRemove({_id: req.params.id, attendees: req.body.attendee })
    .then(error => {
        if (!error) {return res.status(404).send({error: "ID not found"});}
        return res.send("Event successfully removed");
    })
})

module.exports = router;