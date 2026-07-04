@echo off
set GH_TOKEN=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
set CSC_IDENTITY_AUTO_DISCOVERY=false

:: Обновляем версию вручную в package.json перед запуском!

git add .
git commit -m "update"
git push

npm run publish

echo Готово! Открой GitHub Releases и опубликуй Draft.
pause