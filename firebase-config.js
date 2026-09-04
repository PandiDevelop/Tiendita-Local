// ===== Configuración de Firebase (sincronización en tiempo real) =====
// Para activar la sincronización entre trabajadores:
//
// 1) Ve a https://console.firebase.google.com y crea un PROYECTO (o usa uno existente).
// 2) En el proyecto: Activa "Cloud Firestore" (Base de datos -> Crear base de datos ->
//    modo de prueba). Copia las REGLAS que están en el README de este proyecto.
// 3) Configuración del proyecto -> "Tus apps" -> app Web (icono </>) -> registra la app.
// 4) Copia el objeto "firebaseConfig" y pégalo aquí sustituyendo el null.
//
//    Ejemplo:
//
//    window.FIREBASE_CONFIG = {
//      apiKey: "AIzaSyA...",
//      authDomain: "mi-tiendita-12345.firebaseapp.com",
//      projectId: "mi-tiendita-12345",
//      storageBucket: "mi-tiendita-12345.appspot.com",
//      messagingSenderId: "1234567890",
//      appId: "1:1234567890:web:abcdef123"
//    };
//
// 5) Guarda y vuelve a publicar la web (git push). La sincronización quedará activa
//    en la web y en el APK al actualizar.
window.FIREBASE_CONFIG = null;