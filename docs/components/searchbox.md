### SearchBox

- **Tag name :** `<searchbox></searchbox>`
- **Properties :**
  - `autofocus` (_Boolean_, default : _false_) :  Cursor focusing on the input by default
  - `realtime` (_Boolean_, default : _false_) : Performing ES request on every input change 
  - `timeout` (_Number_, default : _300_) : Timeout between to ES request (available only if realtime is true)
  - `field` (_Array_) :  An array of elasticsearch fields to search within
  - `operator` (_String_, default : _'OR'_) : Logical operator applied between several fields
  - `pattern` (_String_, default : _'.*{v}.*'_) : Regular expression used to match with the field(s)
  - `placeholder` (_String_, default : _'Search'_):  Placeholder for the input box
