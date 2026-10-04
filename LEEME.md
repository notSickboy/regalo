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

## Registro de aperturas y cupones (opcional)
1. Crea una hoja nueva en Google Sheets.
2. Extensiones > Apps Script. Borra lo que haya y pega el contenido de `registro/Code.gs`. Guarda.
3. Implementar > Nueva implementación > tipo "Aplicación web".
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
4. Autoriza los permisos (hoja y correo) y copia la URL que termina en `/exec`.
5. En el `index.html` original, pega esa URL en `window.REGISTRO_URL="";`, vuelve a cifrar
   (ver "Contraseña") y sube el nuevo `index.html`.

Cada vez que se abra el regalo o se toque un cupón se agrega un renglón a la hoja.
Cada cupón manda además un correo a la cuenta dueña de la hoja.
Para contar aperturas: `=CONTAR.SI(B:B;"apertura")` en cualquier celda.

Para abrir la página sin que cuente (por ejemplo, tú mismo), agrega `#diego` al final de la dirección.
