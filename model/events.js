const { ObjectId } = require("mongodb");
const { getEventDb } = require("../utility/event-database");

class Event {
  constructor(
    eventName,
    eventDate,
    eventTime,
    location,
    country,
    description,
    maxAttendees,
    category,
    eventImage,
    createdBy
  ) {
    this.eventName = eventName;
    this.eventDate = eventDate;
    this.eventTime = eventTime;
    this.location = location;
    this.country = country;
    this.description = description;
    this.maxAttendees = maxAttendees;
    this.category = category;
    this.eventImage = eventImage;
    this.createdBy = createdBy;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async createEvent() {
    try {
      const _db = getEventDb();
      return await _db.collection("events").insertOne(this);
    } catch (error) {
      console.log("Error while creating the event: ", error);
    }
  }

  static async fetchAll() {
    try {
      const _db = getEventDb();

      return await _db.collection("events").find({}).toArray();
    } catch (error) {
      console.error(error);
    }
  }

  static async getEventById(id) {
    try {
      const _db = getEventDb();
      return await _db.collection("events").findOne({ _id: new ObjectId(id) });
    } catch (err) {
      console.error("Error while getting the event using ID", err);
    }
  }
  static async fetchByCountryName(countryName){ 
    try {
      const _db = getEventDb();
      return await _db.collection('events').find({country:countryName}).toArray();
    } catch (error) {
      console.error("Error while fetching the country name", error);
      
    }
  }

  static async getAllEventCountryList(){ 
    try {
      const _db = getEventDb();
      const allEvents = await _db.collection('events').find({}).toArray();
      const countryList= [];
      allEvents.forEach(event => {
        let country = event.country; 
        if (!countryList.includes(country)) {
          countryList.push(country)
        }
      });
      return countryList;

    } catch (error) {
      console.error("Error while fetching the country name", error);
    }
  }

  static async getAllEventByCountry(countryName){ 
    try {
      const _db = getEventDb();
      const allEvents = await _db.collection('events').find({}).toArray();
      const eventList= [];
      allEvents.forEach(event => {
        if (event.country.toLowerCase() == countryName.toLowerCase()) {
          eventList.push(event)
        }
      });
      return eventList;

    } catch (error) {
      console.error("Error while fetching the event database using country name", error);
    }
  }

  static async filterEventListByName(eventName, eventCountry){ 
    try {
      const allEvents = await Event.getAllEventByCountry(eventCountry);
      const eventList = [];
      allEvents.forEach(event => {
        if (event.eventName.toLowerCase().includes(eventName.toLowerCase())) {
          eventList.push(event);
        }
      });

      return eventList;
    } catch (error) {
      console.error("Error while fetching the event database using country name", error);
    }
  }

  static async deleteEvent(eventId){
    try {
      const _db = getEventDb();
      // await _db.collection('events').deleteOne({_id: new ObjectId(eventId)});
      
      //to delete the event from the eventCategory collection
      const event = await _db.collection('events').findOne({_id: new ObjectId(eventId)});
      console.log(event);
      const eventCategory = event.category;
      await _db.collection('eventCategory').deleteOne({category:eventCategory, events:{$in:[event]}});
        
      
      //to delete the event from the user collection
      await _db.collection('user').updateOne({_id: new ObjectId(eventCategory.createdBy)}, {$pull: {createdEvents: new ObjectId(eventId)}});
    } catch (error) {
      console.error("Error while deleting the event", error);
    }
  }
}

module.exports = Event;
