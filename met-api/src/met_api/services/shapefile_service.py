# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


"""Service for shapefile service."""
import json
import os
import shutil
import zipfile
from http import HTTPStatus

import geopandas as gpd
from flask import current_app
from werkzeug.utils import secure_filename

from met_api.exceptions.business_exception import BusinessException


class ShapefileService:   # pylint: disable=too-few-public-methods
    """This is the shapefile related service class."""

    @staticmethod
    def convert_to_geojson(file):
        """Convert to Geojson."""
        upload_folder = current_app.config.get('SHAPEFILE_UPLOAD_FOLDER')
        shapefile_path = ShapefileService._unzip_file(file, upload_folder)
        geojson_string = ShapefileService._get_geojson(shapefile_path)
        # Clean up uploaded files
        shutil.rmtree(os.path.join(upload_folder))
        return geojson_string

    @staticmethod
    def _get_geojson(shapefile_path):
        gdf = gpd.read_file(shapefile_path)
        geojson_dict = json.loads(gdf.to_json())
        geojson_string = json.dumps(geojson_dict)
        return geojson_string

    @staticmethod
    def _unzip_file(file, upload_folder):
        filename = secure_filename(file.filename)
        ShapefileService._create_upload_dir(upload_folder)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        is_zip_file = zipfile.is_zipfile(filename)
        if not is_zip_file:
            raise BusinessException(
                error='No Valid Zip found.',
                status_code=HTTPStatus.BAD_REQUEST)
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            zip_ref.extractall(upload_folder)
            shapefile_name = ShapefileService._get_shapefile_name(zip_ref)
            if not shapefile_name:
                raise BusinessException(
                    error='No Valid shapefile found.',
                    status_code=HTTPStatus.BAD_REQUEST)

        shapefile_path = os.path.join(upload_folder, shapefile_name)
        return shapefile_path

    @staticmethod
    def _get_shapefile_name(zip_ref):
        shapefile_name = None
        for name in zip_ref.namelist():
            if name.endswith('.shp') and 'MACOSX' not in name:
                shapefile_name = name
        return shapefile_name

    @staticmethod
    def _create_upload_dir(upload_folder):
        is_exist = os.path.exists(upload_folder)
        if not is_exist:
            # Create a new directory because it does not exist
            os.makedirs(upload_folder)
