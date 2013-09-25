#include "stdio.h"
#require "../index.c" as uppercase

int main (int argc, char **argv) {
    for (int i = 1; i < argc; i++) {
        printf("%s ", uppercase(argv[i]));
    }
    printf("\n");
    return 0;
}
