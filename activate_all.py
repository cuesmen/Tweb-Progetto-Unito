#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
activate_all.py
- Fix Windows command resolution (`cmd /c`).
- Pulisce le sequenze colore ANSI (tipo [32m) nella console della GUI per output più leggibile.
- Aggiunge un toggle globale "Mostra colori ANSI (raw)" per vedere l'output grezzo se serve.
"""

import os
import sys
import threading
import subprocess
import queue
import shutil
import time
import re
from pathlib import Path
import platform
import signal
import tkinter as tk
from tkinter import ttk
from tkinter.scrolledtext import ScrolledText

APP_TITLE = "Activate All — Frontend | Express | Spring Boot"
ROOT_DIR = Path(__file__).resolve().parent

# ---- Theme colors ----
BG_APP = "#0b1020"
BG_CARD = "#0f172a"
FG_TEXT = "#e5e7eb"

ANSI_REGEX = re.compile(r'\x1B\[[0-?]*[ -/]*[@-~]')

def is_windows() -> bool:
    return platform.system().lower().startswith("win")

def find_executable(cmd: str) -> bool:
    return shutil.which(cmd) is not None

def win_wrap(cmd_list: list[str]) -> list[str]:
    """Su Windows esegui i comandi tramite 'cmd /c' per compatibilità con *.cmd/.bat."""
    if is_windows():
        return ["cmd", "/c"] + cmd_list
    return cmd_list

def spring_boot_command(spring_dir: Path):
    """
    Preferisci Maven se presente (pom.xml). Wrapper > sistema.
    Fallback a Gradle wrapper se presente.
    """
    pom = spring_dir / "pom.xml"
    gradle_build = spring_dir / "build.gradle"
    gradle_kts = spring_dir / "build.gradle.kts"

    if pom.exists():
        mvnw = spring_dir / ("mvnw.cmd" if is_windows() else "mvnw")
        if mvnw.exists():
            return (win_wrap([str(mvnw), "spring-boot:run"]), "Maven spring-boot:run (wrapper)")
        if find_executable("mvn"):
            return (win_wrap(["mvn", "spring-boot:run"]), "Maven spring-boot:run (system mvn)")
        return (None, "Maven non trovato: aggiungi mvnw al progetto o installa mvn nel PATH.")

    gradlew = spring_dir / ("gradlew.bat" if is_windows() else "gradlew")
    if gradlew.exists() and (gradle_build.exists() or gradle_kts.exists()):
        return (win_wrap([str(gradlew), "bootRun"]), "Gradle bootRun (wrapper)")

    if find_executable("mvn"):
        return (win_wrap(["mvn", "spring-boot:run"]), "Maven spring-boot:run (system mvn)")

    return (None, "Nessun Maven/Gradle trovato: installa Maven o aggiungi il wrapper al progetto.")

class ProcPanel(ttk.Frame):
    def __init__(self, master, title: str, workdir: Path, cmd: list[str] | None, cmd_label: str, strip_ansi_var: tk.BooleanVar, *args, **kwargs):
        super().__init__(master, *args, **kwargs)
        self.title = title
        self.workdir = workdir
        self.cmd = cmd
        self.cmd_label = cmd_label
        self.strip_ansi_var = strip_ansi_var
        self.process: subprocess.Popen | None = None
        self.out_queue = queue.Queue()
        self.reader_thread: threading.Thread | None = None
        self._build_ui()

    def _build_ui(self):
        self["padding"] = (14, 12, 14, 12)
        self["style"] = "Card.TFrame"

        header = ttk.Frame(self, style="Card.TFrame")
        header.pack(fill="x")

        self.status_dot = tk.Canvas(header, width=14, height=14, highlightthickness=0, bg=BG_CARD, bd=0, relief="flat")
        self._set_status("stopped")
        self.status_dot.pack(side="left", padx=(0, 8))

        title_lbl = ttk.Label(header, text=self.title, style="Title.TLabel")
        title_lbl.pack(side="left")

        self.cmd_lbl = ttk.Label(header, text=f"— {self.cmd_label}", style="Cmd.TLabel")
        self.cmd_lbl.pack(side="left", padx=(6, 0))

        header_buttons = ttk.Frame(header, style="Card.TFrame")
        header_buttons.pack(side="right")

        self.start_btn = ttk.Button(header_buttons, text="▶ Start", command=self.start, style="Start.TButton")
        self.start_btn.pack(side="left", padx=4)

        self.stop_btn = ttk.Button(header_buttons, text="■ Stop", command=self.stop, style="Stop.TButton", state="disabled")
        self.stop_btn.pack(side="left", padx=4)

        self.console = ScrolledText(self, height=14, wrap="word", background=BG_CARD, foreground=FG_TEXT, insertbackground=FG_TEXT)
        self.console.configure(font=("Consolas", 10), padx=10, pady=10, borderwidth=0, relief="flat")
        self.console.pack(fill="both", expand=True, pady=(10, 0))

        cwd_lbl = ttk.Label(self, text=str(self.workdir), style="Path.TLabel")
        cwd_lbl.pack(anchor="w", pady=(8, 0))

        self.after(80, self._drain_queue)

    def _set_status(self, state: str):
        self.status_dot.delete("all")
        color = {"running":"#22c55e", "starting":"#f59e0b"}.get(state, "#ef4444")
        self.status_dot.create_oval(2, 2, 12, 12, fill=color, outline=color)

    def append_line(self, text: str):
        if self.strip_ansi_var.get():
            text = ANSI_REGEX.sub('', text)
        self.console.insert("end", text)
        self.console.see("end")

    def _reader(self):
        assert self.process is not None
        with self.process.stdout, self.process.stderr:
            for line in self.process.stdout:
                try:
                    self.out_queue.put(("STDOUT", line.decode(errors="replace")))
                except Exception:
                    pass
            if self.process.stderr:
                for line in self.process.stderr:
                    try:
                        self.out_queue.put(("STDERR", line.decode(errors="replace")))
                    except Exception:
                        pass

    def _drain_queue(self):
        try:
            while True:
                src, text = self.out_queue.get_nowait()
                self.append_line(text)
        except queue.Empty:
            pass

        if self.process is not None:
            code = self.process.poll()
            if code is not None:
                self._set_status("stopped")
                self.start_btn["state"] = "normal"
                self.stop_btn["state"] = "disabled"
                self.append_line(f"\n[exit code {code}]\n")
                self.process = None

        self.after(80, self._drain_queue)

    def start(self):
        if self.process is not None:
            return
        if self.cmd is None or len(self.cmd) == 0:
            self.append_line("❌ Comando non disponibile. Verifica la configurazione.\n")
            return
        try:
            self._set_status("starting")
            env_path = os.environ.get("PATH", "")
            self.append_line(f"PATH= {env_path}\n")
            self.append_line(f"➜ avvio: {' '.join(self.cmd)}  (cwd: {self.workdir})\n\n")

            popen_kwargs = dict(
                args=self.cmd,
                cwd=self.workdir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                shell=False,
            )
            if is_windows():
                popen_kwargs["creationflags"] = subprocess.CREATE_NEW_PROCESS_GROUP  # type: ignore[attr-defined]

            self.process = subprocess.Popen(**popen_kwargs)  # type: ignore[arg-type]

            self.start_btn["state"] = "disabled"
            self.stop_btn["state"] = "normal"
            self._set_status("running")
            self.reader_thread = threading.Thread(target=self._reader, daemon=True)
            self.reader_thread.start()
        except FileNotFoundError as e:
            self._set_status("stopped")
            self.append_line(f"❌ Eseguibile non trovato: {e}\n")
        except Exception as e:
            self._set_status("stopped")
            self.append_line(f"❌ Errore di avvio: {e}\n")

    def stop(self):
        if self.process is None:
            return
        self.append_line("\n⏹ arresto in corso...\n")
        try:
            if is_windows():
                try:
                    self.process.send_signal(signal.CTRL_BREAK_EVENT)  # type: ignore[attr-defined]
                except Exception:
                    self.process.terminate()
            else:
                self.process.terminate()

            for _ in range(30):
                if self.process.poll() is not None:
                    break
                time.sleep(0.1)

            if self.process.poll() is None:
                self.process.kill()
        except Exception as e:
            self.append_line(f"⚠️  Errore durante lo stop: {e}\n")
        finally:
            self._set_status("stopped")
            self.start_btn["state"] = "normal"
            self.stop_btn["state"] = "disabled"
            self.append_line("✓ processo terminato\n")
            self.process = None

class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title(APP_TITLE)
        self.geometry("1100x860")
        self.minsize(900, 720)
        self.strip_ansi_var = tk.BooleanVar(value=True)
        self._init_style()
        self._build()

    def _init_style(self):
        self.configure(bg=BG_APP)
        style = ttk.Style(self)
        style.theme_use("clam")
        style.configure(".", background=BG_APP, foreground=FG_TEXT)
        style.configure("Card.TFrame", background=BG_CARD, relief="flat")
        style.configure("Title.TLabel", font=("Segoe UI", 14, "bold"), foreground=FG_TEXT, background=BG_CARD)
        style.configure("Cmd.TLabel", font=("Segoe UI", 11), foreground="#93c5fd", background=BG_CARD)
        style.configure("Path.TLabel", font=("Segoe UI", 9), foreground="#94a3b8", background=BG_CARD)
        style.configure("Start.TButton", padding=(10, 6), relief="flat", font=("Segoe UI", 11, "bold"))
        style.configure("Stop.TButton", padding=(10, 6), relief="flat", font=("Segoe UI", 11, "bold"))
        style.map("Start.TButton",
                  background=[("!disabled", "#22c55e"), ("disabled", "#14532d")],
                  foreground=[("!disabled", BG_APP), ("disabled", BG_APP)])
        style.map("Stop.TButton",
                  background=[("!disabled", "#ef4444"), ("disabled", "#4c0519")],
                  foreground=[("!disabled", BG_APP), ("disabled", BG_APP)])

    def _build(self):
        container = ttk.Frame(self, padding=16, style="Card.TFrame")
        container.pack(fill="both", expand=True, padx=16, pady=16)

        header = ttk.Frame(container, style="Card.TFrame")
        header.pack(fill="x")
        title = ttk.Label(header, text="Launcher Workspace", style="Title.TLabel")
        title.pack(side="left")
        subtitle = ttk.Label(header, text=" — controlla e osserva i 3 processi live", style="Cmd.TLabel")
        subtitle.pack(side="left", padx=(6,0))

        # Global options
        opts = ttk.Frame(container, style="Card.TFrame")
        opts.pack(fill="x", pady=(8, 8))
        cb = ttk.Checkbutton(opts, text="Mostra colori ANSI (raw)", variable=self.strip_ansi_var, onvalue=False, offvalue=True)
        cb.pack(side="left")

        grid = ttk.Frame(container, style="Card.TFrame")
        grid.pack(fill="both", expand=True, pady=(8, 0))

        grid.columnconfigure(0, weight=1, uniform="col")
        grid.columnconfigure(1, weight=1, uniform="col")
        grid.rowconfigure(0, weight=1)
        grid.rowconfigure(1, weight=1)

        fe_dir = ROOT_DIR / "Frontend"
        fe_cmd = win_wrap(["npm", "run", "dev"])
        self.frontend = ProcPanel(grid, "Frontend (React)", fe_dir, fe_cmd, "npm run dev", self.strip_ansi_var)
        self.frontend.grid(row=0, column=0, sticky="nsew", padx=(0, 8), pady=(0, 8))

        ex_dir = ROOT_DIR / "MainServerExpress"
        ex_cmd = win_wrap(["npm", "run", "dev"])
        self.express = ProcPanel(grid, "MainServerExpress (Express)", ex_dir, ex_cmd, "npm run dev", self.strip_ansi_var)
        self.express.grid(row=0, column=1, sticky="nsew", padx=(8, 0), pady=(0, 8))

        sp_dir = ROOT_DIR / "Springboot"
        sp_cmd, sp_label = spring_boot_command(sp_dir)
        self.spring = ProcPanel(grid, "Springboot (Java)", sp_dir, sp_cmd, sp_label, self.strip_ansi_var)
        self.spring.grid(row=1, column=0, columnspan=2, sticky="nsew", pady=(8, 0))

        footer = ttk.Frame(container, style="Card.TFrame")
        footer.pack(fill="x", pady=(12, 0))

        start_all = ttk.Button(footer, text="▶ Avvia tutti", command=self.start_all, style="Start.TButton")
        start_all.pack(side="left", padx=(0, 8))

        stop_all = ttk.Button(footer, text="■ Stop tutti", command=self.stop_all, style="Stop.TButton")
        stop_all.pack(side="left")

        tips = ttk.Label(footer,
                         text="Windows: output pulito da codici ANSI (disattiva per raw). Assicurati che npm, Java e Maven siano nel PATH.",
                         style="Path.TLabel")
        tips.pack(side="right")

    def start_all(self):
        self.frontend.start()
        self.express.start()
        self.spring.start()

    def stop_all(self):
        self.frontend.stop()
        self.express.stop()
        self.spring.stop()

def main():
    try:
        app = App()
        app.mainloop()
    except KeyboardInterrupt:
        pass

if __name__ == "__main__":
    main()
