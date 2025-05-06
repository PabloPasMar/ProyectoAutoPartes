// URL base de la API
const API_URL = "https://api-git-master-pablos-projects-4849ceb5.vercel.app";

// Cargar datos cuando se carga la página
document.addEventListener('DOMContentLoaded', async () => {
    await obtenerProductos();
    await cargarFiltros();
    
    // Agregar evento para buscar al escribir
    document.getElementById('search').addEventListener('input', debounce(filtrarProductos, 500));
    
    // Agregar eventos para filtros
    document.getElementById('marca').addEventListener('change', filtrarProductos);
    document.getElementById('año').addEventListener('change', filtrarProductos);
    document.getElementById('modelo').addEventListener('change', filtrarProductos);
});

// Función para obtener todos los productos
async function obtenerProductos() {
    try {
        mostrarCargando(true);
        const respuesta = await fetch(`${API_URL}/Productos`);
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        
        const productos = await respuesta.json();
        renderizarProductos(productos);
        return productos;
    } catch (error) {
        console.error("Error al obtener productos:", error);
        mostrarError("No se pudieron cargar los productos. Por favor, intenta más tarde.");
    } finally {
        mostrarCargando(false);
    }
}

// Función para renderizar productos en la página
function renderizarProductos(productos) {
    const catalog = document.querySelector('.catalog');
    
    if (!productos || productos.length === 0) {
        catalog.innerHTML = '<div class="no-products">No se encontraron productos que coincidan con tu búsqueda</div>';
        return;
    }
    
    catalog.innerHTML = productos.map(producto => `
        <div class="product" data-id="${producto.id}">
            <img src="${producto.imagen || 'placeholder.jpg'}" alt="${producto.nombre}" onerror="this.src='placeholder.jpg'">
            <div class="product-info">
                <h3>${producto.nombre}</h3>
                <p class="product-details">
                    <span class="marca">${producto.marca || 'N/A'}</span> | 
                    <span class="modelo">${producto.modelo || 'N/A'}</span> | 
                    <span class="año">${producto.año || 'N/A'}</span>
                </p>
                <p class="price">Q${producto.precio.toFixed(2)}</p>
                <button class="btn-details" onclick="mostrarDetalles(${producto.id})">Ver Detalles</button>
            </div>
        </div>
    `).join('');
}

// Función para cargar los filtros desde la API
async function cargarFiltros() {
    try {
        // Cargar marcas
        const marcasResponse = await fetch(`${API_URL}/Productos/marcas`);
        if (marcasResponse.ok) {
            const marcas = await marcasResponse.json();
            const marcaSelect = document.getElementById('marca');
            marcas.forEach(marca => {
                const option = document.createElement('option');
                option.value = marca;
                option.textContent = marca;
                marcaSelect.appendChild(option);
            });
        }
        
        // Cargar años
        const añosResponse = await fetch(`${API_URL}/Productos/años`);
        if (añosResponse.ok) {
            const años = await añosResponse.json();
            const añoSelect = document.getElementById('año');
            años.forEach(año => {
                const option = document.createElement('option');
                option.value = año;
                option.textContent = año;
                añoSelect.appendChild(option);
            });
        }
        
        // Cargar modelos
        const modelosResponse = await fetch(`${API_URL}/Productos/modelos`);
        if (modelosResponse.ok) {
            const modelos = await modelosResponse.json();
            const modeloSelect = document.getElementById('modelo');
            modelos.forEach(modelo => {
                const option = document.createElement('option');
                option.value = modelo;
                option.textContent = modelo;
                modeloSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error al cargar filtros:", error);
    }
}

// Función para filtrar productos
async function filtrarProductos() {
    try {
        mostrarCargando(true);
        
        const searchTerm = document.getElementById('search').value.trim();
        const marca = document.getElementById('marca').value;
        const año = document.getElementById('año').value;
        const modelo = document.getElementById('modelo').value;
        
        // Construir URL con parámetros de filtro
        let url = `${API_URL}/Productos/filtrar?`;
        
        if (searchTerm) url += `nombre=${encodeURIComponent(searchTerm)}&`;
        if (marca) url += `marca=${encodeURIComponent(marca)}&`;
        if (año) url += `año=${encodeURIComponent(año)}&`;
        if (modelo) url += `modelo=${encodeURIComponent(modelo)}&`;
        
        // Eliminar el último '&' si existe
        url = url.endsWith('&') ? url.slice(0, -1) : url;
        
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        
        const productos = await respuesta.json();
        renderizarProductos(productos);
    } catch (error) {
        console.error("Error al filtrar productos:", error);
        mostrarError("Error al filtrar productos. Por favor, intenta de nuevo.");
    } finally {
        mostrarCargando(false);
    }
}

// Función para mostrar detalles de un producto
function mostrarDetalles(productoId) {
    // Redireccionar a la página de detalles o mostrar un modal
    window.location.href = `detalles.html?id=${productoId}`;
}

// Función para mostrar indicador de carga
function mostrarCargando(mostrar) {
    let loadingElement = document.querySelector('.loading-indicator');
    
    if (mostrar) {
        if (!loadingElement) {
            loadingElement = document.createElement('div');
            loadingElement.className = 'loading-indicator';
            loadingElement.innerHTML = '<div class="spinner"></div><p>Cargando...</p>';
            document.body.appendChild(loadingElement);
        }
        loadingElement.style.display = 'flex';
    } else if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

// Función para mostrar mensajes de error
function mostrarError(mensaje) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = mensaje;
    
    document.body.appendChild(errorElement);
    
    // Eliminar después de 5 segundos
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}

// Función debounce para mejorar rendimiento en búsquedas
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}