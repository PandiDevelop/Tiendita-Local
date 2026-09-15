import type { Member, Store } from '../types';

// Re-vincula una tienda local: mueve la membresía y, si era el caso, el rol
// de dueño (createdBy) del id "from" al id "to" (por ejemplo, del id del
// dispositivo al uid de la cuenta al iniciar sesión). Devuelve una copia
// nueva (no muta la original) o null si "from" no aparece en la tienda.
export function buildRekeyedStore(store: Store, from: string, to: string): Store | null {
  if (!from || !to || from === to) return null;
  const s = JSON.parse(JSON.stringify(store)) as Store;
  const members: Record<string, Member> = s.members || {};
  const entry = members[from];
  if (!entry && s.createdBy !== from) return null;
  if (entry) {
    delete members[from];
    const moved: Member = { ...entry };
    if (s.createdBy === from) moved.role = 'owner';
    members[to] = moved;
  }
  if (s.createdBy === from) s.createdBy = to;
  if (!members[to]) {
    members[to] = {
      name: 'Trabajador',
      role: s.createdBy === to ? 'owner' : 'worker',
      joinedAt: Date.now(),
      eid: entry ? entry.eid : undefined,
    };
  }
  s.members = members;
  s.localRole = s.createdBy === to ? 'owner' : (members[to].role || s.localRole);
  return s;
}