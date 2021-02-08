# Planearly.

**Planearly is flight planner**, that uses [Dijkstra algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) to find the shortest route from one city to another if it exists. It comes with a fully functional **user profiling** feature and an **admin dashboard** so you can add/remove/update cities and flights on the go. The routes are managed by the system.

The **system computes paths once** and stores them till flight information is modified. The scenarios in which the calculated paths are discarded are:

- If a city is removed.
- If a flight is removed or updated.

## Setup

### Folder Structure

- The server is stored in the /api folder.
- The application is stored in the /app folder.

### Installation

1. Goto `/api` folder and run `yarn` or `npm install` to install required modules.
2. After the installation is complete, run the server using `yarn dev`
3. After the server has started, it will display a url to access graphiql (GraphQL Playground) to run queries and mutations.
4. Open `http://localhost:4000/graphql` on your favorite browser to access GraphQL Playground.
5. Open another terminal, goto `/app` folder and run `yarn` or `npm install` to install required modules.
6. After the installation is complete, run `yarn start` or `npm start` to run the application.
7. Open `http://localhost:4200` on your favorite browser to access Angular application.

If you want to access the Angular application on another system, run `ng serve --host your-local-ip-address` and replace `your-local-ip-address` with your machine's IP Address. Now you can access
the application on any machine by opening `http://your-local-ip-address:4200`

### Getting Started

Start by creating a traveler account, or you can use the admin account to access the functionality:
Email: test@mail.com
Password: 0000

- Access the admin dashboard by clicking on 'Dashboard' on top right.
- Enter the given credentials to access admin panel.

_One can register traveler account but not admin account through the Angular application._

## Tools and technologies used

- [x] Angular - Front end for the application.
- [x] [Express](https://expressjs.com/) - REST API.
- [x] [GraphQL](https://github.com/graphql/express-graphql) - Query language.
- [x] [TypeORM](https://typeorm.io/#/) - Communicate with the database
- [x] SQLite3
- [x] Figma - UI/UX Design

### Reasoning behind the selection:

- Angular: As mentioned in the task, the front end needed to be developed in Angular.
- Express: I am comfortable in writing server code in express as our FYP was developed using MEAN Stack.
- GraphQL: As the task did not mention any framework or library to develop the back end in, it gave me an opportunity to learn something that is relatively new in the programming. So I picked GraphQL just to learn something new.
- TypeORM: makes it easy to communicate with a database, and the tutorials I followed and forums I read, it was pretty common.
- SQLite3: I first picked MongoDB but as it was a schema-less relation-less database, the typeorm had a very little compatibility with MongoDB, and automatic resolving of relations that TypeORM provided, did not work with the MongoDB, so I switched to SQLite3, as it created a db file locally which could be easily transferred and I did not need an external server/host or another set of tools to manage the database.
- Figma: Bringing Mockups to life was the first step in completing the application, so I picked Figma, as I could use it from any machine.

## Task

### Minimum Requirements

- [x] The application’s backend must be implemented using Nodejs and the interface should
      follow RESTful standards.
- [x] The application’s front end must be built using Angular.
- [x] The application must compile and must be usable without changing the code after final
      submission.
- [x] The application must support user management, users can log in and sign up.

### Types of Users

- [x] Administrator
- [x] Travelers

### Use Cases

- [x] Admin should be able to add cities
- [x] Admin should be able to create/update/delete one-way flights between available cities.
- [x] Admin should be able to set a cost for the flight.
- [x] Travelers should be able to sign-up and login
- [x] Service should let the travelers select the origin and destination city to provide them with the flight plan.
- [x] A flight plan can have a single flight if selected cities(by travelers) are directly connected.
- [x] A flight plan can have multiple flights if cities can be visited by connecting flights.
- [x] A flight plan can have no flights if cities can't be connected.
- [x] The goal of this service must be to provide cost-effective flight plans.
- [x] **Important: Make sure that the server does not have to calculate flight plans twice for the same origin and destination unless flight details are modified by the admin.**
- [x] A well designed front end, with a good UI experience, will carry greater marks.
- [ ] All the design decisions/explanatory parts of the solution should be part of a “README.md” file on the GitHub project. This should be a private repository that is shared only with ‘xgrid-all’ users as a contributor.

### Optional Requirements

- [ ] Test-driven development to validate your code.
- [ ] Travis CI / CircleCI integration.
- [x] API documentation
- [ ] Dockerized frontend and backend components

> **Test-driven:** Did not have much time to write test cases.
> **CI**: Have not yet worked on the said platforms.
> **API documentation** is automatically generated by the GraphiQL which I consider is enough to use the developed API.
> **Dockerized:** have not yet worked on said tool.

## Conclusion

I have learned new set of tools and technologies, and the task greatly helped me in combining my skills to build something that I am personally very happy about.

Following are links to the videos and forum posts that helped me a lot throughout the development cycle of this application. They are for reference so in case if I get stuck on something in the future, these links might help me and probably you too!

- [Youtube video that helped me get started with Express and GraphQL using Typescript](https://www.youtube.com/watch?v=KToWKbAi8FA)
- [(Basic working of Dijkstra) A great teacher that i watch videos of to learn about algorithms.](https://www.youtube.com/watch?v=XB4MIexjvY0)
- [Example Graph that I have used to during development and still is in the project.](https://www.youtube.com/watch?v=JcN_nq1EAr4)

### Database and UI/UX Designs

- [UI/UX Designs on Figma](https://www.figma.com/file/wTUYPJ5kAnotTTfzvo2MKj/Flight-Planner?node-id=0%3A1)
- [Tables and Relations on Lucid Chart](https://lucid.app/lucidchart/invitations/accept/9902549d-bc61-4775-8c0b-1d5197508861)
