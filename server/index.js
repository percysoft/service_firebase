const express = require('express');
const app = express();
var admin = require("firebase-admin");
var serviceAccount = require("./probando-8207e-firebase-adminsdk-nxiti-8cf7c2f74b.json");
const moment = require('moment');

app.use(express.static(__dirname + '/public/'));


const formatDate = (date) => {
  let date2 = date.split(' ')[0]
  let date3 = date2.split('/');

  return new Date(`${date3[1]}/${date3[0]}/${date3[2]}`)
}

app.listen('3000', function() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:"https://probando-8207e-default-rtdb.firebaseio.com",
  });
  var ref = admin.database().ref('prod-procurators');
  ref.on('value', (snapshot) => {
    var d = snapshot.val(); 
    var now = moment(new Date());   
    Object.entries(d).map((item => {
      let duration = moment.duration(now.diff(formatDate(item[1].createDate)));
      if(duration.asDays() > 2) {
        // console.log(duration.asDays(),'hola')
        //logica de eliminacion
        ref.child(item[0]).remove();
      }
    }))
  })  
});