// Sonido y aviso del sistema para notas nuevas del equipo (ver Notes.tsx).
// No se embebe ningun archivo de audio (nada de mp3/wav sueltos que pesen o
// que tengan licencia ajena): el sonido se sintetiza en el momento con la
// Web Audio API, dos notas cortas en armonia (parecido al "pop" suave de
// Slack o al tono de notificación de iPhone) que suenan igual sin depender
// de descargar nada ni de que el navegador tenga codecs de audio.
let audioCtx: AudioContext | null = null;

function ctx(): AudioContext | null {
  try {
    if (!audioCtx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      audioCtx = new Ctor();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    return audioCtx;
  } catch {
    return null;
  }
}

function tone(ac: AudioContext, freq: number, start: number, dur: number, gain: number, type: OscillatorType = 'sine') {
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + start);
  g.gain.setValueAtTime(0, ac.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, ac.currentTime + start + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur + 0.02);
}

// Campanita de dos notas ascendentes (do -> sol agudo, tipo "ding-ding"
// suave) con un dejo de armonico arriba para que no suene seco ni a beep de
// microondas.
export function playNoteChime(): void {
  const ac = ctx();
  if (!ac) return;
  tone(ac, 783.99, 0, 0.34, 0.09, 'sine');
  tone(ac, 1567.98, 0, 0.34, 0.025, 'sine');
  tone(ac, 1046.5, 0.09, 0.42, 0.1, 'sine');
  tone(ac, 2093, 0.09, 0.42, 0.028, 'sine');
}

export function notifyPermission(): NotificationPermission | 'unsupported' {
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.permission;
}

export async function requestNotifyPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof Notification === 'undefined') return 'unsupported';
  if (Notification.permission !== 'default') return Notification.permission;
  try { return await Notification.requestPermission(); } catch { return Notification.permission; }
}

// Aviso del sistema operativo (el que aparece en el centro de notificaciones
// del telefono, "como las apps normales"). Solo si ya se dio permiso y la
// pestaña no esta a la vista (si esta abierta y visible, el toast + el sonido
// de adentro de la app ya avisan; un aviso del sistema encima seria
// redundante).
//
// Se muestra con el SERVICE WORKER (registration.showNotification) y no con
// new Notification() directo porque en varias plataformas (Firefox en
// Android, algunos PWA embebidos e iOS) instanciar Notification desde la
// pagina falla o se corta, mientras que mostrarla desde el service worker
// llega siempre al centro de notificaciones del sistema. El service worker
// ya esta registrado por la app (sw.js) y su manejador notificationclick
// enfoca la app al tocar el aviso.
export function showSystemNotification(title: string, body: string, tag = 'mi-tiendita-aviso'): void {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  if (document.visibilityState === 'visible') return;
  const opts: NotificationOptions & { vibrate?: number[] } = {
    body,
    icon: './icon-192.png',
    badge: './icon-192.png',
    tag,
    data: { link: location.href },
    vibrate: [140, 90, 140],
  };
  const showDirect = (): void => {
    try {
      const n = new Notification(title, opts);
      n.onclick = () => { window.focus(); n.close(); };
    } catch {
      // Algunos navegadores no dejan instanciar Notification directo aunque
      // el permiso este concedido; se ignora en silencio.
    }
  };
  try {
    // Primero el service worker (llega al centro de notificaciones del
    // sistema aunque la app este en otra pestaña); si no esta listo o falla,
    // cae al Notification directo.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((reg) => reg.showNotification(title, opts))
        .catch(showDirect);
    } else {
      showDirect();
    }
  } catch {
    showDirect();
  }
}
