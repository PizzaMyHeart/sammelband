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
- [ ] Implement user authentication - will need to login to use email features
- [ ] Better Axios error handling e.g. dead links
- [X] Form validation
- [X] Download button
- [X] Add reset button (delete existing HTML file)
- [X] HTML-to-EPUB
- [ ] Regular cleanup of `/public` folder
- [ ] Upload CSV of URLs (e.g. from bookmarks)
- [ ] Integration with Pocket and Instapaper

### CSS modifications for better readability

- Apply `max-width: 80ch` to `<p>` elements (consensus appears to be 50 - 90 characters for optimal line length).
- Set `line-height: calc(1ex / 0.32)` to text elements ([Smashing Magazine article](https://www.smashingmagazine.com/2020/07/css-techniques-legibility/)).
- Set `margin: calc(1ex / 0.42) 0` to headers and list items (again, thanks to [Smashing Magazine article](https://www.smashingmagazine.com/2020/07/css-techniques-legibility/)).
- Apply `max-width: 700px` to `<body>` to center the whole shebang.
- Change the sans-serif header fonts from Arial Black/Arial Bold (horrendous) to plain Arial (not ideal, but available everywhere).
- Change `text-align` from `justify` to `start` (I agree with [this sentiment](https://www.cgpgrey.com/blog/voyage-to-nowhere)).
- Authoring HTML email is 💩&mdash;I've left the CSS as a `<style/>` tag and only removed the left and right margins on `<body>`.
