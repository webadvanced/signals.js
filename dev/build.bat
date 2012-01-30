@echo off
set PATH=\
echo Running jsHint
C:\Windows\System32\cscript.exe jsHint\wsh.js signals.js
echo Running ajaxMin
minify\ajaxmin signals.js -o ..\signals.min.js -clobber
echo Generating docs
"C:\Program Files (x86)\Java\jre7\bin\java.exe" -jar jsdoc-toolkit\jsrun.jar jsdoc-toolkit\app\run.js -a -t=jsdoc-toolkit\templates\jsdoc-simple -d=..\docs signals.js
echo building nuget package
copy ..\signals.min.js ".nuget\content\Scripts"
copy signals.js ".nuget\content\Scripts"
.nuget\NuGet Pack .nuget\Signals.js.nuspec -OutputDirectory .nuget\
echo ----------------------------------------------
