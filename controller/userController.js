const User = require("../model/user");
const Event = require("../model/events");

exports.homePage = (req, res) => {
  Event.fetchAll().then((totalEvents) => {
    User.allUser().then((user) => {
      if (user) {
        res.render("home", {
          pageTitle: "Home",
          user: user,
          totalEvents: totalEvents,
        });
      } else {
        res.render("home", {
          pageTitle: "Home",
          user: null,
          totalEvents: totalEvents,
        });
      }
    });
  });
};

exports.registerPage = (req, res) => {
  res.render("register", { pageTitle: "Create Account", errorMessage: null });
};

exports.eventDetails = (req, res) => {
  console.log(req.params.id);
  Event.getEventById(req.params.id).then((event) => {
    User.allUser().then((user) => {
      if (user) {
        res.render("event-details", {
          pageTitle: "Event Details",
          user: user,
          event: event,
        });
      } else {
        res.render("event-details", {
          pageTitle: "Event Details",
          user: null,
          event: event,
        });
      }
    });
  });
};

exports.registerUser = (req, res) => {
  const user = new User(
    req.body.name,
    req.body.email,
    req.body.password,
    req.body.description
  );
  user
    .registerUser()
    .then((result) => {
      if (!result) {
        res.render("register", {
          pageTitle: "Create Account",
          errorMessage: "Email is already registered",
        });
      }
      res.render("home", { pageTitle: "Home", user: null });
    })
    .catch((err) => console.log(err));
};

exports.communityGuidelines = (req, res) => {
  User.allUser().then((user) => {
    res.render("community-guidelines", { pageTitle: "Community Guidelines: mEvents",user: user });
  });
};

exports.getOurSponsersPage = (req, res) => { 
  User.allUser().then((user) => {
  res.render('our-sponsers', {pageTitle: "Our Sponsers - mEvents", user:user})
  });
}

exports.getFAQPage = (req, res)=>{ 
  User.allUser().then((user) => {
    res.render('FAQs', {pageTitle: "FAQs - mEvents", user:user})
    });
}