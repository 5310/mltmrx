import {Observable} from 'rx'

const ENTER_KEY = 13
const DELETE = 46
const BACKSPACE = 8

export const iNew$ = (DOMMain) => Observable.merge(
  DOMMain.select('.link-new').events('click')
    .map((ev) => ({type: 'new', index: ev.target.dataset.index})),
  DOMMain.select('.link-text')
    .events('keyup')
    .filter((ev) => ev.keyCode === ENTER_KEY)
    .map((ev) => ({type: 'new', index: parseInt(ev.target.parentElement.dataset.index, 10) + 1}))
).startWith({type: 'new', index: '0'})

export const iEdit$ = (DOMMain) => Observable.merge(
  DOMMain.select('.link-text')
    .events('keyup')
    .debounce(500),
  DOMMain.select('.link-text')
    .events('blur')
).map((ev) => ({type: 'edit', index: ev.target.parentElement.dataset.index, url: ev.target.value})).share()

export const iRemove$ = (DOMMain) => Observable.merge(
    DOMMain.select('.link-remove').events('click'),
    DOMMain.select('.link-text').events('keyup')
      .filter((ev) => ev.keyCode === DELETE || ev.keyCode === BACKSPACE)
      .filter((ev) => ev.target.value.trim().length === 0)
  ).map((ev) => ({type: 'remove', index: ev.target.parentElement.dataset.index})).share()
