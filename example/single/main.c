#include "stdio.h"
#include "stdlib.h"

#require "./foo.c" as f

int main(int argc, char **argv) {
    printf("%d\n", f(atoi(argv[1])));
    return 0;
}
