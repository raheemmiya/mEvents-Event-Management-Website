const { ObjectId } = require("mongodb");
const { getDb } = require("../utility/user-database");
const Event = require("../model/events");

class User {
  // Constants
  static COLLECTION_NAME = 'users';

  constructor(name, email, password, description) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.description = description;
    this.isLoggedIn = false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.createdEvents = [];
    this.favouriteEvents = [];
    this.bookedEvents = [];
    this.tickets = [];
  }

  // Database connection helper
  static async getCollection() {
    try {
      const db = getDb();
      return db.collection(this.COLLECTION_NAME);
    } catch (error) {
      console.error("Error getting collection:", error);
      throw error;
    }
  }

  // Authentication Methods
  async registerUser() {
    try {
      const collection = await User.getCollection();
      const existingUser = await collection.findOne({ email: this.email });
      
      if (existingUser) {
        return null;
      }

      const result = await collection.insertOne(this);
      return result;
    } catch (error) {
      console.error("Error in registerUser:", error);
      throw error;
    }
  }

  static async fetchAll() {
    try {
      const collection = await this.getCollection();
      return await collection.find({}).toArray();
    } catch (error) {
      console.error("Error in fetchAll:", error);
      throw error;
    }
  } 

  static async findUser({ email, password }) {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const collection = await this.getCollection();
      return await collection.findOne({ email, password });
    } catch (error) {
      console.error("Error in findUser:", error);
      throw error;
    }
  }

  // User Status Management
  static async userLog(body) {
    try {
      const user = await this.findUser(body);
      if (!user) throw new Error("User not found");

      const collection = await this.getCollection();
      const result = await collection.updateOne(
        { _id: new ObjectId(user._id) },
        {
          $set: {
            isLoggedIn: !user.isLoggedIn,
            updatedAt: new Date(),
          },
        }
      );

      if (result.modifiedCount === 0) {
        throw new Error("Failed to update user login status");
      }

      return result;
    } catch (error) {
      console.error("Error in userLog:", error);
      throw error;
    }
  }

  // User Retrieval Methods
  static async getUserById(id) {
    try {
      if (!id) throw new Error("User ID is required");
      
      const collection = await this.getCollection();
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error("Error while fetching user by id:", error);
      throw error;
    }
  }

  static async getLoggedInUser() {
    try {
      const collection = await this.getCollection();
      return await collection.findOne({ isLoggedIn: true });
    } catch (error) {
      console.error("Error in getLoggedInUser:", error);
      throw error;
    }
  }

  // Event Management Methods
  static async addCreatedEvents(event) {
    try {
      if (!event?.createdBy) throw new Error("Event creator is required");

      const collection = await this.getCollection();
      return await collection.updateOne(
        { name: event.createdBy },
        {
          $push: { createdEvents: event },
          $set: { updatedAt: new Date() }
        }
      );
    } catch (error) {
      console.error("Error in addCreatedEvents:", error);
      throw error;
    }
  }
  // Favorite Events Management
  static async checkFav(userId, eventId) {
    try {
      const favourites = await this.getFavouritesById(userId);
      return favourites.some(fav => fav._id.toString() === eventId.toString());
    } catch (error) {
      console.error("Error in checkFav:", error);
      throw error;
    }
  }
  static async addToFav(userId, eventId) {
    try {
      if (!userId || !eventId) {
        throw new Error("User ID and Event ID are required");
      }

      const isAlreadyFavourite = await this.checkFav(userId, eventId);
      if (isAlreadyFavourite) {
        return null;
      }

      const event = await Event.getEventById(eventId);
      if (!event) {
        throw new Error("Event not found");
      }

      const collection = await this.getCollection();
      return await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { favouriteEvents: event } }
      );
    } catch (error) {
      console.error("Error in addToFav:", error);
      throw error;
    }
  }

  static async deleteFavourite(userId, eventId) {
    try {
      const collection = await this.getCollection();
      return await collection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $pull: {
            favouriteEvents: {
              _id: new ObjectId(eventId)
            }
          }
        }
      );
    } catch (error) {
      console.error("Error in deleteFavourite:", error);
      throw error;
    }
  }

  // Getter Methods
  static async getFavouritesById(userId) {
    try {
      const user = await this.getUserById(userId);
      return user?.favouriteEvents || [];
    } catch (error) {
      console.error("Error in getFavouritesById:", error);
      throw error;
    }
  }

  static async getAllCreatedEventsList(userId) {
    try {
      const user = await this.getUserById(userId);
      return user?.createdEvents || [];
    } catch (error) {
      console.error("Error in getAllCreatedEventsList:", error);
      throw error;
    }
  }
  
  static async addTicket(userId, ticket) {
    try {
      const collection = await this.getCollection();
      return await collection.updateOne({ _id: new ObjectId(userId) }, { $push: { tickets: ticket } });
    } catch (error) {
      console.error("Error in addTicket:", error);
      throw error;
    }
  }
  

}

module.exports = User;
