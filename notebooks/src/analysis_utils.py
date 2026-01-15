"""Utility functions for loading, cleaning and aggregating data."""

from __future__ import annotations

from typing import Dict, Iterable, Mapping, Optional, Sequence

import geopandas as gpd
import pandas as pd

from .config import DATA_DIR, WORLD_SHP_PATH


def load_csv(filename: str, **kwargs) -> pd.DataFrame:
    """
    Load a CSV from the data directory.

    Args:
        filename: CSV file name inside data/.
        **kwargs: Extra arguments passed to pandas.read_csv.
    """
    path = DATA_DIR / filename
    return pd.read_csv(path, **kwargs)


def load_world_shapes() -> gpd.GeoDataFrame:
    """Load the Natural Earth countries shapefile for geographic plots."""
    return gpd.read_file(WORLD_SHP_PATH)


def clean_basic(df: pd.DataFrame, *, dedup_subset: Optional[Sequence[str]] = None) -> pd.DataFrame:
    """
    Apply basic cleanup: strip column names, trim string cells, drop duplicates.

    Args:
        df: Input DataFrame.
        dedup_subset: Optional columns to consider for drop_duplicates.
    """
    df = df.copy()
    df.columns = [c.strip() for c in df.columns]

    # trim string cells
    for col in df.select_dtypes(include=["object", "string"]).columns:
        df[col] = df[col].astype("string").str.strip()

    df = df.drop_duplicates(subset=dedup_subset)
    return df


def normalize_countries(
    df: pd.DataFrame,
    *,
    column: str,
    mapping: Optional[Mapping[str, str]] = None,
    to_upper: bool = True,
) -> pd.DataFrame:
    """
    Normalize country names/codes to improve joins with shapefiles.

    Args:
        df: Input DataFrame.
        column: Column containing country names/codes.
        mapping: Optional mapping to rename custom values.
        to_upper: If True, uppercase values after mapping.
    """
    df = df.copy()
    series = df[column].astype("string").str.strip()
    if mapping:
        series = series.replace(mapping)
    if to_upper:
        series = series.str.upper()
    df[column] = series
    return df


def attach_geometries(
    df: pd.DataFrame,
    world_shapes: gpd.GeoDataFrame,
    *,
    key_df: str,
    key_world: str = "NAME_EN",
) -> gpd.GeoDataFrame:
    """
    Merge a DataFrame with the world geometries for choropleth maps.

    Args:
        df: DataFrame with country data.
        world_shapes: GeoDataFrame of world shapes.
        key_df: Column in df to join on.
        key_world: Column in world_shapes to join on.
    """
    return world_shapes.merge(df, left_on=key_world, right_on=key_df, how="left")


def aggregate(
    df: pd.DataFrame,
    *,
    by: Iterable[str],
    agg: Dict[str, str | list | dict],
    sort_by: Optional[str] = None,
    ascending: bool = False,
    top_n: Optional[int] = None,
) -> pd.DataFrame:
    """
    Group and aggregate a DataFrame with optional sorting and top N selection.

    Args:
        df: Input DataFrame.
        by: Columns to group by.
        agg: Aggregations passed to DataFrame.agg.
        sort_by: Optional column to sort by after aggregation.
        ascending: Sort direction.
        top_n: If provided, keep only the first N rows after sorting.
    """
    grouped = df.groupby(list(by), dropna=False).agg(agg).reset_index()
    if sort_by:
        grouped = grouped.sort_values(by=sort_by, ascending=ascending)
    if top_n:
        grouped = grouped.head(top_n)
    return grouped


def top_n(
    df: pd.DataFrame,
    *,
    value_col: str,
    label_col: Optional[str] = None,
    n: int = 10,
    ascending: bool = False,
) -> pd.DataFrame:
    """
    Return the top N rows by a numeric column.

    Args:
        df: Input DataFrame.
        value_col: Column to rank.
        label_col: Optional label column to keep; if provided, the result is trimmed to these columns.
        n: Number of rows to return.
        ascending: Sort order (False = highest first).
    """
    result = df.sort_values(by=value_col, ascending=ascending).head(n)
    if label_col:
        result = result[[label_col, value_col]]
    return result.reset_index(drop=True)
