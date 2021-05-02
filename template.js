import faviconSVG from './favicon.svg'
import faviconPNG from './favicon.png'


export default env => `
  <!doctype html>
  <html lang="en-Us">
    <head>
      <title>Gloomhaven Line of Sight Tool</title>
      <style>body{background:#000;color:#fff}header,#n{display:none}</style>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=800, initial-scale=0.8"/>
      <link rel="icon" href=${faviconSVG} sizes="any" type="image/svg+xml"/>
      <link rel="icon" href=${faviconPNG} sizes="32x32" type="image/png"/>
${
  env.isProduction && !env.isAlpha
    ? require('./partials/meta-description.js').default
    : '<meta name="robots" content="noindex" />'
}
${
  env.isProduction
    ? require('./partials/googleAnalytics.html')
    : ''
}
    </head>
    <body>
      <div id="n">
        <div id="m">
          <a id="mc" href="#"></a>
          <main id="mm">
            <h1>A simple Gloomhaven Line of Sight Tool</h1>

            <p>Simply select a scenario from dropdown and click a hex to see the line of sight information.</p>

${
  require(env.isAlpha
    ? './partials/mode-info-alpha.html'
    : './partials/mode-info.html'
  )
}

            <h2>Other</h2>
            <p><span id="co"></span>. There is also a <a href="https://boardgamegeek.com/thread/2263913/gloomhaven-line-sight-web-app">discussion thread for this app at BoardGameGeek</a>.</p>

            <p>Map tiles and some graphics are from <a href="https://boardgamegeek.com/thread/1733586/files-creation">Creator Pack</a> provided by <a href="//www.cephalofair.com/">Cephalofair Games</a> with <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">BY-NC-SA 4.0 license</a>.</p>
          </main>
        </div>
      </div>
      <header>
        <p>Scenario
          <select id="s"><option value="editor">Editor</option></select>.
        </p>
        <div id="q"></div>
        <div id="h"></div>
        <div id="e"></div>
        <div id="iw">
          <a id="i" href="#"></a>
        </div>
      </header>
      <p id="j">This app requires a browser with support for JavaScript with ES2017 features.</p>
      <div id="a">
        <canvas id="c"></canvas>
      </div>
      <div id="board"></div>
      <div id="items"></div>
      <script>{const a=()=>typeof Object.entries==="function"?document.getElementById("j"):null;document.body.removeChild(a())}</script>
    </body>
  </html>`
