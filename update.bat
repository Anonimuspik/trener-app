@echo off
:: Токен більше НЕ зберігається у цьому файлі — вводиш його щоразу вручну.
:: Це безпечніше: навіть якщо цей файл потрапить у git або комусь покажеш екран,
:: токен туди не потрапить.

set /p GH_TOKEN="Встав сюди свій GH_TOKEN і натисни Enter: "
set CSC_IDENTITY_AUTO_DISCOVERY=false

:: Обновляем версию вручную в package.json перед запуском!
git add .
git commit -m "update"
git push
npm run publish

echo Готово! Відкрий GitHub Releases і опублікуй Draft.
pause