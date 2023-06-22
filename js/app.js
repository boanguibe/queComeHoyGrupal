// Obtener referencias a los elementos del DOM
const categoriasSelect = document.getElementById('categorias');
const resultadoDiv = document.getElementById('resultado');
let categorias = []; // Variable global para almacenar las categorías

// Función para ordenar la colección por "strCategory"
const ordenarPorCategoria = (categorias) => {
  categorias.sort((a, b) => {
    if (a.strCategory < b.strCategory) return -1;
    if (a.strCategory > b.strCategory) return 1;
    return 0;
  });
};

// Función para limpiar los platos existentes en el resultado
const limpiarPlatos = () => {
  resultadoDiv.innerHTML = '';
};

// Función para crear un card de plato
const crearCardPlato = (plato) => {
  const card = document.createElement('div');
  card.classList.add('card', 'col-md-4', 'mb-3');
  card.innerHTML = `
    <img src="${plato.strMealThumb}" class="card-img-top" alt="${plato.strMeal}">
    <div class="card-body">
      <h5 class="card-title">${plato.strMeal}</h5>
      <p class="card-text">Categoria: ${plato.strCategory || 'No está disponible la preparación'}
      <br>Area: ${plato.strArea || 'No está disponible la preparación'}
      </p>
    
      </div>
  `;
  return card;
};

// Función asíncrona principal
async function cargarCategorias() {
  try {
    const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
    const response = await fetch(url);
    const data = await response.json();

    // Verificar si la respuesta contiene las categorías
    if (data.categories) {
      categorias = data.categories;

      // Ordenar las categorías por "strCategory"
      ordenarPorCategoria(categorias);

      // Mostrar las categorías en el select
      categorias.forEach((categoria) => {
        const option = document.createElement('option');
        option.value = categoria.idCategory;
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

// Función para buscar y mostrar los platos de una categoría seleccionada
const buscarPlatos = async () => {
  limpiarPlatos();

  const categoriaSeleccionada = categoriasSelect.value;

  if (categoriaSeleccionada === '-- Seleccione --') {
    return;
  }

  const categoria = categorias.find((categoria) => categoria.idCategory === categoriaSeleccionada);
  if (categoria) {
    const platos = await obtenerPlatosCategoria(categoria.strCategory);
    mostrarPlatos(platos);
  }
};

// Función para obtener los platos de una categoría
const obtenerPlatosCategoria = async (categoria) => {
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Función para obtener los detalles de un plato por su ID
const obtenerDetallesPlato = async (id) => {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.meals && data.meals[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Función para mostrar los platos en el resultado
const mostrarPlatos = async (platos) => {
  for (const plato of platos) {
    const platoConDetalles = await obtenerDetallesPlato(plato.idMeal);
    if (platoConDetalles) {
      const card = crearCardPlato(platoConDetalles);
      resultadoDiv.appendChild(card);
    }
  }
};

// Llamar a la función principal para cargar las categorías
cargarCategorias();
