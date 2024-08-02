<p align="center">
  <img src="src/assets/logo.png" alt="Ávoristech" /><br />
</p>

# Prueba Técnica Angular 

## Nota importante 🚨

Este proyecto es parte de una prueba técnica propiedad de **Ávoris Corporación Empresarial**. Por favor, no compartas ni publiques este código de manera pública. Su distribución o divulgación sin autorización está estrictamente prohibida.

Una vez hayas completado la prueba, por favor envía el resultado a través de un servicio de transferencia de archivos como WeTransfer o cualquier otro método acordado con el equipo de reclutamiento.

¡Gracias por tu comprensión y cooperación!

## Descripción 📋

El objetivo de esta prueba técnica es desarrollar una aplicación en Angular que muestre un listado de hoteles. La aplicación debe permitir a los usuarios filtrar los hoteles por nombre, categoría (estrellas), valoración y precio.

El modelo de hoteles es el siguiente:
```
{ 
    id: string;
    name: string;
    image: string;
    address: string;
    stars: number;
    rate: number;
    price: number;
}
```

## Requisitos 🎯

- **Filtros**: 
  - **Nombre**: Filtrar hoteles por nombre. El filtro debe funcionar como "contain". Es decir, el texto introducido debe estar presente en cualquier sitio del nombre del hotel.
  - **Categoría**: Filtrar hoteles por su categoría (1 a 5 estrellas). El filtro debe ser de tipo checkbox de tal manera que pueda filtrar por varias categorias al mismo tiempo (3 estrellas, 4 estrellas y 5 estrellas).
  - **Valoración**: Filtrar hoteles por su valoración (de 0 a 5). El filtro debe ser de tipo "range" (input type "range") y mostrar los hoteles con una valoración superior o igual al valor del range. La valoración puede contener decimales (ej: 3.7).
  - **Precio**: Filtrar hoteles dentro de un rango de precios. Igual que el filtro de valoración pero esta vez se deben obtener los hoteles que tengan un precio igual o inferior al precio del range. (el rango de precios mínimo y máximo están establecidos en 50€ y 1000€)
- **Paginación**: Implementar una pequeña paginación que permita navegar por las diferentes páginas de resultados.
- **Diseño**: Aunque no es un requisito de esta prueba, se valorará positivamente una interfaz clara y amigable. Para agilizar el desarrollo se puede hacer uso de alguna librería de estilos como [Bootstrap](https://getbootstrap.com/), [Tailwind](https://tailwindcss.com/) o similar.

## Configuración del Entorno de Desarrollo 💻

Se te proporcionará un archivo ZIP que contiene el esqueleto inicial del proyecto, junto con un conjunto de datos de hoteles para utilizar como base de datos.

1. **Descomprimir el archivo ZIP**: Extrae el contenido del archivo ZIP en tu entorno de desarrollo.
2. **Instalar dependencias**: Abre una terminal en el directorio del proyecto y ejecuta `npm install` para instalar todas las dependencias necesarias.

## Generar la Base de Datos 🏃

Antes de ejecutar la aplicación, necesitarás generar la base de datos:

1. **Generar la base de datos**: Ejecuta `npm run generate-db` en tu terminal. Esto ejecutará el script `generate-hotels-db.js` para generar el archivo `db.json` con datos aleatorios de hoteles.

## Ejecutar la Aplicación 🚀

- Ejecuta `npm run start` para iniciar el servidor de desarrollo de Angular. La aplicación estará disponible en `http://localhost:4200`. Así mismo, al levantar la aplicación, también se iniciará `json-server`, que servirá la API en `http://localhost:3000/hotels`.
- La aplicación se ha generado con el CLI de Angular (versión 17) y no se ha realizado ninguna modificación. Es decir, se empieza con una estructura de proyecto vacía y se deja a elección del programador la estructura de ficheros del proyecto. 

## Criterios de Evaluación 🔎

- **Funcionalidad**: Cumplimiento de los requisitos especificados.
- **Código**: Claridad, calidad y organización del código.
- **Uso de características modernas de Angular**: Se valorará positivamente el uso  (si se considera oportuno) de las últimas funcionalidades de Angular ofrecidas en sus últimas versiones (en este caso, Angular 17).
- **Pruebas unitarias**: Aunque no es obligatorio, la presencia de pruebas unitarias que aseguren la correcta funcionalidad de los componentes, servicios y utilidades implementados será considerada un aspecto favorable en la evaluación.

## Enlaces de Interés 💡

- **Novedades de Angular**: Para conocer las últimas funcionalidades y mejoras introducidas en Angular en sus últimas versiones, puedes visitar el [blog oficial de Angular](https://blog.angular.io/).

- **faker-js**: Hemos utilizado `faker-js` para generar datos falsos de hoteles de manera sencilla. Es muy útil para el desarrollo y pruebas de aplicaciones. Puedes encontrar más información y la documentación en el [repositorio de GitHub de faker-js](https://github.com/faker-js/faker).

- **json-server**: Hemos utilizado `json-server` para generar de una manera rápida un servidor REST API completo con operaciones CRUD a partir de un archivo JSON. Es útil para mockear APIs durante el desarrollo de aplicaciones frontend. Para más detalles, visita el [repositorio de GitHub de json-server](https://github.com/typicode/json-server).