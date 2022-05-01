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
        datas.style.cssText = 'text-align: center; color:#000 !important;';
    }
};

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(posicionActual);
        georeferencia = true;
    } else {
        datas.innerHTML = '<span class="material-symbols-outlined">warning</span>La Geolocalizacion no es admitidad';
    }
}

function posicionActual(posicion) {
    coordenadas.push(posicion.coords);
    console.log('full data', coordenadas);
}

clickBuscar.addEventListener('click', ()=>{
   if(buscar.value === ''){
        datas.style.cssText = 'animacion';
        datas.innerHTML = '<div class="warning"><span class="material-symbols-outlined">warning</span>Por favor, completa el campo con el nombre de una ciudad para consultar el clima</div>';
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
                datas.innerHTML = '<span class="material-symbols-outlined">warning</span>Ciudad no encontrada, verifca que este tipeada correctamente';
            }else{
                console.log(data);
                datas.style.cssText = 'transition: all 0.5s ease-out;';

                datas.innerHTML = 
            `
                <div class="container ciudad-cont col-12 d-flex flex-row">
                    <div class="flex-column col-12">
                       <div class="d-flex col-12 justify-content-between align-items-center">
                            <div class="d-flex flex-column text-center">
                                <h2><span id="tem">${data.main.temp} °C</span></h2>
                                <p><span id="ciudad">${data.name}</span></p>
                            </div>
                            <div class="d-flex flex-column text-center">
                                <p><img class="img-fluid" src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}"></p>
                                <p class="descripcion">${data.weather[0].description.toUpperCase()}</p>
                            </div>
                       </div>
                        <div class="container ciudad d-flex flex-wrap justify-content-between text-center">
                            <p><b>Temperatura Máxima</b><span id="temmax"><i class="fa-solid fa-temperature-high"></i>${data.main.temp_max} °C</span></p>
                            <p><b>Temperatura Mínima</b><span id="temmin"><i class="fa-solid fa-temperature-low"></i>${data.main.temp_min} °C</span></p>
                            <p><b>Humedad</b><span id="humedad"><i class="fa-solid fa-droplet-percent"></i>${data.main.humidity} %</span></p>
                            <p><b>Sensación Térmica</b><span id="st"><i class="fa-solid fa-temperature-list"></i>${data.main.feels_like} °C</span></p>
                            <p><b>Presión Atmosferica</b><span id="pa"><i class="fa-solid fa-arrow-down-wide-short"></i>${data.main.pressure} HPA</span></p>
                            <p><b>Velocidad del viento</b><span id="vv"><i class="fa-solid fa-wind"></i>${data.wind.speed} KM/H</span></p>
                        </div>
                        <div class="p-0 mapa">
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
                </div>
            `;
            }
        }
        return info;
    }catch(error){
        if(error.cod === '404'){
            datas.style.cssText = 'transition: all 0.5s ease-out;';
            datas.innerHTML = '<span class="material-symbols-outlined">warning</span>Ciudad no encontrada, verifca que este tipeada correctamente';
        }
    }
}