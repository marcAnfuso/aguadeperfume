# Esencias Premium - Catálogo Web

Catálogo web minimalista para venta de perfumes premium en Llavallol, GBA Sur.

## 🚀 Configuración Rápida

### 1. Configurar número de WhatsApp

Abrí el archivo `app.js` y modificá la línea 7:

```javascript
const WHATSAPP_NUMBER = '5491112345678'; // CAMBIAR por el número de WhatsApp
```

**Formato del número:** Código de país + código de área + número (sin espacios, guiones ni 15)

**Ejemplo:**
- Si el número es: (011) 15-1234-5678
- Poné: `5491112345678`

### 2. Probar localmente

Abrí el archivo `index.html` directamente en tu navegador (doble click).

### 3. Publicar GRATIS en internet

#### Opción A: GitHub Pages (Recomendado)

1. Creá una cuenta gratis en [github.com](https://github.com)
2. Creá un repositorio nuevo (ejemplo: "perfumes-llavallol")
3. Subí estos archivos:
   - index.html
   - styles.css
   - app.js
   - perfumes.json
4. Andá a Settings → Pages → Source: main branch
5. Tu web estará en: `https://tuusuario.github.io/perfumes-llavallol`

#### Opción B: Netlify

1. Creá cuenta gratis en [netlify.com](https://netlify.com)
2. Arrastrá la carpeta completa
3. Listo, te da una URL automática

## 📝 Cómo actualizar el catálogo

Para agregar, quitar o modificar perfumes, editá el archivo `perfumes.json`:

```json
{
  "id": 139,
  "nombre": "Nombre del Perfume",
  "marca": "Nombre de la Marca",
  "genero": "masculino",  // o "femenino"
  "ranking": 39,
  "notas": ["floral", "frutal", "madera"],
  "precio": 16900
}
```

**Notas disponibles:** floral, frutal, aromático, especiado, madera, cítrico, acqua, vainilla, caramelo, verde

## 🎨 Personalización

### Cambiar precio

Editá `perfumes.json` y modificá el campo `precio` de cada producto.

### Cambiar colores

Editá `styles.css` en las líneas 9-15 (variables CSS):

```css
--color-primary: #000000;    /* Color principal (negro) */
--color-secondary: #ffffff;  /* Color de fondo (blanco) */
```

### Cambiar textos

- Título y slogan: `index.html` líneas 13-14
- Info strip: `index.html` líneas 38-53

## 📱 Compartir la web

Una vez publicada, compartí el link:
- Por WhatsApp
- En estado de WhatsApp
- Por Facebook/Instagram
- Imprimilo en tarjetas con QR code

## 💡 Tips de uso

- **Búsqueda inteligente:** busca por nombre de perfume, marca o notas
- **Filtros:** separar por género facilita la búsqueda
- **Carrito de pedido:** Agregá varios perfumes antes de enviar el pedido por WhatsApp
- **WhatsApp automático:** envía todo el pedido junto con el total calculado
- **Mobile-first:** se ve perfecto en celular (la mayoría de tus clientes)
- **Instagram:** Seguinos en @aguadeperfume
- **Dos vistas:** Top 6 en tarjetas grandes + resto en tabla compacta para menos scroll

## 📊 Estructura de la web

La web muestra los perfumes en dos secciones:

1. **MÁS VENDIDOS** - Top 3 femeninos + Top 3 masculinos en formato tarjeta grande
   - Separados por sección: "FEMENINO:" y "MASCULINO:"
   - Ideal para destacar los más populares de cada categoría

2. **INVENTARIO COMPLETO** - El resto en tabla compacta
   - Filtros por género: Todos / Femenino / Masculino
   - Columna de género (solo visible cuando se muestran "Todos")
   - Fácil de escanear, menos scroll

## 🛒 Carrito de Pedido (Sin Pago)

La web incluye un carrito de compras sin procesamiento de pago. El flujo es:

1. **Agregar productos:** Click en "Agregar al Pedido" en cualquier perfume
2. **Ver el carrito:** Se abre automáticamente o clickeá el ícono flotante (muestra cantidad)
3. **Revisar:** Podés quitar productos individuales o vaciar todo el pedido
4. **Hacer pedido:** Click en "Hacer Pedido por WhatsApp"
   - Se genera un mensaje formateado con:
     - Lista completa de perfumes
     - Marca de cada uno
     - Precio individual
     - Total calculado automáticamente

### Ejemplo del mensaje que se genera:

```
*Mi Pedido - Esencias Premium*

Total de productos: 3

1. *INVICTUS*
   Paco Rabanne
   $16.900

2. *LA VIE EST BELLE*
   Lancôme
   $16.900

3. *SAUVAGE*
   Dior
   $16.900

*TOTAL: $50.700*
```

## 🛠 Archivos del proyecto

```
agua-de-perfume/
├── index.html      # Estructura de la página
├── styles.css      # Diseño y estilos
├── app.js          # Funcionalidad (búsqueda, filtros)
├── perfumes.json   # Base de datos de productos
└── README.md       # Este archivo
```

## 🤝 Soporte

Si tenés problemas o querés agregar funcionalidades, consultame.

---

**"Pagás la esencia, no el marketing"**
