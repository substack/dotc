#include "stdio.h"
#include "stdlib.h"

#require "./foo.c" as f
#require "./bar.c" as b

int main(int argc, char **argv) {
    printf("%d\n", f(atoi(argv[1]) + b(atoi(argv[2]))));
    return 0;
}
