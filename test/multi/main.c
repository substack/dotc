#include "stdio.h"
#include "stdlib.h"

#require "./foobar.c" as FB

int main(int argc, char **argv) {
    int f = FB.foo(atoi(argv[1]));
    int b = FB.bar(atoi(argv[2]));
    printf("%d\n", f + b);
    return 0;
}
