# Web Rebels 2015 Conference

[![Dependencies](https://img.shields.io/david/webrebels/web-rebels-2015.svg?style=flat-square)](https://david-dm.org/webrebels/web-rebels-2015)

This is the source code for the Web Rebels 2015 Conference web site.

# Before we start

Where you check out your code from github is entirely up to you and every time 
this document refer to ```{project_path}``` it does refer to the path where you 
have chosen to check out this project.

# Development

This is a [node.js](http://nodejs.org/) application. The structure of this 
project is built as an [npm](https://npmjs.org/) package for easy development 
and distribution.

## Getting up and running

Install [node.js](http://nodejs.org/) according to the documentation of the 
node.js project.

### Install dependencies:

    cd {project_path}
    npm install

### Start the server:

    cd {project_path}
    npm start

You should now be able to access the application at 
[http://localhost:8000/](http://localhost:8000/)



# Deployment to production

This application is hosted at [Modulus](https://modulus.io/). To deploy to 
production you need to install the [Modulus Client](https://github.com/onmodulus/modulus-cli) 
which is the commandline tool to administer applications running at Modulus. 

The Modulus Client is installed by the following command:

    npm install modulus -g

Modulus is then installed globally so it can be executed from any path. 

To deploy (or run any other operation on our app), one need to log in. Login is 
done by the following command:

    modulus login

When logged in your able to operate the applications running on Modulus.

To deploy this application to Modulus, run the following commands:

    cd {project_path}
    npm run min
    modulus deploy
