# pluggable-autocomplete README

Ever find yourself writing stringly typed values that you wish you could autocomplete from some other data source? Well now you can.

This plugin lets you write .js files that fetch data into your built in list of autocomplete symbols.

## Features

- Read completion values from a json file

  in your settings set "pluggableautocomplete.json" to a filepath and ensure the file is formatted correctly:
  ```js
  {
    "items": [{
      "prefix": "", // optional: appears like e.g. "prefixvalue"
      "value": "", // required
      "comment": "", // optional: describes the value, appears as a comment
      "sortToken": "" // optional: instead of sorting by the "value", sort by this text. sorts as strings, not as numbers
    }] 
    // the file is slurped upon activation. do not make the file too big, preferably kilobytes to only a few megabytes.
  }
  ```

  note that ~ is supporting in file paths, but was only tested on a linux system.

- Write custom data extractor and drop it into .pluggable-autocomplete in your workspace

- Use custom data
![Use custom data!](sample.gif)

## Requirements

Write yourself a plugin! Pro-tip - use the command pallette to run `Create Sample Pluggable Autocomplete` to init a sample plugin in your workspace.

## Extension Settings

No settings yet!
Maybe we could customize the plugin directory...?

## Known Issues

- no known issues yet! Open an issue on https://github.com/Sammons/pluggable-autocomplete

- Security note: this invokes files in the
.pluggable-autocomplete folder, and as such they should
be write-protected once you finish writing your plugin

## Release Notes

## [0.0.1]
- Initial release

## [0.0.3]
- Add contrib for postgres columns

## [0.1.0]
- Add json file support, support for more file types

## [1.0.0]
- Remove the name top level value.
- Stop separating prefix and value with "." (instead you should do "prefix." if you want that)
- Include the prefix in the completion.

**Enjoy!**

## License (MIT)

Copyright 2021 Ben Sammons

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

