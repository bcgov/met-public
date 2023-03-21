import json
import os
import zipfile

import shapefile
from flask import current_app
from werkzeug.utils import secure_filename


class ShapefileService:
    """This is the shapefile related service class."""

    @staticmethod
    def convert_to_geojson(file):
        """Convert to Geojson."""
        filename = secure_filename(file.filename)
        upload_folder = current_app.config.get('SHAPEFILE_UPLOAD_FOLDER')
        ShapefileService._create_upload_dir(upload_folder)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            zip_ref.extractall(upload_folder)
            for name in zip_ref.namelist():
                if name.endswith('.shp') and 'MACOSX' not in name:
                    shapefile_name = name

        shapefile_path = os.path.join(upload_folder, shapefile_name)
        reader = shapefile.Reader(shapefile_path)
        fields = reader.fields[1:]
        field_names = [field[0] for field in fields]
        features = []
        for sr in reader.shapeRecords():
            atr = dict(zip(field_names, sr.record))
            geom = sr.shape.__geo_interface__
            features.append(dict(type="Feature", geometry=geom, properties=atr))
        feature_collection = dict(type="FeatureCollection", features=features)
        return json.dumps(feature_collection)

    @staticmethod
    def _create_upload_dir(upload_folder):
        is_exist = os.path.exists(upload_folder)
        if not is_exist:
            # Create a new directory because it does not exist
            os.makedirs(upload_folder)
