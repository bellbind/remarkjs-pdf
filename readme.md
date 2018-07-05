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

## FAQ

### Some mermaid graphs are not displayed in PDF

The result graph size may be overflowed from its slide page.
To print graphs, the bottom line of the graph area should be shown in the slide.

If you want to fit the graph with scaling, use CSS `transform` such as:

```html
<pre class="mermaid" style="transform: scale(0.8);">
graph LE;
A --> B;
</pre>
```

## Appendix: convert to a n-up handout pdf from the slide pdf

With the [pdfjam](https://warwick.ac.uk/fac/sci/statistics/staff/academic-research/firth/software/pdfjam/) commands in [`texlive`](https://www.tug.org/texlive/),  
you can easily make a 6-up handout pdf file from existing slide-per-page pdf files.

- apt: texlive-extra-utils
- homebrew: mactex (cask)

For example, 

```bash
$ pdfjam-slides6up remarkjs.com.pdf
```

would generate a bordered 6-up pdf file `remarkjs.com-6up.pdf`.

If you want to choose specific pages in the slide, you can add a page selector parameter such as:

```bash
$ pdfjam-slides6up remarkjs.com.pdf 1,5-12,15
```

The result `remarkjs.com-1,5-12,15-6up.pdf` has pages 1, from 2 to 12, and 15.

To simplify result file names, use with `-o result-name.pdf` options:

```bash
$ pdfjam-slides6up remarkjs.com.pdf 1,5-12,{},15- -o remarkjs.com-pickup.pdf
```


### NOTE: use plain `pdfjam` commaind with options

The `pdfjam-slides6up` is same as the plain `pdfjam` command with these options:

```bash
$ pdfjam --suffix 6up --nup 2x3 --frame true --noautoscale false --delta "0.2cm 0.3cm" --scale 0.95 \
         --pagecommand "{\thispagestyle{empty}}" --preamble "\footskip 2.7cm" remarkjs.com.pdf
```

If you want to embed page numbers in each sheet, 
change the option `--pagecommand "{\thispagestyle{empty}}"` to
`--pagecommand "{\thispagestyle{plain}}"`.

