# StringCalculator Game Rule:

- An empty string returns zero
- A single number returns the value
- Two numbers, comma delimited, returns the sum
- Two numbers, newline delimited, returns the sum
- Three numbers, delimited either way, returns the sum
- Negative numbers throw an exception
- Numbers greater than 1000 are ignored
- A single char delimiter can be defined on the first line (e.g. //# for a ‘#’ as the delimiter)
- A multi char delimiter can be defined on the first line (e.g. //[###] for ‘###’ as the delimiter)
- Many single or multi-char delimiters can be defined (each wrapped in square brackets)

# TODO:

- Empty string should return zero (1)
- A single number should return the value (2)
- Negative numbers throw an exception (3)
- Numbers greater than 1000 are ignored (4)
- Two numbers, comma delimited, returns the sum (5)
- Two numbers, newline delimited, returns the sum (6)
- Three numbers, delimited either way, returns the sum (7)
- A single char delimiter can be defined on the first line (e.g. //# for a ‘#’ as the delimiter) (8)
- A multi char delimiter can be defined on the first line (e.g. //[###] for ‘###’ as the delimiter) (9)
- With input //[[[] then ‘[[’ should be a delimiter (10)
- Many single or multi-char delimiters can be defined (each wrapped in square brackets) (11)
- Should separate delimiters definition and string correctly (12)
- Should correctly calculate string //#\n123#45#6 (13)
- Should correctly calculate string //[&&&]\n123&&&45&&&6 (14)
- Should correctly calculate string //[&&&][#]\n123&&&45#6 (15)
