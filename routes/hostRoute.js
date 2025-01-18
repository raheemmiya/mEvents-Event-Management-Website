const express = require("express");
const {loginPage} = require("../controller/hostController");
const {loginUser} = require("../controller/hostController");
const {createEventPage} = require('../controller/hostController')
const {toLogOut} = require('../controller/hostController')
const {createEvent} =  require('../controller/eventsController')

const hostRouter = express.Router();


hostRouter.get('/login', loginPage)
hostRouter.post('/logining', loginUser)
hostRouter.get('/createEvent/:id', createEventPage);  
hostRouter.get('/loggedOut/:id', toLogOut)
hostRouter.post('/createEvent/creating-event/:name', createEvent)

module.exports = hostRouter;
