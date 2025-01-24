const { ObjectId } = require("mongodb");
const { getDb } = require("../utility/user-database");
const Event = require("./events");

class Ticket {
  static COLLECTION_NAME = 'tickets';

  constructor(eventId, event, userId, purchaseDate, status) {
    this.eventId = eventId;
    this.event = event;
    this.userId = userId;
    this.purchaseDate = purchaseDate || new Date();
    this.status = status || 'active'; // active, cancelled
    this.ticketNumber = this.generateTicketNumber();
  }

  async getEvent(eventId) {
    return await Event.getEventById(eventId);
  }

  // Generate a unique ticket number: timestamp + random string
  generateTicketNumber() {
    return `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Database connection helper
  static async getCollection() {
    const db = getDb();
    return db.collection(this.COLLECTION_NAME);
  }

  async save() {
    try {
      const collection = await Ticket.getCollection();
      const result = await collection.insertOne(this);
      return result;
    } catch (error) {
      console.error("Error saving ticket:", error);
      throw error;
    }
  }

  static async getTicketsByUserId(userId) {
    try {
      const collection = await this.getCollection();
      return await collection.find({ userId: new ObjectId(userId) }).toArray();
    } catch (error) {
      console.error("Error getting user tickets:", error);
      throw error;
    }
  }

  static async getTicketById(ticketId) {
    try {
      const collection = await this.getCollection();
      return await collection.findOne({ _id: new ObjectId(ticketId) });
    } catch (error) {
      console.error("Error getting ticket:", error);
      throw error;
    }
  }

  static async updateTicketStatus(ticketId, newStatus) {
    try {
      const collection = await this.getCollection();
      const result = await collection.updateOne(
        { _id: new ObjectId(ticketId) },
        { $set: { status: newStatus } }
      );
      return result;
    } catch (error) {
      console.error("Error updating ticket status:", error);
      throw error;
    }
  }
}

module.exports = Ticket;
