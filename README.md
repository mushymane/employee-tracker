# Employee Management System

## Description 

This command line app lets you manage your employees. You can view the departments, roles, employees, and also add new departments, 
roles, and employees. You may even update an employee's role.

The app uses MySQL for its relational database.

Here is a video tutorial: [Tutorial](https://watch.screencastify.com/v/cXTe5tQg52vDQX7ztdTT)

## Table of Contents

* [Techonologies Used](#technologies-used)
* [Installation](#installation)
* [Usage](#usage)
* [Code Snippet](#code-snippet)
* [Questions](#questions)
* [Author Links](#author-links)

## Technologies Used

- JavaScript - programming language used for this app
- Node.js - runtime environment
- Inquirer - CLI for Node.js
- MySQL - DBMS
- console.table - npm package for printing tables on command line
- Git - version control
- Github - where the repository is hosted
- Visual Studio Code - text editor
- Screencastify - for recording video

## Installation

- Clone from Github
- Use your command-line to get to the project directory
- Enter the MySQL shell to create and seed the database
- ```mysql -u root -p```
- ```source db/schema.sql```
- ```source db/seeds.sql```
- Exit the shell
- Install the required dependencies with ```npm install```
- Run the app with ```node index.js```

## Usage

Select which option you would like to use. Add to or update the database by answering the prompts accordingly

## Code Snippet

SQL query to update an employee's role
```
SELECT employees.id as eid, 
CONCAT(first_name, ' ', last_name) as name, roles.title as role, roles.id as rid 
FROM employees RIGHT JOIN roles ON employees.role_id = roles.id
```

## Questions

Have any questions? My Github and email:

[My Github Link](https://github.com/mushymane)  
Email: mushymanee@gmail.com

## Author Links
[LinkedIn](https://www.linkedin.com/in/luigilantin/)