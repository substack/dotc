#include "stdio.h"
#include "stdlib.h"

#require "./bar.c" as b
#require "./prefoo.c" as f
#require "./macroA.c" as a

int main(int argc, char **argv) {
    printf("%d\n", f(atoi(argv[1]) + b(atoi(argv[2]))));
    return a(5, 10);
}
