#export= foo
#require "./x.c" as x

int foo (int n) {
    return x(n + 1);
}
