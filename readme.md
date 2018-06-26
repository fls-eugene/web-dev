# Description

Startup template for Website Development with the following features.

* Project based config settings
* Monitors changes for .html, .scss, .js
* Optionally monitors specified files, ex: .php, screenshot.png etc
* Auto browser reload, even across local network
* Automated .scss to .css compiling, with prefixing and minifying
* Html minifying


I am using this with Visual Studio Code, however, any node.js with npm compatible editor should work. It works for static html websites, as well as proxy based server such as [Xampp](https://www.apachefriends.org/index.html) or php based sites for WordPress development.

# The Short Version

Copy package.json, gulpfile.js and .gitignore (recommended) to an empty project folder. 

One time commands:

* `npm install` (wait for it)
* `gulp` to create a project config file 

Run the `gulp` command from the terminal to start the automation and to stop, from the terminal press **ctrl**+**c** and say yes.

The terminal can be found from the top menu, **View** > **Integrated Terminal**.

# The Long Version
## Software Installation
* [Visual Studio Code](https://code.visualstudio.com/) (or similar)
* [Node.js](https://nodejs.org/en/)
* (Optionally) [Xampp](https://www.apachefriends.org/download.html)

## New Project

Start VS Code and open an empty folder for a new project

Either download the following files to your project folder or clone the git repository or use git clone

* package.json
* gulpfile.js
* .gitignore (recommended)

Git clone

* Clone the project: `git clone https://github.com/fls-eugene/web-dev.git .`


Afterwards: From the terminal, run the following commands.

* Install packages: `npm install` (may take some time)
* One Time `gulp`

## Project Configuration

After running `gulp` the first time, a **gulpconfig.json** file will be generated. Edit the file for project specific requirements. 

### Build Folder

This is where the compiled files will be saved to.

``` json
 "paths": {
    "build": "./build",
```

### SCSS

Which file is the .scss file to compile

``` json
 "sass_file": "./source/css/style.scss",
```

### Additional files
These files or patterns will be monitored too.

``` json
 "files": [
    "style.css",
    "screenshot.png",
    "**/*.php"
```


---

## Development Server address

For more information check out: [Browsersync](https://browsersync.io/docs/gulp) 

### Local/Static Server (Default)

Important, if you change the project's build folder, make sure that the baseDir is the same.

```json
  "localserver": {
    "server": {
      "baseDir": "./build"
```

### Proxy Server (WordPress)
For a proxy based server approach, such as Xampp for php and WordPress, make sure `useproxy` is `true` as well as what ever your server address is.

``` json
  "useproxy": true,
  "server": {
     "proxy": "?.?.?.?/??YOUR-URL??"
```

---

## Side Notes
This repository does not include the node_modules or package-lock.json as it is intended to be used as a template to start other projects. Simply leave those files in your project.
