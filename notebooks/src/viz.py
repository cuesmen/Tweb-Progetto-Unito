"""Reusable plotting helpers for the analysis notebooks."""

from __future__ import annotations

from typing import Optional

import geopandas as gpd
import matplotlib.pyplot as plt
import pandas as pd


def plot_bar_top(
    df: pd.DataFrame,
    *,
    label_col: str,
    value_col: str,
    n: int = 10,
    title: Optional[str] = None,
    ax: Optional[plt.Axes] = None,
    color: str = "#4C78A8",
) -> plt.Axes:
    """
    Plot a bar chart of the top N rows by value_col.

    Args:
        df: Input DataFrame (already aggregated or filtered).
        label_col: Column for labels on the y-axis.
        value_col: Numeric column for bar lengths.
        n: Number of rows to display.
        title: Optional chart title.
        ax: Optional matplotlib axes.
        color: Bar color.
    """
    ax = ax or plt.gca()
    data = df.sort_values(by=value_col, ascending=False).head(n)
    ax.barh(data[label_col], data[value_col], color=color)
    ax.invert_yaxis()
    ax.set_xlabel(value_col)
    ax.set_ylabel(label_col)
    if title:
        ax.set_title(title)
    return ax


def plot_choropleth(
    gdf: gpd.GeoDataFrame,
    *,
    value_col: str,
    title: Optional[str] = None,
    cmap: str = "Blues",
    missing_color: str = "#f0f0f0",
    ax: Optional[plt.Axes] = None,
) -> plt.Axes:
    """
    Plot a simple choropleth map from a GeoDataFrame.

    Args:
        gdf: GeoDataFrame containing geometries and a numeric value column.
        value_col: Column used to color the map.
        title: Optional chart title.
        cmap: Matplotlib colormap.
        missing_color: Fill color for missing values.
        ax: Optional matplotlib axes.
    """
    ax = ax or plt.gca()
    gdf.plot(column=value_col, cmap=cmap, missing_kwds={"color": missing_color}, legend=True, ax=ax)
    ax.axis("off")
    if title:
        ax.set_title(title)
    return ax
