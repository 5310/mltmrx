import {run} from '@cycle/core'
import {main} from './src/main.js'
import {makeDOMDriver} from '@cycle/dom'
import {makeFocusDriver} from './src/driver-focus.js'

run(main, {
  DOMMain: makeDOMDriver('#links'),
  DOMStatus: makeDOMDriver('#status'),
  DOMFAB: makeDOMDriver('#fab'),
  FocusMain: makeFocusDriver('#links')
})
