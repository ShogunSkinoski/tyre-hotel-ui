@echo off
echo [Setup] Starting build process...

echo [Prisma] Setting up database and generating client...
IF NOT EXIST "prisma" (
    echo [Error] Prisma directory not found! Creating it...
    mkdir prisma
)

echo [Prisma] Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo [Error] Failed to generate Prisma client
    exit /b %errorlevel%
)

echo [Prisma] Running database migrations...
call npx prisma migrate deploy
if %errorlevel% neq 0 (
    echo [Error] Failed to run migrations
    exit /b %errorlevel%
)

IF NOT EXIST "prisma\dev.db" (
    echo [Database] Creating new SQLite database...
    call npx prisma db push
    if %errorlevel% neq 0 (
        echo [Error] Failed to create database
        exit /b %errorlevel%
    )
)

echo [Next.js] Building application...
call npm run build
if %errorlevel% neq 0 (
    echo [Error] Failed to build Next.js application
    exit /b %errorlevel%
)

echo [Package] Creating offline package...
if exist "offline-build" rmdir /s /q offline-build
mkdir offline-build
mkdir offline-build\prisma

xcopy /E /I .next\standalone offline-build\
xcopy /E /I .next\static offline-build\.next\static\
xcopy /E /I public offline-build\public\
xcopy /E /I node_modules\.prisma offline-build\node_modules\.prisma\
xcopy /E /I node_modules\@prisma offline-build\node_modules\@prisma\

copy prisma\schema.prisma offline-build\prisma\
IF EXIST "prisma\dev.db" copy prisma\dev.db offline-build\prisma\

echo [Config] Creating environment file...
(
echo DATABASE_URL="file:./dev.db"
echo NEXTAUTH_URL="http://localhost:3000"
echo NEXTAUTH_SECRET="offline-secret-key-local-only"
) > offline-build\.env

echo [Script] Creating startup script...
(
echo @echo off
echo echo [Setup] Initializing application...
echo cd prisma
echo IF NOT EXIST "dev.db" ^(
echo     echo [Database] Database not found, creating new one...
echo     cd ..
echo     call npx prisma generate
echo     if %%errorlevel%% neq 0 ^(
echo         echo [Error] Failed to generate Prisma client
echo         pause
echo         exit /b %%errorlevel%%
echo     ^)
echo     call npx prisma db push
echo     if %%errorlevel%% neq 0 ^(
echo         echo [Error] Failed to create database
echo         pause
echo         exit /b %%errorlevel%%
echo     ^)
echo ^) else ^(
echo     echo [Database] Using existing database
echo     cd ..
echo ^)
echo echo [Server] Starting application...
echo start http://localhost:3000
echo node server.js
) > offline-build\start-app.bat

echo [Success] Offline package is ready in the 'offline-build' folder!
echo [Info] Copy the entire 'offline-build' folder to use the application on another computer
pause