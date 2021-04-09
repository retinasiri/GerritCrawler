# exportmongodatabase

# Installation 

```bash 
npm i exportmongodatabase
```

# Usage 
```javascript
const exportDb = require('exportmongodatabase');

exportDb.exportDataBase("mongodb://localhost:27017/PMS");
```

## Parameters

### DataBase connection url : String 

example : "mongodb://localhost:27017/PMS"
<br>
example : "mongodb://username:password@host:port/dbname"

## Other 
This will create a folder of database in your project folder name and all the collections will be exported by there name in <b>csv</b> file.

