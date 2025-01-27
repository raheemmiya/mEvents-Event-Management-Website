const User = require("../model/user");
const Event = require("../model/events");
const EventCategory = require("../model/event-categories");

exports.homePage = async (req, res) => {
  try {
    const [totalEvents, user, availableCountryNames] = await Promise.all([
      Event.fetchAll(),
      User.getLoggedInUser(),
      Event.getAllEventCountryList(),
    ]);

    const selectedCountry = req.body.country || "Nepal";
    const eventListByCountry = await Event.getAllEventByCountry(
      selectedCountry
    );

    res.render("home", {
      pageTitle: "Home",
      user: user || null,
      totalEvents: totalEvents,
      availableCountryNames: availableCountryNames,
      selectedCountry: req.body.country,
      eventListByCountry: eventListByCountry,
      selectedCountry: selectedCountry,
    });
  } catch (error) {
    console.error("Error in homePage:", error);
    res.status(500).render("error", {
      message: "An error occurred while loading the home page",
      pageTitle: "Error",
    });
  }
};

exports.registerPage = (req, res) => {
  res.render("register", { pageTitle: "Create Account", errorMessage: null });
};

exports.eventDetails = async (req, res) => {
  try {
    const eventId = req.params.id;
    if (!eventId) {
      return res.status(400).render("error", {
        message: "Event ID is required",
        pageTitle: "Error",
      });
    }

    const [event, user] = await Promise.all([
      Event.getEventById(eventId),
      User.getLoggedInUser(),
    ]);

    if (!event) {
      return res.status(404);
    }

    res.render("event-details", {
      pageTitle: "Event Details",
      user: user || null,
      event,
    });
  } catch (error) {
    console.error("Error in eventDetails:", error);
    res.status(500).render("error", {
      message: "An error occurred while loading event details",
      pageTitle: "Error",
    });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, description } = req.body;

    // Basic input validation
    if (!name || !email || !password) {
      return res.status(400).render("register", {
        pageTitle: "Create Account",
        errorMessage: "All fields are required",
      });
    }

    const user = new User(name, email, password, description);
    const result = await user.registerUser();

    if (!result) {
      return res.status(409).render("register", {
        pageTitle: "Create Account",
        errorMessage: "Email is already registered",
      });
    }

    res.redirect("/login");
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).render("register", {
      pageTitle: "Create Account",
      errorMessage: "An error occurred during registration",
    });
  }
};

// Helper function to handle common page rendering with user data
const renderPageWithUser = async (res, viewName, pageTitle) => {
  try {
    const user = await User.getLoggedInUser();
    res.render(viewName, { pageTitle, user: user || null });
  } catch (error) {
    console.error(`Error rendering ${viewName}:`, error);
    res.status(500).render("error", {
      message: "An error occurred while loading the page",
      pageTitle: "Error",
    });
  }
};

exports.communityGuidelines = async (req, res) => {
  await renderPageWithUser(
    res,
    "community-guidelines",
    "Community Guidelines: mEvents"
  );
};

exports.getOurSponsersPage = async (req, res) => {
  await renderPageWithUser(res, "our-sponsers", "Our Sponsers - mEvents");
};

exports.getFAQPage = async (req, res) => {
  await renderPageWithUser(res, "FAQs", "FAQs - mEvents");
};

//get events by category
exports.getEventsByCategoryPage = async (req, res) => {
  try {
    const category = req.params.category;
    const country = req.params.country;
    const categoryEventsByCountry =
      await EventCategory.getEventsByCategoryAndCountry(category, country);
    const user = await User.getLoggedInUser();
    const allUsers = await User.fetchAll();
    res.render("eventsByCategory", {
      pageTitle: "Events By Category - mEvents",
      events: categoryEventsByCountry,
      user: user,
      allUsers: allUsers,
      country: country,
      category: category,
    });
  } catch (error) {
    console.error("Error in getEventsByCategoryPage:", error);
    res.status(500).render("error", {
      message: "An error occurred while loading the events by category page",
      pageTitle: "Error",
    });
  }
};

exports.getEventsByNamePage = async (req, res) => {
  try {
    
    const eventName = req.body.eventName;
    const eventCountry = req.body.eventCountry;
    const eventsByName = await Event.filterEventListByName(
      eventName,
      eventCountry
    );
    const user = await User.getLoggedInUser();
    res.render("eventsByName", {
      events: eventsByName,
      pageTitle: "Events By Name - mEvents",
      user: user,
    });
  } catch (error) {
    console.error("Error in getEventsByNamePage:", error);
    res
      .status(500)
      .render("error", {
        message: "An error occurred while loading the events by name page",
        pageTitle: "Error",
      });
  }
};
