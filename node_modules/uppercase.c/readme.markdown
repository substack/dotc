# uppercase.c

uppercase a string in-place in c

# example

``` c
#include "stdio.h"
#require "uppercase.c" as uppercase

int main (int argc, char **argv) {
    for (int i = 1; i < argc; i++) {
        printf("%s ", uppercase(argv[i]));
    }
    printf("\n");
    return 0;
}
```

# methods

``` c
#require "uppercase.c" as upper
```

## char *upper(char *str)

Uppercase the string `str` in-place, returning `str`.

# install

With [npm](https://npmjs.org) do:

```
npm install uppercase.c
```

This is a [dotc](https://github.com/substack/dotc) module.

# license

MIT
