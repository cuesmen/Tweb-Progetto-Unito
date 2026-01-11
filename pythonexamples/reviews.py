import pandas as pd
import re

MOVIES_CSV = "movies.csv"
REVIEWS_CSV = "rotten_tomatoes_reviews.csv"

OUTPUT_CSV = "rotten_tomatoes_reviews_updated.csv"
NOT_FOUND_CSV = "rotten_tomatoes_reviews_not_found.csv"

CHUNK_SIZE = 100_000


# ---------------- NORMALIZZAZIONE ----------------

def normalize_title(title: str) -> str:
    if pd.isna(title):
        return ""
    title = title.lower()
    title = re.sub(r"[^\w\s]", "", title)
    title = re.sub(r"\s+", " ", title)
    return title.strip()


# ---------------- LOOKUP MOVIES ----------------

def build_movie_lookup():
    print("📥 Caricamento movies.csv...")

    movies = pd.read_csv(
        MOVIES_CSV,
        usecols=["id", "name"],
        dtype={"id": "int64"}
    )

    movies["norm_title"] = movies["name"].apply(normalize_title)

    lookup = (
        movies
        .drop_duplicates(subset="norm_title")
        .set_index("norm_title")["id"]
        .to_dict()
    )

    print(f"✅ Lookup costruita: {len(lookup)} titoli unici")
    return lookup


# ---------------- PROCESSING CHUNK ----------------

def process_reviews(lookup):
    print("🔄 Processing reviews a chunk...")

    first_chunk = True

    for chunk in pd.read_csv(REVIEWS_CSV, chunksize=CHUNK_SIZE):
        chunk["norm_title"] = chunk["movie_title"].apply(normalize_title)

        mapped = chunk["norm_title"].map(lookup)
        chunk["id"] = mapped.astype("Int64")

        # RIMUOVI movie_title e colonne inutili
        chunk = chunk.drop(columns=[
            "movie_title",
            "rotten_tomatoes_link",
            "norm_title"
        ])

        # id come prima colonna
        cols = ["id"] + [c for c in chunk.columns if c != "id"]
        chunk = chunk[cols]

        chunk.to_csv(
            OUTPUT_CSV,
            mode="w" if first_chunk else "a",
            index=False,
            header=first_chunk
        )

        first_chunk = False

    print("✅ Prima fase completata")


# ---------------- CLEANUP FINALE ----------------

def finalize_outputs():
    print("🧹 Pulizia finale e grouping not found...")

    df = pd.read_csv(OUTPUT_CSV)

    # righe con id mancante
    not_found = df[df["id"].isna()]

    # righe valide
    valid = df[df["id"].notna()].copy()

    # 🔥 FORZA id A INTERO (qui sta la magia)
    valid["id"] = valid["id"].astype("int64")

    # riscrivi output pulito
    valid.to_csv(OUTPUT_CSV, index=False)

    # grouping not found
    if not not_found.empty:
        original = pd.read_csv(
            REVIEWS_CSV,
            usecols=["movie_title"]
        ).iloc[not_found.index]

        nf_grouped = (
            original
            .groupby("movie_title")
            .size()
            .reset_index(name="count")
            .sort_values("count", ascending=False)
        )

        nf_grouped.to_csv(NOT_FOUND_CSV, index=False)

    print("✅ File finali:")
    print(" -", OUTPUT_CSV)
    print(" -", NOT_FOUND_CSV)


# ---------------- MAIN ----------------

if __name__ == "__main__":
    lookup = build_movie_lookup()
    process_reviews(lookup)
    finalize_outputs()
