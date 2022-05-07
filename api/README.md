</p></a>
<p align="center">
  <strong> 🚀 Building the future of social media management and an opensource alternative to ( Buffer. Hootsuite. MeetEdgar. Sprout Social. Postfity. Loomly. etc)</strong>
</p>


<h3 align="center">
  <a href="https://github.com/randolly/randolly/blob/staging/CONTRIBUTING.md">Contribute</a>
  <span> · </span>
  <a href="https://discord.gg/s4Zt62EXjD">Community</a>
</h3>

---

# API
I have tried to keep things simple and concise. With minimal modules needed, it is very lightweight and fast, yet very functional and feature-rich. Three parts of project viz, front-end, database and api server are separately hosted and this repo contains the api code which connects to the front-end app and database.

## Tech used
- Express as an api server
- MongoDB as database
- Mongoose as Mongo JavaScript driver, model/schema validation
- Passport/passport-local for authentication
- Bcryptjs for hashed password storage and comparison
- Cookies/express-session/connect-mongo for session management and storage
- And a large part of my otherwise useless brain.

## File structure 
here is a rundown of project structure 


| Folder              |      Description          |
| :-------------------- | :-----------------------: |
| [models](models)    |contains mongoose schema's for models and their respective methods/statics       |
| [routes](routes)        |- `auth.js` - contains authentication related routes, like `/auth/login`, `/auth/logout`, etc. -`api.js` - contains all other routes        |
| [controllers](controllers)      |contains functions to be used in router        |
| [serializers](serializers)        |contains functions to serialize and includes fields particular to authticated user. |
| [utils](utils)        |`helpers.js`  containes some miscellaneous helper utilities like escapeHtml, etc `mddlewares.js` middlewares like ensureLoggedIn |



<!-- - `dummy-data/` contains json and script for parsing some pre-populated data
- `passport.js` passport related congig and functions
- `app.js` main express app. -->



### ⚡ Authentication ⚡

Authentication is done with passport local-strategy with sessions managed server side via cookies which are also httpOnly. Along with an api end point for checking logged in session (GET /auth/login) which returns success if user is logged in, subsequent api requests return `403` to flag *inauthentication* and is also used by front end to destroy session cookie.

*Authentication still needs to be improved*
