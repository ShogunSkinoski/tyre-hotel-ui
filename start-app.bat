@echo off
chcp 65001 > nul

:: Store the current directory
set "CURRENT_DIR=%CD%"

:: Static IP configuration
set IP=192.168.1.100

echo [Güvenlik Duvarı] Kurallar kontrol ediliyor...
:: Allow inbound HTTP
netsh advfirewall firewall show rule name="TyreHotel-HTTP" > nul 2>&1
if %errorlevel% neq 0 (
    echo [Güvenlik Duvarı] HTTP kuralı ekleniyor...
    netsh advfirewall firewall add rule name="TyreHotel-HTTP" dir=in action=allow protocol=TCP localport=3000 enable=yes
)

:: Allow outbound HTTP
netsh advfirewall firewall show rule name="TyreHotel-HTTP-Out" > nul 2>&1
if %errorlevel% neq 0 (
    echo [Güvenlik Duvarı] HTTP çıkış kuralı ekleniyor...
    netsh advfirewall firewall add rule name="TyreHotel-HTTP-Out" dir=out action=allow protocol=TCP localport=3000 enable=yes
)

:: Allow all inbound connections for Node
netsh advfirewall firewall show rule name="TyreHotel-Node" > nul 2>&1
if %errorlevel% neq 0 (
    echo [Güvenlik Duvarı] Node.js kuralı ekleniyor...
    netsh advfirewall firewall add rule name="TyreHotel-Node" dir=in action=allow program="%ProgramFiles%\nodejs\node.exe" enable=yes
)

:: Temporarily disable firewall for testing
echo [Güvenlik Duvarı] Test için geçici olarak devre dışı bırakılıyor...
netsh advfirewall set allprofiles state off

echo [Erişim Kontrol]
netstat -ano | findstr ":3000" > nul
if %errorlevel% equ 0 (
    echo [Uyarı] Port 3000 kullanımda. Mevcut işlem sonlandırılıyor...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
        taskkill /F /PID %%a
    )
    timeout /t 2 /nobreak > nul
)

echo [Ağ Ayarları]
echo HOST=0.0.0.0 > .env.local
echo PORT=3000 >> .env.local
echo HOSTNAME=0.0.0.0 >> .env.local
echo NEXTAUTH_URL=http://%IP%:3000 >> .env.local

echo [Bilgi] Uygulama başlatılıyor...
echo.
echo [Erişim Bilgileri]
echo ----------------------------------------
echo Yerel Ağ Adresi: http://%IP%:3000
echo.
echo [Diğer Cihazlardan Erişim]
echo 1. Aynı WiFi ağına bağlı olduğunuzdan emin olun
echo 2. Tarayıcıdan http://%IP%:3000 adresini açın
echo 3. Eğer bağlanamazsanız:
echo    - Windows Güvenlik Duvarı'nı kontrol edin
echo    - Antivirüs programını geçici olarak kapatın
echo    - Telefonun WiFi ayarlarını kontrol edin
echo ----------------------------------------
echo.

set HOSTNAME=0.0.0.0
set PORT=3000
set HOST=0.0.0.0

echo [Bilgi] Çıkmak için Ctrl+C tuşlarına basın...
cmd /k "cd /d "%CURRENT_DIR%" && node server.js" 