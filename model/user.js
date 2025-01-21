const { ObjectId } = require("mongodb");
const { getDb } = require("../utility/user-database");
const Event = require("../model/events");

class User {
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
  }

  async registerUser() {
    try {
      const _db = getDb();

      // Check if email already exists
      const existingUser = await _db
        .collection("users")
        .findOne({ email: this.email });
      if (existingUser) {
        return;
      }
      const result = await _db.collection("users").insertOne(this);
      console.log(`User registered successfully with id: ${result.insertedId}`);
      return result;
    } catch (error) {
      console.error("Error in registerUser:", error);
      throw error;
    }
  }

  static async findUser(body) {
    try {
      if (!body?.email || !body?.password) {
        throw new Error("Email and password are required");
      }

      const _db = getDb();
      const user = await _db.collection("users").findOne({
        email: body.email,
        password: body.password,
      });

      if (!user) {
        return user;
      }
      return user;
    } catch (error) {
      console.error("Error in findUser:", error);
      throw error;
    }
  }

  static async getId(body) {
    try {
      const user = await this.findUser(body);
      return user._id.toString();
    } catch (error) {
      console.error("Error in getId:", error);
      throw error;
    }
  }

  static async userLog(body) {
    try {
      const _db = getDb();
      const user = await this.findUser(body);

      const filter = { _id: new ObjectId(user._id) };
      const updateQuery = {
        $set: {
          isLoggedIn: !user.isLoggedIn,
          updatedAt: new Date(),
        },
      };

      const result = await _db
        .collection("users")
        .updateOne(filter, updateQuery);

      if (result.modifiedCount === 0) {
        throw new Error("Failed to update user login status");
      }

      return result;
    } catch (error) {
      console.error("Error in userLog:", error);
      throw error;
    }
  }

  static async userStatus(body) {
    try {
      const user = await this.findUser(body);
      return user.isLoggedIn;
    } catch (error) {
      console.error("Error in userStatus:", error);
      throw error;
    }
  }

  static async allUser() {
    try {
      const _db = getDb();
      const data = await _db.collection("users").find({}).toArray();
      let loggedInUser;
      data.forEach((user) => {
        if (user.isLoggedIn) {
          loggedInUser = user;
        }
      });
      return loggedInUser;
    } catch (error) {
      console.error(error);
    }
  }

  static async getUserById(id) {
    const _db = getDb();
    let user;
    try {
      user = _db.collection("users").findOne({ _id: new ObjectId(id) });
      return user;
    } catch (err) {
      console.error("Error while fetching user by id", err);
    }
  }

  static async addCreatedEvents(event) {
    const _db = getDb();
    console.log("Here the event object contains", event);

    const userName = event.createdBy;
    const filter = { name: userName };
    const updateQuery = {
      $push: {
        createdEvents: event,
      },
      $set: {
        updatedAt: new Date(),
      },
    };

    return await _db.collection("users").updateOne(filter, updateQuery);
  }

  static async addToFav(userId, eventId) {
    const _db = getDb();

    try {
      // to check if the event is already listed to the favourites or not
      const isAlreadyFavourite = await User.checkFav(userId, eventId);
      if (isAlreadyFavourite === true) {
        console.log("Duplicate Event trying to be added to the favList");
        return;
      }

      const event = await Event.getEventById(eventId);
      const filter = { _id: new ObjectId(userId) };

      const query = {
        $push: {
          favouriteEvents: event,
        },
      };

      return await _db.collection("users").updateOne(filter, query);
    } catch (error) {
      console.log("Error while adding favourite events to the user", error);
    }
  }

  static async checkFav(userId, eventId) {
    try {
      const user = await User.getUserById(userId);
      let result = false;

      const currFavList = user.favouriteEvents;

      currFavList.forEach((event) => {
        if (event._id.equals(new ObjectId(eventId))) {
          result = true;
        }
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async getFavouritesById(userId) {
    const _db = getDb();
    try {
      const user = await User.getUserById(userId);
      const favouriteEvents = user.favouriteEvents;
      return favouriteEvents;
    } catch (error) {
      console.log("Error while getting favourite events from the user", error);
    }
  }

  static async deleteFavourite(userId, eventId) {
    try {
      const _db = await getDb();
      const currUserId = new ObjectId(userId);
      const currEventId = new ObjectId(eventId);
      
      return await _db.collection("users").updateOne(
        { _id: currUserId },
        {
          $pull: {
            favouriteEvents: {
              _id: currEventId,
            },
          },
        }
      );


    } catch (error) {
      console.log("Error while deleting favourite events from the user", error);
    }
  }
}

module.exports = User;
