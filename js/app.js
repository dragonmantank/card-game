// replace these values with those generated in your TokBox Account
console.log('app.js started')
// (optional) add server code here
var apiKey = '45828062';
var sessionId = '2_MX40NTgyODA2Mn5-MTU5MjI0NjgxMjA2Nn5RS3l4OUpSNE5wb3k0aUJPLzFvM1loTjB-UH4';
var token = 'T1==cGFydG5lcl9pZD00NTgyODA2MiZzaWc9ZWE2ZjUxMGE0ZGVhMTE4NDI0ZWViNDgzYWNmMjRlNzQ3ZTJhODU0YzpzZXNzaW9uX2lkPTJfTVg0ME5UZ3lPREEyTW41LU1UVTVNakkwTmpneE1qQTJObjVSUzNsNE9VcFNORTV3YjNrMGFVSlBMekZ2TTFsb1RqQi1VSDQmY3JlYXRlX3RpbWU9MTU5MjI0NjgzMyZub25jZT0wLjMzODU2MTMwNDE3MjczOTMzJnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE1OTIzMzMyMzM=';
/*
var SERVER_BASE_URL = 'https://cardgamev.herokuapp.com';
fetch(SERVER_BASE_URL + '/session').then(function(res) {
   return res.json()
}).then(function(res) {
   apiKey = res.apiKey;
   sessionId = res.sessionId;
   token = res.token;
   initializeSession();
}).catch(handleError);
*/
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
      session.subscribe(event.stream, 'subscriber', {
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