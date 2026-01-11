import pandas as pd

INPUT_CSV = "movies.csv"
OUTPUT_CSV = "movies_normalized.csv"

CHUNK_SIZE = 100_000  # aumenta o diminuisci se serve


def normalize_movies_csv():
    print("📥 Normalizzazione movies.csv in corso...")

    first_chunk = True

    for chunk in pd.read_csv(
        INPUT_CSV,
        chunksize=CHUNK_SIZE
    ):
        # Prende SOLO le prime due colonne qualunque esse siano
        normalized = chunk.iloc[:, :2]

        # Rinomina esplicitamente (difesa extra)
        normalized.columns = ["id", "name"]

        normalized.to_csv(
            OUTPUT_CSV,
            mode="w" if first_chunk else "a",
            index=False,
            header=first_chunk
        )

        first_chunk = False

    print(f"✅ File normalizzato creato: {OUTPUT_CSV}")


if __name__ == "__main__":
    normalize_movies_csv()
