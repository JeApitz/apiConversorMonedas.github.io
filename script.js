const userInput = document.getElementById("user-input");
const btn = document.getElementById("btn");
const cambio = document.getElementById("select-moneda");
const result = document.getElementById("result");
const myChart = document.getElementById("myChart");
let grafico;

async function getData(data) {
  try {
    const res = await fetch(`https://mindicador.cl/api/${data}`);
    const monedas = await res.json();
    const valor = monedas.serie[0].valor;
    const datosFechaValor = monedas.serie.splice(0, 10);
    conversion(valor, data);
    fechasEnOrden(datosFechaValor);
  } catch (error) {
    alert("Algo no esta bien, prueba de nuevo !!!");
  }
}

btn.addEventListener("click", () => {
  const option = cambio.value;
  getData(option);
});

function conversion(d, m) {
  const valorDelInput = userInput.value;
  let calculo;
  if (m === "dolar") {
    calculo = (parseInt(valorDelInput) / parseInt(d)).toFixed(4) + " DOLAR";
  } else if (m === "euro") {
    calculo = (parseInt(valorDelInput) / parseInt(d)).toFixed(4) + " EURO";
  } else if (m === "uf") {
    calculo = (parseInt(valorDelInput) / parseInt(d)).toFixed(4) + " UF";
  }
  result.innerHTML = calculo;
}

function fecha(date) {
  date = new Date(date);
  const anio = date.getFullYear();
  const mes = date.getMonth() + 1;
  const dia = date.getDate();
  return `${dia}-${mes}-${anio}`;
}

function fechasEnOrden(datos) {
  const enOrden = datos.sort((a, b) => {
    if (a.fecha < b.fecha) {
      return -1;
    }
    if (a.fecha > b.fecha) {
      return 1;
    }
    return 0;
  });
  const fechas = enOrden.map((elem) => fecha(elem.fecha));
  const moneda = enOrden.map((elem) => elem.valor);
  prepararConfiguracionParaLaGrafica(moneda, fechas);
}

function prepararConfiguracionParaLaGrafica(a, b) {
  if (grafico) {
    grafico.destroy();
  }
  grafico = new Chart(myChart, {
    type: "line",
    data: {
      labels: b,
      datasets: [
        {
          label: "Cotización de los úlimos 10 días",
          data: a,
          borderColor: "rgb(64, 93, 114)",
        },
      ],
    },
  });
}
