module.exports = {
    head: `
      <style>
      /*!
      * Gutenberg
      *
      * MIT Fabien Sa
      * https://github.com/BafS/Gutenberg
      */
    /*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */
    /* Document
        ========================================================================== */
    `,
    tail: `
      </style>
    `,
    base: `
    body {
      background-color: var(--body-bg) !important;
      color: var(--body-color) !important;
      -webkit-print-color-adjust: exact;
    }
    
   /**
    * 1. Correct the line height in all browsers.
    * 2. Prevent adjustments of font size after orientation changes in iOS.
    */
   html {
     line-height: 1.15;
     /* 1 */
     -webkit-text-size-adjust: 100%;
     /* 2 */ }
   
   /* Sections
      ========================================================================== */
   /**
    * Remove the margin in all browsers.
    */
   body {
     margin: 0; }
   
   /**
    * Render the main element consistently in IE.
    */
   main {
     display: block; }
   
   /**
    * Correct the font size and margin on h1 elements within section and
    * article contexts in Chrome, Firefox, and Safari.
    */
   h1 {
     font-size: 2em;
     margin: 0.67em 0; }
   
   /* Grouping content
      ========================================================================== */
   /**
    * 1. Add the correct box sizing in Firefox.
    * 2. Show the overflow in Edge and IE.
    */
   hr {
     box-sizing: content-box;
     /* 1 */
     height: 0;
     /* 1 */
     overflow: visible;
     /* 2 */ }
   
   /**
    * 1. Correct the inheritance and scaling of font size in all browsers.
    * 2. Correct the odd em font sizing in all browsers.
    */
   pre {
     font-family: monospace, monospace;
     /* 1 */
     font-size: 1em;
     /* 2 */ }
   
   /* Text-level semantics
      ========================================================================== */
   /**
    * Remove the gray background on active links in IE 10.
    */
   a {
     background-color: transparent; }
   
   /**
    * 1. Remove the bottom border in Chrome 57-
    * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
    */
   abbr[title] {
     border-bottom: none;
     /* 1 */
     text-decoration: underline;
     /* 2 */
     text-decoration: underline dotted;
     /* 2 */ }
   
   /**
    * Add the correct font weight in Chrome, Edge, and Safari.
    */
   b,
   strong {
     font-weight: bolder; }
   
   /**
    * 1. Correct the inheritance and scaling of font size in all browsers.
    * 2. Correct the odd em font sizing in all browsers.
    */
   code,
   kbd,
   samp {
     font-family: monospace, monospace;
     /* 1 */
     font-size: 1em;
     /* 2 */ }
   
   /**
    * Add the correct font size in all browsers.
    */
   small {
     font-size: 80%; }
   
   /**
    * Prevent sub and sup elements from affecting the line height in
    * all browsers.
    */
   sub,
   sup {
     font-size: 75%;
     line-height: 0;
     position: relative;
     vertical-align: baseline; }
   
   sub {
     bottom: -0.25em; }
   
   sup {
     top: -0.5em; }
   
   /* Embedded content
      ========================================================================== */
   /**
    * Remove the border on images inside links in IE 10.
    */
   img {
     border-style: none; }
   
   /* Forms
      ========================================================================== */
   /**
    * 1. Change the font styles in all browsers.
    * 2. Remove the margin in Firefox and Safari.
    */
   button,
   input,
   optgroup,
   select,
   textarea {
     font-family: inherit;
     /* 1 */
     font-size: 100%;
     /* 1 */
     line-height: 1.15;
     /* 1 */
     margin: 0;
     /* 2 */ }
   
   /**
    * Show the overflow in IE.
    * 1. Show the overflow in Edge.
    */
   button,
   input {
     /* 1 */
     overflow: visible; }
   
   /**
    * Remove the inheritance of text transform in Edge, Firefox, and IE.
    * 1. Remove the inheritance of text transform in Firefox.
    */
   button,
   select {
     /* 1 */
     text-transform: none; }
   
   /**
    * Correct the inability to style clickable types in iOS and Safari.
    */
   button,
   [type="button"],
   [type="reset"],
   [type="submit"] {
     -webkit-appearance: button; }
   
   /**
    * Remove the inner border and padding in Firefox.
    */
   button::-moz-focus-inner,
   [type="button"]::-moz-focus-inner,
   [type="reset"]::-moz-focus-inner,
   [type="submit"]::-moz-focus-inner {
     border-style: none;
     padding: 0; }
   
   /**
    * Restore the focus styles unset by the previous rule.
    */
   button:-moz-focusring,
   [type="button"]:-moz-focusring,
   [type="reset"]:-moz-focusring,
   [type="submit"]:-moz-focusring {
     outline: 1px dotted ButtonText; }
   
   /**
    * Correct the padding in Firefox.
    */
   fieldset {
     padding: 0.35em 0.75em 0.625em; }
   
   /**
    * 1. Correct the text wrapping in Edge and IE.
    * 2. Correct the color inheritance from fieldset elements in IE.
    * 3. Remove the padding so developers are not caught out when they zero out
    *    fieldset elements in all browsers.
    */
   legend {
     box-sizing: border-box;
     /* 1 */
     color: inherit;
     /* 2 */
     display: table;
     /* 1 */
     max-width: 100%;
     /* 1 */
     padding: 0;
     /* 3 */
     white-space: normal;
     /* 1 */ }
   
   /**
    * Add the correct vertical alignment in Chrome, Firefox, and Opera.
    */
   progress {
     vertical-align: baseline; }
   
   /**
    * Remove the default vertical scrollbar in IE 10+.
    */
   textarea {
     overflow: auto; }
   
   /**
    * 1. Add the correct box sizing in IE 10.
    * 2. Remove the padding in IE 10.
    */
   [type="checkbox"],
   [type="radio"] {
     box-sizing: border-box;
     /* 1 */
     padding: 0;
     /* 2 */ }
   
   /**
    * Correct the cursor style of increment and decrement buttons in Chrome.
    */
   [type="number"]::-webkit-inner-spin-button,
   [type="number"]::-webkit-outer-spin-button {
     height: auto; }
   
   /**
    * 1. Correct the odd appearance in Chrome and Safari.
    * 2. Correct the outline style in Safari.
    */
   [type="search"] {
     -webkit-appearance: textfield;
     /* 1 */
     outline-offset: -2px;
     /* 2 */ }
   
   /**
    * Remove the inner padding in Chrome and Safari on macOS.
    */
   [type="search"]::-webkit-search-decoration {
     -webkit-appearance: none; }
   
   /**
    * 1. Correct the inability to style clickable types in iOS and Safari.
    * 2. Change font properties to inherit in Safari.
    */
   ::-webkit-file-upload-button {
     -webkit-appearance: button;
     /* 1 */
     font: inherit;
     /* 2 */ }
   
   /* Interactive
      ========================================================================== */
   /*
    * Add the correct display in Edge, IE 10+, and Firefox.
    */
   details {
     display: block; }
   
   /*
    * Add the correct display in all browsers.
    */
   summary {
     display: list-item; }
   
   /* Misc
      ========================================================================== */
   /**
    * Add the correct display in IE 10+.
    */
   template {
     display: none; }
   
   /**
    * Add the correct display in IE 10.
    */
   [hidden] {
     display: none; }
   
   * {
     -moz-box-sizing: border-box;
     -webkit-box-sizing: border-box;
     box-sizing: border-box; }
   
   *,
   *:before,
   *:after,
   p:first-letter,
   div:first-letter,
   blockquote:first-letter,
   li:first-letter,
   p:first-line,
   div:first-line,
   blockquote:first-line,
   li:first-line {
     /*background: transparent !important;*/
     box-shadow: none !important;
     text-shadow: none !important; }
   
   html {
     font-size: 16px;
     margin: 0;
     padding: 0; }
   
   body {
     -moz-osx-font-smoothing: grayscale;
     -webkit-font-smoothing: antialiased;
     background: var(--body-bg);
     color: var(--body-color);
     font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
     font-size: 1rem;
     line-height: 1.5;
     margin: 0 auto;
     text-rendering: optimizeLegibility; 
     text-align: start;    
     max-width: 900px;
    }
   
   p,
   blockquote,
   table,
   ul,
   ol,
   dl {
     margin-bottom: 1.5rem;
     margin-top: 0; }

  /* Line length for readability */
    p,
    blockquote,
    table,
    ul,
    ol,
    dl {
      max-width: 80ch;}
   
   p:last-child,
   ul:last-child,
   ol:last-child {
     margin-bottom: 0; }
   
   h1,
   h2,
   h3,
   h4,
   h5,
   h6 {
     /*color: #000;*/
     font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
     line-height: 1.2;
     margin-bottom: 0.75rem;
     margin-top: 2rem; }
   
   h1 {
     font-size: 2.25rem; }
   
   h2 {
     font-size: 1.8rem; }
   
   h3 {
     font-size: 1.6rem; }
   
   h4 {
     font-size: 1.45rem; }
   
   h5 {
     font-size: 1.25rem; }
   
   h6 {
     font-size: 1rem; }
   
   a, a:visited {
     color: var(--body-color);
     text-decoration: underline;
     word-wrap: break-word; }
   
   table {
     border-collapse: collapse; }
   
   thead {
     display: table-header-group; }
   
   table,
   th,
   td {
     border-bottom: 1px solid #000; }
   
   td,
   th {
     padding: 8px 16px;
     page-break-inside: avoid; }
   
   code,
   pre,
   kbd {
     border: 1px solid #bbb;
     font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
     font-size: 85%; }
   
   code,
   kbd {
     padding: 3px; }
   
   pre {
     margin-bottom: 1.5rem;
     padding: 10px 12px; }
     pre code,
     pre kbd {
       border: 0; }
   /*
   ::-webkit-input-placeholder {
     color: transparent; }
   
   :-moz-placeholder {
     color: transparent; }
   
   ::-moz-placeholder {
     color: transparent; }
   
   :-ms-input-placeholder {
     color: transparent; }
   */
   blockquote {
     border: 0;
     border-left: 5px solid #bbb;
     margin-left: 1px;
     padding: 12px 1.5rem; }
     [dir='rtl'] blockquote {
       border-left: 0;
       border-right: 5px solid #bbb;
       margin-left: 0;
       margin-right: 1px; }
     blockquote:first-child {
       margin-top: 0; }
     blockquote p:last-child,
     blockquote ul:last-child,
     blockquote ol:last-child {
       margin-bottom: 0; }
     blockquote footer {
       display: block;
       font-size: 80%; }
   
   img {
     border: 0;
     display: block;
     max-width: 100% !important;
     vertical-align: middle; }
   
   hr {
     border: 0;
     border-bottom: 2px solid #bbb;
     height: 0;
     margin: 2.25rem 0;
     padding: 0; }
   
   dt {
     font-weight: bold; }
   
   dd {
     margin: 0;
     margin-bottom: 0.75rem; }
   
   abbr[title],
   acronym[title] {
     border: 0;
     text-decoration: none; }
   
   table,
   blockquote,
   pre,
   code,
   figure,
   li,
   hr,
   ul,
   ol,
   a,
   tr {
     page-break-inside: avoid; }
   
   h2,
   h3,
   h4,
   p,
   a {
     orphans: 3;
     widows: 3; }
   
   h1,
   h2,
   h3,
   h4,
   h5,
   h6 {
     page-break-after: avoid;
     page-break-inside: avoid; }
   
   h1 + p,
   h2 + p,
   h3 + p {
     page-break-before: avoid; }
   
   img {
     page-break-after: auto;
     page-break-before: auto;
     page-break-inside: avoid; }
   
   pre {
     white-space: pre-wrap !important;
     word-wrap: break-word; }
   
   body {
     padding-bottom: 2.54cm;
     padding-left: 5rem;
     padding-right: 5rem;
     padding-top: 2.54cm; }
   
  /*
   a[href^='http']:after, a[href^='ftp']:after {
     content: " (" attr(href) ")";
     font-size: 80%; }
   
   a[href$='.jpg']:after, a[href$='.jpeg']:after, a[href$='.gif']:after, a[href$='.png']:after {
     display: none; }
   
   abbr[title]:after,
   acronym[title]:after {
     content: " (" attr(title) ")"; }
   */

   .page-break,
   .break-before,
   .page-break-before {
     page-break-before: always; }
   
   .break-after,
   .page-break-after {
     page-break-after: always; }
   
   .avoid-break-inside {
     page-break-inside: avoid; }
   
   .no-print {
     display: none; }
   
   a.no-reformat:after {
     content: ''; }
   
   abbr[title].no-reformat:after,
   acronym[title].no-reformat:after {
     content: ''; }
   
   .no-reformat abbr:after,
   .no-reformat acronym:after,
   .no-reformat a:after {
     content: ''; }

  /* Margins for print layout */
  
  @page {
    padding: 1.5rem 0;
  }
  

    `,
    sansSerif: `     
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-family: 'Montserrat', 'Arial', 'Helvetica Neue', Helvetica, sans-serif; }
      
      body {
        font-family: 'Open Sans', 'Helvetica Neue', Helvetica, arial, sans-serif;
      }
      
      h1 {
        font-weight: 700;
        letter-spacing: -1px;
        text-align: center; }
      
      h2 {
        letter-spacing: -1px; }
      
      h2,
      h3,
      h4,
      h5 {
        /*color: #262626; */}
      
      pre,
      code {
        border: 0; }
      
      pre,
      code,
      blockquote {
        /*background: #f8f8f9; */}
      
      blockquote {
        margin-left: 1.5rem;
        margin-right: 1.5rem; }
    `,
    serif: `
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-family: 'Crimson Text', Baskerville, 'Baskerville Old Face', 'Hoefler Text', Garamond, 'Times New Roman', serif; }
      
      body {
        font-family: Georgia, "Times New Roman", Times, serif;
      }
      
      h1 {
        text-align: center; }
      
      pre {
        border: 1px solid #000; }
      
      th,
      td {
        border-bottom: 1px solid #000; }
      
      thead {
        border-bottom: 3px double #000; }
      
      blockquote {
        border-left: 1px dashed #000;
        font-variant: small-caps;
        margin-left: 1.5rem;
        padding-left: 1rem; }
        blockquote p:first-letter {
          font-weight: bold; }
    `,
    dark: `
      :root {
        --body-bg: #1c1b22;
        --body-color: #ffffff;
      }
    `,
    light: `
      :root {
        --body-bg: #ffffff;
        --body-color: #000000;
      }
    `
}