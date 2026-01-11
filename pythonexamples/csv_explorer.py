#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CSV Explorer — un'app Streamlit super comoda per esplorare, cercare e graficare CSV.
Avvio:
    streamlit run csv_explorer.py
Oppure con percorso file:
    streamlit run csv_explorer.py -- --path /percorso/al/file.csv
"""

import argparse
import io
import os
import sys
from datetime import datetime
from typing import Optional, Tuple, List

import pandas as pd
import streamlit as st
import plotly.express as px

# Opzionale ma utile per rilevare encoding e delimitatore
try:
    import chardet
except Exception:
    chardet = None

# AgGrid per tabella interattiva "fighissima"
try:
    from st_aggrid import AgGrid, GridOptionsBuilder, GridUpdateMode, DataReturnMode
except Exception:
    AgGrid = None
    GridOptionsBuilder = None
    GridUpdateMode = None
    DataReturnMode = None


# -------------------------- Utility --------------------------

def detect_encoding_and_sep(raw_bytes: bytes) -> Tuple[str, str]:
    """Prova a dedurre encoding e separatore del CSV."""
    # Encoding
    enc = "utf-8"
    if chardet is not None:
        try:
            enc_guess = chardet.detect(raw_bytes)
            if enc_guess and enc_guess.get("encoding"):
                enc = enc_guess["encoding"]
        except Exception:
            pass

    # Separatore: prova una piccola euristica
    sample = raw_bytes[:20000].decode(enc, errors="ignore")
    candidates = [",", ";", "\t", "|"]
    best = ","
    best_count = -1
    for c in candidates:
        count = sample.count(c)
        if count > best_count:
            best = c
            best_count = count
    return enc, best


def load_csv(file_bytes: bytes, sheet_name: Optional[str] = None) -> pd.DataFrame:
    """Legge un CSV robustamente (anche grandi) con pyarrow se disponibile."""
    enc, sep = detect_encoding_and_sep(file_bytes)
    # Rileva pyarrow in modo sicuro (senza toccare pandas.options)
    has_pyarrow = False
    try:
        import pyarrow  # noqa: F401
        has_pyarrow = True
    except Exception:
        has_pyarrow = False

    try:
        df = pd.read_csv(
            io.BytesIO(file_bytes),
            encoding=enc,
            sep=sep,
            engine="pyarrow" if has_pyarrow else None,
            low_memory=False
        )
    except Exception:
        # fallback
        df = pd.read_csv(
            io.BytesIO(file_bytes),
            encoding=enc,
            sep=sep,
            low_memory=False
        )
    return df


def apply_global_search(df: pd.DataFrame, query: str) -> pd.DataFrame:
    """Filtro semplice su tutte le colonne come stringa (case-insensitive)."""
    if not query:
        return df
    query = query.strip().lower()
    mask = pd.Series(False, index=df.index)
    for col in df.columns:
        try:
            mask |= df[col].astype(str).str.lower().str.contains(query, na=False)
        except Exception:
            continue
    return df[mask]


def infer_datetime_columns(df: pd.DataFrame) -> List[str]:
    candidates = []
    for col in df.columns:
        series = df[col]
        # prova a convertire in datetime in maniera permissiva
        try:
            pd.to_datetime(series, errors="raise", utc=False, infer_datetime_format=True)
            candidates.append(col)
        except Exception:
            pass
    return candidates


# -------------------------- UI --------------------------

def page_header():
    st.set_page_config(page_title="CSV Explorer", layout="wide", initial_sidebar_state="expanded")
    st.title("🧭 CSV Explorer")
    st.caption("Visualizza, filtra, cerca e genera grafici dai tuoi CSV — **in modo fighissimo**.")


def sidebar_controls() -> Optional[pd.DataFrame]:
    st.sidebar.header("📂 Sorgente dati")
    uploaded = st.sidebar.file_uploader("Carica un CSV", type=["csv"])

    st.sidebar.markdown("**oppure**")

    path = st.sidebar.text_input("Percorso locale del CSV", value="")
    df = None

    if uploaded is not None:
        file_bytes = uploaded.getvalue()
        df = load_csv(file_bytes)
        st.sidebar.success(f"Caricato: {uploaded.name}")
    elif path:
        if os.path.exists(path) and os.path.isfile(path):
            with open(path, "rb") as f:
                file_bytes = f.read()
            df = load_csv(file_bytes)
            st.sidebar.success(f"Caricato: {os.path.basename(path)}")
        else:
            st.sidebar.error("Percorso non valido o file inesistente.")

    st.sidebar.divider()
    st.sidebar.header("⚙️ Opzioni")
    sample_rows = st.sidebar.number_input("Anteprima (righe):", min_value=100, max_value=100000, value=2000, step=100)
    st.sidebar.caption("Per file molto grandi, mostra inizialmente solo un campione per performance.")

    return df, sample_rows


def show_dataframe(df: pd.DataFrame, sample_rows: int) -> pd.DataFrame:
    st.subheader("🗂️ Dati")
    nrows = len(df)
    st.caption(f"Righe: **{nrows:,}** · Colonne: **{len(df.columns):,}**")

    # Ricerca globale semplice
    global_query = st.text_input("🔎 Ricerca veloce (tutte le colonne)", placeholder="Cerca testo...")
    dff = apply_global_search(df, global_query)

    # Selezione colonne visibili
    with st.expander("Mostra/Nascondi colonne"):
        selected_cols = st.multiselect("Colonne da visualizzare", options=list(dff.columns), default=list(dff.columns))
        if selected_cols:
            dff = dff[selected_cols]

    # AgGrid se disponibile per filtro/ordinamento avanzato
    use_aggrid = AgGrid is not None and GridOptionsBuilder is not None
    if use_aggrid:
        gb = GridOptionsBuilder.from_dataframe(dff.head(sample_rows if len(dff) > sample_rows else len(dff)))
        gb.configure_default_column(enablePivot=True, enableValue=True, enableRowGroup=True, filter=True, sortable=True, resizable=True)
        gb.configure_grid_options(domLayout="normal", enableRangeSelection=True)
        gb.configure_grid_options(quickFilterText=global_query if global_query else "")
        grid_options = gb.build()

        st.caption("Suggerimento: usa la **Quick Filter** in alto a destra della tabella per filtrare al volo.")
        grid_return = AgGrid(
            dff if len(dff) <= sample_rows else dff.head(sample_rows),
            gridOptions=grid_options,
            enable_enterprise_modules=False,
            data_return_mode=DataReturnMode.FILTERED_AND_SORTED,
            update_mode=GridUpdateMode.MANUAL,
            fit_columns_on_grid_load=True,
            height=500,
            allow_unsafe_jscode=True,
            theme="balham"
        )
        # Dati filtrati/sortati nella griglia
        grid_df = grid_return["data"]
        st.download_button("⬇️ Scarica dati mostrati (CSV)", data=grid_df.to_csv(index=False).encode("utf-8"), file_name="dati_filtrati.csv", mime="text/csv")
        return grid_df
    else:
        st.warning("Installare **st-aggrid** per una tabella più potente (filtri, raggruppamenti, quick search).")
        st.dataframe(dff.head(sample_rows))
        st.download_button("⬇️ Scarica dati mostrati (CSV)", data=dff.head(sample_rows).to_csv(index=False).encode("utf-8"), file_name="dati_anteprima.csv", mime="text/csv")
        return dff


def show_summary(df: pd.DataFrame):
    st.subheader("📊 Panoramica")
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.metric("Righe", f"{len(df):,}")
    with c2:
        st.metric("Colonne", f"{len(df.columns):,}")
    with c3:
        nulls = int(df.isna().sum().sum())
        st.metric("Valori null", f"{nulls:,}")
    with c4:
        mem_mb = df.memory_usage(index=True, deep=True).sum() / (1024 ** 2)
        st.metric("Memoria stimata", f"{mem_mb:,.2f} MB")

    with st.expander("Statistiche descrittive"):
        try:
            desc = df.describe(include="all", datetime_is_numeric=True).transpose()
        except TypeError:
            # Compatibilità con versioni di pandas che non supportano datetime_is_numeric
            desc = df.describe(include="all").transpose()
        st.write(desc)

    with st.expander("Correlazioni (numeric only)"):
        num_df = df.select_dtypes(include="number")
        if not num_df.empty:
            corr = num_df.corr(numeric_only=True)
            fig = px.imshow(corr, title="Matrice di correlazione", aspect="auto")
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("Nessuna colonna numerica per calcolare le correlazioni.")


def show_charts(df: pd.DataFrame):
    st.subheader("📈 Generatore di grafici")
    st.caption("Crea grafici **in pochi clic**.")

    cols = list(df.columns)
    numeric_cols = list(df.select_dtypes(include="number").columns)
    datetime_cols = infer_datetime_columns(df)

    chart_type = st.selectbox("Tipo di grafico", ["line", "bar", "scatter", "histogram", "box", "violin", "area", "pie", "scatter_matrix"])

    c1, c2 = st.columns(2)
    with c1:
        x_col = st.selectbox("Asse X", options=["(nessuno)"] + cols, index=0 if not cols else 1)
    with c2:
        y_col = st.selectbox("Asse Y (una o multiple)", options=["(nessuno)"] + numeric_cols, index=0 if not numeric_cols else 1)

    color = st.selectbox("Colore (categorico)", options=["(nessuno)"] + cols, index=0)
    aggfunc = st.selectbox("Aggregazione (per bar/area/line)", ["none", "sum", "mean", "median", "count", "min", "max"], index=0)

    df_plot = df.copy()

    # Se X è una colonna datetime-like, convertila
    if x_col != "(nessuno)" and x_col in datetime_cols:
        try:
            df_plot[x_col] = pd.to_datetime(df_plot[x_col], errors="coerce")
        except Exception:
            pass

    fig = None
    try:
        if chart_type == "histogram":
            fig = px.histogram(df_plot, x=None if x_col == "(nessuno)" else x_col, color=None if color == "(nessuno)" else color, marginal="rug")
        elif chart_type == "box":
            fig = px.box(df_plot, x=None if x_col == "(nessuno)" else x_col, y=None if y_col == "(nessuno)" else y_col, color=None if color == "(nessuno)" else color, points="outliers")
        elif chart_type == "violin":
            fig = px.violin(df_plot, x=None if x_col == "(nessuno)" else x_col, y=None if y_col == "(nessuno)" else y_col, color=None if color == "(nessuno)" else color, box=True, points="all")
        elif chart_type == "pie":
            # per pie serve un nome e un valore
            if x_col == "(nessuno)" or y_col == "(nessuno)":
                st.info("Per il grafico a torta seleziona una categoria per X e un valore numerico per Y.")
            else:
                # Aggrega per categoria
                agg_map = {"sum": "sum", "mean": "mean", "median": "median", "count": "count", "min": "min", "max": "max", "none": "sum"}
                dfa = df_plot.groupby(x_col)[y_col].agg(agg_map[aggfunc]).reset_index()
                fig = px.pie(dfa, names=x_col, values=y_col, title=f"{y_col} per {x_col} ({aggfunc})")
        elif chart_type == "scatter_matrix":
            num_df = df_plot.select_dtypes(include="number")
            if num_df.shape[1] >= 2:
                fig = px.scatter_matrix(num_df, title="Scatter Matrix (numeriche)")
            else:
                st.info("Servono almeno 2 colonne numeriche per la scatter matrix.")
        else:
            # line / bar / scatter / area
            if x_col == "(nessuno)" and y_col != "(nessuno)":
                # Usa indice come X
                x_col_actual = df_plot.index.name or "index"
                df_plot = df_plot.reset_index()
                x_col_use = "index"
            else:
                x_col_use = None if x_col == "(nessuno)" else x_col

            if aggfunc != "none" and x_col_use is not None and y_col != "(nessuno)":
                agg_map = {"sum": "sum", "mean": "mean", "median": "median", "count": "count", "min": "min", "max": "max"}
                dfa = df_plot.groupby(x_col_use)[y_col].agg(agg_map[aggfunc]).reset_index()
            else:
                dfa = df_plot

            if chart_type == "line":
                fig = px.line(dfa, x=x_col_use, y=None if y_col == "(nessuno)" else y_col, color=None if color == "(nessuno)" else color)
            elif chart_type == "bar":
                fig = px.bar(dfa, x=x_col_use, y=None if y_col == "(nessuno)" else y_col, color=None if color == "(nessuno)" else color, barmode="group")
            elif chart_type == "area":
                fig = px.area(dfa, x=x_col_use, y=None if y_col == "(nessuno)" else y_col, color=None if color == "(nessuno)" else color)
            elif chart_type == "scatter":
                fig = px.scatter(dfa, x=x_col_use, y=None if y_col == "(nessuno)" else y_col, color=None if color == "(nessuno)" else color)

        if fig is not None:
            st.plotly_chart(fig, use_container_width=True)
    except Exception as e:
        st.error(f"Errore nella creazione del grafico: {e}")


def show_extras(df: pd.DataFrame):
    st.subheader("🧰 Extra utili")
    c1, c2, c3 = st.columns(3)
    with c1:
        if st.button("🧼 Pulisci spazi/testo (trim)"):
            for col in df.select_dtypes(include=["object"]).columns:
                df[col] = df[col].astype(str).str.strip()
            st.success("Fatto!")
    with c2:
        if st.button("🕳️ Riempi NaN (vuoto)"):
            df.fillna("", inplace=True)
            st.success("Fatto!")
    with c3:
        if st.button("📤 Esporta CSV (tutto)"):
            st.download_button(
                "Scarica CSV",
                data=df.to_csv(index=False).encode("utf-8"),
                file_name=f"export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                mime="text/csv",
                use_container_width=True
            )


def main():
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--path", type=str, default="", help="Percorso a un CSV da caricare all'avvio.")
    # Riconosci gli argomenti dopo '--' per non disturbare Streamlit
    known, _ = parser.parse_known_args()

    page_header()
    df, sample_rows = sidebar_controls()

    # Fallback: se non caricato da sidebar e c'è un path da CLI
    if df is None and known.path:
        if os.path.exists(known.path):
            with open(known.path, "rb") as f:
                df = load_csv(f.read())
            st.sidebar.success(f"Caricato da --path: {os.path.basename(known.path)}")
        else:
            st.sidebar.error(f"File non trovato: {known.path}")

    if df is None:
        st.info("Carica un CSV dalla sidebar o passa --path quando avvii l'app.")
        st.stop()

    # Mostra riassunto e tabella interattiva
    show_summary(df)
    filtered_df = show_dataframe(df, sample_rows)

    st.divider()
    show_charts(filtered_df)

    st.divider()
    show_extras(filtered_df)


if __name__ == "__main__":
    main()
