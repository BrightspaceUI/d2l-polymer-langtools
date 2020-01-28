# d2l-polymer-langtools

Provides tools for copying/building language term files in D2L polymer repos. Works with language files stored is JSON format where each key of the object corresponds to a lang term.

The following executable javascript binaries are available when installed via npm:

## lang-copy

Used to copy lang terms from a source language file to multiple destination files to be translated later. New terms (ones that exist in source but not destination) will be copied into the destination file. Terms that already exist in the destination file will not be modified unless an override command is given. Terms that exist in a destination file, but not the source file, will be deleted from the destination.

`lang-copy` requires a configuration file with the following properties:

- `copySourceLang` The name of the source language file (within `langDir`) without the file extension. (ie. provide `en` for `lang/en.json`)
- `langDir` The path to the directory where lang files reside
- `langNames` An array of language names that terms should be copied to

An example configuration file can be found in `/templates/lang-config.json`

For help on running `lang-copy` and to see options available, run:

```bash
lang-copy --help
```

## lang-build 

Used to generate "built" versions of language files where the language name and language data (JSON) can be inserted into a template javascript file. The following replacements are available in the template:

- `{{langPascal}}` Replaced with the language name in PascalCase
- `{{langCamel}}` Replaced with the language name in camelCase
- `{{langData}}` Replaced with JSON data from the corresponding lang file

An example template file can be found in `/templates/build.template`

`lang-build` requires a configuration file with the following properties:

- `buildDir` The path to the directory where lang file builds should be created
- `buildTemplateFile` The path to the template file used to create build files
- `langDir` The path to the directory where lang files reside
- `langNames` An array of language names that terms should be copied to

An example configuration file can be found in `/templates/lang-config.json`

For help on running `lang-build` and to see options available, run:

```bash
lang-build --help
```

## Publishing

To publish a new version of the package, update the version number in `/package.json` then make a new release in github.
