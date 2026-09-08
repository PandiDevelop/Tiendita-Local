// Matchers de jest-dom (toBeVisible, toHaveTextContent, etc.) para los tests
// de componentes que corren en entorno jsdom (ver "@vitest-environment jsdom"
// al inicio de esos archivos). No afecta a los tests de sync.ts, que corren
// en entorno 'node' y no usan estos matchers.
import '@testing-library/jest-dom/vitest';
