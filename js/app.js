const criptomonedaSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

document.addEventListener('DOMContentLoaded', () => {
  startAPP();
  criptomonedaSelect.addEventListener('change', llenarBusqueda);
  monedaSelect.addEventListener('change', llenarBusqueda);
  formulario.addEventListener('submit', validarFormulario);
});

const objMoneda = {
  moneda: '',
  criptomoneda: '',
};

function llenarBusqueda(e) {
  objMoneda[e.target.name] = e.target.value;
}

function startAPP() {
  const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

  const obtenerCriptomonedas = (criptomonedas) =>
    new Promise((resolve) => resolve(criptomonedas));

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => obtenerCriptomonedas(resultado.Data))
    .then((criptomonedas) => criptomonedasSelectHTML(criptomonedas));
}

function criptomonedasSelectHTML(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    const {
      CoinInfo: { FullName, Name },
    } = cripto;

    const option = document.createElement('OPTION');
    option.value = Name;
    option.textContent = FullName;

    criptomonedaSelect.appendChild(option);
  });
}

function validarFormulario(e) {
  e.preventDefault();
  const { moneda, criptomoneda } = objMoneda;

  if (moneda == '' || criptomoneda == '') {
    mostrarMensaje('Error, falta rellenar campos');
    return;
  }

  consultarAPI(moneda, criptomoneda);
}

function consultarAPI(moneda, criptomoneda) {
  url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  limpiarHTML();
  spinner();

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) =>
      mostrarResultadoHTML(resultado.DISPLAY[criptomoneda][moneda])
    );
}

function spinner() {
  const spinner = document.createElement('DIV');
  spinner.innerHTML = `

    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    
    `;

  spinner.classList.add('spinner');

  resultado.appendChild(spinner);
}

function mostrarResultadoHTML(informacion) {
  limpiarHTML();

  const { HIGHDAY, LOWDAY, PRICE, LASTUPDATE } = informacion;

  const price = document.createElement('P');
  price.classList.add('precio');
  price.innerHTML = `El precio del dia es <span>${PRICE}</span>`;
  const priceHigh = document.createElement('P');
  priceHigh.innerHTML = `El precio mas alto del dia es <span>${HIGHDAY}</span>`;
  const priceLow = document.createElement('P');
  priceLow.innerHTML = `El precio mas bajo del dia es <span>${LOWDAY}</span>`;
  const priceAct = document.createElement('P');
  priceAct.innerHTML = `El precio mas bajo del dia es <span>${LASTUPDATE}</span>`;

  resultado.appendChild(price);
  resultado.appendChild(priceHigh);
  resultado.appendChild(priceLow);
  resultado.appendChild(priceAct);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function mostrarMensaje(mensaje) {
  const existeError = document.querySelector('.error');

  if (!existeError) {
    const p = document.createElement('P');
    p.classList.add('error');
    p.textContent = mensaje;

    setTimeout(() => {
      p.remove();
    }, 3000);

    formulario.appendChild(p);
  }
}
