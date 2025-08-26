export function anonymizeContract(text: string): string {
  return text
    // Nombres completos
    .replace(/\b[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+ [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\b/g, "[NOMBRE]")
    // Emails
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[EMAIL]")
    // Teléfonos
    .replace(/\b\d{7,15}\b/g, "[TELEFONO]")
    // RFC / CURP
    .replace(/\b[A-Z]{3,4}\d{6}[A-Z0-9]{3}\b/g, "[IDENTIFICADOR]")
    // CLABE / cuentas bancarias (18 dígitos)
    .replace(/\b\d{18}\b/g, "[CUENTA_BANCARIA]")
    // Direcciones (solo nombres de calles y números, no fechas)
    .replace(/\b(Calle|Av|Avenida|Col\.) [\w\s\d]+/gi, "[DIRECCION]");
}
