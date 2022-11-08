# Boundary Sync REST API Design

## Context

Based on the [data model](./adr-001-data-models.md), the following REST API design is proposed to access it:

### Authentication

| Path            | Method | Body      | Authentication | Responses                                             | Notes                                        |
| --------------- | ------ | --------- | -------------- | ----------------------------------------------------- | -------------------------------------------- |
| `/auth/login/`  | GET    | -         | Allow Any      | 200 OK,<br />401 Not Authorized                       | Returns loging JSON if current session valid |
| `/auth/login/`  | POST   | `{ ... }` | Allow Any      | 200 OK,<br />400 Bad Request,<br />401 Not Authorized | Used for starting new valid session          |
| `/auth/logout/` | POST   | -         | Logged In User | 200 OK                                                | Used for logging out                         |

Also present are `/auth/password/reset/` and `/auth/password/reset/confirm/` endpoints that come from `dj_rest_auth`.

### Boundaries

| Path                                        | Method | Body             | Authentication | Responses                                                  | Notes                                                                                                              |
| ------------------------------------------- | ------ | ---------------- | -------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `/boundaries/`                              | GET    | -                | Logged In User | 200 OK                                                     | Returns list of all boundaries the user has access to                                                              |
| `/boundaries/?utilities=1,3,5,8`            | GET    | -                | Logged In User | 200 OK,<br />401 Not Authorized                            | Returns list of boundaries in the given utilities. If the user does not have access to that utility, returns a 401 |
| `/boundaries/`                              | POST   | `{ ... }`        | Contributor    | 201 Created,<br />400 Bad Request,<br />401 Not Authorized | Creates a new boundary if the payload is correct and the user is authorized                                        |
| `/boundaries/{id}/`                         | GET    | -                | Logged In User | 200 OK,<br />404 Not Found                                 | Returns boundary details if the user has access to it, else 404s. Includes all details about the boundary.         |
| `/boundaries/{id}/shape/`                   | PUT    | `{ ... }`        | Contributor    | 204 NO Content,<br />404 Not Found                         | Updates the latest submission's shape                                                                              |
| `/boundaries/{id}/shape/`                   | DELETE | -       `        | Contributor    | 204 No Content,<br />404 Not Found                         | Deletes the latest submission's shape                                                                              |
| `/boundaries/{id}/reference-images/`        | POST   | `{ ... }`        | Contributor    | 200 OK,<br />404 Not Found                                 | Adds a new reference image to the boundary                                                                         |
| `/boundaries/{id}/reference-images/{id}/`   | PUT    | `{ ... }`        | Contributor    | 200 OK,<br />404 Not Found                                 | Updates a reference image                                                                                          |
| `/boundaries/{id}/submit/`                  | PATCH  | `{ notes }`      | Contributor    | 204 NO Content,<br />404 Not Found                         | Submits the boundary                                                                                               |
| `/boundaries/{id}/review/`                  | POST   | -                | Validator      | 200 OK,<br />404 Not Found                                 | Starts a boundary review                                                                                           |
| `/boundaries/{id}/review/finish/`           | POST   | `{ notes }`      | Validator      | 200 OK,<br />404 Not Found                                 | Finishes a boundary review                                                                                         |
| `/boundaries/{id}/review/annotations/`      | POST   | `{ annotation }` | Validator      | 200 OK,<br />404 Not Found                                 | Creates an annotation in the latest review. Older reviews are read-only, so no need to specify review id.          |
| `/boundaries/{id}/review/annotations/{id}/` | PUT    | `{ annotation }` | Validator      | 200 OK,<br />404 Not Found                                 | Updates an annotation in the latest review. Older reviews are read-only, so no need to specify review id.          |
| `/boundaries/{id}/review/annotations/{id}/` | DELETE | -                | Validator      | 204 NO Content,<br />404 Not Found                         | Deletes an annotation in the latest review. Older reviews are read-only, so no need to specify review id.          |
| `/boundaries/{id}/draft/`                   | POST   | -                | Contributor    | 204 No Content,<br />404 Not Found                         | Creates a new draft submission for a boundary after a review                                                       |
| `/boundaries/{id}/approve/`                 | POST   | -                | Validator      | 200 OK,<br />404 Not Found                                 | Approves a boundary                                                                                                |
| `/boundaries/{id}/unapprove/`               | POST   | -                | Validator      | 200 OK,<br />404 Not Found                                 | Unapproves a boundary                                                                                              |

### User

| Path                 | Method | Body      | Authentication | Responses                  | Notes                              |
| -------------------- | ------ | --------- | -------------- | -------------------------- | ---------------------------------- |
| `/user/{id}/profile` | PUT    | `{ ... }` | Contributor    | 200 OK,<br />404 Not Found | Update contributor contact details |

## Notes

Any thing that a Contributor or Validator can do, an Administrator can also do.

A payload Body of `-` means that there is no body required. A payload Body of `{ ... }` means that there is a required body, but is not elaborated here.

All endpoints that are marked as requiring a Logged In User will also return 401 Not Authorized if accessed without proper credentials.

When we return `404 Not Found` for objects that the User does not have permissions to, we're using a pattern like this:

```python
@permission_classes((IsAuthenticated,))
def get_boundary(request, id):
    user = request.user
    boundary = get_object_or_404(Boundary, id)
    submission = boundary.get_latest_submission_for(user)

    serializer = SubmissionSerializer(submission)
    return Response(serializer.data)
```

where `get_latest_submission_for` is along these lines:

```python
class Boundary(models.Model):
    ...

    def get_latest_submission_for(self, user):
        if user.role == CONTRIBUTOR:
            if self.utility not in user.utilities:
                raise Http404

        if user.role == VALIDATOR:
            if self.utility.state not in user.states:
                raise Http404

        return self.submissions.latest('created_at')
```
