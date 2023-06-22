// Obtener referencias a los elementos del DOM
const formularioFavoritos = document.getElementById('formularioFavoritos');
const categoriasSelect = document.getElementById('categorias');
const platosSelect = document.getElementById('platos');
const resultadoDiv = document.getElementById('resultado');

// Función para agregar un plato favorito a la lista
const agregarPlatoALaLista = (plato) => {
  const card = document.createElement('div');
  card.classList.add('card', 'col-md-4', 'mb-3');
  card.innerHTML = `
  <img src="${plato.strMealThumb}" class="card-img-top" alt="${plato.strMeal}">
    <div class="card-body">
      <h5 class="card-title">${plato.strMeal}</h5>
      <p class="card-text">${plato.strInstructions}</p>
    </div>
  `;
  resultadoDiv.appendChild(card);
}

// Función para limpiar los campos del formulario
const limpiarFormulario = () => {
  formularioFavoritos.reset();
}

// Función para cargar las categorías desde la API
const cargarCategorias = async () => {
  const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.categories) {
      data.categories.forEach((categoria) => {
        const option = document.createElement('option');
        option.value = categoria.strCategory;
        option.textContent = categoria.strCategory;
        categoriasSelect.appendChild(option);
      });
    } else {
      throw new Error('Error al obtener las categorías');
    }
  } catch (error) {
    console.error(error);
  }
}

// Función para cargar los platos de una categoría desde la API
const cargarPlatos = async (categoria) => {
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.meals) {
      platosSelect.innerHTML = ''; // Limpiar opciones anteriores

      data.meals.forEach((plato) => {
        const option = document.createElement('option');
        option.value = plato.strMeal;
        option.textContent = plato.strMeal;
        platosSelect.appendChild(option);
      });
    } else {
      throw new Error('Error al obtener los platos');
    }
  } catch (error) {
    console.error(error);
  }
}

// Evento submit del formulario
formularioFavoritos.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Obtener los valores seleccionados en el formulario
  const categoriaSeleccionada = categoriasSelect.value;
  const platoSeleccionado = platosSelect.value;

  // Validar que se haya seleccionado una categoría y un plato
  if (categoriaSeleccionada.trim() === '' || platoSeleccionado.trim() === '') {
    alert('Por favor, seleccione una categoría y un plato.');
    return;
  }

  // Obtener los detalles del plato seleccionado
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${platoSeleccionado}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.meals && data.meals.length > 0) {
      const plato = data.meals[0];
      agregarPlatoALaLista(plato);
      limpiarFormulario();
    } else {
      throw new Error('Plato no encontrado');
    }
  } catch (error) {
    console.error(error);
  }
});

// Cargar las categorías al cargar la página
cargarCategorias();

// Evento change del select de categorías
categoriasSelect.addEventListener('change', () => {
  const categoriaSeleccionada = categoriasSelect.value;
  cargarPlatos(categoriaSeleccionada);
});
