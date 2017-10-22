var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


function CartDAO(database) {
    "use strict";

    this.db = database;


    this.getCart = function(userId, callback) {
        "use strict";

        /*
        * TODO-lab5
        *
        * LAB #5: Implement the getCart() method.
        *
        * Query the "cart" collection by userId and pass the cart to the
        * callback function.
        *
        */
        
        var userCart = {
 		userId: userId,
 		items: []
 	    }
 	    // Filter for Items
        var cursor = database.collection("cart").aggregate([{
 	    $match: {
 		userId: userCart.userId
 	    }
    }, {
 	    $project: {
 		items: 1,
 		_id: 0
 	    }
    }]);
        cursor.toArray(function(err, data) {
 	    var newObj = data.pop()
 	    while (newObj.items.length > 0) {
 		var itemObj = newObj.items.pop()
 		userCart.items.push(itemObj)
 	    }
 	    callback(userCart)
    })
}



    this.itemInCart = function(userId, itemId, callback) {
        "use strict";

        /*
         *
         * TODO-lab6
         *
         * LAB: #6
         *
         * Write a query that will determine whether or not the cart associated
         * with the userId contains an item identified by itemId. If the cart
         * does contain the item, pass the item to the callback. If it does not,
         * pass the value null to the callback.
         */

      /*    mongoimport --db mongomart --collection item items.json
            mongoimport --db mongomart --collection cart cart.json
            db.item.createIndex({title: "text", slogan: "text", description: "text"}) */      

        var cursor = database.collection("cart").find({
	    userId: userId
        }, {
	    items: {
		$elemMatch: {
			_id: itemId
		    }
	    }
    })
        cursor.toArray(function(err, data) {
	    var itemObj = data.pop();
	    if (itemObj.items != null) {
		var itemCal = itemObj.items.pop();
		var callbackValue = itemCal;
	    } else {
		callbackValue = null;
	    }
	    callback(callbackValue);
    })
}


    /*
     * http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#findOneAndUpdate
     */
    this.addItem = function(userId, item, callback) {
        "use strict";
        // Will update the first document found matching the query document.
        this.db.collection("cart").findOneAndUpdate(
            // query for the cart with the userId passed as a parameter.
            {userId: userId},
            // update the user's cart by pushing an item onto the items array
            {"$push": {items: item}},
            // findOneAndUpdate() takes an options document as a parameter.
            // Here we are specifying that the database should insert a cart
            // if one doesn't already exist (i.e. "upsert: true") and that
            // findOneAndUpdate() should pass the updated document to the
            // callback function rather than the original document
            // (i.e., "returnOriginal: false").
            {
                upsert: true,
                returnOriginal: false
            },
            // Because we specified "returnOriginal: false", this callback
            // will be passed the updated document as the value of result.
            function(err, result) {
                assert.equal(null, err);
                // To get the actual document updated we need to access the
                // value field of the result.
                callback(result.value);
            });

        /*

          Without all the comments this code looks written as follows.

        this.db.collection("cart").findOneAndUpdate(
            {userId: userId},
            {"$push": {items: item}},
            {
                upsert: true,
                returnOriginal: false
            },
            function(err, result) {
                assert.equal(null, err);
                callback(result.value);
            });
        */

    };


    this.updateQuantity = function(userId, itemId, quantity, callback) {
        "use strict";

        /*
        * TODO-lab7
        *
        * LAB #7: Update the quantity of an item in the user's cart in the
        * database by setting quantity to the value passed in the quantity
        * parameter. If the value passed for quantity is 0, remove the item
        * from the user's cart stored in the database.
        */

     var userCart = {
            userId: userId,
            items: []
        }

        // TODO-lab7 Replace all code above (in this method).

        if (quantity != 0) {

	// Find
	var updateMethod = database.collection("cart").update({
			userId: userId,
			"items._id": itemId
		},
        
   //update 
		{
			$set: {
				"items.$.quantity": quantity
			}
		})
} else {
	var updateMethod = database.collection("cart").update({
			userId: userId,
			"items._id": itemId
		},
        
   //update 
		{
			$pull: {
				"items": { _id:itemId }
			}
		}) 
}
    
    // Return 
    var cursor = database.collection("cart").find({
	    userId: userId
        }, {
	    items: {
		$elemMatch: {
			_id: itemId
		    }
	    }
    })

	cursor.toArray(function(err, data) {
        var newObj = data.pop() 
        if(quantity != 0) {
            var Items = newObj.items.pop()
            Items.quantity = quantity;
            userCart.items.push(Items)
            callback(userCart)
        }
    })
}
} 
      


module.exports.CartDAO = CartDAO;