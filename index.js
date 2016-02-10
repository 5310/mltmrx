import {Observable} from 'rx'
import {run} from '@cycle/core'
import {makeDOMDriver, h} from '@cycle/dom'
// import nextTick from 'next-tick'

const ENTER_KEY = 13
const DELETE = 46
const BACKSPACE = 8

const log = (x) => console.log(x)

const toBookmarklet = (links) => encodeURI(`javascript:${JSON.stringify(
    links.map((link) => link.search(/^([^\s]+:)?\/\//) !== -1 ? link : 'http://' + link)
  )}.forEach(l=>window.open(l))`)
// const parseBookmarklet = (bookmarklet) => JSON.parse(
//     bookmarklet.match(/javascript:(\[.*\])/)[1]
//   ).map((link) => link.replace(/^http:\/\//, ''))

const vLinks = (links) => {
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

const vStatus = (links) => {
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
const vFAB = (links) => {
  let trimmedLinks = links.filter((link) => link.trim().length > 0)
  return h(
    'a#fab.bookmarklet-button.mdl-button.mdl-js-button.mdl-button--fab.mdl-color--white.mdl-shadow--4dp',
    {href: toBookmarklet(trimmedLinks)},
    h('i.material-icons', 'link')
  )
}

const main = ({DOMMain}) => {
  const new$ = Observable.merge(
    DOMMain.select('.link-new').events('click')
      .map((ev) => ({type: 'new', index: ev.target.dataset.index})),
    DOMMain.select('.link-text')
      .events('keyup')
      .filter((ev) => ev.keyCode === ENTER_KEY)
      .map((ev) => ({type: 'new', index: parseInt(ev.target.parentElement.dataset.index, 10) + 1}))
  ).startWith({type: 'new', index: '0'})

  const edit$ = Observable.merge(
    DOMMain.select('.link-text')
      .events('keyup')
      .debounce(500),
    DOMMain.select('.link-text')
      .events('blur')
  ).map((ev) => ({type: 'edit', index: ev.target.parentElement.dataset.index, url: ev.target.value})).share()

  const remove$ = Observable.merge(
      DOMMain.select('.link-remove').events('click'),
      DOMMain.select('.link-text').events('keyup')
        .filter((ev) => ev.keyCode === DELETE || ev.keyCode === BACKSPACE)
        .filter((ev) => ev.target.value.trim().length === 0)
    ).map((ev) => ({type: 'remove', index: ev.target.parentElement.dataset.index})).share()

  const links$ = Observable.merge(new$, edit$, remove$)
    .startWith([])
    .scan((o, a) => {
      let o2 = o.slice(0)
      switch (a.type) {
        case 'new':
          if (a.index === -1) o2.splice(a.index, 0, '')
          else o2.push('')
          return o2
        case 'edit':
          o2[a.index] = a.url
          return o2
        case 'remove':
          if (o.length > 1) {
            o2.splice(a.index, 1)
            return o2
          } else {
            return o
          }
          break
        default:
          return o
      }
    })

  const focuse$ = Observable.merge(
    new$.map((a) => a.index),
    remove$.map((a) => a.index <= 0 ? 0 : a.index - 1),
  ).map((index) => `.link[data-index='${index}']>.link-text`)

  return {
    DOMMain: links$
      .tap(log)
      .map(vLinks),
    DOMStatus: links$.map(vStatus),
    DOMFAB: links$.map(vFAB),
    FocusMain: focuse$
  }
}

const makeFocusDriver = function (rootSelector) {
  let root = document.querySelector(rootSelector)
  return function (focuse$, driverName) {
    focuse$
      .map((selector) => root.querySelector(selector))
      .subscribe((element) => element.focus())
  }
}

run(main, {
  DOMMain: makeDOMDriver('main'),
  DOMStatus: makeDOMDriver('#status'),
  DOMFAB: makeDOMDriver('#fab'),
  FocusMain: makeFocusDriver('main')
})
