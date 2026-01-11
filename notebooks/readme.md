# Python Data Analysis – IUM Project (UniTO)

This directory contains the **Python-based data analysis** developed for the
**IUM–TWEB course** at the **University of Turin (UniTO)**.

The analysis is implemented using **Jupyter Notebooks** and focuses on data
exploration, aggregation, and visualization.

---

## Directory Structure

### 📁 `data/`
This folder must be **manually populated with the CSV datasets** required
by the notebooks.

The CSV files are intentionally **not included** in the repository and must
be provided separately.

### 📁 `assets/`
Contains auxiliary resources used by the notebooks.

In particular, this folder includes the **Natural Earth shapefile**
`ne_110m_admin_0_countries`, which is used for geographic visualizations
(world maps by country).

---

## Python Dependencies

All required Python libraries are listed in the `requirements.txt` file.

To install them, it is recommended to use a virtual environment:

```bash
python -m venv venv
source venv/bin/activate   # Linux / macOS
venv\Scripts\activate      # Windows
