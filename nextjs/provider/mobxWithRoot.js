import React, { Component } from 'react'
import { Provider } from 'mobx-react'
//import store from '../stores/store'
let stores = null
function initStore(strs, isServer, req) {
  if (strs !== null) return strs
  return {
    // store: new store(req),
  }
}
function mobxWithRoot(BaseComponent) {
  class mobxWithRootClass extends Component {
    static async getInitialProps(ctx) {
      const { req } = ctx
      const isServer = !!req
      stores = initStore(stores, isServer, req)
      if (BaseComponent.getInitialProps) {
        return { ...await BaseComponent.getInitialProps(ctx), isServer }
      }
      return { isServer }
    }
    constructor(props) {
      super(props)
      stores = initStore(stores, props.isServer)
    }
    render() {
      return (
        <Provider {...stores}>
          <BaseComponent {...this.props} />
        </Provider>
      )
    }
  }
  return mobxWithRootClass
}
export default mobxWithRoot