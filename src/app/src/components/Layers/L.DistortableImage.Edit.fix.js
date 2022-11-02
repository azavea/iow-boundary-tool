import L from 'leaflet';
import 'leaflet-toolbar';
import 'leaflet-distortableimage';

/**
 * Most of this code in _enableDragging exactly the same as it is
 * in the distortable image plugin. The only differences is
 * the addition of dragend handler near the end of the function.
 * This allows listeners of the layer's dragend event to handle
 * drags of the whole layer in addition to just the edit handles.
 * This fix can be removed if this PR is merged:
 * https://github.com/publiclab/Leaflet.DistortableImage/pull/1014
 * and the distortable image plugin is updated in this project.
 *
 */

L.DistortableImage.Edit.prototype._enableDragging = function () {
    var overlay = this._overlay;
    var map = overlay._map;

    this.dragging = new L.Draggable(overlay.getElement());
    this.dragging.enable();

    /* Hide toolbars and markers while dragging; click will re-show it */
    this.dragging.on('dragstart', () => {
        overlay.fire('dragstart');
        this._removeToolbar();
    });

    /*
     * Adjust default behavior of L.Draggable, which overwrites the CSS3
     * distort transformations that we set when it calls L.DomUtil.setPosition.
     */
    this.dragging._updatePosition = function () {
        var topLeft = overlay.getCorner(0);
        var delta = this._newPos.subtract(map.latLngToLayerPoint(topLeft));
        var currentPoint;
        var corners = {};
        var i;

        this.fire('predrag');

        for (i = 0; i < 4; i++) {
            currentPoint = map.latLngToLayerPoint(overlay.getCorner(i));
            corners[i] = map.layerPointToLatLng(currentPoint.add(delta));
        }

        overlay.setCorners(corners);
        overlay.fire('drag');

        this.fire('drag');
    };

    this.dragging.on('dragend', () => {
        overlay.fire('dragend');
    });
};

// Adds firing of refresh event
L.DistortableImage.Edit.prototype._refresh = function () {
    if (this.toolbar) {
        this._removeToolbar();
    }
    this._addToolbar();

    this._overlay.fire('refresh');
};

// Prevent unbinding listeners on layers that have already been removed.
// Same as https://github.com/publiclab/Leaflet.DistortableImage/blob/2b743c747dcdfe2c3de51b50283084aa327348b6/src/edit/handles/EditHandle.js#L58-L68
// except handles nulls more gracefully.
L.EditHandle.prototype._unbindListeners = function () {
    this?.off(
        {
            contextmenu: L.DomEvent.stop,
            dragstart: this._onHandleDragStart,
            drag: this._onHandleDrag,
            dragend: this._onHandleDragEnd,
        },
        this
    );

    this?._handled?._map?.off('zoomend', this.updateHandle, this);
    this?._handled?.off('update', this.updateHandle, this);
};

export default L;
