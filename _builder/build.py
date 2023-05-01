"""Build tool for assets."""

import json
from pathlib import Path


assets = {}
project = str(Path.cwd().as_posix())



def build():
    """Builds assets file."""
    
    global assets

    # Build components html assets.
    for path in Path(f"{project}/html/components/").glob("*.*"):
        if path.suffix == ".html":
            key = f"components/{path.name}"
            value = path.read_text()
            assets[key] = value

    # Build pages html assets.
    for path in Path(f"{project}/html/pages/").glob("*.*"):
        if path.suffix == ".html":
            key = f"pages/{path.name}"
            value = path.read_text()
            assets[key] = value



    # NOTE: Storage of stylesheet CSS in `assets` is intended for constructing 
    # stylesheets to be added to shadow roots. 
    # Using `import sheet from './styles.css' assert { type: 'css' };`
    # would render storage of stylesheet CSS in `assets` unnecessary,
    # as the imported sheet's `default` can be adopted directly to a shadow root.
    # However, support for CSS module scripts is still limited to Chromium-based browsers...

    # Build Bootstrap css assets.
    for path in Path(f"{project}/libs/bootstrap/").glob("*.*"):
        if path.suffix == ".css":
            key = f"bootstrap/{path.name}"
            value = path.read_text()
            assets[key] = value

    # Build UiKit css assets.
    for path in Path(f"{project}/libs/uikit/").glob("*.*"):
        if path.suffix == ".css":
            key = f"uikit/{path.name}"
            value = path.read_text()
            assets[key] = value

    # Build app css assets.
    for path in Path(f"{project}/styles/").glob("*.*"):
        if path.suffix == ".css" and path.name != "app.css":
            key = f"styles/{path.name}"
            value = path.read_text()
            assets[key] = value


    text = f"export const assets = {json.dumps(assets, indent=2)}"
    Path(f"{project}/assets.js").write_text(text)

    print('Assets build complete.')
    



build()


