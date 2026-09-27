import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App setup screen', () => {
  it('renders the business name inside the main landmark', () => {
    const markup = renderToStaticMarkup(<App />)

    expect(markup).toContain('<main><h1>Dr Plumbing &amp; Heating LLC</h1>')
  })

  it('identifies the page as an unapproved website starter', () => {
    const markup = renderToStaticMarkup(<App />)

    expect(markup).toContain('Website starter')
    expect(markup).toContain('The website design and business details await approval.')
  })

  it('does not offer unconfigured forms or contact links', () => {
    const markup = renderToStaticMarkup(<App />)

    expect(markup).not.toMatch(/<form\b|<button\b|href=/)
  })
})
