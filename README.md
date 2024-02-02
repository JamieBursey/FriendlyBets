# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Steps to Use the Website

### 1. Register

1. Got to https://jamiebursey.github.io/FriendlyBets/
2. If you're not logged in it will send you to https://jamiebursey.github.io/Login
3. Click on Register
<img width="1275" alt="Screen Shot 2024-01-22 at 3 31 08 PM" src="https://github.com/JamieBursey/FriendlyBets/assets/121978068/12821809-1fc6-4552-9018-7483c9e34199">
4. You will automattically be logged in and redirected to the home page.

### 2. Login
1. If you already have an account you can Log in directly
<img width="1277" alt="Screen Shot 2024-01-22 at 2 20 37 PM" src="https://github.com/JamieBursey/FriendlyBets/assets/121978068/c278d236-ec9f-4b81-873c-23204a688c15">

### 3. Adding Friends
1. In the nav-bar you will see a Friends option. clicking it will redirect you to the Friends page
2. You can add friends by entering their email.
3. you will need to log out and log in as the second user to accept the friend request in their Notifications.
   <img width="1278" alt="Screen Shot 2024-01-23 at 7 09 47 PM" src="https://github.com/JamieBursey/FriendlyBets/assets/121978068/84281644-af7f-49af-be9e-a0ffae5fbfff">
4. When accepted you will see information about the friend on this page.
<img width="1277" alt="FriendPage" src="https://github.com/JamieBursey/FriendlyBets/assets/121978068/69002d82-2978-42a4-9279-1edcfc46704a">

### 4. Creating a Bet
1. While on the Home page you will see a number of games for the day as well as live games.
2. If no games have started you will see a message saying "No Live Games", however in the Todays Games you can click the button to see the weekly schedule
 <img width="1274" alt="NHL Schedule" src="https://github.com/JamieBursey/FriendlyBets/assets/121978068/e84e666f-cd8b-48c8-8eb3-9e2d21122ec1">
3.If there are any games that are live then you will have the option to click Bet Friends. This will direct you to the bet page for the selected game.
<img width="1276" alt="live games" src="https://github.com/JamieBursey/FriendlyBets/assets/121978068/4e5c26ea-408b-4955-aaf1-c29642dce47c">
4. Select the friend you want to bet against and type in what you want to bet (Coffee, money, food, my favorite is tims iced cap)
<img width="1279" alt="BetPage" src="https://github.com/JamieBursey/FriendlyBets/assets/121978068/23408c95-ad66-444a-b274-58510544a51e">
5. Log out and log back in to the user you sent the bet to. The Friend will see the bet on their My Bets page with an accept and decline button. you will see it with the option to resind the bet if you want to back out before they accept.
  <img width="1276" alt="pendingBetsPage" src="https://github.com/JamieBursey/FriendlyBets/assets/121978068/bf6d7102-2805-4579-a515-b9149c17176c">
6. Once accepted you will see the bet in the active bets section of the My Bets page. there will be two buttons, one to check results and one to remove the bet from yours and the friends page. The idea is to remove the bet once you have paid the bet, but an honor system is important as this is not meant to be serious betting and nothing is to be forced. The bets are not mandatory to pay.
<img width="1279" alt="ActiveBets" src="https://github.com/JamieBursey/FriendlyBets/assets/121978068/2fd14ba9-72d0-4260-bfc5-71c01aa3a3dc">


### 5. My Account
1. In the My Account page you will see a your display name, email, avatar, and favorite team. Along with a button to navigate to the update page.
<img width="1276" alt="myAccount" src="https://github.com/JamieBursey/FriendlyBets/assets/121978068/3543bada-17e7-48a2-9982-0c0b91e83576">

2. once on the update page you will have the option to edit any fields you wish to change. the display name, email, password, ect. You will also have the option to add an about me section.
<img width="1279" alt="updateAccount" src="https://github.com/JamieBursey/FriendlyBets/assets/121978068/8bb493dd-00f6-4bdc-9512-f40473a30e61">

### 6. Admin Usage
1. You will have the option to log in as an admin with extra features. To do this log in using email admine@email.com with password admin.
<img width="1272" alt="Screen Shot 2024-01-25 at 6 38 42 PM" src="https://github.com/JamieBursey/FriendlyBets/assets/121978068/13d7b34c-d58a-4a94-ad8d-e1c8d3b6217e">
2. After loggin in as the admin you will see a new link in your account dropdown to update Users.
<img width="1271" alt="Screen Shot 2024-01-25 at 6 40 15 PM" src="https://github.com/JamieBursey/FriendlyBets/assets/121978068/326b1b87-e815-4121-b50f-9ecb2317d748">
3. clicking this link will direct you to a table of all users that you can edit by clicking the Edit button
<img width="1274" alt="image" src="https://github.com/JamieBursey/FriendlyBets/assets/121978068/b1b5502d-76db-4554-9253-fab7b885bb76">
4. Here you can change the details of the user selected and even have to option to make them an admin as well.
<img width="1272" alt="image" src="https://github.com/JamieBursey/FriendlyBets/assets/121978068/a748b803-8179-4fd3-83f9-37863b3cf68b">


### 7. Data Structure

#### Single User
```
{
   "username":"Admin",
   "password":"admin",
   "email":"admin@email.com",
   "favoriteTeam":"https://assets.nhle.com/logos/nhl/svg/COL_light.svg",
   "bets":[],
   "friends":["jamie","paul","Kelly"],"avatar":[],
   "messages":[],
   "isAdmin":true,
   "aboutMe":"Lorem ipsum dolor sit amet"
}
```

#### All Users
```
[
   {
      "username":"user1",
      ....
   },
   {
      "username":"user2",
      ....
   }
]
```

### Future Updates




## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

### Commands

npm install bootstrap@5.3.1 --save
npm install react-router-dom --save
//require both
npm install prop-types --save
npm install react-avatar --save

npm install --save gh-pages

sudo su #entering admin level

chmod -R 7777 . # Giving recursive permission to read/write

npm install # read from package.json and install dependecies

npm start # start the server and host the app locally
