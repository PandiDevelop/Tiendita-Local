// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { AuthLanding } from '../views/AuthLanding';
import { TestProvider, makeState, makeStore } from './testUtils';

// Primer pantallazo con cuenta: opciones -> subflujo con desvanecimiento.
// No toca Firebase: solo navega entre pasos.

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});

function renderLanding() {
  return render(
    <TestProvider initialState={makeState(makeStore())}>
      <AuthLanding onCreate={() => {}} onJoin={() => {}} />
    </TestProvider>,
  );
}

describe('Bienvenida: la cuenta va primero', () => {
  it('arranca con Inicia sesión, Crear cuenta y Continuar sin registrarme', () => {
    renderLanding();
    expect(screen.getByRole('button', { name: 'Inicia sesión' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continuar sin registrarme' })).toBeInTheDocument();
  });

  it('Continuar sin registrarme muestra crear tienda y unirme', async () => {
    renderLanding();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar sin registrarme' }));
    expect(await screen.findByRole('button', { name: 'Crear mi primera tienda' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Unirme a una tienda' })).toBeInTheDocument();
  });

  it('Inicia sesión muestra correo, contraseña, Conectarse, Cancelar y olvidé mi contraseña', async () => {
    renderLanding();
    fireEvent.click(screen.getByRole('button', { name: 'Inicia sesión' }));
    expect(await screen.findByLabelText('Correo')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Conectarse' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '¿Olvidaste tu contraseña?' })).toBeInTheDocument();

    // Cancelar regresa a las opciones iniciales.
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(await screen.findByRole('button', { name: 'Inicia sesión' })).toBeInTheDocument();
  });

  it('Crear cuenta pide usuario, correo y contraseña con sus condiciones', async () => {
    renderLanding();
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(await screen.findByLabelText('Nombre de usuario')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByText(/al menos 6 caracteres/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  it('el atrás vuelve a las opciones en vez de cerrar la app', async () => {
    renderLanding();
    fireEvent.click(screen.getByRole('button', { name: 'Inicia sesión' }));
    await screen.findByRole('button', { name: 'Conectarse' });
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(await screen.findByRole('button', { name: 'Inicia sesión' })).toBeInTheDocument();
  });

  it('en las opciones iniciales, el atrás no cierra la app', () => {
    renderLanding();
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(screen.getByRole('button', { name: 'Inicia sesión' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continuar sin registrarme' })).toBeInTheDocument();
  });
});
