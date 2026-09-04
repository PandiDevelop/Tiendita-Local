# Mi Tiendita

Aplicación web local para gestionar una o varias tiendas, sin mezclar sus datos.

## Cómo usarla

Abre `index.html` en cualquier navegador moderno. No requiere instalación ni conexión: los datos se guardan en el almacenamiento local del navegador de ese dispositivo.

## Incluye

- Tiendas independientes con nombre e imagen personalizable; incluye una ilustración de tienda predeterminada.
- Catálogo por tienda: productos, precios y varias promociones por producto, cada una con su propio precio y contador de ventas.
- Registro de ventas por día mediante contadores de cantidad.
- Cierre diario e historial editable.
- Exportación de días cerrados a CSV, listo para abrir en Excel.
- Total producido general y desglose acumulado por producto y promoción.

## Decisiones tomadas

- Se priorizó una arquitectura local y persistente, por lo que no se necesita backend ni cuenta.
- Cada venta se vincula a una tienda específica y cada día tiene su propio registro.
- La exportación usa CSV con UTF-8 y separador de punto y coma para que Excel en configuraciones regionales en español lo abra correctamente.
- Los importes se muestran en pesos colombianos como valor inicial razonable; se pueden adaptar fácilmente en `app.js` si se desea otra moneda.
- Al abrir un registro ya cerrado para editarlo, los productos y promociones añadidos después se incorporan con cantidad inicial de cero. Esto permite completar ventas que se olvidaron sin crear otro día.

> Importante: al depender del almacenamiento local, borrar los datos del navegador también elimina los registros. Para conservar una copia, exporta los cierres periódicamente.

## Uso en celular

La app ya incluye configuración PWA, por lo que puede instalarse como una aplicación desde Chrome en Android una vez que se publique en un alojamiento web seguro (HTTPS): abre la dirección y elige **Instalar aplicación**. Funciona a pantalla completa y conserva los datos en el teléfono.

Un APK requiere compilar un contenedor Android con Android Studio/Java y las herramientas de Android, que no están disponibles en este espacio de trabajo. La versión PWA es la alternativa lista para móvil y no necesita instalar desde un APK.
