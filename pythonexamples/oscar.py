import pandas as pd
from rapidfuzz import process, fuzz
from collections import defaultdict

# ---------------- CONFIG ----------------
OSCAR_CSV = "the_oscar_awards.csv"
ACTORS_CSV = "actors.csv"
MOVIES_CSV = "movies_normalized.csv"
OUTPUT_CSV = "oscar_output.csv"

ACTOR_SIM_THRESHOLD = 90
MOVIE_SIM_THRESHOLD = 88
# ---------------------------------------


def normalize(text: str) -> str:
    if pd.isna(text):
        return ""
    return (
        str(text)
        .lower()
        .replace(".", "")
        .replace(",", "")
        .replace("'", "")
        .strip()
    )


def build_buckets(df, name_col, id_col):
    """
    Crea bucket per iniziale + mappa nome -> id
    """
    buckets = defaultdict(list)
    id_map = {}

    for _, row in df.iterrows():
        name = row[name_col]
        if not name:
            continue
        key = name[0]
        buckets[key].append(name)
        id_map[name] = int(row[id_col])

    return buckets, id_map


def main():
    print("📥 Loading CSV files...")
    oscar_df = pd.read_csv(OSCAR_CSV)
    actors_df = pd.read_csv(ACTORS_CSV)
    movies_df = pd.read_csv(MOVIES_CSV)

    print("🧹 Normalizing names...")
    oscar_df["name_norm"] = oscar_df["name"].apply(normalize)
    oscar_df["film_norm"] = oscar_df["film"].apply(normalize)

    actors_df["name_norm"] = actors_df["name"].apply(normalize)
    movies_df["name_norm"] = movies_df["name"].apply(normalize)

    # ================= ACTORS =================
    print("📦 Indexing actors...")
    actor_buckets, actor_id_map = build_buckets(
        actors_df, "name_norm", "id"
    )

    actor_cache = {}
    actor_ids = []

    print("🔗 Matching actors (optimized)...")
    for idx, row in oscar_df.iterrows():
        name = row["name_norm"]
        actor_id = None

        if name:
            if name in actor_cache:
                actor_id = actor_cache[name]
            else:
                key = name[0]
                candidates = actor_buckets.get(key, [])

                if candidates:
                    match = process.extractOne(
                        name,
                        candidates,
                        scorer=fuzz.token_sort_ratio
                    )
                    if match:
                        matched, score, _ = match
                        if score >= ACTOR_SIM_THRESHOLD:
                            actor_id = actor_id_map[matched]

                actor_cache[name] = actor_id

        actor_ids.append(actor_id)

        if idx % 2000 == 0 and idx > 0:
            print(f"  actors processed: {idx}")

    oscar_df["actor_id"] = actor_ids

    # ================= MOVIES =================
    print("📦 Indexing movies...")
    movie_buckets, movie_id_map = build_buckets(
        movies_df, "name_norm", "id"
    )

    movie_cache = {}
    movie_ids = []

    print("🎬 Matching movies (optimized)...")
    for idx, row in oscar_df.iterrows():
        name = row["film_norm"]
        movie_id = None

        if name:
            if name in movie_cache:
                movie_id = movie_cache[name]
            else:
                key = name[0]
                candidates = movie_buckets.get(key, [])

                if candidates:
                    match = process.extractOne(
                        name,
                        candidates,
                        scorer=fuzz.token_sort_ratio
                    )
                    if match:
                        matched, score, _ = match
                        if score >= MOVIE_SIM_THRESHOLD:
                            movie_id = movie_id_map[matched]

                movie_cache[name] = movie_id

        movie_ids.append(movie_id)

        if idx % 2000 == 0 and idx > 0:
            print(f"  movies processed: {idx}")

    oscar_df["movie_id"] = movie_ids

    # ================= CLEANUP =================
    oscar_df.drop(columns=["name_norm", "film_norm"], inplace=True)

    oscar_df["actor_id"] = oscar_df["actor_id"].astype("Int64")
    oscar_df["movie_id"] = oscar_df["movie_id"].astype("Int64")

    print(f"💾 Writing output to {OUTPUT_CSV}")
    oscar_df.to_csv(OUTPUT_CSV, index=False)

    print("✅ Done.")
    print(f"Actor matches : {oscar_df['actor_id'].notna().sum()}/{len(oscar_df)}")
    print(f"Movie matches : {oscar_df['movie_id'].notna().sum()}/{len(oscar_df)}")


if __name__ == "__main__":
    main()
