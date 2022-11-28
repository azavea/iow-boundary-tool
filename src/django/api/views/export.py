from datetime import datetime

from django.db import connection
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from api.permissions import UserIsAdmin


@api_view(["GET"])
@permission_classes([IsAuthenticated, UserIsAdmin])
def boundaries_approved(request):
    query = """
    WITH features AS (
        SELECT json_build_object(
            'type',       'Feature',
            'id',         b.id,
            'geometry',   ST_AsGeoJSON(shape)::json,
            'properties', json_build_object(
                'name',            u.name,
                'pwsid',           u.pwsid,
                'city',            u.address_city,
                'state',           u.state_id,
                'drafted_at',      s.created_at,
                'drafted_by',      du.email,
                'submitted_at',    s.submitted_at,
                'submitted_by',    su.email,
                'submitted_notes', s.notes,
                'approved_at',     a.approved_at,
                'approved_by',     au.email,
                'status',          'Approved'
            )
        ) AS feature
        FROM api_approval a
            INNER JOIN api_user au ON a.approved_by_id = au.id
            INNER JOIN api_submission s ON a.submission_id = s.id
            INNER JOIN api_user du ON s.created_by_id = su.id
            INNER JOIN api_user su ON s.submitted_by_id = su.id
            INNER JOIN api_boundary b ON s.boundary_id = b.id
            INNER JOIN api_utility u ON b.utility_id = u.id
        WHERE a.unapproved_at IS NULL
    )

    SELECT json_build_object(
        'type',     'FeatureCollection',
        'features', json_agg(features.feature)
    )::text

    FROM features;
    """

    with connection.cursor() as cursor:
        cursor.execute(query)
        result = cursor.fetchone()[0]

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    response = HttpResponse(result, content_type="application/json")
    response[
        "Content-Disposition"
    ] = f"attachment; filename=approved_boundaries_{timestamp}.geojson"

    return response


@api_view(["GET"])
@permission_classes([IsAuthenticated, UserIsAdmin])
def boundaries_all(request):
    query = """
    WITH features AS (
        SELECT json_build_object(
            'type',       'Feature',
            'id',         b.id,
            'geometry',   ST_AsGeoJSON(shape)::json,
            'properties', json_build_object(
                'name',            u.name,
                'pwsid',           u.pwsid,
                'city',            u.address_city,
                'state',           u.state_id,
                'drafted_at',      s.created_at,
                'drafted_by',      du.email,
                'submitted_at',    s.submitted_at,
                'submitted_by',    su.email,
                'submitted_notes', s.notes,
                'reviewed_at',     r.reviewed_at,
                'reviewed_by',     ru.email,
                'reviewed_notes',  r.notes,
                'approved_at',     a.approved_at,
                'approved_by',     au.email,
                'status',          CASE
                                       WHEN s.submitted_at IS NULL THEN 'Draft'
                                       WHEN r.id IS NOT NULL
                                           AND r.reviewed_at IS NULL
                                           THEN 'In Review'
                                       WHEN r.id IS NOT NULL
                                           AND r.reviewed_at IS NOT NULL
                                           THEN 'Needs Revisions'
                                       WHEN a.approved_at IS NOT NULL
                                           AND a.unapproved_at IS NULL
                                           THEN 'Approved'
                                       ELSE 'Submitted'
                                   END
            )
        ) AS feature
        FROM api_boundary b
            INNER JOIN api_utility u ON u.id = b.utility_id
            LEFT JOIN LATERAL (
                SELECT *
                FROM api_submission
                WHERE boundary_id = b.id
                ORDER BY created_at DESC
                LIMIT 1
            ) s ON TRUE
            LEFT JOIN api_user du ON s.created_by_id = du.id
            LEFT JOIN api_user su ON s.submitted_by_id = su.id
            LEFT JOIN LATERAL (
                SELECT *
                FROM api_review
                WHERE submission_id = s.id
                ORDER BY created_at DESC
                LIMIT 1
            ) r ON TRUE
            LEFT JOIN api_user ru ON r.reviewed_by_id = ru.id
            LEFT JOIN LATERAL (
                SELECT *
                FROM api_approval
                WHERE submission_id = s.id
                ORDER BY approved_at DESC
                LIMIT 1
            ) a ON TRUE
            LEFT JOIN api_user au ON a.approved_by_id = au.id
    )

    SELECT json_build_object(
        'type',     'FeatureCollection',
        'features', json_agg(features.feature)
    )::text

    FROM features;
    """

    with connection.cursor() as cursor:
        cursor.execute(query)
        result = cursor.fetchone()[0]

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    response = HttpResponse(result, content_type="application/json")
    response[
        "Content-Disposition"
    ] = f"attachment; filename=all_boundaries_{timestamp}.geojson"

    return response
