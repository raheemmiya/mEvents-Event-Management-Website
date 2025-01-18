const Event = require('../model/events')
const User = require('../model/user')

exports.createEvent = (req, res)=>{ 
    const createdBy = req.params.name;
    const eventName = req.body.eventName;
    const eventDate = req.body.eventDate;
    const eventTime = req.body.eventTime;
    const location = req.body.location;
    const description = req.body.description;
    const maxAttendees = req.body.maxAttendees;
    const category = req.body.category;
    const eventImage = req.body.eventImage;

    
    
    let newEvent = new Event(
        eventName,
        eventDate,
        eventTime,
        location,
        description,
        maxAttendees,
        category,
        eventImage,
        createdBy
    )
    
    newEvent.createEvent().then(result=>{ 
        console.log("EVent created successfully");
        User.addCreatedEvents(newEvent).then(result=> {
            console.log("Event added to the user database successfully");
        })
        
        
    })
    res.send("<h2>Your Event has been added</h2>")
    
  }