var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


function CartDAO(database) {
    "use strict";

    this.db = database;


    this.getCart = function(userId, callback) {
        "use strict";

        /*  Query the "cart" collection by userId and pass the cart to the
            callback function.  */
        
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

        /*  We write a query to determine whether or not the cart associated
        with the userId contains an item identified by itemId.
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


    /*  http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#findOneAndUpdate
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
        We update the quantity of an item in the user's cart in the
        database by setting quantity to the value passed in the quantity
        parameter. If the value passed for quantity is 0, the item is removed
        from the user's cart stored in the database.
        */

     var userCart = {
            userId: userId,
            items: []
        }

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