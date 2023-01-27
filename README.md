![Wolf Tags Logo](https://wolf-suite.web.app/images/single-blog/wolf-tags/wolf-tags.png)
# Wolf Tags
Wolf Tags is a discord bot that can view, edit, delete, and create tags from Firebase.

# Installation
Wolf Tags required NodeJS version v16 or higher. It may work on older versions, but support is not guaranteed.

You must have a Firebase Firestore database ready. To authenticate into the database, create a private key in Firebase. You can do this by going to Project Settings > Service accounts > Firebase Admin SDK. Click the "Generate new private key" button, then put the downloaded JSON file into the root directory of the bot. Make sure to name this file `firebase.json`. 

After this, you need to run `npm install` in the root directory of the bot in order to install all of the required Node modules. 

Next, you need to create a `.env` file. In this file, create a variable named `TOKEN`. Surround your token in parenthesis. It should look similar to this:
```
TOKEN="NEWOInewoginweawegfoiwa.WEIOEWFthisIOPjeoiisAjgewagewafakeSAtoken"
```

Finally, you can run `node bot.js` to start the bot. The logging level is set to debug by default. 

# Podman Installation
Podman is a daemonless container engine for developing, managing, and running OCI Containers on your Linux System. Containers can either be run as root or in rootless mode. 

Follow the regular instructions until you are about to start the bot.

Use this command to build the image:
```
podman build -t wolf-tags .
```

Use this command to run the container:
```
podman run --name <name of your choosing> wolf-tags
```

# License
Wolf Tags is licensed under the MIT license. See the LICENSE file for more information. 
