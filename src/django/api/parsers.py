import json
from rest_framework.parsers import MultiPartParser


class NewBoundaryParser(MultiPartParser):
    def parse(self, stream, media_type=None, parser_context=None):
        form_data = super().parse(stream, media_type, parser_context)

        if 'reference_images_meta' in form_data.data:
            # TODO Figure out why brackets are removed
            new_reference_images_meta = json.loads(
                '[' + form_data.data['reference_images_meta'] + ']'
            )

            form_data.data = {
                k: v if k != 'reference_images_meta' else new_reference_images_meta
                for (k, v) in form_data.data.items()
            }

        return form_data
