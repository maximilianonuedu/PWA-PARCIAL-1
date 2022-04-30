const API_OPENWEATHER_KEY   = 'f9de70f30082431bd108ea9dd7705e27';
const API_KEY_GOOGLE       = 'AIzaSyCqIsprh-l65BSAAVy6QnBG9te8egiw-Oc';
//const REGION                = 'AR';
const LANG                  = 'sp';
let clickBuscar             = document.getElementById('clickbuscar');
let buscar                  = document.getElementById('buscar');
let datas                   = document.getElementById('data');
let validar                 = document.getElementById('validar');
let info;
let coordenadas             = [];

let ciudad                  = document.getElementById('ciudad');
let tem                     = document.getElementById('tem');
let temmax                  = document.getElementById('temmax');
let temmin                  = document.getElementById('temmin');
let humedad                 = document.getElementById('humedad');
let st                      = document.getElementById('st');
let pa                      = document.getElementById('pa');
let vv                      = document.getElementById('vv');
let loader                  = document.getElementById('loading');  
let mapa                    = document.getElementById('mapa');
let icon = '';


window.onload = function() {
    if (localStorage.length != 0) {
        let ultimaBusqueda = localStorage.getItem('datos');
        let convertido = JSON.parse(ultimaBusqueda);
        buscarClima(convertido.name);
    }else{
        getLocation()
        datas.innerHTML = 'Ingrese una ciudad para consultar el clima </br>';
        datas.innerHTML += new Date().toDateString();
        datas.style.cssText = 'text-align: center; color:#000 !important;';
    }
};

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(posicionActual);
        georeferencia = true;
    } else {
        datas.innerHTML = "La Geolocalizacion no es admitidad";
    }
}

function posicionActual(posicion) {
    coordenadas.push(posicion.coords);
    console.log('full data', coordenadas);
}

clickBuscar.addEventListener('click', ()=>{
   if(buscar.value === ''){
        datas.style.cssText = 'animacion';
        datas.innerHTML = 'Por favor, completa el campo con el nombre de una ciudad para consultar el clima';
   }else{
        buscarClima(buscar.value);
   }
});

function buscarClima(ciudadBuscar) {
    spinner.removeAttribute('hidden');
    try {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudadBuscar}&APPID=${API_OPENWEATHER_KEY}&lang=${LANG}&units=metric`)
        .then(response => response.json())
        .then(data => {datas.innerHTML ='',spinner.setAttribute('hidden', ''),guardar(data);});
        function guardar(data) {
            if(data.cod != '404'){
                localStorage.setItem('datos', JSON.stringify(data));
            }

            if(data.cod === '404'){
                datas.style.cssText = 'transition: all 0.5s ease-out;';
                datas.innerHTML = 'Ciudad no encontrada, verifca que este tipeada correctamente';
            }else{
                console.log(data);
                datas.style.cssText = 'transition: all 0.5s ease-out;';

                datas.innerHTML = 
            `
                <div class="container ciudad d-flex flex-row">
                    <div class="container ciudad d-flex flex-row">
                        <h2>Ciudad: <span id="ciudad">${data.name}</span></h2>
                        <p><img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}"></p>
                        <p>${data.weather[0].description}</p>
                        <p><b>Temperatura:</b><span id="tem">${data.main.temp} °C</span></p>
                        <p><b>Temperatura Máxima:</b><span id="temmax">${data.main.temp_max} °C</span></p>
                        <p><b>Temperatura Mínima:</b><span id="temmin">${data.main.temp_min} °C</span></p>
                        <p><b>Humedad:</b><span id="humedad">${data.main.humidity} %</span></p>
                        <p><b>Sensación Térmica:</b><span id="st">${data.main.feels_like} °C</span></p>
                        <p><b>Presión Atmosferica:</b><span id="pa">${data.main.pressure} HPA</span></p>
                        <p><b>Velocidad del viento:</b><span id="vv">${data.wind.speed} KM/H</span></p>
                    </div>

                    <div class="p-0">
                        <iframe
                            width="100%"
                            frameborder="0"
                            style="border:0"
                            height="50%"
                            style="border:0"
                            loading="lazy"
                            src="https://www.google.com/maps/embed/v1/place?key=${API_KEY_GOOGLE}
                            &q=${data.name}">
                        </iframe>
                    </div>
                </div>
            `;
            }
        }
        return info;
    }catch(error){
        if(error.cod === '404'){
            datas.style.cssText = 'transition: all 0.5s ease-out;';
            datas.innerHTML = 'Ciudad no encontrada, verifca que este tipeada correctamente';
        }
    }
}