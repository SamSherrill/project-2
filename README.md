# Steam Comparison

Are you a Steam user? Do you have friends who own Steam games and want to play together? Steam Comparison is an interactive app where you can enter you and your friends' Steam ID, and see if you share a game with your pal!

![screenshot](./public/images/project_02_steam-comparison.png)

## Description

Steam Comparison is a Steam API based app that lets users get their games list from Steam and compare their list to that of a friend's list. The application will display both the user list and the list of the other searched individual, also with a third list if matching games are found.

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Design](#design)
* [Contributors](#contributors)
* [Website](#website)
* [Repository](#repository)
* [Questions](#questions)
* [License](#license)

## Installation

No installation necessary.

```sh
npm install
```

## Usage

Option 1) Go to the provided <a href="https://steam-comparison.herokuapp.com/">link</a> to experience the website or,

Option 2) download and install MySQL Server and MySQL Workbench and build your own database to use wth the application. 

If use want to run the app on your own machine, first clone the repository to your system, then follow the above installation step(s), then setup your database for use with the application by copying the `schema.sql` file from the `db` folder and pasting the contents into the MySql Workbench query pane and running the script with the 'lightning bolt' icon. Then copy the contents from the `seeds.sql` file and running those scripts in the workbench query pane.

Ensure that your MySQL root password is set in the `connection.js` file housed in `config` folder.

Run the application in the command line with:

```sh
node server.js
```

Note: if the above command throws an error, make sure the file is first being targeted by running the command within the root of the project folder.


The following demonstrates general application functionality:

![steam-comparison demo](./public/assets/img/eat-da-burger-demo.gif)

## Contributors

* SamSherrill
* jessie-computes
* drospond
* AlanAshworth

## Website

[Deployed Application](https://steam-comparison.herokuapp.com/)

## Repository

[Github Repository](https://github.com/SamSherrill/project-2)

## Questions

<img src="https://avatars2.githubusercontent.com/u/38333695?v=4" alt="avatar" width="100px" height="100px" />
<img src="https://avatars0.githubusercontent.com/u/60405600?v=4" alt="avatar" width="100px" height="100px" />
<img src="https://avatars1.githubusercontent.com/u/43630721?v=4" alt="avatar" width="100px" height="100px" />
<img src="https://avatars3.githubusercontent.com/u/54105679?v=4" alt="avatar" width="100px" height="100px" />

Contact me at <a href="mailto:awashworth927@gmail.com">awashworth927@gmail.com</a>

## License

![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)©