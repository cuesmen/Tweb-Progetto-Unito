"""Shared paths and constants for the analysis notebooks."""

from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT_DIR / "data"
ASSETS_DIR = ROOT_DIR / "assets"

# Natural Earth shapefile path used for country-level maps
WORLD_SHP_PATH = "./assets/ne_110m_admin_0_countries.shp"
