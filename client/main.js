import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session'
import './main.html';

Session.set('sending', false)
const handle = Meteor.subscribe('vote');
Meteor.subscribe('bannedChairs');
number = 0

Tracker.autorun(() => {
  // const isReady = handle.ready();
  // console.log(`Handle is ${isReady ? 'ready' : 'not ready'}`);

  if (handle.ready()) {
  	document.getElementById("couvercle").style.opacity=0
  	setTimeout(function(){
	   	document.getElementById("couvercle").style.display="none"
  	},1000)
  }
});

Template.svg.onCreated(function helloOnCreated() {
	Vote = new Mongo.Collection('vote');
	BannedChairs = new Mongo.Collection('bannedChairs');
	// console.log("client side collection created")

});

Template.svg.helpers({
  counter() {
    return Template.instance().counter.get();
  },

  toggleVisible(id){
  	// console.log("getting bob ", id)
  	if(Vote.find({name:id}).fetch()[0].connected){
  		return "block"
  	}else{
  		return "none"
  	}
  },

  toggleVotePour(id){
  	// console.log("getting vote pour", id)
  	if(Vote.find({name:id}).fetch()[0].yorn){
  		return 1
  	}else{
  		return 0
  	}
  },  

  toggleVoteContre(id){
  	// console.log("getting vote contre", id)
  	if(Vote.find({name:id}).fetch()[0].yorn){
  		return 0
  	}else{
  		return 1
  	}
  }
});

Template.svg.events({
/*  'click button'(instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },*/

  'click .chair'(event){
  	number = event.currentTarget.id.substr(1)
  	if (BannedChairs.findOne({nr:number})) {
  		return
  	}else{
	  	// console.log("chair clicked", number)
	  	document.getElementById("diagContainer").style.display="block";
	  	setTimeout(function(){
		  	document.getElementById("diagContainer").style.opacity=1;
	  	},0)
	}
  },

  'click .bonhomme'(event, instance){
  	// console.log("ho ho t'as cliqué sur un bonhomme ", event.currentTarget.id.substr(1))
  	var result = getCookie("enableClick")

  	if(result===Vote.find({name:"M"+event.currentTarget.id.substr(1)}).fetch()[0].who){
  		tempYorn = Vote.find({name:"M"+event.currentTarget.id.substr(1)}).fetch()[0].yorn
  		tempYorn =! tempYorn
		Vote.update(Vote.find({name:"M"+event.currentTarget.id.substr(1)}).fetch()[0]._id, { $set: { yorn: tempYorn },});
		// console.log("yorn? ",tempYorn)
  	}else{
  		// console.log("c'est pas toi t'a pas le droit!")
  	}
  }
});

Template.dialog.events({
	'click #send'(instance){
		if(Session.get('sending')){return}else{
		Session.set('sending', true)
		// console.log(document.getElementById("diagMail").value)
		// console.log(document.getElementById("diagName").value)

		// là faut checker que

		document.getElementById("send").innerHTML="connection en cours..."

		Meteor.call('connect', document.getElementById("diagMail").value, document.getElementById("diagName").value, number, function (error, result) {
            
            if(error){
				switch(error.error){
					case 500 :
						// console.log("uh oh probably bad mail");
						alert("ah ben flûte on dirait que cet email n'est pas présent dans ma base de données. ou alors le serveur est planté mais bon c'est moins vraisemblable")
					break;
					case "badPassWord":
						// console.log("uh oh bad pwd")
						alert("ah ouais cette adresse mail est bien dans la DB mais par contre c'est pas le bon nom a priori.")
					break;
					case "alreadyConnected":
						alert("vous avez déjà voté ou alors quelqu'un a voté pour vous hahaha. hum.")
					break;
				}
			}else{
				// console.log("ok get in ", number)
				Vote.update(Vote.find({name:"M"+number}).fetch()[0]._id, { $set: { connected: true },});
				BannedChairs.insert({nr:number})
				setCookie("enableClick", diagName.value, 30)		
  			}

			document.getElementById("diagContainer").style.opacity=0;
			document.getElementById("send").innerHTML="CONNECTION"
			document.getElementById("diagMail").value=""
			document.getElementById("diagName").value=""
	  		
	  		setTimeout(function(){
	  			 document.getElementById("diagContainer").style.display="none";
	  		}, 333)
		Session.set('sending', false)
        })
		}
	},

	'click #close'(){
  		document.getElementById("diagContainer").style.opacity=0;
  		setTimeout(function(){
  			 document.getElementById("diagContainer").style.display="none";
  		}, 333)
	}

})

// document.getElementById("M1").querySelectorAll('[id$="_contre"]')
// pour chopper le bon child

  setCookie = function(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
} 

 getCookie = function(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
} 

getEventElement = function(event){
	// console.log(event.currentTarget.id.substr(1))
}


window.onkeydown = function(event){
	// console.log("KEYDOWN ", event.keyCode)

	if(event.keyCode==27){
		//echap
  		document.getElementById("diagContainer").style.opacity=0;
  		setTimeout(function(){
  			 document.getElementById("diagContainer").style.display="none";
  		}, 333)
	}
}; 

/*window.onmousemove = function(event){
	if(event.target.localName == "path"){
	console.log("mouse moooove ", event)
		
	}
}; 
*/
