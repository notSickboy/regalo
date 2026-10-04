// Registro de la página de cumpleaños.
// Va dentro de una hoja de Google Sheets: Extensiones > Apps Script.
// Cada apertura o cupón agrega un renglón; cada cupón además manda un correo.
function doPost(e) {
  var d = {};
  try { d = JSON.parse(e.postData.contents); } catch (err) {}
  var tipo = String(d.tipo || "desconocido").slice(0, 40);
  var detalle = String(d.detalle || "").slice(0, 200);
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (hoja.getLastRow() === 0) hoja.appendRow(["Fecha", "Tipo", "Detalle"]);
  hoja.appendRow([new Date(), tipo, detalle]);
  if (tipo === "cupon") {
    MailApp.sendEmail(Session.getEffectiveUser().getEmail(),
      "Cupón de bonita: " + detalle,
      detalle + "\nFecha: " + new Date().toLocaleString("es-MX"));
  }
  return ContentService.createTextOutput("ok");
}
