#!/usr/bin/env node
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var del = require('del');
var exec = require('child_process').exec;

// pick up path argument
// [0] will be "node"
// [1] will be the reference to the script: build-scripts/bower2git.js
// [2] will be path to bower directory
var folderPath = process.argv[2];

if (!folderPath) {
    console.err('ABORTING: No path provided!');
    return;
}

// find platform folder
if (!fs.existsSync(folderPath)) {
    console.log(chalk.red('ABORTING: Folder "' + folderPath + '"" does not exist'));
    return;
}

// find bower json
var bowerPath = path.join(folderPath, 'bower.json');
// find folder name
var folderNameArr = path.dirname(folderPath).split('/');
var folderName = folderNameArr[folderNameArr.length - 1];
console.log(folderName);

if (!fs.existsSync(bowerPath)) {
    console.log(chalk.red('ABORTING: No bower.json found in ' + folderPath));
    return;
}

fs.readFile(bowerPath, function (err, data) {
    'use strict';
    if (err) {
        throw err;
    }

    var json = JSON.parse(data);
    var url;
    var tmpFolderName = 'tmp' + Date.now();
    // var parentFolder = path.join('folderPath', '../');
    // console.log('Parent folder: ' + parentFolder);

    console.log('Found bower component: "' + json.name + '"');

    if (!json.repository || !json.repository.url || !json.repository.type) {
        console.log(chalk.red('ABORTING: No repository information found in bower.json'));
        return;
    }

    if (json.repository.type !== 'git') {
        console.log(chalk.red('ABORTING: Not a git repository'));
        return;
    }

    url = json.repository.url;

    console.log('Cloning from ' + url + ' to temporary directory...');

    exec('git clone ' + url + ' ' + tmpFolderName, function (err) {
        if (err) {
            throw err;
        }

        console.log('Done!');

        console.log('Deleting ' + folderPath + ' ...');

        // rename old folder before removing to be able to fallback

        // 1. rename old folder to tmp
        // 2. rename new folder to component name
        // 3. delete old folder


        del(folderPath, function (err) {
            if (err) {
                throw err;
            }

            console.log('Done!');
            console.log('Removing temporary directory...');

            // NOT WORKING??
            fs.rename('./' + tmpFolderName, './' + folderName, function (err) {
                if (err) {
                    throw err;
                }
                console.log(chalk.green('Done!'));
            });

            // find which folder to clone to
            // process.chdir('src/platform');

            // rename tmp to folder name

        });
    });

});

