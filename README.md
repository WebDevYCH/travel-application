## City Explorer - Travel Application

### Motivation

This intention behind this application is to have people around the world share information about the places that they travel to. Whenever we go to new places we generally do some form of reasearch about where we are going and the things that we want to do when we are there. City Explorer will help people awnser those questions. Additionally we will see who the most avid explorers out there are.

### Build Status:

[![CircleCI](https://circleci.com/gh/JoshBowdenConcepts/travel-application.svg?style=svg&circle-token=8d7201f2cf01538b3b12c9edfb41ab210e71d232)]

### Technology Stack:

1. [Mongo](https://www.mongodb.com/)
2. [Express](https://www.express.com/)
3. [GraphQL](https://graphql.org/)
4. [React](https://reactjs.org/)
5. [Node](https://nodejs.org/)
6. [Cypress](https://www.cypress.io/)
7. [CircleCI](https://circleci.com/)

### Features:

- Adding Trips
- Adding Destination Information
- Addting Activities by Destination
- Searching Trips
- Searching Destinations
- Searching Best Activites by Destination

### Installation:

Clone Repository:
```
https://github.com/JoshBowdenConcepts/travel-application
```

Change to Repository Directory:
```
cd travel-application
```

Install Dependencies
```
yarn instal
```

Start Development Server
```
yarn start
```

### Testing:

Visual Testing
```
yarn run test
```

Locate the cypress application and select the tests that you wish to run and watch them happen in the browser.

Quick Testing
```
yarn run quickTest
```

The output will be logged in the console.

### Submitting Pull Requests:

If you would like to submit code to this project you can create a pull request and when it is submitted it will undergo the CircleCI process that runs the test suite that I have set up and determines wether the code can be submitted. If something in the integration or testing process seems broken to you please reach out and let me know.

### Development Practice:

I am using this application as a learning experience and as such I am going to attempt to use TDD (Test Driven Development) as well as CI (Continuous Integration). For the testing framework I am using Cypress as it gives me the ability to test both the front and back end of the applications as well as any potential possibiiities that may arrise from different data scenarios. For continuous integration I am using CircleCI because it is highly regarded and is what my current position is using. It is always good to stay up to date on the technology that your company is using.
