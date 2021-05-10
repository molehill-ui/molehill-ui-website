import * as CSS from 'csstype'
import {} from 'react'

declare namespace molehill {
  export interface CSSAttribute extends CSS.Properties {
    [key: string]: CSSAttribute | string | number | undefined
  }
}

export default molehill
export as namespace molehill

declare module 'react' {
  interface Attributes {
    css?: molehill.CSSAttribute
    style?: molehill.CSSAttribute
  }
}
