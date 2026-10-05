# Cumpleaños de bonita

Página estática. El `index.html` publicado está cifrado: pide una contraseña y, al acertarla,
el navegador descifra la página original (con las 15 fotos incluidas dentro) y la muestra.
En el repositorio no hay fotos ni texto legible; sin la contraseña no se puede ver nada.

## Contraseña
- La página original (`index.html` + `fotos/`) NO está en el repositorio: guárdala tú (el zip).
- Para cambiar algo o cambiar la contraseña, edita la carpeta original y vuelve a cifrar:

      CLAVE="la contraseña" node herramientas/cifrar.mjs ruta/a/cumple-bonita

  Eso reescribe `index.html` aquí; luego súbelo. Solo necesita Node 18 o más nuevo.
- "Recordarme en este dispositivo" guarda la llave en ese navegador para no volver a escribirla.
  Si cambias la contraseña, se volverá a pedir.

## Publicar en GitHub Pages
1. Sube todo el contenido de esta carpeta a la raíz del repositorio (incluido `.nojekyll`).
2. En el repositorio: Settings > Pages > Source: "Deploy from a branch", rama `main`, carpeta `/ (root)`.
3. La página queda en `https://USUARIO.github.io/REPOSITORIO/`.

## Avisos por correo
Cada vez que se abre el regalo o se toca un cupón, la página manda un correo (vía FormSubmit) a la
dirección que está en `window.REGISTRO_URL` dentro del `index.html` original. Esa dirección va dentro
de la parte cifrada, así que no es visible sin la contraseña.

- La primera vez, FormSubmit manda un correo de **activación**: hay que abrirlo y confirmar. Antes de
  eso no llega ningún aviso.
- Para abrir la página sin que avise (por ejemplo, tú mismo), agrega `#diego` al final de la dirección.
- Para desactivarlo, deja `window.REGISTRO_URL="";` en el original y vuelve a cifrar.
- Alternativa con hoja de Google Sheets: `registro/Code.gs` (Apps Script publicado como aplicación
  web); en ese caso, pon su URL `/exec` en `REGISTRO_URL` y regresa el `fetch` de `enviar()` a texto plano.
