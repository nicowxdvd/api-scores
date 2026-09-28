## API
La api se desarrollo con nestjs, para probarla se necesita ejecutar 

$ npm i
  
  y luego 

$ npm run start:dev


## Criterios a usar IA

- el armado del proyecto con arquitectura hexagonal
- Implementacion de test unitarios
- Abstracion de los desacoplamientos de cada capa
- mock de usuarios
- Aplicacion de flujo de gitglow para los cambios de codigo
- instalacion de jwy
- validacion de cors


## USUARIOS DE PRUEBAS

─────────┬─────────────────┬───────────┬───────┬──────────────┐
│   id    │      email      │ password  │ role  │     rut      │
├─────────┼─────────────────┼───────────┼───────┼──────────────┤
│ 001 │ admin@pp-scores.cl │ @dmin │ admin │ sin rut      │
├─────────┼─────────────────┼───────────┼───────┼──────────────┤
│ 002 │ user@pp-scores.cl  │ 123456  │ user  │ 11.111.111-1


## CONSIDERACIONES 

1. Login (POST, body JSON):
http://localhost:3000/login
{ "email": "user@pp-scores.cl", "password": "123456" }
Copiá el token de la respuesta. Si no ves un campo token, revisá el nombre real del campo en la respuesta.

2. Score (GET):
http://localhost:3000/score?rut=11.111.111-1
En la pestaña Authorization elegí Bearer Token y pegá el token. Todas las rutas menos /login exigen Authorization: Bearer <token>. Sin token da 401.

Reglas de acceso:
- user@pp-scores.cl solo puede consultar su propio RUT, 11.111.111-1. Con otro RUT da 403.
- admin@pp-scores.cl (password @dmin) puede consultar cualquier RUT válido.

El RUT se valida con dígito verificador. Un RUT válido para probar con admin es 12.345.678-5. Ese RUT lo calculé a mano y no lo probé contra la API.
Antes de probar, levantá el servidor con npm run startpunto 