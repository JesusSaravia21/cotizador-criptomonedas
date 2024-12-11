const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

//Promise que nos devuelve las criptomonedas

const obtenerCriptomonedas = criptomonedas => new Promise (resolve =>{
    resolve(criptomonedas)
});

document.addEventListener('DOMContentLoaded', ()=>{
    consultarCriptomonedas();
    formulario.addEventListener('submit', submitFormulario);
    monedaSelect.addEventListener('change', leerValor);
    criptomonedasSelect.addEventListener('change', leerValor);
})


async function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

   try {
    const response = await fetch(url);
    const data = await response.json();
    const criptomonedas = await obtenerCriptomonedas(data.Data);
    selectCriptomonedas(criptomonedas);
   } catch (error) {
        console.log(error);
   }
    

}


function selectCriptomonedas(criptomonedas){

    criptomonedas.forEach(cripto =>{
        const {Name, FullName} = cripto.CoinInfo;

        const option = document.createElement('OPTION');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);


    })

}

function leerValor(e){

    objBusqueda[e.target.name] = e.target.value;

}

function submitFormulario(e){

    e.preventDefault();

    //Validar

    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    //Consultar API con los resultados
    consultarAPI();



}


function mostrarAlerta(msg){

    const divError = document.querySelector('.error');

    if(!divError){

        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('error');

        divMensaje.textContent = msg;

        formulario.appendChild(divMensaje);

        setTimeout(()=>{
            divMensaje.remove();
        }, 3000)

    }

    
}

function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)
        .then(response => response.json())
        .then(data => {
            mostrarCotizacionHTML(data.DISPLAY[criptomoneda][moneda]);
        })
}


function mostrarCotizacionHTML(cotizacion){

   limpiarHTML();

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es <span>${PRICE}</span>`;

    const precioAlto = document.createElement('P');
    precioAlto.innerHTML = `<p>Precio mas alto del dia: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('P');
    precioBajo.innerHTML = `<p>Precio mas bajo del dia: <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('P');
    ultimasHoras.innerHTML = `<p>Variacion ultimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaActualizacion = document.createElement('P');
    ultimaActualizacion.innerHTML = `<p>Ultima actualizacion: <span>${LASTUPDATE}</span>`;

    

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function mostrarSpinner(){

    limpiarHTML();

    const spinner = document.createElement('DIV');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(spinner);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}


