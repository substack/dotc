# dotc

use node-style `#require` calls and packages in c!

dotc is a preprocessor that copies the semantics of
[node.js's module lookup algorithm](http://nodejs.org/docs/latest/api/modules.html#modules_modules)
for c programs

# example

``` c
#require ""
```

gcc -no-integrated-cpp -Bbin main.c

# publishing

Publish your c libraries to npm with a `.c` suffix. For example: `hyperset.c`.


