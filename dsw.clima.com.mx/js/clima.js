const API_URL_BASE ="https://api.openweathermap.org/data/2.5/";
const API_APP_ID="2eb7842b540f6a0a66d35420dbeb03bb";
const IMG_URL_BASE_START = "https://openweathermap.org/img/wn/";
const IMG_URL_BASE_END = "@2x.png";

var div_resultados;
var city;

window.onload = function () {
   
    city = document.getElementById("cityInput");
    div_resultados = document.getElementById("div_resultados");
    
    //Oculta el div de resultados
    div_resultados.style.display = "none";
}
function getCurrentWeather() {
    div_resultados.style.display = "none";

    var URL_CONSULTA = API_URL_BASE+"weather?q="+city.value+
                        "&appid="+API_APP_ID+
                        "&lang=es&units=metric";
    console.log(URL_CONSULTA);
    axios.get(URL_CONSULTA).then((response) => {
        console.log(response);
            if (response.status >= 200 && response.status < 300) {
                var data = response.data;
                console.log(data);
                mostrarClima(data.main,data);
            }else{
                
                alert("No se puede conectar al servidor...");
            }   
        }).catch((error) => {
            console.log(error);
            alert("El API_KEY solo permite consutar clima de lugares "+ 
                  "existentes en el mundo...");
        });
    return false;
}

function getForecast(){
    div_resultados.style.display = "none";

    var URL_CONSULTA = API_URL_BASE+"forecast?q="+city.value+
                        "&appid="+API_APP_ID+
                        "&lang=es&units=metric";
    console.log(URL_CONSULTA);
    axios.get(URL_CONSULTA).then((response) => {
        console.log(response);
            if (response.status >= 200 && response.status < 300) {
                var data = response.data;
                console.log(data);
                mostrarClima1(data.list);
            }else{
                
                alert("No se puede conectar al servidor...");
            }   
        }).catch((error) => {
            console.log(error);
            alert("El API_KEY solo permite consutar clima de lugares "+ 
                  "existentes en el mundo...");
        });
    return false;
}



function mostrarClima(climaActual,icon) {
    div_resultados.style.display = "block";
    div_resultados.innerHTML ="";
    let temperatureDiv = document.createElement("h2");
    temperatureDiv.innerText = "Tiempo para  "+
                        city.value;


    div_resultados.appendChild(temperatureDiv);
    let tarjetas = "";
       
    
    tarjetas = generarTarjeta(climaActual,icon); 
        

        if (tarjetas !== "") {
            tarjetas = '<div class="tarjetas">' + tarjetas + '</div>';
            div_resultados.insertAdjacentHTML("beforeend", tarjetas);
        } else {
            let mensaje = document.createElement("h3");
            mensaje.innerText = "No se encontraron resultados para este lugar...";
            mensaje.className = "sinresultados";
            div_resultados.appendChild(mensaje);
        }
}


function mostrarClima1(pronosticoClima) {
    div_resultados.style.display = "block";
    div_resultados.innerHTML ="";
    let temperatureDiv = document.createElement("h2");
    temperatureDiv.innerText = "Tiempo para  "+
                        city.value;


    div_resultados.appendChild(temperatureDiv);
    let tarjetas = "";
       
    const uniqueDates = new Set();
    const uniqueData = pronosticoClima.reduce((acc, item) => {
        const date = item.dt_txt.split(' ')[0];
        if (uniqueDates.size < 5 && !uniqueDates.has(date)) {
            uniqueDates.add(date);
            acc.push(item);
        }
        return acc;
    }, []);

    uniqueData.forEach((pronostico) => {
        tarjetas += generarTarjeta1(pronostico);
    });


        if (tarjetas !== "") {
            tarjetas = '<div class="tarjetas">' + tarjetas + '</div>';
            div_resultados.insertAdjacentHTML("beforeend", tarjetas);
        } else {
            let mensaje = document.createElement("h3");
            mensaje.innerText = "No se encontraron resultados para este lugar...";
            mensaje.className = "sinresultados";
            div_resultados.appendChild(mensaje);
        }
}
function generarTarjeta(datos,dato) {
    const fechaActual = new Date(); // Obtiene la fecha actual
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fecha = fechaActual.toLocaleDateString('es-ES', options); // Formatea la fecha
    const iconoURL = IMG_URL_BASE_START + dato.weather[0].icon + IMG_URL_BASE_END;
    console.log(datos)
    return '<div class="tarjeta">'+
           '    <h3>'+fecha+'</h3>'+
           '    <img src="' + iconoURL + '" alt="Icono del clima" style="max-width: 55px;">' +
           '    <h4>Máxima:'+datos.temp_max+'</h4>'+
           '    <h4>Minima:'+datos.temp_min+'</h4>'+
           '    <br>'+
           '</div>';
  }

  function generarTarjeta1(datos) {
    const fecha = new Date(datos.dt_txt);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const iconoURL = IMG_URL_BASE_START + datos.weather[0].icon + IMG_URL_BASE_END;

    console.log(datos)
    return '<div class="tarjeta">'+
    '    <h3>' + fecha.toLocaleDateString('es-ES', options) + '</h3>' +
    '    <img src="' + iconoURL + '" alt="Icono del clima" style="max-width: 55px;">' +
           '    <h4>Máxima:'+datos.main.temp_max+'</h4>'+
           '    <h4>Minima:'+datos.main.temp_min+'</h4>'+
           '    <br>'+
           '</div>';
  }