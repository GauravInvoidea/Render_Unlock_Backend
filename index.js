const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cors = require('cors');

require("dotenv").config();
 
const app = express();

const eventsRouter = require('./routers/events');
const pagesRouter = require('./routers/pages');
const pitchDeckRouter = require('./routers/pitch-deck');
const settingsRouter = require('./routers/settings');
const startupChallengesRouter = require('./routers/startup-challenges');
const transactionsRouter = require('./routers/transactions');
const usersRouter = require('./routers/users' );
const normalusersRouter = require('./routers/normalusersRouter')
const enquiriesRouter = require('./routers/enquiry');
const categoriesRouter = require('./routers/categories');
const locationRouter = require('./routers/location');
const businessRouter = require('./routers/BusinessRoutes');
const ChallengeRegistration = require('./routers/startupchallengeRegistration')
const eventsRegistrationRouter = require('./routers/eventRegistrartion')
const { saveChallengesToDatabase } = require('./utils/DummyChallenges');
const { saveEventsToDatabase } = require("./utils/DummyEvent");

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// database connection
require("./config/db");0

app.use(express.static("public"));

// routes
app.use('/api/startup-challenges', startupChallengesRouter)
app.use('/api/registration', ChallengeRegistration)
app.use('/api/pitch-deck', pitchDeckRouter)
app.use('/api/users', usersRouter)
app.use('/api/normaluser', normalusersRouter)
app.use('/api/events', eventsRouter)
app.use('/api/events-registration', eventsRegistrationRouter)

app.use('/api/business', businessRouter)
app.use('/api/transactions', transactionsRouter)
app.use('/api/pages', pagesRouter)
app.use('/api/settings', settingsRouter)
app.use('/api/enquiries', enquiriesRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/locations', locationRouter)


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on ${port}`);


  // Insert Dummy startup Challenges 
  // saveChallengesToDatabase(5);


  // Insert Dummy startup Event 
  // saveEventsToDatabase(20);

});
