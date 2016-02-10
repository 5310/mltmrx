import {Observable} from 'rx'

export const mLinkse$ = (new$, edit$, remove$) => Observable.merge(new$, edit$, remove$)
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
          return ['']
        }
        break
      default:
        return o
    }
  })

export const mFocuse$ = (new$, remove$) => Observable.merge(
  new$.map((a) => a.index),
  remove$.map((a) => a.index <= 0 ? 0 : a.index - 1),
).map((index) => `.link[data-index='${index}']>.link-text`)
