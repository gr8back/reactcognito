# Getting Started 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Live Demo
Check out the live demo from my S3 Bucket

http://reactcognito.s3-website.us-east-2.amazonaws.com/

## What is this project

This is a simple starting point for a larger application.  This is a react app with AWS
cognito for user authentication.  There are lots of options for Cognito user pools, so, thats
why I say this is a starting point.    It's really just one component - nav.jsx.  

### `npm start`

After inputting your AWS Cognito credentials: client-id, pool-id, identity-pool and region,
the cognito app should work.   Dont' forget that your client_id is located in the 'app integration screen' in your user
pool.  If you don't change that, nothing will work. 

### `Notifications`

Using toastr for notfications, but, obviously this can be changed to whatever is desired.
Customize the tostr error and info messages to more user friendly ones

### `Styling & Animation`

This app uses Materialize.css for some CSS features.  I've also added React-Greensock for some additional 
animation features, that really haven't been built out yet.  

### `JQuery`

This app uses Jquery to switch between sign-in views.  This could easily be done in a more React way with
different views as state.     

### `Attributes can be added`

You can add attributes to your Cognito users in user pools, I've included one in the slide-out, that
will add a phone number.  Its pretty easy to adjust the attribute to something else.  Consult
the Cognito documentation for available attributes.

See more information here:
https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html

### `Uses a slider for account details`

**Note: This is a starting point for an application.  Will be adding basic CRUD functionality with Amplify GraphQL endpoint**

**Note: Multiple users can sign-up with the same email, but, then some functionality will
be lost.  You may see 400 and 500 http errors if there are multiple users with same email.
