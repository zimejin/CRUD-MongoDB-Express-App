About

MongoMart | PC Mart was my final lab project in mongodb for Node.js Developers course provided by MongoDB. 
I've cycled through the project a couple of times to add new features or UI updates.

MongoMart | PC Mart is an ecommerce application that allows the user to browse for and add products to their cart.
There is no user session at the moment, so the user id is hard coded. 

 Sincerely
 
 Zimuzo Ejin
 
----------------------------------------------------------------------------------------------------------------------


![Image](https://github.com/zimejin/Mongo-mart/blob/master/sreen%20mart.png?raw=true)


Requires

Node.js (with npm)
MongoDB 3.2.x, using the WiredTiger (default for 3.2) storage engine
Knowledge of Commandline interface.
Getting Started (windows)

* Open a terminal and type "mongod" into the commandline and press enter
- This would start a mongodb server, minimize the terminal.

* Open the another terminal, in the commandline cd to the project's root directory.
* Install the required dependencies by running "npm install"

* Open another terminal and cd to data (Mongo-mart/data) directory, while in the directory run the following code
* mongoimport --db mongomart --collection item items.json
* mongoimport --db mongomart --collection cart cart.json

// This would import the item collection and cart collection.


- After the database is imported, go ahead and close that terminal.

* Then on the terminal where the root directory is open create a Text Index by running the following code
* "mongo"                 //This would start a mongodb shell. Then Type the following code
* show dbs                // This would display a list of dbs
* "use mongomart"          // This selects mongomart as the db of choice
* db.item.createIndex({title: "text", slogan: "text", description: "text"}) 

Hopefully if all went as planned you would have created a new Text index. Press ctrl + c to exit the mongo shell.

* Finally in the root project directory, still in the terminal type the following command to run the application.

* "node mongomart.js"    

And there you have it :) whew!

![Image](https://github.com/zimejin/Mongo-mart/blob/master/pc%20mart.jpg?raw=true)

----------------------------------------------------------------------------------------------------------------------

----------------------------------------------------------------------------------------------------------------------

![Image](https://github.com/zimejin/Mongo-mart/blob/master/ScreenShot%20mart.png?raw=true)


----------------------------------------------------------------------------------------------------------------------


Todo

* Firebase Authentication [ Email ]
* Payment Request API [ Demo ] 
* UI update [ Product Page ]
* Material Design Lite [ Navbar and Sidebar ]
* Deploy DB&App to MongoDB Atlas & Heroku 
* Add Game Titles to Category of Items for Sale.
