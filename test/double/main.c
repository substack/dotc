#include "stdio.h"
#include "stdlib.h"

#require "./bar.c" as b
#require "./foo.c" as f

int main(int argc, char **argv) {
    printf("%d\n", f(atoi(argv[1]) + b(atoi(argv[2]))));
    return 0;
}
