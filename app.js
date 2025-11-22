// Estado de la aplicación
let allPerfumes = [];
let filteredPerfumes = [];
let currentFilter = 'todos';
let searchTerm = '';
let tableGenderFilter = 'todos'; // 'todos', 'femenino', 'masculino'
let cart = []; // Carrito de compras

// Configuración de WhatsApp
const WHATSAPP_NUMBER = '5491139457241';

// Elementos del DOM
const searchInput = document.getElementById('searchInput');
const featuredFemeninoGrid = document.getElementById('featuredFemeninoGrid');
const featuredMasculinoGrid = document.getElementById('featuredMasculinoGrid');
const inventoryTableBody = document.getElementById('inventoryTableBody');
const featuredSection = document.getElementById('featuredSection');
const inventorySection = document.getElementById('inventorySection');
const thGenero = document.getElementById('thGenero');
const noResults = document.getElementById('noResults');
const resultsCount = document.getElementById('resultsCount');
const filterButtons = document.querySelectorAll('.filter-btn');
const filterTableTodos = document.getElementById('filterTableTodos');
const filterTableFemenino = document.getElementById('filterTableFemenino');
const filterTableMasculino = document.getElementById('filterTableMasculino');

// Elementos del carrito
const cartToggle = document.getElementById('cartToggle');
const cartPanel = document.getElementById('cartPanel');
const cartClose = document.getElementById('cartClose');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const cartCheckout = document.getElementById('cartCheckout');
const cartClear = document.getElementById('cartClear');

// Cargar perfumes al iniciar
async function loadPerfumes() {
    try {
        const response = await fetch('perfumes.json');
        allPerfumes = await response.json();
        filteredPerfumes = allPerfumes;
        renderPerfumes();
    } catch (error) {
        console.error('Error cargando perfumes:', error);
        noResults.style.display = 'block';
        noResults.innerHTML = '<p style="text-align:center;padding:2rem;">Error cargando productos. Por favor recargá la página.</p>';
    }
}

// Renderizar perfumes
function renderPerfumes() {
    featuredFemeninoGrid.innerHTML = '';
    featuredMasculinoGrid.innerHTML = '';
    inventoryTableBody.innerHTML = '';

    if (filteredPerfumes.length === 0) {
        noResults.style.display = 'block';
        featuredSection.style.display = 'none';
        inventorySection.style.display = 'none';
        resultsCount.textContent = '';
        return;
    }

    noResults.style.display = 'none';

    // Mostrar contador de resultados
    const count = filteredPerfumes.length;
    const filterText = currentFilter === 'todos' ? '' : ` ${currentFilter}s`;
    const searchText = searchTerm ? ` que coinciden con "${searchTerm}"` : '';
    resultsCount.textContent = `${count} perfume${count !== 1 ? 's' : ''}${filterText}${searchText}`;

    // Separar por género y ordenar por ranking
    const femeninos = filteredPerfumes.filter(p => p.genero === 'femenino').sort((a, b) => a.ranking - b.ranking);
    const masculinos = filteredPerfumes.filter(p => p.genero === 'masculino').sort((a, b) => a.ranking - b.ranking);

    // Top 3 de cada género para "Más Vendidos"
    const featuredFemeninos = femeninos.slice(0, 3);
    const featuredMasculinos = masculinos.slice(0, 3);

    // Resto para inventario (a partir del 4to de cada género)
    const inventoryFemeninos = femeninos.slice(3);
    const inventoryMasculinos = masculinos.slice(3);
    const inventoryAll = [...inventoryFemeninos, ...inventoryMasculinos].sort((a, b) => a.ranking - b.ranking);

    // Renderizar featured section
    if (featuredFemeninos.length > 0 || featuredMasculinos.length > 0) {
        featuredSection.style.display = 'block';

        // Renderizar femeninos top 3
        featuredFemeninos.forEach(perfume => {
            const card = createProductCard(perfume);
            featuredFemeninoGrid.appendChild(card);
        });

        // Renderizar masculinos top 3
        featuredMasculinos.forEach(perfume => {
            const card = createProductCard(perfume);
            featuredMasculinoGrid.appendChild(card);
        });
    } else {
        featuredSection.style.display = 'none';
    }

    // Renderizar inventory section con filtro de género
    renderInventoryTable(inventoryAll);
}

// Crear tarjeta de producto
function createProductCard(perfume) {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Formatear ID con padding de ceros
    const productId = String(perfume.id).padStart(3, '0');

    const notesHTML = perfume.notas
        .map(nota => `<span class="note-tag">${nota}</span>`)
        .join('');

    // Verificar si está en el carrito y obtener cantidad
    const cartQty = getCartQuantity(perfume.id);
    const buttonText = cartQty > 0 ? `+ (${cartQty} en carrito)` : 'Agregar al Pedido';
    const buttonClass = cartQty > 0 ? 'whatsapp-btn add-more-btn' : 'whatsapp-btn add-to-cart-btn';

    card.innerHTML = `
        <div class="product-header">
            <div class="product-id">Nº ${productId}</div>
            <div class="product-ranking">RANK #${perfume.ranking}</div>
        </div>
        <div class="product-body">
            <h3 class="product-name">${perfume.nombre}</h3>
            <p class="product-brand">Insp. ${perfume.marca}</p>
            <div class="product-info">
                <div class="product-label">Notas:</div>
                <div class="product-notes">${notesHTML}</div>
            </div>
            <div class="product-details">
                <div class="product-volume">Cont. Neto 60ml</div>
                <div class="product-price">$${perfume.precio.toLocaleString('es-AR')}</div>
            </div>
        </div>
        <button class="${buttonClass}" data-id="${perfume.id}">
            ${buttonText}
        </button>
    `;

    // Agregar event listener al botón (siempre agrega al carrito)
    const btn = card.querySelector('button');
    btn.addEventListener('click', () => addToCart(perfume));

    return card;
}

// Renderizar tabla de inventario con filtro de género
function renderInventoryTable(inventoryPerfumes) {
    inventoryTableBody.innerHTML = '';

    // Aplicar filtro de género de tabla
    let filteredInventory = inventoryPerfumes;
    if (tableGenderFilter === 'femenino') {
        filteredInventory = inventoryPerfumes.filter(p => p.genero === 'femenino');
    } else if (tableGenderFilter === 'masculino') {
        filteredInventory = inventoryPerfumes.filter(p => p.genero === 'masculino');
    }

    // Mostrar/ocultar columna de género según filtro
    if (tableGenderFilter === 'todos') {
        thGenero.style.display = '';
    } else {
        thGenero.style.display = 'none';
    }

    if (filteredInventory.length > 0) {
        inventorySection.style.display = 'block';
        filteredInventory.forEach(perfume => {
            const row = createTableRow(perfume);
            inventoryTableBody.appendChild(row);
        });
    } else {
        inventorySection.style.display = 'none';
    }
}

// Crear fila de tabla
function createTableRow(perfume) {
    const row = document.createElement('tr');

    // Formatear ID con padding de ceros
    const productId = String(perfume.id).padStart(3, '0');

    const notesHTML = perfume.notas
        .map(nota => `<span class="table-note-tag">${nota}</span>`)
        .join('');

    // Ícono según género
    const genderIcon = perfume.genero === 'femenino' ? '♀' : '♂';

    // Determinar si mostrar columna de género
    const generoColumn = tableGenderFilter === 'todos'
        ? `<td data-label="Género:"><span class="table-gender">${perfume.genero.toUpperCase()}</span></td>`
        : '';

    // Verificar si está en el carrito y obtener cantidad
    const cartQty = getCartQuantity(perfume.id);
    const buttonText = cartQty > 0 ? `+ (${cartQty})` : '+';
    const buttonClass = cartQty > 0 ? 'table-btn table-add-more' : 'table-btn table-add-to-cart';

    // Aplicar clase de género para background
    row.className = perfume.genero === 'masculino' ? 'row-masculino' : 'row-femenino';
    row.dataset.perfumeId = perfume.id;

    row.innerHTML = `
        <td data-label="ID:"><span class="table-id">Nº ${productId}</span></td>
        <td data-label="Nombre:" class="mobile-expandable">
            <span class="table-name"><span class="gender-icon">${genderIcon}</span> ${perfume.nombre}</span>
            <div class="mobile-details">
                <div class="mobile-detail-item">
                    <span class="mobile-detail-label">Marca:</span>
                    <span class="mobile-detail-value">${perfume.marca}</span>
                </div>
                <div class="mobile-detail-item">
                    <span class="mobile-detail-label">Notas:</span>
                    <div class="mobile-detail-notes">${notesHTML}</div>
                </div>
            </div>
        </td>
        <td data-label="Marca:"><span class="table-brand">${perfume.marca}</span></td>
        ${generoColumn}
        <td data-label="Notas:"><div class="table-notes">${notesHTML}</div></td>
        <td data-label="Precio:"><span class="table-price">$${perfume.precio.toLocaleString('es-AR')}</span></td>
        <td>
            <button class="${buttonClass}" data-id="${perfume.id}">
                ${buttonText}
            </button>
        </td>
    `;

    // Agregar event listener al botón (siempre agrega al carrito)
    const btn = row.querySelector('button');
    btn.addEventListener('click', () => addToCart(perfume));

    // Agregar event listener para expandir en mobile (solo en el área del nombre)
    const nameCell = row.querySelector('.mobile-expandable');
    nameCell.addEventListener('click', (e) => {
        // No expandir si se clickea el botón
        if (e.target.closest('button')) return;
        row.classList.toggle('expanded');
    });

    return row;
}

// Función de búsqueda
function performSearch() {
    searchTerm = searchInput.value.toLowerCase().trim();
    applyFilters();
}

// Aplicar filtros
function applyFilters() {
    filteredPerfumes = allPerfumes.filter(perfume => {
        // Filtro por género
        const matchesGender = currentFilter === 'todos' || perfume.genero === currentFilter;

        // Filtro por búsqueda
        const matchesSearch = !searchTerm ||
            perfume.nombre.toLowerCase().includes(searchTerm) ||
            perfume.marca.toLowerCase().includes(searchTerm) ||
            perfume.notas.some(nota => nota.toLowerCase().includes(searchTerm));

        return matchesGender && matchesSearch;
    });

    renderPerfumes();
}

// Event Listeners
searchInput.addEventListener('input', performSearch);

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Actualizar botones activos
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Actualizar filtro actual
        currentFilter = button.dataset.filter;
        applyFilters();
    });
});

// Event listeners para filtros de tabla
filterTableTodos.addEventListener('change', () => {
    if (filterTableTodos.checked) {
        filterTableFemenino.checked = false;
        filterTableMasculino.checked = false;
        tableGenderFilter = 'todos';
        renderPerfumes();
    }
});

filterTableFemenino.addEventListener('change', () => {
    if (filterTableFemenino.checked) {
        filterTableTodos.checked = false;
        filterTableMasculino.checked = false;
        tableGenderFilter = 'femenino';
        renderPerfumes();
    } else if (!filterTableMasculino.checked) {
        filterTableTodos.checked = true;
        tableGenderFilter = 'todos';
        renderPerfumes();
    }
});

filterTableMasculino.addEventListener('change', () => {
    if (filterTableMasculino.checked) {
        filterTableTodos.checked = false;
        filterTableFemenino.checked = false;
        tableGenderFilter = 'masculino';
        renderPerfumes();
    } else if (!filterTableFemenino.checked) {
        filterTableTodos.checked = true;
        tableGenderFilter = 'todos';
        renderPerfumes();
    }
});

// ===== FUNCIONES DEL CARRITO =====

// Verificar si un producto está en el carrito
function isInCart(perfumeId) {
    return cart.some(item => item.perfume.id === perfumeId);
}

// Obtener cantidad de un producto en el carrito
function getCartQuantity(perfumeId) {
    const item = cart.find(item => item.perfume.id === perfumeId);
    return item ? item.quantity : 0;
}

// Agregar producto al carrito
function addToCart(perfume) {
    const existingItem = cart.find(item => item.perfume.id === perfume.id);

    if (existingItem) {
        // Si ya existe, incrementar cantidad
        existingItem.quantity++;
    } else {
        // Si no existe, agregar nuevo item con cantidad 1
        cart.push({ perfume, quantity: 1 });
    }
    updateCart();
}

// Incrementar cantidad de un producto
function incrementQuantity(perfumeId) {
    const item = cart.find(item => item.perfume.id === perfumeId);
    if (item) {
        item.quantity++;
        updateCart();
    }
}

// Decrementar cantidad de un producto
function decrementQuantity(perfumeId) {
    const item = cart.find(item => item.perfume.id === perfumeId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
            updateCart();
        } else {
            // Si la cantidad es 1, quitar del carrito
            removeFromCartById(perfumeId);
        }
    }
}

// Quitar producto del carrito por índice
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Quitar producto del carrito por ID
function removeFromCartById(perfumeId) {
    const index = cart.findIndex(item => item.perfume.id === perfumeId);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCart();
    }
}

// Vaciar carrito
function clearCart() {
    if (confirm('¿Querés vaciar todo el pedido?')) {
        cart = [];
        updateCart();
    }
}

// Actualizar vista del carrito
function updateCart() {
    // Calcular total de items (sumando cantidades)
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Actualizar contador
    cartCount.textContent = totalItems;
    if (totalItems === 0) {
        cartCount.classList.add('hidden');
    } else {
        cartCount.classList.remove('hidden');
    }

    // Mostrar/ocultar empty state y footer
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartFooter.style.display = 'none';
        cartItems.innerHTML = '';
    } else {
        cartEmpty.style.display = 'none';
        cartFooter.style.display = 'block';
        renderCartItems();
        updateCartTotal();
    }

    // Re-renderizar productos para actualizar estado de botones
    renderPerfumes();
}

// Renderizar items del carrito
function renderCartItems() {
    cartItems.innerHTML = '';

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        const subtotal = item.perfume.precio * item.quantity;

        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.perfume.nombre}</div>
                <div class="cart-item-brand">${item.perfume.marca}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-action="decrement" data-id="${item.perfume.id}">−</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" data-action="increment" data-id="${item.perfume.id}">+</button>
                </div>
                <div class="cart-item-price">$${subtotal.toLocaleString('es-AR')}</div>
            </div>
            <button class="cart-item-remove" data-index="${index}">
                ×
            </button>
        `;

        // Event listeners para controles de cantidad
        const decrementBtn = cartItem.querySelector('[data-action="decrement"]');
        const incrementBtn = cartItem.querySelector('[data-action="increment"]');
        const removeBtn = cartItem.querySelector('.cart-item-remove');

        decrementBtn.addEventListener('click', () => decrementQuantity(item.perfume.id));
        incrementBtn.addEventListener('click', () => incrementQuantity(item.perfume.id));
        removeBtn.addEventListener('click', () => removeFromCart(index));

        cartItems.appendChild(cartItem);
    });
}

// Calcular y mostrar total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.perfume.precio * item.quantity), 0);
    cartTotalPrice.textContent = `$${total.toLocaleString('es-AR')}`;
}

// Checkout - Enviar por WhatsApp
function checkout() {
    if (cart.length === 0) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Construir mensaje
    let message = '*Mi Pedido - Esencias Premium*\n\n';
    message += `Total de unidades: ${totalItems}\n\n`;

    cart.forEach((item, index) => {
        const subtotal = item.perfume.precio * item.quantity;
        message += `${index + 1}. *${item.perfume.nombre}*\n`;
        message += `   ${item.perfume.marca}\n`;
        message += `   Cantidad: ${item.quantity} x $${item.perfume.precio.toLocaleString('es-AR')}\n`;
        message += `   Subtotal: $${subtotal.toLocaleString('es-AR')}\n\n`;
    });

    const total = cart.reduce((sum, item) => sum + (item.perfume.precio * item.quantity), 0);
    message += `*TOTAL: $${total.toLocaleString('es-AR')}*`;

    // Abrir WhatsApp
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
}

// Event listeners del carrito
cartToggle.addEventListener('click', () => {
    cartPanel.classList.toggle('open');
});

cartClose.addEventListener('click', () => {
    cartPanel.classList.remove('open');
});

cartCheckout.addEventListener('click', checkout);

cartClear.addEventListener('click', clearCart);

// Inicializar
loadPerfumes();
