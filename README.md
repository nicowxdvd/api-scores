## API

API de scores desarrollada con NestJS. Login con JWT y consulta de score por RUT.

### Requisitos

- Node.js y npm

### Puesta en marcha

```bash
npm i
cp .env.example .env
```

Editar `.env` y completar `JWT_SECRET` con cualquier texto secreto (por ejemplo `mi-secreto-de-prueba`). `JWT_EXPIRES_IN` queda en `1h`.

```bash
npm run start:dev
```

La API queda en `http://localhost:3000`. Para cambiar el puerto: `PORT=4000 npm run start:dev`.

### Tests y build

```bash
npm test
npm run test:e2e
npm run build
```

## Criterios a usar IA

- Armado del proyecto con arquitectura hexagonal
- Implementación de tests unitarios
- Abstracción de los desacoplamientos de cada capa
- Mock de usuarios
- Aplicación de flujo Gitflow para los cambios de código
- Instalación de JWT
- Validación de CORS

## Usuarios de prueba

| id  | email              | password | role  | rut          |
| --- | ------------------ | -------- | ----- | ------------ |
| 001 | admin@pp-scores.cl | @dmin    | admin | sin rut      |
| 002 | user@pp-scores.cl  | 123456   | user  | 11.111.111-1 |

## Uso

### 1. Login

`POST http://localhost:3000/login` con body JSON:

```json
{ "email": "user@pp-scores.cl", "password": "123456" }
```

Respuesta:

```json
{ "accessToken": "eyJhbGciOi..." }
```

Copiar el valor de `accessToken`.

### 2. Score

`GET http://localhost:3000/score?rut=11.111.111-1`

Enviar el header `Authorization: Bearer <accessToken>`. En Postman: pestaña Authorization, tipo Bearer Token. Todas las rutas menos `/login` exigen este header.

Respuesta `200`:

```json
{
  "rut": "111111111",
  "score": 41,
  "fecha": "2026-09-28T22:48:22.037Z"
}
```

- `rut`: RUT normalizado, sin puntos ni guion.
- `score`: entero, siempre el mismo para un mismo RUT.
- `fecha`: fecha y hora ISO 8601 en UTC, generada en cada consulta.

### Reglas de acceso

- `user@pp-scores.cl` solo puede consultar su propio RUT, `11.111.111-1`. Con otro RUT responde `403`.
- `admin@pp-scores.cl` puede consultar cualquier RUT válido, por ejemplo `12.345.678-5`.
- El RUT se valida con su dígito verificador. Acepta formato con puntos y guion (`12.345.678-5`) o sin puntos (`12345678-5`).

### Errores

| Código | Cuándo                                                          |
| ------ | --------------------------------------------------------------- |
| 400    | RUT inválido, o body de login inválido (email malo, campo vacío) |
| 401    | Credenciales incorrectas, token ausente, inválido o vencido      |
| 403    | Usuario `user` consulta un RUT que no es el suyo                 |
