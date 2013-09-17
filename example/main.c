#include "stdio.h"
#include "stdlib.h"

#require "./foo.c" as foo

int main(int argc, char **argv) {
    printf("%d\n", foo(atoi(argv[1])));
    return 0;
}
