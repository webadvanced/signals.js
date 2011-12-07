@echo off
set PATH=\
echo Running jsHint
C:\Windows\System32\cscript.exe jsHint\wsh.js signals.js
echo Running ajaxMin
minify\ajaxmin signals.js -o ..\signals.min.js -clobber
echo Generating docs
"C:\Program Files (x86)\Java\jre7\bin\java.exe" -jar jsdoc-toolkit\jsrun.jar jsdoc-toolkit\app\run.js -a -t=jsdoc-toolkit\templates\jsdoc-simple -d=..\docs signals.js
echo ----------------------------------------------
