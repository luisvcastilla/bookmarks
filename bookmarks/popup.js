var cionApp = {
  startApp: function() {    
  },
  myAlert: function() {
  	chrome.browserAction.setBadgeText({text:'i'})
  	$('<div/>').text('I appeared').addClass('red').appendTo('body');
  },  
  createSession: function(sessionTitle) {  	  	
  	var sessionTitle = sessionTitle;
  	chrome.tabs.getSelected(null, function(tab) {
        var tabId = tab.id;	
        var tabUrl = tab.url;          
        var tabTitle = tab.title;          
        var Session = Parse.Object.extend("Session");		
		var Url = Parse.Object.extend("Url");		

		var user = Parse.User.current();	
		var session = new Session();	
		var url = new Url();		
		// console.log(tabUrl);
		session.set("title",sessionTitle);
		url.set("link", tabUrl);
		url.set("title", tabTitle);
		
		url.set("parent", session);
		url.save(null, {
			success: function(url) {
				var session = url.get('parent');
				var relation = user.relation("follows");	
				relation.add(session);
				console.log(session.id)
				$('#session-title').text(session.get('title'));	  				  	
				setCookie('session_id',session.id, 365);	  					
			}
		});		
		user.save();
	  	// console.log(url.attributes);
	  	cionApp.showUrl(url);
	  	cionApp.changeToAddUrlView();
	  	
    });	
  },
  changeToAddUrlView: function() {
  	$('#createSession').hide('slow');
	$('#sessionTitle').hide('fast');
  	$('#sessionTitle').hide('fast');
  	$('#switchFeed').show('slow');
  	$('#addUrl').show('slow');

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
  checkSession: function(){
  	var user = Parse.User.current();
  	if(user) {  		
  		$('#signUp').hide();
  		$('<small/>').addClass('text-muted').text(user.get('username')).appendTo('body');
  	}
  	checkCookie("session_id");
  },  
  logIn: function() {
    username = $('#username').val();
    password = $('#password').val();
    if(username == "" || password == ""){
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

    logOut: function() {
      Parse.User.logOut();
    },

    getSessions: function() {
      var user = Parse.user.current();
      var relation = user.relation("follows");
      relation.query().descending("score");
      relation.query().find({
       success: function(list){
        //asdf
      }});
    },

    getUrls: function(session){

    var Url = Parse.Object.extend("Url");
    var query = new Parse.Query(Url);
    query.equalTo("parent", session);
    query.find({
      success: function(results) {
          console.log(results);
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          cionApp.showUrl(object);
        }
      },
      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    })},

    getUrlsFromSession: function(){
      var Session = Parse.Object.extend("Session");
      var query = new Parse.Query(Session);
      query.get("epnEki3T64", {
        success: function(session) {
          console.log(session.id);
          cionApp.getUrls(session);
        },
        error: function(object, error) {
          // The object was not retrieved successfully.
          // error is a Parse.Error with an error code and message.
        }
      });
    }
  
};

document.addEventListener('DOMContentLoaded', function () {
  Parse.initialize("zMzw4YOroYkmhM2YUgPjNMc9BQTxelTMwlb3Oy3h", "GCQ4URRqPsoyXyYVlc48rXuqZEr82Yd4DNeU2Bne");

  cionApp.startApp();     
  $(document).ready(function(){
  	$('#createSession').on('click',function(e){
  		e.preventDefault();  		
  		e.stopImmediatePropagation;  		
  		$('#sessionTitle').show('fast').focus();
  	});
  	$('#signUp').on('click',function(e){
  		cionApp.signUp
  	});
  	$('#sessionTitle').on('keypress',function(e) {
  		var code = e.keyCode || e.which;
		 if(code == 13) { 
		 	var title = $('#sessionTitle').val();  
		 	cionApp.createSession(title);
		 }
  	});
  	cionApp.checkSession();  	
  })
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}

function checkCookie(cname) {
    var session_id=getCookie(cname);    
    if (session_id!="") {
    	var Session = Parse.Object.extend("Session");	
    	var session = new Session;
    	var query = new Parse.Query(Session);
		query.get(session_id, {
		  success: function(session) {
		    console.log(session);
		  },
		  error: function(error) {
		    // error is an instance of Parse.Error.
		  }
		});
        alert(session_id);
    }else{
        alert('theres no fucijn sesions')
    }
}