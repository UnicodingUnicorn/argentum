# argentum v0.0.1

argentum backend API

- [General](#general)
	- [Ping API](#ping-api)
	
- [Station](#station)
	- [Add a station](#add-a-station)
	- [Get a specific station by ID](#get-a-specific-station-by-id)
	- [Get all the stations](#get-all-the-stations)
	
- [User](#user)
	- [Add a user with error checking](#add-a-user-with-error-checking)
	- [Get a user&#39;s infomation from his JWT](#get-a-user&#39;s-infomation-from-his-jwt)
	- [Get a user by username](#get-a-user-by-username)
	- [Log a user in based on username and password](#log-a-user-in-based-on-username-and-password)
	


# General

## Ping API



	GET /


### Success Response

Success-Response:

```
HTTP/1.1 200 OK
{
    "message" : "Received"
}
```
# Station

## Add a station



	POST /addstation


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| token			| String			|  <p>User JWT for authentication</p>							|
| name			| String			|  <p>Name of new Station</p>							|
| stream			| String			|  <p>Stream URL of new Station</p>							|

### Success Response

Success=Response

```
HTTP/1.1 200 OK
{
    "message" : "Success!"
    "station" : {<station>}
}
```
## Get a specific station by ID



	GET /stations/:station


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| station			| 			|  <p>ID of the station</p>							|

### Success Response

Success-Response:

```
HTTP/1.1 200 OK
{
    "message" : "Success!"
    "station" : {<station>}
}
```
## Get all the stations



	GET /stations


### Success Response

Success Response:

```
HTTP/1.1 200 OK
{
    "message" : "Success!",
    "stations" : [{station}...]
}
```
### Error Response

Database Error

```
HTTP/1.1 500 Internal Server Error
{
    "message" : "Database Error"
}
```
# User

## Add a user with error checking



	POST /adduser


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| username			| String			|  <p>Proposed username for new user</p>							|
| email			| String			|  <p>New user's email</p>							|
| password			| String			|  <p>Proposed password for new user. Minimum strength is not enforced server-side.</p>							|

### Success Response

Success-Response:

```
HTTP/1.1 200 OK
{
    "message" : "Success",
    "token" : {"token" : "<JWT>", "expiry" : 1}
}
```
### Error Response

Database Error:

```
HTTP/1.1 500 Internal Server Error
{
    "message" : "Database error"
}
```
User Exists:

```
HTTP/1.1 400 Bad Request
{
    "message" : "User already exists"
}
```
## Get a user&#39;s infomation from his JWT



	GET /user


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| token			| String			|  <p>JWT</p>							|

### Success Response

Success-Response:

```
HTTP/1.1 200 OK
{
    "message" : "Success!"
    "user" : {<user>}
}
```
## Get a user by username



	GET /user/:username


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| username			| String			|  <p>User's username</p>							|

## Log a user in based on username and password



	POST /login


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| username			| String			|  <p>User's username</p>							|
| password			| String			|  <p>User's password</p>							|

### Success Response

Success-Response:

```
HTTP/1.1 200 OK
{
    "message" : "Success!",
    "token" : {"token" : "<JWT>", "expiry" : 1}
}
```
### Error Response

Database Error:

```
 	HTTP/1.1 500 Internal Server Error
 	{
	    message : "Database error"
 	}
```
User not Found:

```
 	HTTP/1.1 400 Bad Request
 	{
	    message : "User not found"
 	}
```
Incorrect Password:

```
 	HTTP/1.1 400 Bad Request
 	{
	    message : "Incorrect Password"
 	}
```

