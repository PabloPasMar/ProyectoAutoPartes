// URL base de la API
const API_URL = "https://api-git-master-pablos-projects-4849ceb5.vercel.app/";

// Función para obtener parámetros de la URL
function obtenerParametroURL(nombre) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nombre);
}

// Cargar datos cuando se carga la página
document.addEventListener('DOMContentLoaded', async () => {
    const productoId = obtenerParametroURL('id');
    
    if (!productoId) {
        mostrarError("No se especificó un producto para mostrar");
        return;
    }
    
    await cargarDetallesProducto(productoId);
});

// Función para cargar los detalles del producto
async function cargarDetallesProducto(productoId) {
    try {
        mostrarCargando(true);
        
        const respuesta = await fetch(`${API_URL}/Productos/${productoId}`);
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        
        const producto = await respuesta.json();
        renderizarDetallesProducto(producto);
    } catch (error) {
        console.error("Error al cargar detalles del producto:", error);
        mostrarError("No se pudo cargar la información del producto. Por favor, intenta más tarde.");
    } finally {
        mostrarCargando(false);
    }
}

// Función para renderizar los detalles del producto
function renderizarDetallesProducto(producto) {
    const contenedor = document.getElementById('producto-detalle');
    
    // Determinar el estado del stock
    let stockClase = 'in-stock';
    let stockTexto = 'En Stock';
    
    if (producto.stock <= 0) {
        stockClase = 'out-of-stock';
        stockTexto = 'Sin Stock';
    } else if (producto.stock < 5) {
        stockClase = 'low-stock';
        stockTexto = 'Bajo Stock';
    }
    
    contenedor.innerHTML = `
        <div class="product-image-container">
            <img src="${producto.imagen || 'placeholder.jpg'}" alt="${producto.nombre}" class="product-image" onerror="this.src='placeholder.jpg'">
        </div>
        <div class="product-info-detail">
            <h2>${producto.nombre}</h2>
            <div class="product-meta">
                <div class="meta-item">
                    <span class="meta-label">Marca:</span>
                    <span class="meta-value">${producto.marca || 'No especificada'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Modelo:</span>
                    <span class="meta-value">${producto.modelo || 'No especificado'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Año:</span>
                    <span class="meta-value">${producto.año || 'No especificado'}</span>
                </div>
            </div>
            <div class="price-detail">Q${producto.precio.toFixed(2)}</div>
            <div class="stock-info ${stockClase}">${stockTexto} (${producto.stock} unidades)</div>
            
            <a href="index.html" class="back-button">Volver al catálogo</a>
            
            <div class="cotizacion-form">
                <h3>Solicitar Cotización</h3>
                <form id="cotizacion-form" onsubmit="enviarCotizacion(event, ${producto.id})">
                    <div class="form-group">
                        <label for="nombre">Nombre completo *</label>
                        <input type="text" id="nombre" name="nombre" required>
                        <span class="error-message" id="error-nombre"></span>
                    </div>
                    <div class="form-group">
                        <label for="email">Correo electrónico *</label>
                        <input type="email" id="email" name="email" required>
                        <span class="error-message" id="error-email"></span>
                    </div>
                    <div class="form-group">
                        <label for="telefono">Teléfono *</label>
                        <input type="tel" id="telefono" name="telefono" required>
                        <span class="error-message" id="error-telefono"></span>
                    </div>
                    <div class="form-group">
                        <label for="cantidad">Cantidad *</label>
                        <input type="number" id="cantidad" name="cantidad" min="1" max="${producto.stock}" required>
                        <span class="error-message" id="error-cantidad"></span>
                    </div>
                    <div class="form-group">
                        <label for="mensaje">Mensaje o especificaciones adicionales</label>
                        <textarea id="mensaje" name="mensaje" rows="4"></textarea>
                    </div>
                    <button type="submit" class="cotizar-button">Solicitar Cotización</button>
                </form>
            </div>
        </div>
    `;
    
    // Agregar validación a los campos del formulario
    agregarValidacionFormulario();
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

// Función para validar el formulario de cotización
function agregarValidacionFormulario() {
    // Obtener elementos del formulario
    const form = document.getElementById('cotizacion-form');
    const inputNombre = document.getElementById('nombre');
    const inputEmail = document.getElementById('email');
    const inputTelefono = document.getElementById('telefono');
    const inputCantidad = document.getElementById('cantidad');
    
    // Validar nombre
    inputNombre.addEventListener('blur', function() {
        validarCampo(
            this,
            (valor) => valor.trim().length >= 3,
            'Por favor ingresa un nombre válido (mínimo 3 caracteres)'
        );
    });
    
    // Validar email
    inputEmail.addEventListener('blur', function() {
        validarCampo(
            this,
            (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor),
            'Por favor ingresa un correo electrónico válido'
        );
    });
    
    // Validar teléfono
    inputTelefono.addEventListener('blur', function() {
        validarCampo(
            this,
            (valor) => /^\d{8,}$/.test(valor),
            'Por favor ingresa un número de teléfono válido (mínimo 8 dígitos)'
        );
    });
    
    // Validar cantidad
    inputCantidad.addEventListener('blur', function() {
        const max = parseInt(this.getAttribute('max'));
        validarCampo(
            this,
            (valor) => parseInt(valor) > 0 && parseInt(valor) <= max,
            `Por favor ingresa una cantidad entre 1 y ${max}`
        );
    });
    
    // Validar todo el formulario antes de enviar
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Validar todos los campos obligatorios
        const esNombreValido = validarCampo(
            inputNombre,
            (valor) => valor.trim().length >= 3,
            'Por favor ingresa un nombre válido (mínimo 3 caracteres)'
        );
        
        const esEmailValido = validarCampo(
            inputEmail,
            (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor),
            'Por favor ingresa un correo electrónico válido'
        );
        
        const esTelefonoValido = validarCampo(
            inputTelefono,
            (valor) => /^\d{8,}$/.test(valor),
            'Por favor ingresa un número de teléfono válido (mínimo 8 dígitos)'
        );
        
        const max = parseInt(inputCantidad.getAttribute('max'));
        const esCantidadValida = validarCampo(
            inputCantidad,
            (valor) => parseInt(valor) > 0 && parseInt(valor) <= max,
            `Por favor ingresa una cantidad entre 1 y ${max}`
        );
        
        // Si todos los campos son válidos, enviar el formulario
        if (esNombreValido && esEmailValido && esTelefonoValido && esCantidadValida) {
            // Obtener el ID del producto de la URL
            const productoId = obtenerParametroURL('id');
            enviarCotizacion(event, productoId);
        }
    });
}

// Función para validar un campo individual
function validarCampo(input, validacion, mensajeError) {
    const valor = input.value;
    const errorElement = document.getElementById(`error-${input.id}`);
    
    if (!validacion(valor)) {
        input.classList.add('invalid');
        if (errorElement) {
            errorElement.textContent = mensajeError;
            errorElement.style.display = 'block';
        }
        return false;
    } else {
        input.classList.remove('invalid');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        return true;
    }
}

// Función para enviar cotización al backend
function enviarCotizacion(event, productoId) {
    event.preventDefault();
    
    const formData = {
        productoId: parseInt(productoId),
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        cantidad: parseInt(document.getElementById('cantidad').value),
        mensaje: document.getElementById('mensaje').value
    };
    
    // Mostrar cargando
    mostrarCargando(true);
    
    // Enviar petición a la API
    fetch(`${API_URL}/Cotizaciones`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text || 'Error al enviar la cotización');
            });
        }
        return response.json();
    })
    .then(data => {
        mostrarCargando(false);
        
        // Mostrar mensaje de éxito
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = 'Cotización enviada con éxito. Nos pondremos en contacto contigo pronto.';
        document.body.appendChild(successMsg);
        
        // Eliminar después de 5 segundos
        setTimeout(() => {
            successMsg.remove();
        }, 5000);
        
        // Resetear formulario
        document.getElementById('cotizacion-form').reset();
    })
    .catch(error => {
        mostrarCargando(false);
        console.error('Error:', error);
        mostrarError('Error al enviar la cotización: ' + error.message);
    });
}