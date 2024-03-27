import type { LinkItem } from './LinkItem'

export type StoreType = {
  Pages: LinkItem[]
  Links: LinkItem[]
  url: string
  host: string
  dir: string
  cookie: string
  reinit: () => void
}

export const Store: StoreType = {
  Pages: [],
  Links: [],
  url: '',
  host: '',
  dir: '',
  cookie: '',
  reinit() {
    this.Pages.splice(0)
    this.Links.splice(0)
    this.url = ''
    this.host = ''
    this.dir = ''
    this.cookie = ''
  }
}
