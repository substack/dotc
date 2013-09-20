# dotc

use node-style `#require` and `#export` directives in c!

dotc is a c/c++ preprocessor that copies the semantics of
[node.js's module lookup algorithm](http://nodejs.org/docs/latest/api/modules.html#modules_modules)
without modifying anything else about the c language

[![build status](https://secure.travis-ci.org/substack/dotc.png)](http://travis-ci.org/substack/dotc)

# example

## single export

The first form of exports uses an `#export=` directive to export exactly 1
thing from a file.

In `foo.c` we'll export the `foo()` function:

``` c
#export= foo
int foo (int n) {
    return n * 111;
}
```

then use `#require` to load `"foo.c"` into the local token `f` in `main.c`:

``` c
#include "stdio.h"
#include "stdlib.h"

#require "./foo.c" as f

int main(int argc, char **argv) {
    printf("%d\n", f(atoi(argv[1])));
    return 0;
}
```

Now use the `dotc` command to compile `main.c` with `gcc`:

```
$ dotc main.c -o main
$ ./main 3
333
```

## multi export

We can also export multiple declarations from a file and expose them through
property-lookup (dot) syntax.

Suppose we have a file `foobar.c` that has 2 exports: `foo` and `bar`:

``` c
#export foo
int foo (int n) {
    return n * 111;
}

#export bazzy as bar
int bazzy (int n) {
    return n * 10;
}
```

Note that in the second form, `#export bazzy as bar`, the exported token name
need not match the local definition name.

Now in `main.c` we can reference both functions under the `FB` name:

``` c
#include "stdio.h"
#include "stdlib.h"

#require "./foobar.c" as FB

int main(int argc, char **argv) {
    int f = FB.foo(atoi(argv[1]));
    int b = FB.bar(atoi(argv[2]));
    printf("%d\n", f + b);
    return 0;
}
```

# syntax

To import a relative (from the requiring file) module, do:

``` c
#require "./foo.c" as foo
```

To import a module installed with npm, do:

``` c
#require "beepboop.c" as bb
```

To export a single item from your module, do:

```
#export= foo
```

To export `localname` that requiring files will see as `name`, do:

```
#export localname as name
```

If `localname` and `name` are the same, you can just do:

```
#export name
```

# under the hood

Files loaded with `#require` are automatically wrapped in a `namespace {}` block
to keep their internal methods and declarations from leaking out into the global
namespace.

We can print out the output of the preprocessing step from the previous example
code with `dotc pre` to see the wrapping and transformation:

``` c
$ dotc pre main.c
#include "stdio.h"
#include "stdlib.h"

namespace _177d2db2 {
int foo (int n) {
    return n * 111;
}
};

int main(int argc, char **argv) {
    printf("%d\n", (_177d2db2::foo)(atoi(argv[1])));
    return 0;
}
```

When you run `dotc main.c` (or `dotc build main.c`), this is the code that gcc
compiles for you. If you want to compile with gcc yourself, you could just do:

```
$ dotc pre main.c | gcc -x c++ - -o main
$ ./main 4
444
```

The `-x c++` is necessary for now because c doesn't have `namespace {}` blocks.

When somebody writes a namespace transform we can drop the forced c++ upgrade.

## graceful upgrades 

Similar to UMD in browser code, we can write libraries that gracefully upgrade
into dotc exports mode by checking for `DOTC` in an `#ifdef`:

``` c
#ifdef DOTC
#export= foo
#endif

int foo (int n) {
    return n * 111;
}
```

# packages

## finding c modules

You can use the `dotc search` command to search npm:

```
substack : ~ $ dotc search upper
NAME         DESCRIPTION                       AUTHOR     DATE              VERSION KEYWORDS
uppercase.c  uppercase a string in-place in c  =substack  2013-09-19 04:21  0.0.0  dotc c c++ pre
substack : ~ $ 
```

`dotc search` just filters `npm search` by packages ending in `.c`, `.cc`,
`.cpp`, and `.cxx`.

## publishing c modules

To publish a dotc module, just pick a name and add `.c` to the end!
For example: `hyperset.c`.

Then create a package.json file with a "main.c" field set to the file that you
want to resolve when somebody does `#require "yourpackage.c" as yp`.

## npm?

npm? Isn't that for javascript?

Yes, but:

* native node modules are written in c++
* npm already exists
* npm installs packages in a way that avoids dependency hell

Just make sure to suffix a `.c` at the end of your package name so that we can
more easily distinguish c packages from javascript packages.

# install

First install [node](http://nodejs.org). This will give you the `npm` command
that you can use to install `dotc` itself by doing:

```
npm install -g dotc
```
# license

MIT
