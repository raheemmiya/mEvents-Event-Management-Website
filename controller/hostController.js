const User = require("../model/user");
const Event = require("../model/events");
const Country = require("../model/country");

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
