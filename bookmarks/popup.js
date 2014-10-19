
// chrome.tabs.create({}, function (e){
//   alert('hey bro');
// });

var cionApp = {
  startApp: function() {
    
  },
  myAlert: function() {
  	chrome.browserAction.setBadgeText({text:'i'})
  	$('<div/>').text('I appeared').addClass('red').appendTo('body');
  },
  createFeed: function() {  	
  	var id = makeid();
  	$('<h1/>').text('Your session id is '+ id).appendTo('body');
  },
  signUp: function() {
  	var user = new Parse.User();
		user.set("username", "Luis");
		user.set("password", "iakere");
		user.set("email", "luis@sititec.com");
		 
		// other fields can be set just like with Parse.Object
		user.set("phone", "415-392-0202");
		 
		user.signUp(null, {
		  success: function(user) {
		    alert('horray')
		  },
		  error: function(user, error) {
		    // Show the error message somewhere and let the user try again.
		    alert("Error: " + error.code + " " + error.message);
		  }
		});
  },
  checkSession: function(){
  	var user = Parse.User.current();
  	if(user) {  		
  		$('#signUp').hide();
  		$('<small/>').addClass('text-muted').text(user.get('username')).appendTo('body');
  	}  	  	
  }

};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  Parse.initialize("zMzw4YOroYkmhM2YUgPjNMc9BQTxelTMwlb3Oy3h", "GCQ4URRqPsoyXyYVlc48rXuqZEr82Yd4DNeU2Bne");
  cionApp.startApp();   
  document.getElementById('alertButton').addEventListener('click', cionApp.myAlert);
  document.getElementById('createFeed').addEventListener('click', cionApp.createFeed);
  document.getElementById('signUp').addEventListener('click', cionApp.signUp);
  cionApp.checkSession();   
});

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i=0;i<5;i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}