# dotc

use node-style `#require` and `#export=` directives in c!

dotc is a c/c++ preprocessor that copies the semantics of
[node.js's module lookup algorithm](http://nodejs.org/docs/latest/api/modules.html#modules_modules)

# example

First export a function with `export=` in `foo.c`:

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
dotc search TERMS...
```

All the `dotc search` command does is a regular npm search but with the results
filtered to only show packages ending in `.c`.

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
