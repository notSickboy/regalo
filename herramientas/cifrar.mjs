// Cifra la página del regalo para publicarla con contraseña en GitHub Pages.
// Uso:  CLAVE="la contraseña" node herramientas/cifrar.mjs ruta/a/cumple-bonita [salida.html]
// La carpeta de entrada es la original (index.html + fotos/). Las fotos se incrustan en el HTML
// como data URIs y todo se cifra con AES-256-GCM (clave PBKDF2-SHA-256, 600000 iteraciones).
// Sin dependencias: solo Node 18+.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ITER = 600000;
const [origen, salida = "index.html"] = process.argv.slice(2);
const clave = process.env.CLAVE;
if (!origen || !clave) {
  console.error('Uso: CLAVE="..." node herramientas/cifrar.mjs ruta/a/cumple-bonita [salida.html]');
  process.exit(1);
}

let html = readFileSync(join(origen, "index.html"), "utf8");
let n = 0;
html = html.replace(/src="(fotos\/[^"]+\.jpe?g)"/g, (_, ruta) => {
  n++;
  return `src="data:image/jpeg;base64,${readFileSync(join(origen, ruta)).toString("base64")}"`;
});
console.error(`Fotos incrustadas: ${n}`);

const { subtle } = globalThis.crypto;
const sal = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const base = await subtle.importKey("raw", new TextEncoder().encode(clave), "PBKDF2", false, ["deriveKey"]);
const llave = await subtle.deriveKey(
  { name: "PBKDF2", hash: "SHA-256", salt: sal, iterations: ITER },
  base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
const cifrado = new Uint8Array(await subtle.encrypt({ name: "AES-GCM", iv }, llave, new TextEncoder().encode(html)));

const b64 = (u8) => Buffer.from(u8).toString("base64");
writeFileSync(salida, plantilla({ sal: b64(sal), iv: b64(iv), datos: b64(cifrado), iter: ITER }));
console.error(`Escrito ${salida} (${(cifrado.length / 1048576).toFixed(2)} MB cifrados)`);

function plantilla({ sal, iv, datos, iter }) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<title>Para ti</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caprasimo&family=Baloo+2:wght@400;700&display=swap">
<style>
:root{--bg:#dfe6fb;--fg:#2c1a3d;--muted:#5d4d74;--paper:#fbf9ff;--line:#b9c2e6;--accent:#d6336c;--accent-ink:#fff;
  --display:"Caprasimo","Cooper Black",Georgia,serif;--body:"Baloo 2","Trebuchet MS",system-ui,sans-serif;color-scheme:light}
@media (prefers-color-scheme:dark){:root{--bg:#1d1430;--fg:#f3ecff;--muted:#b9a9d6;--paper:#2a1e44;--line:#46366b;--accent:#ff7aa6;--accent-ink:#2c1a3d;color-scheme:dark}}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;min-height:100dvh;display:grid;place-items:center;background:var(--bg);color:var(--fg);font-family:var(--body);font-size:1.125rem;padding:24px 16px}
form{width:100%;max-width:360px;background:var(--paper);border:1px solid var(--line);border-radius:10px;padding:28px 22px;display:flex;flex-direction:column;gap:14px;text-align:center}
h1{font-family:var(--display);font-weight:400;font-size:2.4rem;margin:0;line-height:1.05}
h1 span{color:var(--accent)}
p{margin:0;color:var(--muted)}
input[type=password]{font:inherit;font-size:16px;padding:12px 14px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--fg);width:100%}
label{display:flex;gap:8px;align-items:center;justify-content:center;font-size:1rem;color:var(--muted)}
button{font:700 1.05rem var(--body);background:var(--accent);color:var(--accent-ink);border:0;border-radius:999px;padding:12px 20px;cursor:pointer}
button:disabled{opacity:.6;cursor:wait}
:focus-visible{outline:3px solid var(--fg);outline-offset:2px}
#error{color:var(--accent);min-height:1.5em;font-weight:700}
#olvidar{font-size:.9rem;color:var(--muted)}
</style>
</head>
<body>
<form id="f" autocomplete="off">
  <h1>Para ti <span>💛</span></h1>
  <p>Escribe la contraseña para abrir tu regalo.</p>
  <input type="password" id="clave" aria-label="Contraseña" autocomplete="current-password" required autofocus>
  <label><input type="checkbox" id="recordar" checked> Recordarme en este dispositivo</label>
  <button id="abrir" type="submit">Abrir</button>
  <p id="error" role="alert"></p>
  <a href="#" id="olvidar" hidden>Olvidar este dispositivo</a>
</form>
<script>
(function(){
  var SAL="${sal}", IV="${iv}", ITER=${iter}, GUARDADA="regalo-llave";
  var DATOS="${datos}";
  var $=function(id){return document.getElementById(id)};
  function bytes(b64){var s=atob(b64),u=new Uint8Array(s.length);for(var i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u}
  function leer(){try{return localStorage.getItem(GUARDADA)}catch(e){return null}}
  function guardar(v){try{v?localStorage.setItem(GUARDADA,v):localStorage.removeItem(GUARDADA)}catch(e){}}
  async function descifrar(llave){
    var plano=await crypto.subtle.decrypt({name:"AES-GCM",iv:bytes(IV)},llave,bytes(DATOS));
    return new TextDecoder().decode(plano);
  }
  // Reemplaza la página solo cuando terminó de cargar; antes, document.open() se ignora y el HTML se agregaría encima.
  function mostrar(html){
    if(document.readyState!=="complete"){addEventListener("load",function(){mostrar(html)},{once:true});return}
    document.open();document.write(html);document.close();
  }
  async function derivar(clave){
    var base=await crypto.subtle.importKey("raw",new TextEncoder().encode(clave),"PBKDF2",false,["deriveKey"]);
    return crypto.subtle.deriveKey({name:"PBKDF2",hash:"SHA-256",salt:bytes(SAL),iterations:ITER},base,{name:"AES-GCM",length:256},true,["decrypt"]);
  }
  if(!window.crypto||!crypto.subtle){$("error").textContent="Ábrelo desde https:// en un navegador actual.";return}
  var g=leer();
  if(g){
    $("olvidar").hidden=false;
    crypto.subtle.importKey("raw",bytes(g),"AES-GCM",false,["decrypt"]).then(descifrar).then(mostrar).catch(function(){guardar(null);$("olvidar").hidden=true});
  }
  $("olvidar").onclick=function(e){e.preventDefault();guardar(null);this.hidden=true};
  $("f").onsubmit=async function(e){
    e.preventDefault();
    var btn=$("abrir");btn.disabled=true;$("error").textContent="";btn.textContent="Abriendo…";
    try{
      var llave=await derivar($("clave").value);
      var html=await descifrar(llave);
    }catch(err){
      $("error").textContent="Esa no es 💛";btn.disabled=false;btn.textContent="Abrir";$("clave").select();
      return;
    }
    if($("recordar").checked){
      var crudo=new Uint8Array(await crypto.subtle.exportKey("raw",llave)),s="";
      for(var i=0;i<crudo.length;i++)s+=String.fromCharCode(crudo[i]);
      guardar(btoa(s));
    }
    mostrar(html);
  };
})();
</script>
</body>
</html>
`;
}
