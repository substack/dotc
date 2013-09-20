#export= foo
#require "./baz.c" as b

int foo (int n) {
    return b(n * 2);
}
