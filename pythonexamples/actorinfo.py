
import csv
import json
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path

# ---------- Config ----------
ACTORS_FILE = "actors.csv"
OUTPUT_FILE = "output.csv"
OUT_FIXED_CSV = "test.csv"
OUT_FIXED_JSON = "test.json"
OUT_UNMATCHED_CSV = "unmatched.csv"
OUT_AUDIT_CSV = "matches_audit.csv"
JACCARD_THRESHOLD = 0.90  # prudente

# ---------- Utility ----------
def strip_accents(s: str) -> str:
    return "".join(ch for ch in unicodedata.normalize("NFKD", s) if not unicodedata.combining(ch))

def normalize_name(name: str) -> str:
    if not name:
        return ""
    s = strip_accents(name).lower()
    for p in ",.;:!?'\"()[]{}_/\\|-":
        s = s.replace(p, " ")
    return " ".join(s.split())

def tokens(name: str) -> list:
    return normalize_name(name).split()

def token_key(name: str) -> str:
    return " ".join(sorted(set(tokens(name))))

def comma_flipped_variants(name: str):
    if "," in name:
        left, right = [part.strip() for part in name.split(",", 1)]
        if left and right:
            yield f"{right} {left}"

def jaccard(a: set, b: set) -> float:
    if not a or not b:
        return 0.0
    inter = a & b
    union = a | b
    return len(inter) / len(union)

# ---------- Caricamento actors.csv ----------
def load_actors_index(path: Path):
    norm_index = defaultdict(set)   # nome normalizzato -> {id}
    token_index = defaultdict(set)  # token-set key -> {id}
    names_by_id = {}                # id -> name (audit)

    # utf-8-sig gestisce eventuale BOM
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)  # delimiter=',' per default, ok per "id","name"
        if not reader.fieldnames:
            print("ERRORE: actors.csv sembra vuoto o senza header.", file=sys.stderr)
            sys.exit(1)
        # forziamo i nomi esatti delle colonne che mi hai dato
        cols = {c.lower(): c for c in reader.fieldnames}
        id_col = cols.get("id")
        name_col = cols.get("name")
        if not id_col or not name_col:
            print("ERRORE: actors.csv deve avere colonne 'id' e 'name'.", file=sys.stderr)
            sys.exit(1)

        count = 0
        for row in reader:
            raw_id = (row.get(id_col) or "").strip()
            raw_name = (row.get(name_col) or "").strip()
            if not raw_id or not raw_name:
                continue
            names_by_id[raw_id] = raw_name

            n = normalize_name(raw_name)
            if n:
                norm_index[n].add(raw_id)
            tk = token_key(raw_name)
            if tk:
                token_index[tk].add(raw_id)

            # supporta "Cognome, Nome"
            for v in comma_flipped_variants(raw_name):
                n2 = normalize_name(v)
                if n2:
                    norm_index[n2].add(raw_id)
                tk2 = token_key(v)
                if tk2:
                    token_index[tk2].add(raw_id)
            count += 1

    print(f"[actors] indicizzati {len(names_by_id):,} ID da {count:,} righe.")
    return norm_index, token_index, names_by_id

# ---------- Matching ----------
def resolve_id_for_name(name, norm_index, token_index):
    raw = name or ""
    n = normalize_name(raw)

    # 1) exact normalized
    cands = sorted(norm_index.get(n, []))
    if len(cands) == 1:
        return "matched", cands[0], cands, "exact"
    elif len(cands) > 1:
        return "ambiguous", "", cands, "exact"

    # 2) token-set
    tk = token_key(raw)
    cands = sorted(token_index.get(tk, []))
    if len(cands) == 1:
        return "matched", cands[0], cands, "token_set"
    elif len(cands) > 1:
        return "ambiguous", "", cands, "token_set"

    # 3) jaccard
    name_tokens = set(tokens(raw))
    best_id, best_score, second_best = None, 0.0, 0.0
    best_cands, seen = [], set()

    for key, ids in token_index.items():
        key_tokens = set(key.split())
        if not (name_tokens & key_tokens):
            continue
        score = jaccard(name_tokens, key_tokens)
        if score >= JACCARD_THRESHOLD:
            for _id in ids:
                if _id in seen:
                    continue
                seen.add(_id)
                if score > best_score:
                    second_best = best_score
                    best_score = score
                    best_id = _id
                    best_cands = [best_id]
                elif score == best_score:
                    best_cands.append(_id)

    if best_id and best_score >= JACCARD_THRESHOLD:
        if len(best_cands) == 1 and best_score > second_best:
            return "matched", best_id, best_cands, "jaccard"
        else:
            return "ambiguous", "", sorted(best_cands), "jaccard"

    return "unmatched", "", [], ""

# ---------- Pipeline ----------
def main():
    base = Path(".")
    actors_path = base / ACTORS_FILE
    output_path = base / OUTPUT_FILE

    if not actors_path.exists() or not output_path.exists():
        print(f"ERRORE: metti '{ACTORS_FILE}' e '{OUTPUT_FILE}' nella cartella corrente.", file=sys.stderr)
        sys.exit(1)

    print(">> Carico indice attori…")
    norm_index, token_index, names_by_id = load_actors_index(actors_path)

    print(">> Elaboro output.csv e correggo gli ID…")
    fixed_rows, unmatched_rows, audit_rows = [], [], []

    # calcolo righe totali per log (senza caricare tutto in memoria)
    try:
        with output_path.open("r", encoding="utf-8-sig") as fcnt:
            total = sum(1 for _ in fcnt) - 1
            if total < 0:
                total = 0
    except Exception:
        total = 0

    with output_path.open("r", encoding="utf-8-sig", newline="") as fin:
        reader = csv.DictReader(fin)  # header: biography,place_of_birth,birthday,name,id,gender,popularity,deathday,image_path
        if not reader.fieldnames:
            print("ERRORE: output.csv sembra vuoto o senza header.", file=sys.stderr)
            sys.exit(1)
        cols = {c.lower(): c for c in reader.fieldnames}
        id_col = cols.get("id")
        name_col = cols.get("name")
        if not id_col or not name_col:
            print("ERRORE: output.csv deve avere colonne 'name' e 'id'.", file=sys.stderr)
            sys.exit(1)

        for i, row in enumerate(reader, start=1):
            if i % 1000 == 0:
                print(f"   - {i:,}/{total or '?':} righe…", end="\r", flush=True)

            original_id = (row.get(id_col) or "").strip()
            name = (row.get(name_col) or "").strip()

            status, chosen_id, candidates, method = resolve_id_for_name(name, norm_index, token_index)

            new_row = dict(row)
            new_row[id_col] = chosen_id if status == "matched" else ""
            fixed_rows.append(new_row)

            audit_rows.append({
                "name": name,
                "original_id": original_id,
                "new_id": new_row[id_col],
                "status": status,
                "method": method,
                "candidates": "|".join(candidates) if candidates else ""
            })

            if status in ("unmatched", "ambiguous"):
                unr = dict(row)
                unr["match_status"] = status
                unr["match_method"] = method
                unr["candidate_ids"] = "|".join(candidates) if candidates else ""
                unmatched_rows.append(unr)

    print("\n>> Scrivo file…")
    # test.csv
    with Path(OUT_FIXED_CSV).open("w", encoding="utf-8", newline="") as fout:
        writer = csv.DictWriter(fout, fieldnames=fixed_rows[0].keys() if fixed_rows else [])
        writer.writeheader()
        writer.writerows(fixed_rows)
    # test.json
    with Path(OUT_FIXED_JSON).open("w", encoding="utf-8") as fj:
        json.dump(fixed_rows, fj, ensure_ascii=False, indent=2)
    # unmatched.csv
    with Path(OUT_UNMATCHED_CSV).open("w", encoding="utf-8", newline="") as fu:
        if unmatched_rows:
            writer = csv.DictWriter(fu, fieldnames=unmatched_rows[0].keys())
            writer.writeheader()
            writer.writerows(unmatched_rows)
        else:
            csv.writer(fu).writerow(["(tutti risolti)"])
    # audit
    with Path(OUT_AUDIT_CSV).open("w", encoding="utf-8", newline="") as fa:
        if audit_rows:
            writer = csv.DictWriter(fa, fieldnames=audit_rows[0].keys())
            writer.writeheader()
            writer.writerows(audit_rows)

    total_rows = len(fixed_rows)
    unmatched = sum(1 for a in audit_rows if a["status"] == "unmatched")
    ambiguous = sum(1 for a in audit_rows if a["status"] == "ambiguous")
    matched = sum(1 for a in audit_rows if a["status"] == "matched")

    print("\n=== RIEPILOGO ===")
    print(f"Righe processate: {total_rows:,}")
    print(f"Matched:          {matched:,}")
    print(f"Ambigui:          {ambiguous:,}")
    print(f"Non trovati:      {unmatched:,}")
    if unmatched or ambiguous:
        print(f"Controlla '{OUT_UNMATCHED_CSV}' per i dettagli.")
    print(f"Creati: {OUT_FIXED_CSV}, {OUT_FIXED_JSON}, {OUT_AUDIT_CSV}")

    # elenco breve dei non risolti
    if unmatched or ambiguous:
        print("\nAlcuni attori senza ID assegnato:")
        shown = 0
        for a in audit_rows:
            if a["status"] in ("unmatched", "ambiguous"):
                print(f" - {a['name']} ({a['status']})")
                shown += 1
                if shown >= 50:
                    print(" ... altri in unmatched.csv")
                    break

if __name__ == "__main__":
    main()
