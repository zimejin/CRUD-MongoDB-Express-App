# Mongo-mart
JavaScript E-commerce Application, Using Node, Express and MongoDB

![Image](https://github.com/zimejin/Mongo-mart/blob/master/sreen%20mart.png?raw=true)


About

MongoMart is the final lab project in M101JS mongodb for javascript course provided by MongoDB.
MongoMart is an ecommerce site that allows the user to browse for and add MongoDB products to their cart.
There is no user session at the moment, so the user id is hard coded.

Requires

Node.js (with npm)
MongoDB 3.2.x, using the WiredTiger (default for 3.2) storage engine
Knowledge of Commandline interface.
Getting Started (windows)

* Open a terminal and type "mongod" into the commandline and press enter
- This would start a mongodb server, minimize the terminal.

* Open the anotehr terminal, in the commandline cd to the project's root directory.
* Install the required depedencies by running "npm install"

* Open another terminal and cd to data (Mongo-mart/data) directory, while in the directory run the following code
* mongoimport --db mongomart --collection item items.json
* mongoimport --db mongomart --collection cart cart.json

// This would import the item collection and cart collection.


- After the database is imported, go ahead and close that terminal.

* Then on the terminal where the root directory is open create a Text Index by running the following code
* "mongo"                 //This would start a mongodb shell. Then Type the following code
* show dbs                // This would display a list of dbs
* "use mongomart"         // mind the format. mongomart, mongo mart. 

 - Then run the next line of code.

* db.item.createIndex({title: "text", slogan: "text", description: "text"}) 
Hopefully if all went as planned you would have created a new Text index. Press ctrl + c to exit the ongo shell.

* Finally in the root project directory in the terminal (/Mongo-mart) run the following command.

Run the application by typing 

* node mongomart.js    

And there you have it :) whew!

![Image](https://github.com/zimejin/Mongo-mart/blob/master/pc%20mart.jpg?raw=true)

----------------------------------------------------------------------------------------------------------------------

----------------------------------------------------------------------------------------------------------------------

![Image](https://github.com/zimejin/Mongo-mart/blob/master/ScreenShot%20mart.png?raw=true)



Todo

* Firebase Authentication
* Payment Request API
* Material Design Lite [ Navbar and Sidebar ]
