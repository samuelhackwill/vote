import { Meteor } from 'meteor/meteor';
import '../collections/collections.js';
import { Session } from 'meteor/session'

Meteor.startup(() => {

	Meteor.publish('vote', function () {
	  return Vote.find({});
	});
	Meteor.publish('bannedChairs', function () {
	  return BannedChairs.find({});
	});


});

Meteor.methods({

 'connect'(_mail, _name, chair) {
 		console.log(_mail, _name)


		var foundUser = Users.find({mail:_mail}).fetch()
		var goodName = Users.find({mail:_mail}).fetch()[0].name
		// hulalalaal le serveur il aime vraiment pas cette ligne et il plante direct.
		// bon du coup si c'est une erreur 500 c'est prob que le mail est pas bon zeby

		if((foundUser)&&(goodName===_name)){
			if(Users.find({mail:_mail}).fetch()[0].connected){
				throw new Meteor.Error("alreadyConnected", "barrez vous");	
			}
			Users.update(Users.find({mail:_mail}).fetch()[0]._id, { $set: { connected: true }} , { upsert: true })
			Vote.update(Vote.find({name:"M"+chair}).fetch()[0]._id, { $set: {who : goodName}})
			return("yiiihaw")
		}else{
			throw new Meteor.Error("badPassWord", "On dirait que c'est pas le bon mot de passe");
		}
},

'pushCred'(_mail, _name){
	Users.insert({ mail: _mail, name: _name });
}
})


/*'pushCred'(_mail, _name){
	Users.insert({ mail: _mail, name: _name });
}*/