// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { DevThemesModal } from '../views/DevThemes';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('DevThemes: animación y cierre', () => {
  it('al desbloquear muestra el tótem antes del menú y sin los botones Clásico/Cerrar', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<DevThemesModal onClose={onClose} />);

    // Aún pide la contraseña.
    const input = document.querySelector('input[type="password"]') as HTMLInputElement;
    expect(input).toBeTruthy();
    fireEvent.change(input, { target: { value: '028007' } });
    fireEvent.click(screen.getByText('Desbloquear'));

    // Etapa del tótem: los logos aparecen uno a uno, todavía sin menú.
    expect(document.querySelector('.dev-stage.icons')).toBeTruthy();
    expect(document.querySelector('.dev-stage.menu')).toBeNull();
    expect(screen.queryByText('Owen-chan')).toBeNull();

    // Pasan los 2,6 s de la secuencia: aparece el menú con los temas.
    act(() => { vi.advanceTimersByTime(2700); });
    expect(document.querySelector('.dev-stage.menu')).toBeTruthy();
    expect(screen.getByText('Owen-chan')).toBeTruthy();

    // Ya no hay botones de texto "Clásico" ni "Cerrar"; la X flotante sí cierra.
    expect(screen.queryByText('Clásico')).toBeNull();
    expect(screen.queryByText('Cerrar')).toBeNull();
    const x = document.querySelector('.modal-float-actions .float-cancel');
    expect(x).toBeTruthy();
    fireEvent.click(x as HTMLElement);
    expect(onClose).toHaveBeenCalled();
  });
});
