#include "stdio.h"
#include "stdlib.h"

#require "uppercase.c" as upper

int main(int argc, char **argv) {
    for (int i = 1; i < argc; i++) {
        printf("%s ", upper(argv[i]));
    }
    printf("\n");
    return 0;
}
