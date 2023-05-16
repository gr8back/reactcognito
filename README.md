# Getting Started 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## What is this project

This is a simple starting point for a larger application.  This is a react app with AWS
cognito for user authentication.  There are lots of options for Cognito user pools, so, thats
why I say this is a starting point.   

### `npm start`

After inputting your AWS Cognito credentials: client-id, pool-id, identity-pool and region,
the cognito app should work.   It's really just one additional component - nav.jsx.  

### `Notifications`

Using toastr for notfications, but, obviously this can be changed to whatever is desired.
Customize the tostr error and info messages to more user friendly ones

### `Attributes can be added`

You can add attributes to your Cognito users in user pools, I've included one in the slide-out, that
will add a phone number.  Its pretty easy to adjust the attribute to something else.  Consult
the Cognito documentation for available attributes.

### `Uses a slider for account details`

**Note: This is a starting point for an application.  Will be adding basic CRUD functionality with Amplify GraphQL endpoint**
Dont' forget that your client_id is located in the 'app integration screen' in your user
pool.  If you don't change that, nothing will work.

**Note: Multiple users can sign-up with the same email, but, then some functionality will
be lost.  You may see 400 and 500 http errors if there are multiple users with same email.
