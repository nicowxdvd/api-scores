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