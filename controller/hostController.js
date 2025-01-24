const User = require("../model/user");
const Event = require("../model/events");
const Country = require("../model/country");
const Favourite = require("../model/favourite");
const Ticket = require('../model/tickets');
const { ObjectId } = require("mongodb");

/**
 * Authentication Controllers
 */
exports.loginPage = (req, res) => {
  res.render("login", { pageTitle: "Login", errorMessage: null });
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findUser(req.body);
    if (!user) {
      return res.status(401).render("login", {
        pageTitle: "Login",
        errorMessage: "Invalid email or password",
      });
    }

    await User.userLog(req.body);
    const userId = new ObjectId(user._id);

    const [favouriteEventList, createdEvents] = await Promise.all([
      User.getFavouritesById(userId),
      User.getAllCreatedEventsList(userId),
    ]);

    return res.render("profile", {
      pageTitle: "Profile",
      user: user,
      createdEvents: createdEvents,
      favouriteEventList: favouriteEventList,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).render("error", {
      pageTitle: "Error",
      errorMessage: "An error occurred during login",
    });
  }
};

exports.toLogOut = async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
    await User.userLog(user);
    res.redirect("/home");
  } catch (err) {
    console.error("Logout error:", err);
    res.redirect("/home");
  }
};

/**
 * Event Controllers
 */
exports.createEventPage = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(401).render("login", {
        pageTitle: "Login",
        errorMessage: "Please login to create an event",
      });
    }

    const [user, countryList] = await Promise.all([
      User.getUserById(req.params.id),
      Country.getAllCountry(),
    ]);

    res.render("create-Event", {
      pageTitle: "Create an Event",
      user: user,
      countryList: countryList,
    });
  } catch (err) {
    console.error("Error in createEventPage:", err);
    res.status(500).render("error", {
      pageTitle: "Error",
      errorMessage: "Failed to load event creation page",
    });
  }
};

/**
 * Favorites Controllers
 */
exports.addToFavourite = async (req, res) => {
  try {
    const { userId, eventId } = req.params;

    const newFav = new Favourite(userId, eventId);
    await Promise.all([newFav.addFavourite(), User.addToFav(userId, eventId)]);

    res.redirect("/home");
  } catch (err) {
    console.error("Error adding favorite:", err);
    res.status(500).redirect("/home");
  }
};

exports.getFavouritesPage = async (req, res) => {
  try {
    const [user, favouriteEventList] = await Promise.all([
      User.getLoggedInUser(),
      User.getFavouritesById(req.params.userId),
    ]);

    res.render("favourites", {
      pageTitle: "My Favourites-mEvents",
      user: user,
      favouriteEventList: favouriteEventList,
    });
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).render("error", {
      pageTitle: "Error",
      errorMessage: "Failed to load favorites",
    });
  }
};

exports.deleteFavourite = async (req, res) => {
  try {
    const { userId, eventId } = req.params;
    const result = await User.deleteFavourite(userId, eventId);

    if (result.modifiedCount === 0) {
      return res.status(404).render("error", {
        pageTitle: "Error",
        errorMessage: "Favorite not found",
      });
    }

    const [user, favouriteEventList] = await Promise.all([
      User.getLoggedInUser(),
      User.getFavouritesById(userId),
    ]);

    res.render("favourites", {
      pageTitle: "My Favourites-mEvents",
      user: user,
      favouriteEventList: favouriteEventList,
    });
  } catch (err) {
    console.error("Error deleting favorite:", err);
    res.status(500).render("error", {
      pageTitle: "Error",
      errorMessage: "Failed to delete favorite",
    });
  }
};

/**
 * Profile Controllers
 */
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate userId format first
    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(400).redirect('/home');
    }

    const userObjectId = new ObjectId(userId);

    const [user, createdEvents, favouriteEvents, totalEvents, availableCountryNames] = await Promise.all([
      User.getUserById(userObjectId),
      User.getAllCreatedEventsList(userObjectId),
      User.getFavouritesById(userObjectId),
      Event.fetchAll(),
      Event.getAllEventCountryList()
    ]);

    const selectedCountry = req.body.country || "Nepal";
    const eventListByCountry = await Event.getAllEventByCountry(selectedCountry);
    
    res.render("profile", {
      pageTitle: "My Profile - mEvents",
      user: user,
      createdEvents: createdEvents,
      favouriteEvents: favouriteEvents
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).render("error", {
      pageTitle: "Error",
      errorMessage: "Failed to load profile",
    });
  }
};

//to get my tickets
exports.getMyTicketPages = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.getUserById(userId);
    res.render('my-tickets', { pageTitle: 'My Tickets - mEvents', user: user });
  } catch (err) {
    console.error("Error fetching tickets:", err);
  }
};

//Ticket Management
exports.spotAdded = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.getUserById(userId);
    const event = await Event.getEventById(req.body.eventId);
    const ticket = new Ticket(req.body.eventId, event, userId); //create a new ticket
    await ticket.save(); //save the ticket to the database
    
    //to add the ticket to the user's database
    await User.addTicket(userId, ticket);

    // const allBookedEvents = await Event.getAllBookedEvents(userId);


    res.render('my-tickets', { pageTitle: 'My Tickets - mEvents', user: user });
  } catch (err) {
    console.error("Error fetching tickets:", err);
  }
};




