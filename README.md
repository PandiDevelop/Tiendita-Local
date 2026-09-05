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

## Sincronización entre trabajadores (en tiempo real)

La app puede compartir una tienda entre varios dispositivos usando **Cloud Firestore** de Firebase. Cada tienda se vincula con un **código (PIN)**: quien lo tenga verá y editará la misma tienda en tiempo real. El dispositivo guarda además una copia local para funcionar sin conexión y sincroniza cuando vuelve a conectarse.

### Configurar Firebase (una sola vez, 5 minutos)

1. Crea un proyecto gratis en <https://console.firebase.google.com>.
2. En el proyecto activa **Cloud Firestore** → *Crear base de datos* (modo prueba está bien para empezar).
3. Ve a **Configuración del proyecto → Tus apps → Web (`</>`)** y registra una app. Copia el objeto `firebaseConfig`.
4. En el archivo `firebase-config.js` de este proyecto sustituye `null` por ese objeto.
5. Aplica las **reglas** de Firestore (ver más abajo) en *Base de datos → Reglas*.
6. Guarda el cambio y publícalo (git commit + push). La sincronización queda activa en la web y en el APK.

### Reglas de Firestore

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /stores/{storeKey} {
      allow read, write: if true;
    }
  }
}
```

> ⚠️ Estas reglas son abiertas a propósito (el PIN actúa como llave). Cualquiera que consiga el código puede leer/escribir esa tienda, así que usa códigos privados entre tu equipo. Para un control real por usuario se puede añadir autenticación más adelante.

### Cómo se usa

- Al crear o editar una tienda aparece un campo **"Código compartido"**. Escribe un código (ej. `aurora2026`) y listo: esa tienda queda sincronizada.
- Un compañero desde su teléfono elige **Unirme a una tienda**, escribe su **nombre** y pega el mismo código.
- **Roles automáticos**: la primera persona que activa la sincronización es el **creador** de la tienda; los que se unen con el código son **trabajadores**. Solo el creador puede editar el **nombre e imagen** de la tienda, **quitar trabajadores** y **borrarla**; los trabajadores registran productos, ventas y manejan inventario. Cuando un trabajador abre "Editar tienda", los campos de nombre e imagen aparecen deshabilitados con un aviso.
- El creador puede ver en **Editar tienda** la lista de **trabajadores vinculados** y quitar a cualquiera con el botón ×. Quien sea quitado dejará de recibir cambios: su tienda se elimina del dispositivo y muestra "Fuiste eliminado de esta tienda".
- **Registro de empleados**: en la pestaña **Empleados** (solo visible para el creador) se muestra un resumen por trabajador de **unidades vendidas**, **producido** y **días** en que registró. Se atribuye a quien tocó el **+** en Ventas del día (el **−** descuenta de la propia cuenta del que lo toca; la atribución nunca baja de cero). Cada empleado tiene un desplegable (**▾**) que muestra **qué vendió, separado por fechas**.
- Los **contadores de ventas** se fusionan con un criterio seguro (se conserva la mayor cantidad de cada fila), así que dos trabajadores pueden registrar ventas al mismo tiempo sin pisarse. La atribución de cada trabajador (quién tocó el +) también se une entre dispositivos.
- El **catálogo** usa "último guardado gana": si dos editan el mismo producto a la vez, gana el que guardó después.
- El **creador** puede **desvincular** la tienda en Editar tienda (la × junto al código): queda solo en su dispositivo y puede seguir editándola; los compañeros conservan sus datos en la nube. Un **trabajador no puede** apagar la sincronización (la × no aparece): su opción es "**Desvincularse de esta tienda**", que lo quita de la lista de miembros y elimina la tienda de su dispositivo.
- En el modal de edición también puedes **Borrar la tienda**. Si estaba compartida, se borra de tu dispositivo y se avisa a todos los que tienen el código: los que estén en línea lo aplican al instante y los que estén desconectados, apenas vuelvan a conectarse. Advertencia: el código queda marcado como eliminado (no se puede reutilizar tal cual; para reusarlo, borra el documento correspondiente en la consola de Firebase).
- Cada día de ventas guarda **quién lo registró**: en la pestaña **Ventas del día** aparece "Registrando: [nombre]" y en **Historial** se ve una etiqueta con el nombre junto a la fecha. El nombre viaja con la tienda compartida, así el dueño ve quién registró aunque sea otro trabajador el que anota.

> Límites prácticos: cada tienda vive en un documento de Firestore, adecuado para catálogos y ventas de una tienda pequeña. Si necesitas muchos miles de registros, el modelo se puede migrar a subcolecciones.
> Nota: la expulsión de un trabajador es una medida práctica; si alguien conoce el código, puede volver a vincularse. Para un control estricto por usuario haría falta autenticación (futuro).

### Inventario (opcional)

Pestaña **Inventario**: refleja automáticamente los productos del catálogo. Puedes **subir existencias** con los botones +1 / +10 (o tocar el producto y guardar). Las **ventas descuentan solas** porque el disponible se calcula como *comprado − vendido*:

- Si registras una venta (+1) y luego le restas (−1), el número vuelve al anterior.
- Si no hay existencias registradas, sigue siendo posible vender: se muestra "—" y nada bloquea el registro.
- El disponible **nunca es negativo**: si vendes más que las existencias, simplemente se queda en **0** (vender siempre está permitido).

## Generar un APK

No se necesita Android Studio ni Java. El sitio ya incluye manifest con íconos PNG y service worker, que es todo lo que necesitan los generadores de APK por web:

1. Publica la carpeta en GitHub Pages (o cualquier hosting HTTPS). La dirección debe quedar pública y con HTTPS.
2. Entra a **[PWABuilder](https://www.pwabuilder.com)**, pega la URL del sitio y pulsa **Start**.
3. Pulsa **Package for stores/android**, revisa las opciones y pulsa **Download package**. Se descargará un ZIP con el APK (y la opción de AAB para Google Play).
4. Instala el APK directamente en el teléfono (permite "instalar desde orígenes desconocidos") o súbelo a la Play Store.

> El APK generado es un contenedor de la PWA: abre el mismo sitio en pantalla completa. Para que funcione sin conexión y siempre actualizado, publica siempre la última versión en la URL de GitHub Pages antes de generar el APK.
