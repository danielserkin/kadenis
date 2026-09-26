# Kadenis

Sitio institucional estático para Kadenis. No requiere instalación ni backend propio: abrí `index.html` en un navegador o servilo con cualquier servidor HTTP estático. La tipografía se carga desde Google Fonts, por lo que necesita conexión a esos dominios para mostrarse con la familia visual elegida; si no están disponibles, se usan las fuentes de respaldo del sistema.

## Publicación y tratamiento de datos

El sitio está preparado para GitHub Pages. Para activar una publicación hace falta que la cuenta propietaria habilite Pages en el repositorio. El formulario envía una solicitud `POST` JSON al endpoint de [FormSubmit](https://formsubmit.co/) configurado para `daniel.serkin@gmail.com`; no depende del cliente de correo del visitante. FormSubmit solicita al destinatario una activación única por correo antes de aceptar el primer envío.

### Responsable legal y tratamiento de consultas
- **Responsable legal**: Daniel Serkin (`daniel.serkin@gmail.com`).
- **Almacenamiento en el sitio**: El sitio web estático en GitHub Pages no posee backend propio ni base de datos, por lo que no persiste ni almacena localmente la información del formulario.
- **Tratamiento en casilla de correo**: Los datos remitidos (nombre, email, empresa, teléfono y consulta) se dirigen a la casilla de correo del responsable para responder la solicitud.
- **Conservación y revisión**: Las consultas recibidas se conservan en la casilla de correo de destino durante **al menos un mes**. Cumplido dicho período mínimo, se realiza una revisión manual de la bandeja de entrada para resolver su mantenimiento o depuración (sin borrado automático programado al día 30).

Si el envío fallara, el visitante puede usar el enlace de correo visible en la sección de contacto o en el pie.

## Verificación rápida

```sh
npx --yes serve .
```

Abrí la URL que indique el comando. No se incluyen dependencias, credenciales ni configuración de terceros.
