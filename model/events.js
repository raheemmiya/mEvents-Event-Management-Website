const { ObjectId } = require("mongodb");
const { getEventDb } = require("../utility/event-database");

class Event {
  constructor(
    eventName,
    eventDate,
    eventTime,
    location,
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
}

module.exports = Event;
