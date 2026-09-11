## 1. Proxy.ts — Protección de rutas por rol

- [x] 1.1 Modificar `proxy.ts` para obtener el rol del usuario desde la tabla `users` y almacenarlo en una variable
- [x] 1.2 Agregar lógica de redirects: staff/admin en `/family/*` → `/staff`, parent en `/staff/*` → `/family`
- [x] 1.3 Modificar redirect post-login para redirigir a `/staff` o `/family` según rol (en vez de `/`)
- [x] 1.4 Verificar que `npm run build` compila sin errores

## 2. Página raíz — Redirect según rol

- [x] 2.1 Modificar `app/page.tsx` para que sea un server component que redirija a `/staff` o `/family` según el rol del usuario
- [x] 2.2 Verificar que usuarios no autenticados son redirigidos a `/login`

## 3. Login — Redirect post-login

- [x] 3.1 Modificar `app/login/page.tsx` para obtener el rol del usuario después del login
- [x] 3.2 Cambiar `router.replace("/")` por `router.replace("/staff")` o `router.replace("/family")` según el rol

## 4. Sidebar — Renderizado condicional por rol

- [x] 4.1 Agregar prop `role` al componente `Sidebar` en `components/layout/Sidebar.tsx`
- [x] 4.2 Modificar `navItems` para que sea condicional según el rol (staff: Feed, Niños, Avisos, Mi cuenta / parent: Feed, Mis hijos, Notificaciones, Mi cuenta)
- [x] 4.3 Hacer que el botón "Nueva publicación" solo se muestre para admin/staff
- [x] 4.4 Actualizar los hrefs de los nav items para apuntar a `/staff/*` o `/family/*` según el rol

## 5. Staff Layout

- [x] 5.1 Crear `app/staff/layout.tsx` como server component que verifique auth y rol (admin/staff)
- [x] 5.2 El layout renderiza el Sidebar con `role` correcto y envuelve children

## 6. Staff Pages

- [x] 6.1 Crear `app/staff/page.tsx` (feed staff — puede reusar el contenido actual de `app/page.tsx`)
- [x] 6.2 Mover `app/kids/page.tsx` a `app/staff/kids/page.tsx`
- [x] 6.3 Crear `app/staff/kids/[id]/page.tsx` (detalle de niño — reusar contenido existente)
- [x] 6.4 Crear `app/staff/avisos/page.tsx` (placeholder con sidebar)
- [x] 6.5 Crear `app/staff/cuenta/page.tsx` (placeholder con sidebar)

## 7. Family Layout

- [x] 7.1 Crear `app/family/layout.tsx` como server component que verifique auth y rol (parent)
- [x] 7.2 El layout renderiza el Sidebar con `role="parent"` y envuelve children

## 8. Family Pages

- [x] 8.1 Crear `app/family/page.tsx` (feed familia — filtrado por hijos vinculados)
- [x] 8.2 Crear `app/family/hijos/page.tsx` (lista de hijos vinculados — solo lectura, sin botón agregar)
- [x] 8.3 Crear `app/family/hijos/[id]/page.tsx` (detalle de hijo — solo lectura)
- [x] 8.4 Crear `app/family/notificaciones/page.tsx` (placeholder con sidebar)
- [x] 8.5 Crear `app/family/cuenta/page.tsx` (placeholder con sidebar)

## 9. Limpieza

- [x] 9.1 Eliminar `app/kids/` (carpeta movida a staff)
- [x] 9.2 Verificar que `npm run build` compila sin errores
- [x] 9.3 Verificar que `npm run lint` pasa sin errores
