#!/usr/bin/env node
import chalk from 'chalk';

console.log(chalk.rgb(9, 218, 158).bold('---- Hello Chalk 21 ----'))
console.log(chalk.rgb(9, 218, 158).visible('---- Hello Chalk 21 ----'))
console.log(chalk.hex('#09DA9E').visible('---- Hello Chalk 21 ----'))

console.log(chalk.bgHex('#09DA9E').visible('---- Hello Chalk 21 ----'))
console.log(chalk.bgRgb(9, 218, 158).visible('---- Hello Chalk 21 ----'))





