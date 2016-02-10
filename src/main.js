import {mLinkse$, mFocuse$} from './models.js'
import {iNew$, iEdit$, iRemove$} from './intents.js'
import {vLinks, vStatus, vFAB} from './views.js'
import {log} from './utils.js'

export const main = ({DOMMain}) => {
  const new$ = iNew$(DOMMain)
  const edit$ = iEdit$(DOMMain)
  const remove$ = iRemove$(DOMMain)

  const linkse$ = mLinkse$(new$, edit$, remove$)
  const focuse$ = mFocuse$(new$, remove$)

  return {
    DOMMain: linkse$.map(vLinks).tap(log),
    DOMStatus: linkse$.map(vStatus),
    DOMFAB: linkse$.map(vFAB),
    FocusMain: focuse$
  }
}
