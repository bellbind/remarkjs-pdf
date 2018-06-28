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

Slide html as a remote url also works:

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


## Appendix: convert to n-up handout pdf from slide pdf

With the [pdfjam](https://warwick.ac.uk/fac/sci/statistics/staff/academic-research/firth/software/pdfjam/) commands in [`texlive`](https://www.tug.org/texlive/),  
you can easily make a 6-up handout pdf file from existing slide-per-page pdf files.

- apt: texlive-extra-utils
- homebrew: mactex (cask)

For example, 

```bash
$ pdfjam-slides6up remarkjs.com.pdf
```

would generate a bordered 6-up pdf file `remarkjs.com-6up.pdf`.

NOTE: `pdfjam-slides6up` is same as the plain `pdfjam` command with these options:

```bash
$ pdfjam --suffix 6up --nup 2x3 --frame true --noautoscale false --delta "0.2cm 0.3cm" --scale 0.95 \
         --pagecommand "{\thispagestyle{empty}}" --preamble "\footskip 2.7cm" remarkjs.com.pdf
```

If you want to embed page numbers in each sheet, 
change the option `--pagecommand "{\thispagestyle{empty}}"` to
`--pagecommand "{\thispagestyle{plain}}"`.
