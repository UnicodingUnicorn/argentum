module.exports = function(mongoose, models){
	var OAuthTokens = models.OAuthTokens;
	var OAuthClients = models.OAuthClients;
	var User = models.User;
	
	return {
		getAccessToken : function(bearerToken){
			return OAuthTokens.findOne({accessToken : bearerToken});
		},
		getClient : function(clientId, clientSecret){
			return OAuthClients.findOne({clientId : clientId, clientSecret : clientSecret});
		},
		getRefreshToken : function(refreshToken){
			return OAuthTokens.findOne({refreshToken : refreshToken});
		},
		getUser : function(username, password){
			return OAuthUsersModel.findOne({username : username, password : password});
		},
		saveToken : function(token, client, user){
			var accessToken = new OAuthTokens({
				accessToken : token.accessToken,
				accessTokenExpiresOn : token.accessTokenExpiresOn,
				clientId : client.id,
				refreshToken : token.refreshToken,
				refreshTokenExpiresOn : token.refreshTokenExpiresOn,
				userId : user.id
			});
			return accessToken.save();
		}
	};
};