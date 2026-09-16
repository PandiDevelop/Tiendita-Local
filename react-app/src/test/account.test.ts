// @vitest-environment jsdom
import { describe, expect, it, beforeEach } from 'vitest';
import { CLIENT_KEY, resetClientId, samePerson, syncClientId } from '../lib/core';
import { accountEmail, accountId, legacyAccountIds, rememberLegacyId, sessionActive, setAccountEmail, setAccountId, setSessionActive } from '../lib/accountStore';
import { buildRekeyedStore } from '../lib/identity';
import { makeStore } from './testUtils';

// Pruebas de identidad "cuenta vs dispositivo" y del re-vinculado de tiendas.
// No se importa lib/account (usa Firebase Auth con imports dinámicos), solo
// los módulos puros que no necesitan red.

describe('cuenta: identidad', () => {
  beforeEach(() => {
    localStorage.clear();
    resetClientId();
  });

  it('sin cuenta la identidad es el id propio del dispositivo', () => {
    localStorage.setItem(CLIENT_KEY, 'dev-1');
    expect(syncClientId()).toBe('dev-1');
    expect(accountId()).toBeNull();
  });

  it('con cuenta la identidad pasa a ser el uid y persiste en localStorage', () => {
    localStorage.setItem(CLIENT_KEY, 'dev-1');
    expect(syncClientId()).toBe('dev-1');
    setAccountEmail('ana@correo.com');
    setAccountId('uid-9');
    expect(syncClientId()).toBe('uid-9');
    expect(accountId()).toBe('uid-9');
    expect(accountEmail()).toBe('ana@correo.com');
    // al "recargar" (módulos ya cargados) la identidad sigue siendo la cuenta
    resetClientId();
    expect(syncClientId()).toBe('uid-9');
  });
});

describe('cuenta: samePerson y legacy', () => {
  beforeEach(() => {
    localStorage.clear();
    resetClientId();
  });

  it('reconoce la cuenta, el dispositivo y los ids legacy, pero no a otros', () => {
    localStorage.setItem(CLIENT_KEY, 'dev-1');
    setAccountId('uid-9');
    resetClientId();
    rememberLegacyId('dev-1');
    expect(samePerson('uid-9')).toBe(true);
    expect(samePerson('dev-1')).toBe(true);
    expect(samePerson('otro')).toBe(false);
    expect(samePerson(null)).toBe(false);
    expect(samePerson(undefined)).toBe(false);
  });

  it('rememberLegacyId no duplica el id legacy', () => {
    rememberLegacyId('dev-1');
    rememberLegacyId('dev-1');
    expect(legacyAccountIds()).toEqual(['dev-1']);
  });

  it('la sesión activa requiere identidad de cuenta Y flag de sesión', () => {
    setAccountId('uid-9');
    expect(sessionActive()).toBe(false);
    setSessionActive(true);
    expect(sessionActive()).toBe(true);
    setSessionActive(false);
    expect(sessionActive()).toBe(false);
    // sin identidad de cuenta, el flag solo no cuenta
    setAccountId(null);
    setSessionActive(true);
    expect(sessionActive()).toBe(false);
  });
});

describe('cuenta: re-vinculado de tiendas (buildRekeyedStore)', () => {
  it('el dueño con id de dispositivo pasa a la cuenta conservando su membresía y rol', () => {
    const s = makeStore({
      createdBy: 'dev-1',
      members: {
        'dev-1': { name: 'Ana', role: 'owner', joinedAt: 10, eid: 'e1' },
        'w-2': { name: 'Luis', role: 'worker', joinedAt: 11, eid: 'e2' },
      },
    });
    const r = buildRekeyedStore(s, 'dev-1', 'uid-9');
    expect(r).not.toBeNull();
    const m = r!.members!;
    expect(r!.createdBy).toBe('uid-9');
    expect(m['uid-9']).toMatchObject({ name: 'Ana', role: 'owner', joinedAt: 10, eid: 'e1' });
    expect(m['dev-1']).toBeUndefined();
    expect(m['w-2']).toBeDefined();
    expect(r!.localRole).toBe('owner');
    // no muta la tienda original
    expect(s.createdBy).toBe('dev-1');
    expect(s.members!['dev-1']).toBeDefined();
  });

  it('un admin (no dueño) re-vincula su membresía siguiendo la clave de "from"', () => {
    const s = makeStore({
      createdBy: 'other',
      members: { 'dev-1': { name: 'Luis', role: 'admin', joinedAt: 11, eid: 'e9' } },
      localRole: 'admin',
    });
    const r = buildRekeyedStore(s, 'dev-1', 'uid-9');
    expect(r).not.toBeNull();
    const m = r!.members!;
    expect(r!.createdBy).toBe('other');
    expect(m['uid-9']).toMatchObject({ name: 'Luis', role: 'admin', eid: 'e9' });
    expect(m['dev-1']).toBeUndefined();
    expect(r!.localRole).toBe('admin');
  });

  it('si el id no aparece en la tienda devuelve null (no cambia nada)', () => {
    const s = makeStore({ createdBy: 'other', members: {} });
    expect(buildRekeyedStore(s, 'ghost', 'uid-9')).toBeNull();
  });

  it('from === to no re-vincula', () => {
    const s = makeStore({ createdBy: 'uid-9', members: {} });
    expect(buildRekeyedStore(s, 'uid-9', 'uid-9')).toBeNull();
  });

  it('un dueño ausente de members se vuelve miembro con rol owner al re-vincular', () => {
    const s = makeStore({ createdBy: 'dev-1', members: {} });
    const r = buildRekeyedStore(s, 'dev-1', 'uid-9');
    expect(r).not.toBeNull();
    const m = r!.members!;
    expect(r!.createdBy).toBe('uid-9');
    expect(m['uid-9']).toMatchObject({ role: 'owner' });
    expect(r!.localRole).toBe('owner');
  });
});