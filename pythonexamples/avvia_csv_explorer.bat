@echo off
REM === Attiva venv se presente ===
if exist ".venv\Scripts\activate.bat" (
    call .venv\Scripts\activate.bat
)

REM === Avvia Streamlit sul tuo script ===
streamlit run csv_explorer.py

REM === Mantieni la finestra aperta dopo l'esecuzione ===
pause
