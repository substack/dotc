#include <stdio.h>

#require "./thing.c" as Thing

int main() {
  Thing someThing;
  printf("%d\n", someThing.add(2,3));
}
