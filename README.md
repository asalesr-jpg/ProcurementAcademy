# Procurement Academy

Plataforma de formación en compras con dos cursos: Stakeholder Academy y Source to Contract. Incluye lecciones, audios, presentaciones, plantillas, ejercicios, administración de usuarios y clases en vivo.

## Requisitos

- Servidor web con PHP. La documentación original indica PHP 7.4 o superior.
- Permiso de escritura para el servidor en `data/`.
- HTTPS para cámara y micrófono.
- No necesita base de datos: guarda los datos en archivos.

## Configuración

1. Copia `config.example.php` a `config.php`.
2. Genera un hash de una contraseña propia con la función PHP `password_hash($password, PASSWORD_DEFAULT)` y sustituye `REPLACE_WITH_YOUR_PASSWORD_HASH` en `config.php`. Evita guardar la contraseña en texto claro o en el historial de comandos.
3. Revisa la configuración de sesiones, registro y servidores STUN/TURN.
4. Sube el proyecto a un hosting con PHP, incluyendo los archivos `.htaccess`.
5. Permite escritura en `data/` al usuario del servidor y bloquea el acceso web a `data/` y `seed/`. Consulta los detalles de Apache/Nginx en `LEEME.txt`.
6. Entra como `admin` con la contraseña que has configurado.

La copia local preparada desde el ZIP conserva su `config.php` original, excluido de Git. Las nuevas descargas del repositorio necesitan crear ese archivo siguiendo los pasos anteriores.

## Desarrollo local

Una vez creado `config.php`, puedes iniciar una vista local con:

```sh
php -S 127.0.0.1:8000
```

Abre http://127.0.0.1:8000. El servidor integrado de PHP es solo para desarrollo local y no interpreta `.htaccess`.

## Estructura

- `index.html`, `app/`: portal y código compartido.
- `api.php`: lógica del servidor.
- `config.example.php`: plantilla de configuración sin credenciales.
- `stakeholder/`, `source-to-contract/`: contenidos y materiales de cada curso.
- `seed/`: contenido inicial de las presentaciones del profesor.
- `data/`: datos generados durante el uso; excluidos de Git salvo los archivos de protección.
- `LEEME.txt`: documentación original del proyecto.

## Repositorio y publicación web

El repositorio incluye los audios, documentos y plantillas del ZIP original. La configuración privada y los datos de usuarios quedan fuera del control de versiones.

Guardar el proyecto en GitHub no publica una web funcional. La aplicación necesita un servidor PHP; GitHub Pages no ejecuta el backend PHP.

Antes de actualizar un servidor en uso, conserva su `config.php` y haz una copia de seguridad de `data/`.
