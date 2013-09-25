# c-tokenizer

[tokenize](https://npmjs.org/package/tokenize) C/C++ source code

[![build status](https://secure.travis-ci.org/substack/c-tokenizer.png)](http://travis-ci.org/substack/c-tokenizer)

# example

``` js
var tokenize = require('tokenize');
var t = tokenize(function (src, token) {
    console.log(token.type + ' => ' + JSON.stringify(src));
});
process.stdin.pipe(t);
```

For the input file main.c:

``` c
#include "stdio.h"
#include "stdlib.h"

int main(int argc, char **argv) {
    printf("%d\n", foo(atoi(argv[1])));
    return 0;
}
```

output:

```
$ node example/tokens.js < example/main.c
directive => "#include"
whitespace => " "
quote => "\"stdio.h\""
whitespace => "\n"
directive => "#include"
whitespace => " "
quote => "\"stdlib.h\""
whitespace => "\n\n"
identifier => "int"
whitespace => " "
identifier => "main"
open paren => "("
identifier => "int"
whitespace => " "
identifier => "argc"
operator => ","
whitespace => " "
identifier => "char"
whitespace => " "
operator => "**"
identifier => "argv"
close paren => ")"
whitespace => " "
open curly => "{"
whitespace => "\n    "
identifier => "printf"
open paren => "("
quote => "\"%d\\n\""
operator => ","
whitespace => " "
identifier => "foo"
open paren => "("
identifier => "atoi"
open paren => "("
identifier => "argv"
open square => "["
number => "1"
close square => "]"
close paren => ")"
close paren => ")"
close paren => ")"
operator => ";"
whitespace => "\n    "
identifier => "return"
whitespace => " "
number => "0"
operator => ";"
whitespace => "\n"
close curly => "}"
whitespace => "\n"
```

## var t = tokenize(cb)

Return a new [tokenize](https://npmjs.org/package/tokenize)
through stream with C/C++ syntax rules loaded into it.

Each parsed token will fire the `cb(src, token)` callback.

Each token has a `token.type` with the rule as a string name and `token.regex`
as the regular expression for the rule that matched.

## t.addRule(regex, name)

Add additional rules as `regex` with a `name`.

# install

With [npm](https://npmjs.org) do:

```
npm install c-tokenizer
```

# license

MIT
