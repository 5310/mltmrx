export const toBookmarklet = (links) => encodeURI(`javascript:${JSON.stringify(
    links.map((link) => link.search(/^([^\s]+:)?\/\//) !== -1 ? link : 'http://' + link)
  )}.forEach(l=>window.open(l))`)

export const parseBookmarklet = (bookmarklet) => JSON.parse(
     bookmarklet.match(/javascript:(\[.*\])/)[1]
   ).map((link) => link.replace(/^http:\/\//, ''))
