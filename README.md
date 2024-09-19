# Prompt Manager

table of contents:
# Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Setting up the server](#setting-up-the-server)
4. [Upcoming Features](#upcoming-features)

# Introduction

a prompt management system, implemented by **NodeJS, Express** and **Sequelize ORM** with a frontend that have a minimal design implemented with **Pico.css** library and plain **JavaScript.**

you can add, edit, mark and delete prompts in this app. 

# Installation

## Docker
Go to the root folder of the app and run:
```bash
docker-compose up
```
## Manual

to use the app you should install the latest version of NodeJS and other required packages such as Express and Sequelize.

you can follow installation manual on the following docs:

https://nodejs.org/en/download/package-manager/current

https://expressjs.com/en/starter/installing.html

https://sequelize.org/docs/v6/getting-started/


>⚠️ To allow all frontend api fetches you should install cors middleware package after installing NodeJS and ExpressJS:
>  ```bash
>  npm install cors
>  ```
>


---
>💡the app database setting is configured on a local postgreSQL server. you can change the setting in **models.js** file.
>In order to use postgreSQL you can follow installation guide bellow and change the configuration parameters of the app according to your local postgre server.
https://www.postgresql.org/

# Setting up the server

the server is set to run on port **3000**. 

after finishing the installation go to projects root directory and use the following command to run the app:

```bash
node backend/app.js
```

# Upcoming features

✨adding priority to prompts and sorting them according to their priority

🚀user authentication
