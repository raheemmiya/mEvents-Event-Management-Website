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
      console.log(this);
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
      console.log(error);
    }
  }

  static async getEventById(id) {
    try {
      const _db = getEventDb();
      return await _db.collection("events").findOne({ _id: new ObjectId(id) });
    } catch (err) {
      console.log("Error while getting the event using ID", err);
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
}

module.exports = Event;
