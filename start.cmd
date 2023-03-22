@REM @echo off
@REM cls
@REM node .
@REM PAUSE
set count=0
:loop
set /a count=%count%+1
cls
node .
PAUSE
if %count% neq 100 goto loop