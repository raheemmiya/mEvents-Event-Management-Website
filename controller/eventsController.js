const Event = require('../model/events')
const User = require('../model/user')
const EventCategory = require('../model/event-categories')

exports.createEvent =async (req, res)=>{ 
    const createdBy = req.params.name;
    const eventName = req.body.eventName;
    const eventDate = req.body.eventDate;
    const eventTime = req.body.eventTime;
    const location = req.body.location;
    const description = req.body.description;
    const maxAttendees = req.body.maxAttendees;
    const category = req.body.category;
    const eventImage = req.body.eventImage;
    const country = req.body.country;

    
    
    let newEvent = new Event(
        eventName,
        eventDate,
        eventTime,
        location,
        country,
        description,
        maxAttendees,
        category,
        eventImage,
        createdBy,
    )
    try {
        await newEvent.createEvent();
        console.log("Event created successfully");
        await User.addCreatedEvents(newEvent);
        console.log("Event added to the user database successfully");
        await EventCategory.addEventToCategory(newEvent);
        console.log("Event added to the category database successfully");
    } catch (error) {
        console.error("Error creating event:", error);
    }
        
    res.send("<h2>Your Event has been added</h2>")
    
  }