#export foo
#export bazzy as bar
#export foo2

int foo (int n) {
    return n * 111;
}

#define foo2 10

int bazzy (int n) {
    return n * foo2;
}
