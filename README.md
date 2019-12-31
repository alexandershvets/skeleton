# Skeleton

## Особенности

- возможность выбирать препроцессор, **sass / scss**
- в сборку интегрирована сетка [smart-grid](https://github.com/dmitry-lavrik/smart-grid) от [Дмитрия Лаврика](https://dmitrylavrik.ru/)
- в сборку входит скрипт отложенной загрузки изображений [Lazy Load](https://www.youtube.com/watch?v=lRu3e3Vbgy0) от [Web Design Master](https://webdesign-master.ru/)

## Файловая структура

```
skeleton
├── dist
├── app
│   ├── fonts
│   ├── img
│   ├── js
│	  ├── libs
│   ├── sass
│   ├── scss
│	  └── views
├── .bowerrc
├── .gitignore
├── .npmrc
├── gulpfile.js
├──	gulpfile.smart-grid.js
└── package.json
```

## Команды

- `npm run dev`   - режим разработки с запуском сервера, без оптимизации файлов
- `npm run build`  - сборка проекта с оптимизацией файлов, без запуска сервера
- `gulp watch --dev`   - режим разработки, без запуска сервера
- `gulp watch --sync`   - режим разработки с оптимизацией файлов, с запуском сервера
- `gulp grid`  - сгенерировать сетку Smart-Grid
- `gulp html`  - собрать html-файлы
- `gulp styles` - скомпилировать SASS/SCSS-файлы
- `gulp scripts` - собрать JS-файлы
- `gulp img`  -  собрать изображения
- `gulp fonts`  - собрать шрифты
- `gulp fav`  - сгенерировать фавиконки
- `gulp clear`   - удалить папку ./dist
- `gulp cache`    - отчистить кэш gulp
- `gulp cleanimg`  - очистить папку ./dist/img
- `gulp rsync`  - молниеносный деплой на сервер
