const { createElement: h } = React;

function App() {
  return h('main', { className: 'page' },
    h('section', { className: 'card' },
      h('span', { className: 'eyebrow' }, 'Portal del equipo'),
      h('h1', null, 'Hola, mundo.'),
      h('p', null, 'El espacio de trabajo está listo para iniciar.'),
      h('a', { href: 'https://react.dev', target: '_blank', rel: 'noreferrer' },
        'Ver documentación de React')));
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));
