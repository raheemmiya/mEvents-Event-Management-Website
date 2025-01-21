const User = require("../model/user");
const Event = require("../model/events");
const Country = require("../model/country");
const Favourite = require("../model/favourite");

exports.loginPage = (req, res) => {
  res.render("login", { pageTitle: "Login", errorMessage: null });
};

exports.loginUser = (req, res) => {
  User.findUser(req.body)
    .then((user) => {
      if (!user) {
        res.render("login", {
          pageTitle: "Login",
          errorMessage: "Please, enter correct email and password",
        });
      } else {
        User.userLog(req.body).then(() => {
          User.userStatus(req.body).then((isLoggedIn) => {
            res.render("profile", {
              pageTitle: "Profile",
              user: user,
              loggedIn: isLoggedIn,
            });
          });
        });
      }
    })
    .catch((err) => console.log("User not found", err));
};
exports.createEventPage = async (req, res) => {
  if (req.params.id) {
    try {
      const user = await User.getUserById(req.params.id);
      const countryList = await Country.getAllCountry();

      res.render("create-Event", {
        pageTitle: "Create an Event",
        user: user,
        countryList: countryList,
      });
    } catch (err) {
      console.error("Error while fetching the user", err);
    }
  } else {
    res.render("login", { pageTitle: "Login", errorMessage: null });
  }
};

exports.toLogOut = (req, res) => {
  User.getUserById(req.params.id).then((user) => {
    User.userLog(user);
    // Event.fetchAll().then(totalEvents=>{
    //   res.render("home", { pageTitle: "Home Page", user: null, totalEvents:totalEvents });
    // })
    res.redirect("/home");
  });
};

exports.addToFavourite = async (req, res) => {
  const userId = req.params.userId;
  const eventId = req.params.eventId;

  const newFav = new Favourite(userId, eventId);
  await newFav.addFavourite();

  const result = await User.addToFav(userId, eventId);

  console.log("Event is added or not? ", result);

  res.redirect("/home");
};

exports.getFavouritesPage = async (req, res) => {
  try {
    const user = await User.allUser();

    const favouriteEventList = await User.getFavouritesById(req.params.userId);

    res.render("favourites", {
      pageTitle: "My Favourites-mEvents",
      user: user,
      favouriteEventList: favouriteEventList,
    });
  } catch (error) {
    console.log("Error while getting the fav page", error);
  }
};

exports.deleteFavourite = async (req, res, next) => {
  try {
    const result = await User.deleteFavourite(
      req.params.userId,
      req.params.eventId
    );
    if (result.modifiedCount > 0) {
      console.log("Event successfully removed");
      const user = await User.allUser();

      const favouriteEventList = await User.getFavouritesById(
        req.params.userId
      );

      res.render("favourites", {
        pageTitle: "My Favourites-mEvents",
        user: user,
        favouriteEventList: favouriteEventList,
      });
    } else {
      console.log("Event not found or already removed");
    }
  } catch (error) {
    console.log("Error while deleting the favourites", error);
  }
};
