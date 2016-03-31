#require "./macroB.c" as B

#export= macro
#define macro(a, b) \
  B.b((a), (b))
