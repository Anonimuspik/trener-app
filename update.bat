@echo off
setlocal

:: Токен не зберігається у цьому файлі — вводиш його щоразу вручну.
set /p GH_TOKEN="Встав сюди свій GH_TOKEN і натисни Enter: "
set CSC_IDENTITY_AUTO_DISCOVERY=false

:: Обновляем версию вручную в package.json перед запуском!

echo.
echo === git add ===
git add .

echo.
echo === git commit ===
git commit -m "update"

echo.
echo === git push ===
git push
if errorlevel 1 (
    echo.
    echo !!! ПОМИЛКА при git push — дивись повідомлення вище !!!
    pause
    exit /b 1
)

echo.
echo === npm run publish (може тривати кілька хвилин) ===
call npm run publish
if errorlevel 1 (
    echo.
    echo !!! ПОМИЛКА під час публікації — дивись повідомлення вище !!!
    pause
    exit /b 1
)

echo.
echo Готово! Відкрий GitHub Releases і опублікуй Draft.
echo.
pause