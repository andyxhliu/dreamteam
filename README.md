# Make Good Time
Make Good Time is, ironically, an application about planning one's time wisely. Users can select their interests, then plot a route to up to eight different places in their vicinity. Theoretically, a very nice day can be had by walking around one's neighbourhood to visit a cinema, cafe, book store, etc.

## Planning

We used Trello for project management, assigning cards to members of the group. Wireframes were created in Adobe Illustrator.
[trello screenshot]
[wireframe screenshot]

## Project Requirements
This project was created for General Assembly's Web Development Immersive (WDI) third project, and only group project assignment. Groups were assigned by the instructional team, and the project had several arbitrary requirements associated with it:

* **Use Mongo & Express** to build an API and a front-end that consumes it
* **Create an API using at least 2 models**, one of which should be a user
* Include **all major CRUD functions** in a **RESTful API** for at least one of those model
* **Consume your own API** by making your front-end with HTML, Javascript, & jQuery
* **Add authentication to your API** to restrict access to appropriate users
* **Craft thoughtful user stories together**, as a team
* **Manage team contributions and collaboration** using a standard Git flow on Github
* Layout and style your front-end with **clean & well-formatted CSS**
* **Deploy your application online** so it's publically accessible


---

### Necessary Deliverables
According to the project's requirements, there were several components to include: 

* A **working API, built by the whole team**, hosted somewhere on the internet
* A handmade front-end **that consumes your own API**, hosted somewhere on the internet
* A **link to your hosted working app** in the URL section of your Github repo
* A **team git repository hosted on Github**, with a link to your hosted project, and frequent commits from _every_ team member dating back to the _very beginning_ of the project

We did achieve each of these goals.

## Build

### Technologies 
Using BCrypt with JSON Web Tokens for authentication
Node.js with Express and MongoDB/Mongoose
Google Maps Javascript API, Google Maps Directions Service API
Bower to manage client-side dependencies (Bootstrap, Underscore for templates)
AJAX
Mocha, Chai for testing; Istanbul for test coverage reporting
[app screenshot with map plotting]

### Installation Instructions
We're using Node.js with MondoDB on the server-side. Run `npm install ` to install all dependencies. These include `express`, `mongoose`, `bcrypt`, `body-parser`, `morgan` and a few others, all included in the package.json file.

## Unsolved Problems
Most of our current outstanding issues are around the user experience. The "user favorite" feature was added very late in the build cycle. No wireframes were created for that feature, and little thought or planning went into the design of interactions and user journeys incorporating that feature. Thus, we still have many open tickets on our Trello board to improve this feature. These include:

* Hiding the user favorite toggle when a user is not logged in
* Maininting a persistent state for the favorites in the sidebar (i.e., if a user has included a place in their favorites, it should be indicated any time that place is included in a route)
* Allow users to un-favorite a place from their Favorites view
* Add links to external resources for each returned result in the route, because an photo and address is insufficient for a user to make an informed decision about each place to visit.

During user testing, it was indicated that the path to "start over" or start creating a new day plan was unclear. We'd also like to add an additional icon to the header for a user to begin a new search directly on the map screen.

## Credits
Our team is comprised of:
Axel Berdugo, Kaitlyn Tierney, and Andy Xiang-Hua Liu.