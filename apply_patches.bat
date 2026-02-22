@echo off
echo Applying all patches to fitness-tracker...
echo.

if not exist "src\navigation\TabNavigator.tsx" (
  echo ERROR: Run this script from inside your fitness-tracker folder!
  echo Example: cd C:\Users\User\Downloads\fitness-tracker
  pause
  exit /b 1
)

:: Copy all patched files - assumes downloads are in the same folder as this bat
set SCRIPT_DIR=%~dp0

copy /Y "%SCRIPT_DIR%TabNavigator.tsx"         "src\navigation\TabNavigator.tsx"
copy /Y "%SCRIPT_DIR%AddExerciseModal.tsx"      "src\components\AddExerciseModal.tsx"
copy /Y "%SCRIPT_DIR%ExercisePicker.tsx"        "src\components\ExercisePicker.tsx"
copy /Y "%SCRIPT_DIR%ExerciseCard.tsx"          "src\components\ExerciseCard.tsx"
copy /Y "%SCRIPT_DIR%EntryRow.tsx"              "src\components\EntryRow.tsx"
copy /Y "%SCRIPT_DIR%DayDetail.tsx"             "src\components\DayDetail.tsx"
copy /Y "%SCRIPT_DIR%ExerciseDetailScreen.tsx"  "src\screens\ExerciseDetailScreen.tsx"
copy /Y "%SCRIPT_DIR%TodayScreen.tsx"           "src\screens\TodayScreen.tsx"
copy /Y "%SCRIPT_DIR%CalendarScreen.tsx"        "src\screens\CalendarScreen.tsx"
copy /Y "%SCRIPT_DIR%exercises.ts"              "src\constants\exercises.ts"
copy /Y "%SCRIPT_DIR%logEntries.ts"             "src\db\logEntries.ts"
copy /Y "%SCRIPT_DIR%db_exercises.ts"           "src\db\exercises.ts"

echo.
echo All files patched!
echo.
echo Now run:  npx expo start --clear
echo.
pause
