// replace these values with those generated in your TokBox Account
console.log('app.js started')
// (optional) add server code here
var SERVER_BASE_URL = 'https://cardgamev.herokuapp.com';
fetch(SERVER_BASE_URL + '/session').then(function(res) {
   return res.json()
}).then(function(res) {
   apiKey = res.apiKey;
   sessionId = res.sessionId;
   token = res.token;
   initializeSession();
}).catch(handleError);
// (optional) add server code here
initializeSession();

// Handling all of our errors here by alerting them
function handleError(error) {
   if (error) {
      alert(error.message);
   }
   }
   
   function initializeSession() {
   var session = OT.initSession(apiKey, sessionId);
   
   // Subscribe to a newly created stream
   session.on('streamCreated', function(event) {
      let count = document.getElementById('subscriber').childElementCount();
      let elem = 'subscriber';
      if (count > 0) {
         elem = 'spectator';
      }
      session.subscribe(event.stream, elem, {
         insertMode: 'append',
         width: '100%',
         height: '100%'
      }, handleError);
      });

   // Create a publisher
   var publisher = OT.initPublisher('publisher', {
      insertMode: 'append',
      width: '100%',
      height: '100%'
   }, handleError);
   
   // Connect to the session
   session.connect(token, function(error) {
      // If the connection is successful, publish to the session
      if (error) {
         handleError(error);
      } else {
         session.publish(publisher, handleError);
      }
   });
   }