#export= foo
#require "./foo.c" as f

int foo (int n) {
    return f(n - 1);
}
