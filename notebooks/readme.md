# Python Data Analysis – IUM Project (UniTO)

This folder contains the Python data analysis developed for the IUM–TWEB course
at the University of Turin. The analysis is implemented with **Jupyter Notebooks**
and focuses on data exploration, aggregation, and visualization.

---

## Directory Structure

### 📁 `data/`
Manually populate this folder with the CSV datasets required by the notebooks.
The files are not included in the repository.

### 📁 `assets/`
Auxiliary resources. Contains the **Natural Earth** shapefile
`ne_110m_admin_0_countries` used for geographic visualizations.

### 📁 `src/`
Reusable Python modules to keep the notebook clean:
- `config.py`: shared paths (`data/`, `assets/`, shapefile).
- `analysis_utils.py`: functions to load, clean, normalize, and aggregate data.
- `viz.py`: helpers for recurring plots (bar chart, choropleth).

Example imports in the notebook:
```python
from src.analysis_utils import load_csv, clean_basic, aggregate, load_world_shapes, attach_geometries
from src.viz import plot_bar_top, plot_choropleth
```

---

## Python Dependencies

All required libraries are listed in `requirements.txt`.

It is recommended to use a virtual environment:

```bash
python -m venv venv
source venv/bin/activate   # Linux / macOS
venv\Scripts\activate      # Windows
