
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
  	chrome.tabs.getSelected(null, function(tab) {
        var tabId = tab.id;	
        var tabUrl = tab.url;  
        // console.log(tabUrl);    
        var tabTitle = tab.title;  
        // console.log(tabTitle);
        var Session = Parse.Object.extend("Session");		
		var Url = Parse.Object.extend("Url");		

		var user = Parse.User.current();	
		var session = new Session();	
		var url = new Url();		

		console.log(tabUrl);

		url.set("link", tabUrl);
		url.set("title", tabTitle);
		
		url.set("parent", session);
		url.save(null, {
			success: function(url) {
				var session = url.get('parent');
				var relation = user.relation("follows");	
				relation.add(session);
				console.log('saved session to user');
			}
		});		
		user.save();
	  	console.log(url.attributes);
	  	cionApp.showUrl(url);
    });	
  },
  showUrl: function(url) {
  	$('<div/>').addClass('url').html('<a href="'+url.get('link')+'">'+url.get('title')+'</a>').prependTo('#feed');
  },
  signUp: function() {
    username = $('#username').val();
    password = $('#password').val();
  	var user = new Parse.User();
		user.set("username", username);
		user.set("password", password);

		user.signUp(null, {
		  success: function(user) {
		    alert('User sign up was a success, try logging in!')
		  },
		  error: function(user, error) {
		    // Show the error message somewhere and let the user try again.
		    alert("User sign up has failed :(\n Error: " + error.code + " " + error.message);
		  }
		});
  },
  logIn: function() {
    username = $('#username').val();
    password = $('#password').val();
    if( username == "" || password == ""){
      alert("Credentials missing");
    } else{
      Parse.User.logIn(username, password, {
        success: function(user) {
          alert("USER LOG IN WAS A SUCCESS");
        },
        error: function(user, error) {
         alert("USER LOG IN FAILED MISERABLY, Error: " + error.code + " " + error.message);
        }
      });
    }
        },
    checkSession: function(){
        	var user = Parse.User.current();
        	if(user) {  		
        		$('#signUp').hide();
        		$('<small/>').addClass('text-muted').text(user.get('username')).appendTo('body');
        	}  	  	
        },

    logOut: function() {
      Parse.User.logOut();
    }
  

};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  Parse.initialize("zMzw4YOroYkmhM2YUgPjNMc9BQTxelTMwlb3Oy3h", "GCQ4URRqPsoyXyYVlc48rXuqZEr82Yd4DNeU2Bne");
  cionApp.startApp();   
  // document.getElementById('alertButton').addEventListener('click', cionApp.myAlert);
  document.getElementById('createFeed').addEventListener('click', cionApp.createFeed);
  document.getElementById('signUp').addEventListener('click', cionApp.signUp);
  document.getElementById('logIn').addEventListener('click', cionApp.logIn);
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