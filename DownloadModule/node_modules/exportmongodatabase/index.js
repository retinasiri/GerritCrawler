const mongoClient = require("mongodb").MongoClient;
const fs = require("fs");
const fastcsv = require("fast-csv");

let exportDataBase = function (dburl) {
  mongoClient.connect(dburl, (err, db) => {
    if (err) throw err;
    // console.log("connnected");
    db.db()
      .listCollections()
      .toArray(function (err, collections) {
        if (err) {
          console.log(err);
        } else {
        //   console.log(collections);
		  var dbs = dburl.split("/");
			var dir= dbs[dbs.length -1];
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
		  var numberofCollections = collections.length;
		  console.log("total number of collectons is ------------>  "+ numberofCollections);
		  var itr =	0;
        //   var arrofcollection = [];
          collections.forEach((element) => {
			itr += itr;
			console.log("----------- *"+ itr+ "*"+" out of "+numberofCollections +" are completed -----------");
            db.db()
              .collection(element.name)
              .find({})
              .toArray((err, data) => {
                if (err) throw err;
                // console.log(data);
                const ws = fs.createWriteStream(
                  dir + "/" + element.name + ".csv"
                );
                // console.log(data);
                fastcsv
                  .write(data, { headers: true })
                  .on("finish", function () {
                    console.log("Write to "+element.name+ " successfully!");
                  })
                  .pipe(ws);
              });
            // arrofcollection.push(element.name);
          });
        //   console.log(arrofcollection);
		}
		db.close();
	  });
  });
};

module.exports.exportDataBase = exportDataBase;
