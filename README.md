# Kadenis

Sitio institucional estático para Kadenis. No requiere instalación ni backend propio: abrí `index.html` en un navegador o servilo con cualquier servidor HTTP estático. La tipografía se carga desde Google Fonts, por lo que necesita conexión a esos dominios para mostrarse con la familia visual elegida; si no están disponibles, se usan las fuentes de respaldo del sistema.

## Publicación

El sitio está preparado para GitHub Pages. Para activar una publicación hace falta que la cuenta propietaria habilite Pages en el repositorio. El formulario envía una solicitud `POST` JSON al endpoint de [FormSubmit](https://formsubmit.co/) configurado para `daniel.serkin@gmail.com`; no depende del cliente de correo del visitante. FormSubmit solicita al destinatario una activación única por correo antes de aceptar el primer envío. El sitio no almacena esos datos localmente. Si el envío fallara, el visitante puede usar el enlace de correo visible en la sección de contacto o en el pie.

## Verificación rápida

```sh
npx --yes serve .
```

Abrí la URL que indique el comando. No se incluyen dependencias, credenciales ni configuración de terceros.
