# Plan de Pruebas - Xpedition Learn 2025

**Proyecto:** Xpedition Learn 2025: Caso de Evaluación  
**Autor:** Juan Roberto Escobedo Flores  
**Alcance:** Validar funcionalidades de página demo [https://automationexercise.com](https://automationexercise.com)

---

## Índice
- [Plan de Pruebas - Xpedition Learn 2025]
  - [Índice]
  - [Objetivos](#objetivos)
  - [Alcance funcional](#alcance-funcional)
    - [Web](#web)
    - [API](#api)
  - [Supuestos y limitaciones](#supuestos-y-limitaciones)
  - [Priorización y riesgos](#priorización-y-riesgos)
  - [Criterios de salida](#criterios-de-salida)
  - [Estrategia de pruebas](#estrategia-de-pruebas)
  - [Datos de prueba](#datos-de-prueba)
  - [Diseño de casos principales](#diseño-de-casos-principales)
    - [Casos Web](#casos-web)
    - [Casos API](#casos-api)
  - [Matriz de trazabilidad](#matriz-de-trazabilidad)
    - [Casos Web](#casos-web-1)
    - [Casos API](#casos-api-1)
  - [Herramientas](#herramientas)
  - [Estructura del proyecto](#estructura-del-proyecto)
  - [Métricas](#métricas)
  - [Entregables](#entregables)

---

## Objetivos
- Diseñar estrategia de pruebas
- Automatizar 10 casos con Playwright
- Automatizar 19 requests API
- Reporte unificado (Allure)
- Matriz de trazabilidad
- Reporte de bugs

---

## Alcance funcional

### Web
- Registro de usuario
- Login / logout / sesión persistente
- Páginas estáticas (home, productos, carrito)
- Carrito (añadir, quitar, cantidades)
- Checkout (flujo básico)
- Búsqueda y filtros
- Review de producto
- Contact Us form
- Validaciones en login y registro

### API
- Registro de usuario
- Login / logout
- Búsqueda (usuario, productos, marcas)
- Carrito (añadir)
- Mensajes de error (método incorrecto, campos faltantes o erróneos)

**Nota:**  
- No se prueban pagos reales  
- No se testean integraciones externas

---

## Supuestos y limitaciones
- El entorno es público (no controlamos datos ni rollback)  
- No se realizan pruebas que dañen el servicio  
- Datos de prueba deben ser identificables y limpiables (usar email+timestamp)  
- Limitación de tiempos de respuesta por hosting público

---

## Priorización y riesgos

**Prioridad:**  
- **P0 (crítico):** Autenticación y flujo de compra  
- **P1 (alta):** Funcionalidades de carrito y validaciones de interacción  
- **P2:** Interacción con el usuario / reviews

**Riesgos técnicos:** cambios en página demo, anuncios  
**Mitigación:** usar cuentas con emails y nombres temporales controlados, reintentos, uso de helper para bloquear anuncios

---

## Criterios de salida
- Todas las pruebas P0 pasan en ejecución automatizada (100%)  
- ≥ 80% de casos P1 pasan (o defectos aceptados con plan)  
- Reporte consolidado (Allure)  
- Coverage mínimo: Web 10 automatizados y API 19 requests validados  
- Reporte de bugs reproducibles (P0/P1 incluidos si aplican)

---

## Estrategia de pruebas

**Enfoque general**
Se aplicará un enfoque híbrido de pruebas:

- **Pruebas exploratorias ligeras** para identificar comportamientos inesperados en un entorno público no controlado y apoyar el diseño de casos formales.
- **Pruebas End-to-End en UI** con Playwright, para validar los flujos críticos del usuario.
- **Pruebas de API** para validar lógica de negocio, contratos, mensajes de error y consistencia de datos.

---

## Datos de prueba
- **Emails:** jescobedof+<timestamp>@pw.com  
- **Password estándar:** 12345678  
- **Usuario creado:** datos de creación (guardado en JSON)  
- **Sesión persistente:** datos de sesión (guardado en JSON)

---

## Casos principales

### Casos Web

**P0**  
1. Registro usuario válido  
2. Login válido + persistencia  
3. Añadir producto al carrito  
4. Checkout exitoso  

**P1**  
5. Modificar cantidad y validar total  
6. Búsqueda de productos  
7. Eliminar del carrito  
8. Validaciones de formulario en login/registro  

**P2**  
9. Review a un producto  
10. Envío de formulario contáctanos  

### Casos API

**P0**  
1. POST createAccount válido  
2. POST verifyLogin válido  
3. GET user detail válido  
4. DELETE account válido  
5. GET productos → 200  
6. POST searchProduct válido  
7. GET addProductToCart  

**P1**  
8. POST productosList → 405  
9. GET brandsList → 200  
10. PUT brandsList → 405  
11. POST createAccount missing fields  
12. POST verifyLogin credenciales inválidas  
13. POST verifyLogin sin email  
14. DELETE verifyLogin → 405  
15. DELETE account credenciales incorrectas  
16. GET user detail email no existente  

**P2**  
17. POST searchProduct → 405  
18. PUT updateAccount usuario no existe → 404  
19. POST createAccount body vacío → 400

---

## Matriz de trazabilidad

### Casos Web

| ID RF | Descripción | ID Caso | Script | Resultado esperado | Estado | Prioridad |
|-------|------------|---------|----------------|-----------------|--------|-----------|
| RF-01 | Registro de usuario válido | WEB-P0-01 | P0.spec.ts | Se crea usuario nuevo. Se muestra "ACCOUNT CREATED!". Logout | Passed | **P0 🔴** |
| RF-02 | Login válido y persistencia | WEB-P0-02 | P0.spec.ts | Acceso correcto. Se muestra "Logged in as" | Passed | **P0 🔴** |
| RF-03 | Añadir producto al carrito desde el listado | WEB-P0-03 | P0.spec.ts | Popup "Added!" visible. Carrito muestra 1 item | Passed | **P0 🔴** |
| RF-04 | Checkout exitoso | WEB-P0-04 | P0.spec.ts | Se llena formulario de pago/envío. Orden completada. "Order Placed Successfully" | Passed | **P0 🔴** |
| RF-05 | Modificar cantidad de producto y validar total | WEB-P1-05 | P1.spec.ts | Cantidad actualizada (ej: 1 → 4). Total cambia correctamente | Passed | **P1 🟠** |
| RF-06 | Búsqueda de productos | WEB-P1-06 | P1.spec.ts | Resultados visibles. Productos contienen el término buscado | Passed | **P1 🟠** |
| RF-07 | Eliminar producto del carrito | WEB-P1-07 | P1.spec.ts | Producto eliminado. Carrito vacío o items restantes actualizados | Passed | **P1 🟠** |
| RF-08 | Validaciones de formulario en login/registro | WEB-P1-08 | P1.spec.ts | Mensajes de error visibles. No permite continuar | Passed | **P1 🟠** |
| RF-09 | Review a un producto | WEB-P2-09 | P2.spec.ts | Click en producto, llenar formulario y enviar review | Passed | **P2 🟢** |
| RF-10 | Envío de formulario contáctanos | WEB-P2-10 | P2.spec.ts | Click en Contact Us, llenar formulario y enviar | Passed | **P2 🟢** |

### Casos API

| ID RF | Descripción | ID Caso | Script | Resultado esperado | Estado | Prioridad |
|-------|------------|---------|----------------|-----------------|--------|-----------|
| RF-11 | POST createAccount válido | API-P0-01 | TC_API_POST_CreateAccount_Valid | 201 + mensaje indicando usuario creado | Passed | **P0 🔴** |
| RF-12 | POST verifyLogin válido | API-P0-02 | TC_API_POST_VerifyLogin_Valid | 200 + mensaje indicando usuario existe | Passed | **P0 🔴** |
| RF-13 | GET user detail válido | API-P0-03 | TC_API_GET_UserDetail_Valid | 200 + JSON con datos exactos del usuario | Passed | **P0 🔴** |
| RF-14 | DELETE account válido | API-P0-04 | TC_API_DELETE_Account_Valid | 200 + mensaje indicando cuenta borrada | Passed | **P0 🔴** |
| RF-15 | GET productos → 200 | API-P0-05 | TC_API_GET_ProductsList_200 | 200 + lista de productos | Passed | **P0 🔴** |
| RF-16 | POST searchProduct válido | API-P0-06 | TC_API_POST_SearchProduct_Valid | 200 + lista de productos con el nombre en la categoría | Passed | **P0 🔴** |
| RF-17 | GET addProductToCart | API-P0-07 | TC_API_GET_addProductToCart | 200 + mensaje indicando agregado al carrito | Passed | **P0 🔴** |
| RF-18 | POST productosList → 405 | API-P1-08 | TC_API_POST_ProductsList_405 | 405 + mensaje indicando método request no soportado | Passed | **P1 🟠** |
| RF-19 | GET brandsList → 200 | API-P1-09 | TC_API_GET_BrandsList_200 | 200 + lista de brands | Passed | **P1 🟠** |
| RF-20 | PUT brandsList → 405 | API-P1-10 | TC_API_PUT_BrandsList_405 | 405 + mensaje indicando método request no soportado | Passed | **P1 🟠** |
| RF-21 | POST createAccount missing fields | API-P1-11 | TC_API_POST_CreateAccount_MissingFields | 400 + mensaje indicando campo que falta | Passed | **P1 🟠** |
| RF-22 | POST verifyLogin credenciales inválidas | API-P1-12 | TC_API_POST_VerifyLogin_InvalidCreds | 404 + mensaje indicando usuario no encontrado | Passed | **P1 🟠** |
| RF-23 | POST verifyLogin sin email | API-P1-13 | TC_API_POST_VerifyLogin_MissingEmail | 400 + mensaje indicando campo que falta | Passed | **P1 🟠** |
| RF-24 | DELETE verifyLogin → 405 | API-P1-14 | TC_API_DELETE_VerifyLogin_405 | 405 + mensaje indicando método request no soportado | Passed | **P1 🟠** |
| RF-25 | DELETE account credenciales incorrectas | API-P1-15 | TC_API_DELETE_Account_InvalidCreds | 404 + mensaje indicando cuenta no encontrada | Passed | **P1 🟠** |
| RF-26 | GET user detail email no existente | API-P1-16 | TC_API_GET_UserDetail_NotFound | 404 + mensaje indicando cuenta no encontrada con el email usado | Passed | **P1 🟠** |
| RF-27 | POST searchProduct → 405 | API-P2-17 | TC_API_POST_SearchProduct_405 | 405 + mensaje indicando método request no soportado | Passed | **P2 🟢** |
| RF-28 | PUT updateAccount usuario no existe → 404 | API-P2-18 | TC_API_PUT_UpdateAccount_UserNotFound | 404 + mensaje indicando cuenta no encontrada | Passed | **P2 🟢** |
| RF-29 | POST createAccount body vacío → 400 | API-P2-19 | TC_API_POST_CreateAccount_EmptyBody | 400 + mensaje indicando campo que falta | Passed | **P2 🟢** |

---

## Herramientas
- **Web automation:** Playwright. 
- **API automation:** Postman + Newman  
- **Reportes:** Allure  
- **CI:** GitHub  
- **Repositorio:** estructura sugerida abajo

---

## Estructura del proyecto
/allure-report
/auth
/data
/helpers/utils
/pages
/tests
   /web
   /apis

---

## Métricas
- % automatización de casos P0/P1/P2  
- Tiempo promedio de ejecución E2E  
- Nº de fallos detectados y severidad

---

## Entregables
- Plan de pruebas (MD + PDF)  
- Suites automatizadas (web y apis).
- Reporte unificado (Allure)
- Informe de bugs. 
- README con instrucciones de ejecución
