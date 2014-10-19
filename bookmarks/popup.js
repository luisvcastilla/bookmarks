var cionApp = {
  session_id : '',
  myAlert: function() {
  	chrome.browserAction.setBadgeText({text:'i'})
  	$('<div/>').text('I appeared').addClass('red').appendTo('body');
  },  
  addUrl: function() {
  	chrome.tabs.getSelected(null, function(tab) {
        var tabId = tab.id;	
        var tabUrl = tab.url;          
        var tabTitle = tab.title;          
	  	var Session = Parse.Object.extend("Session");		
	  	var query = new Parse.Query(Session);
      
	      query.get(session_id, {
	        success: function(session) {	          
	            var Url = Parse.Object.extend("Url");		
				var user = Parse.User.current();			
				var url = new Url();		
				
				url.set("link", tabUrl);
				url.set("title", tabTitle);
				
				url.set("parent", session);
				url.save(null, {
					success: function(url) {
						var session = url.get('parent');
						var relation = user.relation("follows");	
						relation.add(session);
						user.save();
						// console.log(session.id)						
					}
				});						
			  	// console.log(url.attributes);
			  	cionApp.showUrl(url);
	        },
	        error: function(object, error) {
	          // The object was not retrieved successfully.
	          // error is a Parse.Error with an error code and message.
	        }
	      });		
	});	
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
				var relation = user.relation('follows');	
				relation.add(session);
				user.save();
				// console.log(session.id)
				$('#session-title').text(session.get('title'));	  				  	
				$('#sesiones').hide();
				setCookie('session_id',session.id, 36500000000);	  					
			}
		});				
	  	// console.log(url.attributes);
	  	cionApp.showUrl(url);
	  	cionApp.changeToAddUrlView();
	  	
    });	
  },
  joinSession: function(session_id) {
        var Session = Parse.Object.extend("Session");
        var query = new Parse.Query(Session);
        console.log(session_id);
        query.get(session_id, {
	        success: function(session) {
	          var user = Parse.User.current();
	          // console.log(session.id);
	          var relation = user.relation("follows");  
	          relation.add(session);          
	          user.save();
	          setCookie('session_id', session.id, 365);
	          location.reload();	          
	        },
	        error: function(object, error) {
	        	
	        }
        });
  },
  changeToAddUrlView: function() {
  	$('#createSession').hide('slow');
	$('#sessionTitle').hide('fast');  	
  	$('#switchFeed').show('slow');
  	$('#addUrl').show('slow');
  },
  showUrl: function(url) {
  	console.log(url.id)
  	var div = $('<div/>').addClass('url-container');
  	$('<a/>').addClass('url').attr('href',url.get('link')).html(url.get('title')+' <i class="fa fa-remove pull-right delete"></i>').appendTo(div);
  	div.prependTo('#feed');
  },
  showSession: function(session) {  	
  	// console.log(session.id);
  	$('<option/>').addClass('session').attr('value', session.id).val(session.id).text(session.get('title')).appendTo('#sessionOption');
  },
  signUp: function() {
    username = $('#username').val();
    password = $('#password').val();
    if(username == "" || password == ""){
      console.log('empty')
      return;
    } else {
  		var user = new Parse.User();
			user.set("username", username);
			user.set("password", password);

			user.signUp(null, {
			  success: function(user) {
			    console.log('Signup succesful');
	          	location.reload();
			  },
			  error: function(user, error) {
			    // Show the error message somewhere and let the user try again.
			    alert("User sign up has failed :(\n Error: " + error.code + " " + error.message);
			  }
		});
	}
  },
  checkSession: function(){
  	var user = Parse.User.current();
  	if(user) {  		
  		$('#createSession, #feed').show('fast');
  		$('#loginBlock').hide();
  		var sm = $('<small/>').addClass('text-muted').text(user.get('username')).appendTo('body');
  		sm.append('<small id="logOut" class="link"> (logout)</small>');
  	}
  	checkCookie("session_id");
  },  
  logIn: function() {
    username = $('#username').val();
    password = $('#password').val();    
    if(username == "" || password == ""){
      console.log('empty')
      return;
    } else{
      Parse.User.logIn(username, password, {
        success: function(user) {
          console.log('Login succesful');
          location.reload();
        },
        error: function(user, error) {
         alert("USER LOG IN FAILED MISERABLY, Error: " + error.code + " " + error.message);
        }
      });
    }
        },

    logOut: function() {
      setCookie('session_id','', -36500000000);	  					
      Parse.User.logOut();
      location.reload();
    },
    SessionlogOut: function() {
    	setCookie('session_id','', -36500000000);	  					
    	location.reload();
    },
    getSessions: function() {
      var user = Parse.User.current();
      var relation = user.relation("follows");
      // relation.query().descending("updatedAt");
      relation.query().find({
       success: function(results){          
          for (var i = 0; i < results.length; i++) {
	          var object = results[i];	          
	          cionApp.showSession(object);
	          console.log(object);
	      }                    
        }
      });
    },

    getUrls: function(session){

    var Url = Parse.Object.extend("Url");
    var query = new Parse.Query(Url);
    query.equalTo("parent", session);
    console.log(session);
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

    getUrlsFromSession: function(session_id){
      var Session = Parse.Object.extend("Session");
      var query = new Parse.Query(Session);
      
      query.get(session_id, {
        success: function(session) {
          // console.log(session.id);
          $('#session-title').text(session.get('title'));	  				  	
          var sm = $('<small/>').addClass('text-muted pull-right').html('Session id: <b>'+session.id+'</b>').appendTo('body');
  			sm.append('<small id="SessionlogOut" class="link"> (Session logout)</small>');
          cionApp.getUrls(session);
        },
        error: function(object, error) {
          // The object was not retrieved successfully.
          // error is a Parse.Error with an error code and message.
        }
      });
    },
    openUrl: function(newURL) {    	    	
    	chrome.tabs.create({ url: newURL });
    }
};

document.addEventListener('DOMContentLoaded', function () {
  Parse.initialize("zMzw4YOroYkmhM2YUgPjNMc9BQTxelTMwlb3Oy3h", "GCQ4URRqPsoyXyYVlc48rXuqZEr82Yd4DNeU2Bne");  
  $(document).ready(function(){
  	$('#createSession').on('click',function(e){
  		e.preventDefault();  		
  		e.stopImmediatePropagation;  		
  		$('#sessionTitle').show('fast').focus();
  	});
  	$('#signUp').on('click',function(e){
  		cionApp.signUp();
  	});  	
  	$('#logIn').on('click',function(e){
  		cionApp.logIn();
  	});  	
  	$('#addUrl').on('click',function(e){
  		cionApp.addUrl();
  	});  	

  	$('#sessionOption').on('change',function(e){
  		var id_ses = $('#sessionOption').val();
  		setCookie('session_id', id_ses, 36500000000);
  		location.reload();
  	});  	

  	$('#sessionTitle').on('keypress',function(e) {
  		var code = e.keyCode || e.which;
		 if(code == 13) { 
		 	var title = $('#sessionTitle').val();  
		 	cionApp.createSession(title);
		 }
  	});

  	$('#joinSession').on('keypress',function(e) {
  		var code = e.keyCode || e.which;
		 if(code == 13) { 
		 	var session_id = $('#joinSession').val();  
		 	cionApp.joinSession(session_id);
		 }
  	});

  	
  	cionApp.checkSession();  	  	
  }).on('click', '#logOut', function(){  	
  		cionApp.logOut();
  }).on('click', '#SessionlogOut', function(){  	
  		cionApp.SessionlogOut();
  }).on('click','.url', function(e){
  	// console.log($(this));
  	var url = $(this).attr('href');
// console.log(url);
  	cionApp.openUrl(url);
  });

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
    session_id=getCookie(cname);    
    if (session_id!="") {
        cionApp.getUrlsFromSession(session_id);
        $('#createSession').hide();
        $('#addUrl').show();        
    } else {
      	cionApp.getSessions();  
      	$('#sesiones').show();
        // console.log('No sessions');
    }
}