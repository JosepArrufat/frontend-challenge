# Project Overview

## Resumen del proyecto

Una aplicación de pronóstico del tiempo. Permite buscar ciudades, ver condiciones actuales, pronóstico por horas y a 16 días, guardar favoritos, ver alertas meteorológicas y un mapa mundial. Incluye autenticación simple por nombre, geolocalización, preferencias de unidad (°C/°F) y tema claro/oscuro.

---

## Arquitectura del proyecto

Estructura por capas: `components/` (UI reutilizable), `routes/` (páginas), `hooks/` (lógica con TanStack Query y contexto), `context/` (estado global con React Context + reducers), `lib/` (utilidades y APIs), `styles/` (tema), `types/` (tipos).

Separa responsabilidades: la lógica vive en hooks, el estado en contextos, y los componentes solo renderizan. Facilita testing y reutilización.

---

## Decisiones técnicas

**Estado global:** React Context con `useReducer` para favoritos, usuario, ciudad actual, unidad y tema. Simple y suficiente para esta escala.

**Data fetching:** TanStack React Query para caché, refetch, debounce y estados de carga/error.

**Styling:** styled-components con tema centralizado en tokens oklch (paleta, radios, sombras).

**Routing:** React Router v7 con rutas para Home, Map, Favorites, Alerts, Settings.

**Buscador:** downshift `useCombobox` para accesibilidad (teclado, ARIA) en el autocompletado de ciudades.

**Iconos:** lucide-react.

---

## Uso de IA

**¿Qué herramientas usaste?**

Open code como planner/setup durante el desarrollo y copilot como "coworker" y aplicacion de algunas funciones concretas.

**¿Cómo te ayudaron?**

Refactorización (migración a useCombobox), depuración de bugs (duplicados en favoritos, keyframes de styled-components), revisión de accesibilidad, planning.

**¿Hubo sugerencias que descartaste?**

Sí. La IA sugirió añadir un botón de geolocalización dentro del buscador, pero se eliminó luego para simplificar la UI y mantener solo el buscador de texto.

---

## Retos

**¿Cuál fue la parte más difícil?**

El buscador con `useCombobox`: integrar debounce, react-query, navegación por teclado y limpieza del estado tras seleccionar una ciudad, asi como encajar el estilo con styled components (ayuda de setup con asistentes de codigo pero mucho retoque manual).

**¿Cómo lo resolviste?**

Controlando `inputValue` manualmente, usando `stateReducer` para personalizar el comportamiento de Enter/Blur, y llamando `reset()` tras cada selección para evitar que el estado interno de downshift bloqueara el teclado.

---

## Trade-offs

**¿Qué simplificaste o pospusiste?**

No implementé persistencia offline ni testing exhaustivo de integración. Los tests cubren utilidades clave pero no flujos completos de UI.

**¿Por qué?**

Prioricé funcionalidad core y accesibilidad sobre cobertura de tests dentro del tiempo del sprint.

---

## Mejoras

**¿Qué mejorarías con otro sprint?**

- Tests de integración con Testing Library para flujos completos.
- Animaciones de transición entre ciudades.
- Soporte para múltiples idiomas.
- Virtualización del pronóstico de 16 días.

---

## Autoevaluación

**¿De qué parte estás más orgulloso?**

Del buscado con downshift y la accesibilidad (navegación por teclado, ARIA, foco visible).

**¿Qué parte refactorizarías?**

El componente `Home` — tiene demasiada lógica de estado (ciudad seleccionada, geolocalización, efectos). Lo extraería a un hook `useHomeCity`. Tendría más cuidado con los patrones de diseño de componentes y la composición.

**¿Si empezarías de nuevo, qué harías diferente?**

Definiría los tipos de datos de la API con Zod desde el inicio para validación en runtime, y separaría la lógica de UI de la de datos desde el primer día.

---
