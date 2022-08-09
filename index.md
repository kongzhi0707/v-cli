
### nodejs 编写cli命令行工具

<div id="back"></div>

- [一) 创建项目目录及初始化](#id1) <br />
- [二) 给命令行工具起名字为 v-cli](#id2) <br />
- [三) process.argv 读取参数](#id3) <br />
- [四) 学习 commander.js (命令行参数)](#id4) <br />
- [五）学习 Inquirer.js --- 命令行交互工具](#id5) <br />
- [六) 学习 chalk(用于美化控制台输出的语句)](#id6) <br />

  前端日常开发中, 会碰到各种各样的cli工具, 比如vue中 有 @vue/cli, react 中有 create-react-app, 我们只需要一行命令就可以创建我们的vue或react的脚手架. 因此会大大提高我们的开发效率, 因此我们需要学习在node中编写cli命令行工具方便我们日常的学习及开发对应的工具.

  我们要如何开发我们的cli命令工具呢?

#### <div id="id1">一) 创建项目目录及初始化 <a href="#back"> 回到顶部</a></div>

1) 在对应的目录下, 创建项目目录;
```
$ mkdir test-cli
$ cd test-cli && npm init
```
  一直按 enter 键, 在项目的根目录下会生成 package.json 文件. 然后在我们项目根目录新建 index.js 文件.

  添加如下代码:
```
// index.js
console.log('hello world');
```
然后在项目的根目录下 调用命令行: 
```
$ node index.js  // 打印出 hello world
```
为了做的更好点, 我们可以在 package.json 里面的 scripts 字段上添加一个脚本名:
```
{
  "scripts": {
    "hello": "node index.js"
  }
}
```
因此这个时候, 我们只想 npm run hello , 就可以打印输出了; 如下所示:
```
$ test-cli % npm run hello

> test-cli@1.0.0 hello
> node index.js

hello world
```
#### 二) <div id="id2">给命令行工具起名字为 v-cli <a href="#back"> 回到顶部</a></div>

如上是平时打包使用的命令行, 我们现在想在命令行中 和 create-react-app 类似 执行 v-cli 就能执行我们的index.js 代码, 因此我们暂时给我们的命令行工具起名为 v-cli. 我们目的想在命令中执行 v-cli, 就能输出 "hello world".

因此我们的 index.js 文件顶部需要声明执行环境.

2.1) index.js 文件顶部声明执行环境, 代码如下:
```
#!/usr/bin/env node
console.log('hello world');
```
在Shell脚本中， #! 该符号一般在liunx系统的第一行开头出现的，用于指明这个脚本文件的解释程序。npm脚本第一行增加这个程序 #!usr/bin/env node 为了指定使用node执行脚本文件。
不同用户不同系统不同脚本安装在不同的目录中，那么系统如何知道去哪里寻找解释程序呢？/usr/bin/env 就是告诉系统在 PATH 目录下查找，所以配置 #!/usr/bin/env node，就是解决不同用户node路径不同的问题。可以让系统动态的去查找node来执行我们的脚本。

2.2) 在package.json添加 bin 字段.
```
{
  "name": "test-cli",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "bin": {
    "v-cli": "index.js"
  },
  "author": "",
  "license": "ISC"
}
```
bin 字段里面写上该命令行的名字, v-cli, 它告诉 npm, 里面的js脚本可以通过命令行的方式执行, v-cli 来调用. 了解bin字段更多, 可以看 <a href="https://github.com/kongzhi0707/front-end-learn/blob/master/node/bin.md">这篇文章</a>.

2.3) 执行 npm link 测试

在当前项目的根目录下, 打开命令行工具, 执行 npm link, 将当前的代码 软链接到 npm 全局目录下, npm 检测到 package.json 里面存在一个bin字段, 它会在全局npm 包下生存一个可执行文件.

因此当我们在命令行中执行 v-cli 命令的时候, 实际上执行的就是 node index.js.
我们在安装node的时候, npm将这个目录设置为系统环境变量, 当我们执行的时候, 系统会先找到系统命令和系统变量, 然后到变量环境里面查找这个命令后, 然后找到这个目录, 发现匹配上了该命令的可执行文件.
```
$ v-cli
hello world
```
当然如果我们该命令行工具写好了后,我们可以发布到npm包里面去, 以后我们如果想要在项目中使用该包, 我们可以直接和我们安装其他包一样, 安装下即可, 比如 npm i -D
test-cli 即可, 因此它会在我们的依赖包node_modules中, 如果安装成功, 在我们的依赖脚本中 node_modules 有对应的bin目录,里面存放着就是我们的可执行文件.

然后我们可以在 package.json 中配置下, 添加cli配置命令; 比如如下配置:
```
{
  "name": "test-cli",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "bin": {
    "v-cli": "index.js"
  },
  "scripts": {
    "cli": "v-cli"
  },
  "author": "",
  "license": "ISC"
}
```
如上, 我们只要 npm run cli 即可了. 可能我们会问, 现在也是 npm run cli 和我上面的 直接在项目中 npm run xx 有什么区别呢? 我们为什么要发布npm包呢?
但是还是有区别的, 我们直接使用 node index.js 不够灵活, 严重依赖脚本路径, 一旦目录结构发生变化了, 那么scripts中配置中目录路径也要跟着变化, 但是使用 npm 安装后, 本地的cli脚本被拉到了 node_modules里面, 现在我们不依赖于目录结构. 其次,如果有其他的项目要使用该工具, 我们可以在其他项目中安装该包直接调用即可, 可以达到项目中共享使用该工具.

#### <div id="id3">三) process.argv 读取参数 <a href="#back"> 回到顶部</a></div>

现在我们来学习下 使用 process.argv 来获取参数, 比如我们使用 v-cli xxx , 我们想要获取 xxx 这个参数的话, 我们可以使用 node 内置的 process.argv 来获取.

因此命令行上的参数, 我们可以通过 process 这个变量来获取, process 是一个全局对象, 不需要通过 require 来引入, 通过 process 这个对象我们可以拿到当前脚本执行环境等一系列信息. 我们可以在我们的 index.js 中来打印下 process.argv 这个参数值如下:

index.js 代码改成如下:
```
#!/usr/bin/env node
console.log('hello world');
console.log('--process.argv--', process.argv);
```
然后执行 $ v-cli xxx 打印如下:
```
$ % v-cli xxx
hello world
--process.argv-- [ '/usr/local/bin/node', '/usr/local/bin/v-cli', 'xxx' ]
```
如上可以看到, argv 是一个数组, 前两位是固定的, 分别是node程序的路径和脚本存放的位置, 从第三位开始才是我们的参数. 因此我们只要读取 argv 数组的第三位. 然后就可以获取到参数了.
```
#!/usr/bin/env node
console.log('--process.argv--', `${process.argv[2]}`)
```
npm 社区中也有一些优秀的命令行参数解析包, 比如 commander.js, 稍后我们来学习下该包的使用.

#### 子进程

我们脚本还可以通过 child_process 模块新建子进程, 从而执行 Unix 系统命令, 使用 exec 方法, 了解更多 child_process的话, 可以看 <a href="https://github.com/kongzhi0707/front-end-learn/blob/master/node/child_process.md">这篇文章</a>

exec 方法常见接受2个参数, 第一个参数是所要执行的 shell 命令, 第二个参数是回调函数, 该函数接受三个参数, 分别是发生的错误对象, 标准输出的显示结果, 标准错误的显示结果.
```
#!/usr/bin/env node
// index.js 代码如下
var name = process.argv[2];
const { exec } = require('child_process');

exec('echo hello ' + name, function(err, stdout, stderr) {
  if (err) {
    throw err;
  }
  console.log('---输出结果---', stdout);
})
```
  当我们只想 v-cli xxx 的时候, 打印如下:
```
$ v-cli xxx
---输出结果--- hello xxx
```
如果我们想要查看所有的文件, 我们平时在命令行中,执行 ls 即可, 现在我们使用shell命令来操作, index.js 代码改成如下:
```
#!/usr/bin/env node
var name = process.argv[2];
const { exec } = require('child_process');

exec(name, function(err, stdout, stderr) {
  if (err) {
    throw err;
  }
  console.log('---输出结果---', stdout);
})
```
然后我们在命令中执行 v-cli ls 即可打印, 如下:
```
$ % v-cli ls   
---输出结果--- index.js
index.md
package.json
```
#### <div id="id4">四) 学习 commander.js (命令行参数) <a href="#back"> 回到顶部</a></div>

上面我们使用了 process.argv 来获取命令行参数了, 现在我们来学习使用 commander.js , 它可以让nodejs命令行参数更加简单, commander.js 是TJ所写的一个工具包.

4.1) 安装及使用
```
$ npm install commander
```
Commander 使用.option()方法来定义选项，同时可以附加选项的简介。每个选项可以定义一个短选项名称（-后面接单个字符）和一个长选项名称（--后面接一个或多个单词），使用逗号、空格或|分隔。
```
program
  .option('-j | --join','Join IMWeb now!')
```
解析后的选项可以通过Command对象上的.opts()方法获取，同时会被传递给命令处理函数。可以使用.getOptionValue()和.setOptionValue()操作单个选项的值。
index.js 代码如下:
```
#!/usr/bin/env node
var program = require('commander');
program.option('-j | --join','Join IMWeb now!');
program.parse(program.argv);
console.log(program.opts()) // {join: true}
console.log(program.getOptionValue('join')) // true
```
当我们执行 v-cli -j 的时候, 输出如上信息.

下面再来看下 index.js 代码如下:
```
#!/usr/bin/env node
const program = require('commander');
const package = require('./package.json');
program
  .version(package.version)
  .option('-f, --foo', 'enable some foo')
  .option('-b, --bar', 'enable some bar')
  .option('-B --baz', 'enable some baz');

program.on('--help', function() {
  console.log('---demo--');
  console.log(' $ custom-help --help');
  console.log(' $ custom-help -h');
});

program.parse(process.argv);
```
然后我们执行 v-cli -h 如下:
```
$: v-cli -h
Usage: v-cli [options]

Options:
  -V, --version  output the version number
  -f, --foo      enable some foo
  -b, --bar      enable some bar
  -B --baz       enable some baz
  -h, --help     display help for command
---demo--
 $ custom-help --help
 $ custom-help -h
```
 commander.js 的优势是提供了简单的api对可选项, 参数进行解析. 第二个优势帮我们自动生成帮助的文本信息.

 #### 常用的api

 #### 1) version
```
作用: 定义命令程序的版本号, 用法: .version('0.0.1', '-v, --version') 参数解析. 
1. 第一个参数: 版本号<必须>
2. 第二个参数 自定义标志 <可省略>: 默认为 -V 和 --version
```
当我们输入 v-cli -v 就可以读出对应的版本号, 如果我们没有设置第二个参数的话, 我们执行 v-cli -V 或 v-cli --version 就可以获取到版本号了.

#### 2) option
```
作用: 用于定义命令选项: .option('-n, --name <name>', 'your name', 'GK');

1) 第一个参数, 自定义标志<必须>: 分为长短标识, 中间用逗号 或 竖线 或 空格分割. 标志后面可跟参数, 可以使用 <> 或者 [] 修饰, 前者为必须参数, 后者为可选参数.
2) 第二个参数, 选项描述<可省略>, 在使用 --help 命令时显示标志描述.
3) 第三个参数, 选项参数默认值, 可选值.
```
#### 3) command

作用: 添加命令名称, 用法实例: .command('rmdir [otherDirs...]', 'install description', opts);

参数解析:
```
1) 第一个参数 命令名称<必须>: 命令后面可跟用 <> 或 [] 包含的参数; 命令最后的参数otherDirs可以是可变的. 在命令后面传入的参数被传入到action的回调函数以及 program.args 数组中.

2) 第二个参数 命令描述<可省略>; 如果存在, 且没有显示调用 action(fn); 就会启动子命令程序, 否则会报错.
   2.1) 当没有第二个参数时, commander.js将返回Command对象，若有第二个参数，将返回原型对象。
   2.2) 当带有第二个参数，并且没有显示调用action(fn)时，则将会使用子命令模式。

3) 第三个参数opts是配置可选项<可省略>; 可以配置 noHelp, isDefault 等.
```
#### 4) alias

作用: 自定义别名; 用法: .alias('xxx');

#### 5) description

作用: 定义命令的描述, 用法: .description('xxxx');

#### 6) action

用法: .action(fn)

用于设置命令行的相关回调, fn 可以接受命令的参数为函数行参, 顺序和 command() 中定义的顺序一致.

#### 7) parse

用法: program.parse(process.argv)

该api一般最后用, 用于解析 process.argv.

#### 8) outputHelp

用法: program.outputHelp();

一般用于未录入参数时自动打印帮助信息.

#### 参数解析

.option() 方法用来定义带选项的 commander, 同时也作为这些选项的文档. 如下演示代码, 会解析来自 process.argv 指定的参数和选项, 当没有匹配到任何选项的参数将会放到
process.argv 数组中.

解析后的选项可以通过Command对象上的.opts()方法获取，同时会被传递给命令处理函数。可以使用.getOptionValue()和.setOptionValue()操作单个选项的值。
```
#!/usr/bin/env node
const program = require('commander');

program
  .version('0.0.1')
  .option('-p, --peppers', 'Add peppers')
  .option('-P, --pineapple', 'Add pineApple')
  .option('-b, --bbq-xxx', 'Add bbq xxx')
  .parse(process.argv);

const options = program.opts();
console.log('----输出代码----');
if (options.peppers) {
  console.log('--peppers---', options.peppers);
}
if (options.pineapple) {
  console.log('--pineapple--', options.pineapple);
}
if (options.bbqXxx) {
  console.log('-----bbq-xxx---', options.bbqXxx);
}
```
如上代码, 当我们执行 v-cli -p 或 v-cli --peppers 的时候, 输出 "--peppers--- true". 如下所示:
```
$ v-cli -p        
----输出代码----
--peppers--- true
$ v-cli --peppers
----输出代码----
--peppers--- true
```
#### 添加处理函数
```
#!/usr/bin/env node
var program = require('commander');

function range(val) {
  return val.split('..').map(Number);
}

function list(val) {
  return val.split(',');
}

function collect(val, memo) {
  memo.push(val);
  return memo;
}

function increaseVerbosity(v, total) {
  return total + 1;
}

program
  .version('0.0.1')
  .usage('[options] <file ...>')
  .option('-i, --integer <n>', 'An integer argument', parseInt)
  .option('-f, --float <n>', 'A float argument', parseFloat)
  .option('-r, --range <a>..<b>', 'A range', range)
  .option('-l, --list <items>', 'A list', list)
  .option('-o, --optional [value]', 'An optional value')
  .option('-c, --collect [value]', 'A repeatable value', collect, [])
  .option('-v, --verbose', 'A value that can be increased', increaseVerbosity, 0)
  .parse(process.argv);

const options = program.opts();

console.log(' int: %j', options.integer);
console.log(' float: %j', options.float);
console.log(' optional: %j', options.optional);
options.range = options.range || [];
console.log(' range: %j..%j', options.range[0], options.range[1]);
console.log(' list: %j', options.list);
console.log(' collect: %j', options.collect);
console.log(' verbosity: %j', options.verbose);
console.log(' args: %j', options.args);
```
执行结果如下:
```
$: v-cli -f 123
 int: undefined
 float: 123
 optional: undefined
 range: undefined..undefined
 list: undefined
 collect: []
 verbosity: 0
 args: undefined

$: v-cli -r 12..13
 int: undefined
 float: undefined
 optional: undefined
 range: 12..13
 list: undefined
 collect: []
 verbosity: 0
 args: undefined

$: v-cli -l 12,13
 int: undefined
 float: undefined
 optional: undefined
 range: undefined..undefined
 list: ["12","13"]
 collect: []
 verbosity: 0
 args: undefined

$: v-cli -o 12
 int: undefined
 float: undefined
 optional: "12"
 range: undefined..undefined
 list: undefined
 collect: []
 verbosity: 0
 args: undefined

$: v-cli -c 12
 int: undefined
 float: undefined
 optional: undefined
 range: undefined..undefined
 list: undefined
 collect: ["12"]
 verbosity: 0
 args: undefined
```
 #### 正则表达式
```
#!/usr/bin/env node
var program = require('commander');

program
  .version('0.0.1')
  .option('-s --size <size>', 'kongzhi size', /^(large|medium|small)$/i, 'medium2')
  .option('-d --drink [drink]', 'Drink', /^(coke|pepsi|izze)$/i)
  .parse(process.argv);

const options = program.opts();

console.log(' size: ', options.size);
console.log(' drink: ', options.drink);
```
执行命令如下:
```
$: v-cli -s aaaaa -d 12
 size:  medium2
 drink:  true
```
  size 选项: 没有输入值则报错, 如果不符合正则匹配的话, 值为默认值. 符合的话, 就是正则匹配的值, 比如 执行命令: v-cli -s small -d 12, 那么size的值为 small.
  drink选项: 没有输入值则报 undefined, 不符合正则为 true, 符合正则则为正则的值. 比如执行命令: v-cli -s small -d coke, 则drink的值为 coke.

#### 可变参数

  命令command有且只有最后一个参数可变的, 要使参数变量可变, 必须将 ... 附加到参数名称.
```
#!/usr/bin/env node
var program = require('commander');

program
  .version('0.0.1')
  .command('rmdir <dir> [otherDirs...]')
  .action(function(dir, otherDirs) {
    console.log('---rmdir---', dir);
    if (otherDirs) {
      otherDirs.forEach(function(oDir) {
        console.log('---sub---rmdir---', oDir);
      })
    }
  })
  .parse(process.argv);
```
  执行命令: v-cli rmdir ./haha aaa bbb ccc 打印结果如下:
```
$: v-cli rmdir ./haha aaa bbb ccc
---rmdir--- rmdir
---sub---rmdir--- ./haha
---sub---rmdir--- aaa
---sub---rmdir--- bbb
---sub---rmdir--- ccc
```
可变参数的值保存在数组中, 可以通过 program.args 以及传递 action 的参数获取.

#### 指定参数的语法

  尖括号(比如 <cmd>) 代表必填输入, 方括号 (比如 [env]) 代表可选输入.
```
#!/usr/bin/env node
var program = require('commander');

program
  .version('0.0.1')
  .arguments('<cmd> [env]')
  .action(function(cmd, env) {
    cmdValue = cmd;
    envValue = env;
  })
  .parse(process.argv);

  if (typeof cmdValue === 'undefined') {
    console.error('no command given!');
    process.exit(1);
 }
console.log('command:', cmdValue);
console.log('environment:', envValue || "no environment given");
```
执行结果如下所示:
```
$: v-cli 测试
command: 测试
environment: no environment given

$: v-cli 测试 22
command: 测试
environment: 22
```
#### Git 风格的子命令

当 .command() 带有描述参数时, 不能采用 .action(callback)来处理子命令, 否则会出错. 因此, commander 将采用单独的可执行文件作为子命令.
```
// index.js 代码如下:

#!/usr/bin/env node
var program = require('commander');

program
  .version('0.0.1')
  .description('Fake package manager')
  .command('install [name]', 'install one or more packages').alias('i')
  .command('search [query]', 'search with optional query').alias('s')
  .command('list', 'list packages installed')
  .command('publish', 'publish the package').alias('p')
  .parse(process.argv);

// index-install.js 代码如下:

#!/usr/bin/env node
var program = require('commander');

program
  .option('-f, --force', 'force installation')
  .parse(process.argv);

var pkgs = program.args;
if (!pkgs.length) {
  console.error('packages required');
  process.exit(1);
}
if (program.force) {
  console.log('force: install')
};
pkgs.forEach(function(pkg){
  console.log('  install : %s', pkg);
});
```
当我们执行如下命令: node index.js install foo bar baz -f, 如下所示:
```
$: node index.js install foo bar baz -f
  install : foo
  install : bar
  install : baz
```
如上, 当我执行 node index.js install 的时候, 它会在同级目录下搜索 index-install 可执行文件, 如果我改成 v-cli install foo bar baz -f 的话, 那么它就会在index.js 同级目录下搜索 v-cli-install 可执行文件, 如果有该执行文件的话 就执行里面的命令, 否则会报错. 因此如果我们想要如上命令生效的话, 我们可以 新建 index-install.js, index-search.js, index-list.js, index-publish.js 可执行文件.

#### 自定义帮助

帮助程序是 commander 基于我们的程序自动生成的, 下面是 --help 生成的帮助信息;
```
$: v-cli -h
Usage: v-cli [options] [command]

Fake package manager

Options:
  -V, --version     output the version number
  -h, --help        display help for command

Commands:
  install|i [name]  install one or more packages
  search|s [query]  search with optional query
  list              list packages installed
  publish|p         publish the package
  help [command]    display help for command
```
  我们可以通过监听 --help 来控制 -h, --help 显示任何信息. 一旦调用完成, Commander 将自动退出. 程序的其余部分不会展示。例如在下面的 “stuff” 将不会在执行 --help 时输出。

index.js 改为如下代码:
```
#!/usr/bin/env node
var program = require('commander');

program
  .version('0.0.1')
  .option('-f, --foo', 'enable some foo')
  .option('-b, --bar', 'enable some bar')
  .option('-B, --baz', 'enable some baz');

program.on('--help', function(){
  console.log('');
  console.log('Examples:');
  console.log('  $ custom-help --help');
  console.log('  $ custom-help -h');
});

program.parse(process.argv);

console.log('stuff');
```
  当执行 v-cli , 打印: stuff, 当我们执行 v-cli -h 时候, 打印如下:
```
$: v-cli -h
Usage: v-cli [options]

Options:
  -V, --version  output the version number
  -f, --foo      enable some foo
  -b, --bar      enable some bar
  -B, --baz      enable some baz
  -h, --help     display help for command

Examples:
  $ custom-help --help
  $ custom-help -h
```
#### <div id="id5">五) 学习 Inquirer.js --- 命令行交互工具 <a href="#back"> 回到顶部</a></div>

作用是：当我们需要做一个脚手架或工具时，我们某些时候需要和用户进行交互，这个时候我们需要使用 inquirer.js---命令行交互工具。

#### 5.1) 安装及使用

安装命令如下:
```
npm install --save inquirer@^8.0.0
```
#### 注意: Inquirer v9和更高版本仅仅支持esm模块, 不支持 commonJS模块, 因此如果版本9以上使用 require('inquirer') 是不支持的. 所以上面我们指定版本就可以了.
#### 解决方法: 如果我们想使用最新版本的话, 我们可以修改 整个node项目用ems规范, 在package.js里添加 "type": "module"

之前也折腾过 <a href="https://github.com/kongzhi0707/front-end-learn/blob/master/autoDeployment/inquirer.md">一篇文章</a>, 但是之前写的比较简单, 现在重新详细折腾下该API的使用方法.

我们把 index.js 改成如下代码:
```
#!/usr/bin/env node
var program = require('commander');
var inquirer = require('inquirer');
var package = require('./package');

program
  .version(package.version)
  .description('工具库')

program
  .command('v-inq')
  .description('v-inq帮助指令')
  .action(() => {
    inquirer.prompt([
      {
        type: 'rawlist',
        name: 'question1',
        message: '请选择使用那个组件进行开发?',
        choices: ['react', 'vue']
      }
    ]).then((answers) => {
      console.log('---answers---', answers);
    })
  })

program.parse(process.argv);
```
然后在命令行中运行 v-cli v-inq 执行, 然后选择使用那个组件开发, 选择完成后, 就可以打印信息出来, 比如如下:
```
$: v-cli v-inq
? 请选择使用那个组件进行开发? vue
---answers--- { question1: 'vue' }
```
如上代码中, 通过 inquirer.prompt(Array<Object>), 可以选择或输入问题信息, 然后通过回调获取答案. 其中Object配置信息支持如下字段:
```
1) type: [String] 提示的类型, 默认是 input(输入框), 包含 input, number, confirm, list, rawlist, expand, checkbox, password, editor.
2) name: [String] 存储当前问题回答的变量, 比如上面的 answers 返回的对象 包含 name 中的 question1 当作变量.
3) message: [String|Function] 提问的问题内容.
4) default: [String|Number|Boolean|Array|Function] 默认值
5) choices: [Array|Function] 列表选项
6) validate: [Function] 验证方法, 校验输入值是否可行, 有效返回 true, 否则返回字符串表示错误信息.
7) filter: [Function] 对答案进行过滤处理, 返回处理后的值.
8) transformer: [Function] 操作答案的显示效果.
9) when: [Function|Boolean] 接受答案, 根据前面的内容判断是否需要展示该问题.
10) pageSize: [Number] 在 list, rawlist, expand, checkbox 这种多选项中, 进行分页拆分.
11) prefix: [String] 修改默认前缀
12) suffix: [String] 修改默认后缀
13) askAnswered: [Boolean] 已有答案是否强制提问
14) loop: [Boolean] list 是否能循环滚动选择, 默认true.
```
#### 5.2) 举列使用

#### 1) 输入文本 (type 为 input)
```
#!/usr/bin/env node
var inquirer = require('inquirer');

inquirer.prompt([
  {
    type: 'input',
    name: 'question1',
    message: '问题?',
    default: 'xxx'
  }
]).then((answers) => {
  console.log('---answers---', answers);
})

$: v-cli      
? 问题? xxx  // 直接按enter键 输出 xxx, 如果我们随便输入什么, 就返回什么
---answers--- { question1: 'xxx' }
```
#### 2) 输入数字 (type 为 number)
```
#!/usr/bin/env node
var inquirer = require('inquirer');

inquirer.prompt([
  {
    type: 'number',
    name: 'question1',
    message: '问题?',
    default: '1'
  }
]).then((answers) => {
  console.log('---answers---', answers);
})
```
执行结果如下; 默认为1, 如果我输入2, 返回结果值就为2. 如下:
```
$: v-cli
? 问题? 2
---answers--- { question1: 2 }
```
#### 3) 输入密码 (type为password)
```
#!/usr/bin/env node
var inquirer = require('inquirer');

inquirer.prompt([
  {
    type: 'password',
    name: 'question1',
    message: '问题?',
  }
]).then((answers) => {
  console.log('---answers---', answers);
})
```
密码我输入123456, 打印如下信息:
```
$: v-cli
? 问题? [hidden]
---answers--- { question1: '123456' }
```
#### 4) 单选项 (type为list)
```
#!/usr/bin/env node
var inquirer = require('inquirer');

inquirer.prompt([
  {
    type: 'list',
    name: 'question1',
    message: '问题?',
    default: ['kongzhi'],
    choices: ['tugenhua', 'kongzhi']
  }
]).then((answers) => {
  console.log('---answers---', answers);
})
```
执行效果如下:

<img src="https://raw.githubusercontent.com/kongzhi0707/test-cli/master/images/1.jpg" /> <br />

#### 添加分隔符, 代码如下:
```
#!/usr/bin/env node
var inquirer = require('inquirer');

inquirer.prompt([
  {
    type: 'list',
    name: 'question1',
    message: '问题?',
    default: ['kongzhi'],
    choices: [
      'tugenhua', 
      new inquirer.Separator(), // 添加分隔符
      'kongzhi'
    ]
  }
]).then((answers) => {
  console.log('---answers---', answers);
})
```
<img src="https://raw.githubusercontent.com/kongzhi0707/test-cli/master/images/2.jpg" /> <br />

#### 5) 有下标的单选项 (type为rawlist)
```
#!/usr/bin/env node
var inquirer = require('inquirer');

inquirer.prompt([
  {
    type: 'rawlist',
    name: 'question1',
    message: '问题?',
    default: ['kongzhi'],
    choices: [
      'tugenhua',
      'kongzhi'
    ]
  }
]).then((answers) => {
  console.log('---answers---', answers);
})
```
执行效果如下:

<img src="https://raw.githubusercontent.com/kongzhi0707/test-cli/master/images/3.jpg" /> <br />

#### 6) 多选项 (type为checkbox)
```
#!/usr/bin/env node
var inquirer = require('inquirer');

inquirer.prompt([
  {
    type: 'checkbox',
    name: 'question1',
    message: '问题?',
    choices: [
      'tugenhua',
      'kongzhi'
    ]
  }
]).then((answers) => {
  console.log('---answers---', answers);
})
```
执行结果如下:

<img src="https://raw.githubusercontent.com/kongzhi0707/test-cli/master/images/4.jpg" /> <br />

#### 7) 确认框 (type 为 confirm)
```
#!/usr/bin/env node
var inquirer = require('inquirer');

inquirer.prompt([
  {
    type: 'confirm',
    name: 'question1',
    message: '问题?',
  }
]).then((answers) => {
  console.log('---answers---', answers);
})
```
执行结果如下:

<img src="https://raw.githubusercontent.com/kongzhi0707/test-cli/master/images/5.jpg" /> <br />

#### 8) 校验输入 
```
#!/usr/bin/env node
var inquirer = require('inquirer');

inquirer.prompt([
  {
    type: 'input',
    name: 'question1',
    message: '请输入手机号',
    validate: (val) => {
      if (val.match(/\d{11}/g)) {
        return true;
      }
      return '请输入 11 位数字';
    },
  }
]).then((answers) => {
  console.log('---answers---', answers);
})
```
执行结果如下, 比如输入 12345, 会有如下提示:

<img src="https://raw.githubusercontent.com/kongzhi0707/test-cli/master/images/6.jpg" /> <br />

#### <div id="id6">六) 学习 chalk(用于美化控制台输出的语句) <a href="#back"> 回到顶部</a></div>

chalk 可以美化我们的控制台输出的语句, 包括加粗字体, 修改字体的颜色, 改变字体背景等. 主要用来美化相关控制台工具输出消息和语句.

#### chalk 安装及使用

安装命令如下:
```
$: npm install chalk@4.0.0
```
#### 注意: chalk5.0.0不支持在nodejs中require()导入. 
#### 解决方法: 如果我们想使用最新版本的话, 我们可以修改 整个node项目用ems规范, 在package.js里添加 "type": "module"

下面我们使用最新版本的chalk, 使用 import 导入的话, 只需要在 package.js里添加 "type": "module", package.json 配置如下:
```
{
  "name": "test-cli",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "bin": {
    "v-cli": "index.js"
  },
  "scripts": {
    "cli": "v-cli"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "chalk": "^5.0.1",
    "colors": "^1.4.0",
    "commander": "^9.4.0",
    "inquirer": "^8.2.4"
  },
  "type": "module"
}
```
index.js 代码变为如下:
```
#!/usr/bin/env node
// const chalk = require('chalk');
import chalk from 'chalk';

console.log(chalk.blue('---- Hello Chalk ----')); // 颜色为蓝色输出
```
执行 v-cli 命令即可.

在 chalk 中, 可以分三个对文字进行操作的模块, 分别对应: 修饰器(Modifiers), 颜色(Colors), 背景色(Background Colors), 这三个可以进行组合并进行链式调用。比如如下两段代码执行的效果是一样的。
```
#!/usr/bin/env node
// const chalk = require('chalk');
import chalk from 'chalk';

console.log(chalk.bold.blueBright.underline('---- Hello Chalk ----\n'));
console.log(chalk.blueBright.bold.underline('---- Hello Chalk ----\n'));
```
<img src="https://raw.githubusercontent.com/kongzhi0707/test-cli/master/images/7.jpg" /> <br />

如果出现调用多个颜色函数的话，以最右边的为准；如下代码：
```
#!/usr/bin/env node
// const chalk = require('chalk');
import chalk from 'chalk';

console.log(chalk.blueBright.bold.underline.blue.redBright('---- Hello Chalk 3----\n'));
// 最终输出：红色
```
<img src="https://raw.githubusercontent.com/kongzhi0707/test-cli/master/images/8.jpg" /> <br />

#### 6.1）修饰器

1）reset 重置样式，该函数如果是链式调用必须放到最后才能生效。 
```
#!/usr/bin/env node
import chalk from 'chalk';
console.log(chalk.bold.blueBright.reset('---- Hello Chalk ----'));
// 输出：---- Hello Chalk ----（不带任何样式）
```
```
2）bold 加粗字体
3）dim 让字体稍微泛光。
4）italic 斜体
5）underline 下划线
6）inverse 翻转背景色和情景色
7）hidden 打印文本，但使其不可见。
8）strikethrough 将一条水平线穿过文本的中心。
9）visible 仅当chalk的颜色级别为> 0时打印文本。对那些纯粹是装饰的东西很有用
```
如下代码演示， index.js 代码变为如下：
```
#!/usr/bin/env node
import chalk from 'chalk';

console.log(chalk('---- Hello Chalk 6----'));
console.log(chalk.dim('---- Hello Chalk 6----'));
console.log(chalk.italic('---- Hello Chalk 7----'));
console.log(chalk.underline('---- Hello Chalk 8----'));
console.log(chalk.inverse('---- Hello Chalk 9----'));
console.log(chalk.hidden('---- Hello Chalk 10----'));
console.log(chalk.strikethrough('---- Hello Chalk 11----\n'));
```
执行 v-cli 命令如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/test-cli/master/images/9.jpg" /> <br />

#### 6.2）内置颜色 (colors)

chalk内置了16种基本颜色：
```
1）black 黑色
2）red 红色
3) green 绿色
4）yellow 黄色
5）blue 蓝色
6）magenta 品红
7）cyan 青色
8）white 白色
9）blackBright 灰色，等同于gray
10）redBright 亮红，感觉跟red区别不大
11）greenBright 亮绿
12）yellowBright 亮黄
13）blueBright 亮蓝
14）magentaBright 亮品红
15）cyanBright 亮青
16）whiteBright 亮白
```
index.js 代码改为如下：
```
#!/usr/bin/env node
import chalk from 'chalk';

console.log(chalk.magenta('---- magenta 品红----'));
console.log(chalk.cyan('---- cyan 青色----'));
console.log(chalk.blackBright('---- blackBright 灰色----'));
console.log(chalk.redBright('---- redBright亮红----'))
console.log(chalk.greenBright('---- greenBright亮绿----'));
console.log(chalk.blueBright('---- blueBright亮蓝----'));
console.log(chalk.yellowBright('---- yellowBright亮黄----'));
console.log(chalk.magentaBright('---- magentaBright亮品红----'));
console.log(chalk.cyanBright('---- cyanBright亮青----'));
console.log(chalk.whiteBright('---- whiteBright亮白----'));
```
执行 v-cli 命令打印如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/test-cli/master/images/10.jpg" /> <br />

#### 6.3）内置的背景色

chalk 内置了16种基本颜色，对应了上面字体的16种颜色。
```
1）bgBlack
2）bgRed
3）bgGreen
4）bgYellow
5）bgBlue
6）bgMagenta
7）bgCyan
8）bgWhite
9）bgBlackBright
10）bgRedBright
11）bgGreenBright
12）bgYellowBright
13）bgBlueBright
14）bgMagentaBright
15）bgCyanBright
16）bgWhiteBright
```
index.js 代码改为如下：
```
#!/usr/bin/env node
import chalk from 'chalk';

console.log(chalk.bgBlack('---- bgBlack----'));
console.log(chalk.bgRed('---- bgRed----'));
console.log(chalk.bgGreen('----bgGreen----'));
console.log(chalk.bgYellow('----bgYellow----'));
console.log(chalk.bgBlue('---- bgBlue----'));
console.log(chalk.bgMagenta('----bgMagenta----'));
console.log(chalk.bgCyan('---- bgCyan----'));
console.log(chalk.bgBlackBright('----bgBlackBright----'));
console.log(chalk.bgRedBright('----bgRedBright----'))
console.log(chalk.bgGreenBright('---- bgGreenBright ----'));
console.log(chalk.bgBlueBright('---- bgBlueBright ----'));
console.log(chalk.bgYellowBright('----bgYellowBright ----'));
console.log(chalk.bgMagentaBright('----bgMagentaBright----'));
console.log(chalk.bgCyanBright('---- bgCyanBright----'));
console.log(chalk.bgWhiteBright('---- bgWhiteBright----'));
```
执行结果如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/test-cli/master/images/11.jpg" /> <br />

#### 6.4）使用rgb和hex自定义字体颜色，bgRgb和bgHex自定义背景颜色

index.js 代码改为如下：
```
#!/usr/bin/env node
import chalk from 'chalk';

console.log(chalk.rgb(9, 218, 158).bold('---- Hello Chalk 21 ----'))
console.log(chalk.rgb(9, 218, 158).visible('---- Hello Chalk 21 ----'))
console.log(chalk.hex('#09DA9E').visible('---- Hello Chalk 21 ----'))

console.log(chalk.bgHex('#09DA9E').visible('---- Hello Chalk 21 ----'))
console.log(chalk.bgRgb(9, 218, 158).visible('---- Hello Chalk 21 ----'))
```
执行 v-cli, 结果如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/test-cli/master/images/12.jpg" /> <br />

























