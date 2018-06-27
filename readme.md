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

## Limitations

It is only available that the slide HTML has used the name **`slideshow`**
for a result object of `remark.create()`.

## Dependencies

- [puppeteer](https://github.com/GoogleChrome/puppeteer)

## License

- [CC0](http://creativecommons.org/publicdomain/zero/1.0/)
