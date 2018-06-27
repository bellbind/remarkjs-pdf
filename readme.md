# remarkjs-pdf

A simple commandline script for converting 
[remark.js](https://github.com/gnab/remark) slide html to pdf file.

## howto use

With recent node.js:

```sh
$ npm install bellbind/remarkjs-pdf
$ $(npm bin)/remarkjs-pdf slide.html slide.pdf
```

Or with npx:

```sh
$ npx bellbind/remarkjs-pdf slide.html slide.pdf
```

Remote url is also work as:

```sh
$ npx bellbind/remarkjs-pdf https://remarkjs.com/ remarkjs.pdf
```

NOTE: 2nd PDF file path would be generated from the slide URL 
when PDF file path is omitted:

```sh
$ npx bellbind/remarkjs-pdf https://remarkjs.com/
```

A `remarkjs.com.pdf` file would be generated.

## Advanced

If the slide html use a name other than `slideshow`, 
you can set the name at the env `REMARKJS_NAME`.

You can also customize printed page size at the env
`REMARKJS_SIZE` such as `1024:768`.

## Dependencies

- [puppeteer](https://github.com/GoogleChrome/puppeteer)

## License

- [CC0](http://creativecommons.org/publicdomain/zero/1.0/)
