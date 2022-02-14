#See Your Story

>The purpose of the see your story application is for writers of all types to be able to store notes on their stories, create characters and give each character a journal where they can take notes on that particular character.

>The application is broken up into two parts the server, which handles all of the requests and the client that allows the user to >access it.

##Client Links:##
- Repo: https://github.com/dsilverfox/seeyourstoryclient
- Deployed: https://seeyourstoryclient.herokuapp.com/

#Server:#
>The server starts its journey with four endpoints.
>-/Auth
>-/Stories
>-/Characters
>-/Journal

#**/Auth**#
Auth gets you to all of your user activities for both standard users and admin.

	##/signup##
Signup is the endpoint that all users both admin and regular will use to create their user account. It requires you enter a username and a password. It assigns you a randomly generated ID. Provides the message "user created" and the id and session token when the user is successfully created.

If the user tries to use a username that is already taken they will receive the error "Username is already in use."

If it does not create successfully you will get the error "Failed to register user:" and any error details the system has.

	##/login##
Login is the endpoint used to actually log a user in once they have created their username and password. This controls whether or not protected information is displayed.

If login is successful the server will display "logged in" and the user id and session token.

Failure to login will provide one of three errors depending upon the reason. You'll get a 502 bad gateway, 500 for failed to authenticate and a 501 for server does not support this functionality.

	##/delete##
Delete allows a user to delete their own account. Provides the message "User Removed" when it completes successfully.

Returns an error 500 and any error details it has for any reason it does not delete.

#>**ADMIN Endpoints**#
Using the same login process admins are granted access to additional routes. 

A server admin will have to set your admin access if you believe you should have them.

	##/userinfo##
Userinfo provides admins with a list of all of the users that exist on the system. It provides them with the users ID and username.

If it succeeds you will see an array of objects for each of the users in the system.

If it fails you will receive an error 404 "user not found" this is generally because you lack the access.

	##/delete/:id##
Delete by ID allows an admin to delete an individual user and provides the message "User Removed" when it completes successfully.

If it fails it is likely because you have the wrong ID and it will return a 500 and any error remarks it has from the system.

#**/Story**#
After creating a user account, the next thing a user will need to do is create their first story. The story endpoint provides all of the endpoints necessary to have complete control of the story.
	
A user can have as many stories as they wish.

	##/Create##
Asks the user to provide a title and some content to create a story.

If it works the system returns the story as an object with the message "story created"

If something fails in the process the system returns "Failure to create story:" and any error details it has.

Users have multiple view options they can choose to view a single story, which is necessary for them to view the characters attached to that story. Alternatively they can view all of their stories so they can choose one to work on.

	##/view##
Allows the user to view all of their stories, this is the default that will run when a user clicks view stories. The system searches for all of the stories attached to their unique user id and displays them in a list of objects.

On success the server provides a list of objects including the story title and content and the individual story id and the user id it's attached to.

On failure it returns error details.

	##/view/:id##
This allows a user to view a single story. It checks to make sure that the user ID is attached to the story and then makes sure it has the right story by comparing the story id entered in the :id field with the story it found.

If it succeeds it provides the story as an object with the user id it's attached to, it's own story id and the story title and content.

If it fails it returns whatever error detail the system provides.

	##/update/:id##
This also makes use of an individual story id, to allow the user to edit their story.

On success it provides the story id, new title and new content.

On failure it provides whatever error details the system has.

	##/delete/:storyId##
This makes use of the individual story ID to delete the associated story.

On success it removes the story and provides the message "story removed"

On failure it provides whatever error details the system has.

#**/Characters**#
The characters endpoint allows users to create characters for their stories. They must be attached to a story. When the story is deleted the characters go with it. A story can have as many characters as the user wants.

	##/create/:storyId##
The create endpoint allows a user to create a character to attach to the currently viewed story. They will be asked to enter a firstname, last name, gender, age, date of birth.

On success it will return the characters object with it's character ID and the story and user ids it's attached to. It provides the message "Character Created."

On failure it provides the error "Failed to create character" and any error details it has available.

	##/view##
This views all characters attached to a specific story id. 

On success it provides a list of objects including all currently created characters on that story.
	
	##/view/:characterId##
This allows you to view a single character and will fire when you select a character.

On success it provides the character detail.

On failure it gives you any detail the error provides.

	##/update/:characterId##
This endpoint allows you to edit your character. You will first select the character and on the detail page will be an edit button.

On success it will update the story and re-run the select.

On failure it gives you any detail the error provides.

	##/delete/:characterId##
This endpoint will allow you to delete the character, this action cannot be undone.

On success it will show "Character Removed".

On failure it gives you any detail the error provides.

#**/Journal**#
Each character will have the ability to create a journal for notes on that specific character.

	##/create/:characterId##
This endpoint will enable you to create a journal attached to the character it belongs to.

On success it will provide the message 'journal created' and the new journal entry.

On failure it will give the message 'Failed to Create Journal' and any error message that the system provides.

	##/view/:characterId##
Once created this will allow you to pull up the characters journal.

On success it will display the journal page.

On failure it will provide any errors the system provides.

	##/update/:journalId##
This will enable you to edit the journal entry.

On success it will display the updated journal.

On failure it will display whatever error information the system can provide.

	##/delete/:journalId##
This endpoint enables you to delete a journal without deleting the character it is attached to. This enables you to change the note details associated with the character.

On success it will display the message 'journal removed'.

On failure it will provide whatever error information the system has.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
