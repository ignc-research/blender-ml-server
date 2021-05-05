# Node server for the blender-ml web app
This repository contains the NodeJs server that is used to facilitate the communication between the Frontend (available at ignc-research/blender-ml-web) and the Backend (available at ignc-research/blender-ml-docker).

#### Note that the server must be up and running before either of the FE or BE in order to ensure complete connectivity.

### How to install and run the server

First clone the files and from inside the cloned directory, install nodemon first

### `npm install -g nodemon`

Nodemon is used to detect file changes automatically. 

Run app.js 

### `nodemon app.js`

The server by default is set to run on the localhost at port 3001. This can be changed in the **app.js** file.