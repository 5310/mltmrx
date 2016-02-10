import {h} from '@cycle/dom'
import {toBookmarklet} from './logic.js'

export const vLinks = (links) => {
  return h(
  'div#links.main-content.mdl-cell.mdl-cell--12-col.mdl-grid--no-spacing.mdl-color--white.mdl-shadow--2dp.mdl-color-text--grey-800',
    links.map(vLink).concat(vLinkNew(links.length))
  )
}
const vLink = (url, n) => h('div.link', {dataset: {index: n}}, [
  h('input.link-text.text.mdl-textfield__input', {type: 'text', value: url}),
  h('button.link-remove.icon.mdl-button.mdl-js-button.mdl-button--icon', [h('i.material-icons', ['remove_circle'])])
])
const vLinkNew = (n) => h('div.link-new.link.new.mdl-color-text--grey-500', {dataset: {index: n}}, [
  h('i.material-icons', ['add_circle_outline']),
  h('div', 'Bookmark')
])

export const vStatus = (links) => {
  let n = links.filter((link) => link.trim().length > 0).length
  let status
  switch (n) {
    case 0:
      status = `add at least two bookmarks`
      break
    case 1:
      status = `need 1 more bookmark`
      break
    default:
      status = `${n} mltmrx`
      break
  }
  return h(
    'div#status.bookmarklet-status.mdl-layout-title', status
  )
}

export const vFAB = (links) => {
  let trimmedLinks = links.filter((link) => link.trim().length > 0)
  return h(
    'a#fab.bookmarklet-button.mdl-button.mdl-js-button.mdl-button--fab.mdl-color--white.mdl-shadow--4dp',
    {href: toBookmarklet(trimmedLinks)},
    h('i.material-icons', 'link')
  )
}
