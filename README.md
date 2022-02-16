# Sammelband

Collate web articles into a virtual [sammelband](https://en.wikipedia.org/wiki/Sammelband). A read-them-later service, if you will.

## TODO

- [X] Add styling to parsed articles
- [X] HTML-to-PDF converter
- [X] Add options to form for user style preferences
- [X] Add titles to each parsed article
- [ ] Tweak Gutenberg.css
- [X] Separate user requests using express-session
- [X] Implement session store for production
- [X] Implement email function
- [X] Notification when email sent
- [X] Send as email attachment
- [X] Form validation
- [X] Download button
- [X] Add reset button (delete existing HTML file)
- [X] HTML-to-EPUB
- [ ] Regular cleanup of `/public` folder
- [ ] Upload CSV of URLs (e.g. from bookmarks)
- [ ] Integration with Pocket and Instapaper

### CSS modifications for better readability

- Apply `max-width: 80ch` to `<p>` elements (consensus appears to be 50 - 90 characters for optimal line length)
- Apply `max-width: 700px` to `<body>` to center the whole shebang
- Change the sans-serif header fonts from Arial Black/Arial Bold (horrendous) to plain Arial (not ideal, but available everywhere)
- Change `text-align` from `justify` to `start` (I agree with [this sentiment](https://www.cgpgrey.com/blog/voyage-to-nowhere))
- Change `body {padding}` to `1rem`