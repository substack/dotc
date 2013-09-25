#include "stdlib.h"
#include "string.h"

#export= upper

char *upper (char *s) {
    size_t l = strlen(s);
    for (size_t i = 0; i < l; ++i) {
        if (s[i] >= 'a' && s[i] <= 'z') s[i] -= 32;
    }
    return s;
}
