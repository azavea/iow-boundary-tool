# IOW Entity Relationship Diagram

## Context

Below is the Entity Relationship Diagram illustrating the initial data model as discussed in Issue #69. Not included in the diagram at the time of creation are the file fields for `ReferenceImage` and `Submission` that would reference those respective file S3 uploads (to be implemented in Issue #81).

```mermaid
erDiagram
    User }o--o{ Utility : "has"
    User }o--|{ State : "within"
    User {
        email email
        boolean is_staff
        boolean is_active
        string role "max_length=1"
        date date_joined
        password password
        boolean is_locked_out
        phone phone
        State state FK
        Utility utilities
    }
    Utility }o--|| State : "within"
    Utility {
        string pwsid
        string name
        address address
        point location
        State state FK
    }
    State {
        string id "max_length=2"
        string name
        MultiPolygon shape
        json options
    }
    Boundary }o--|| Utility : "for"
    Boundary {
        Utility utility FK
        date archived_at
    }
    Submission }o--|| User : "by"
    Submission }|--|| Boundary: "for"
    Submission {
        Boundary boundary FK
        Polygon shape
        date created_at
        User created_by FK
        date submitted_at
        User submitted_by FK
        date updated_at
        string upload_filename
        date upload_edited_at
        text notes
    }
    Review }o--|| User : "by"
    Review |o--|| Submission : "for"
    Review {
        User reviewed_by FK
        Submission submission FK
        date created_at
        date reviewed_at
        text notes
    }

    Annotation }o--|| Review : "of"
    Annotation {
        Review review FK
        point location
        text comment
        date created_at
        date resolved_at
    }

    Approval }o--|| User : "by"
    Approval |o--|| Submission : "for"
    Approval {
        User approved_by FK
        Submission submission FK
        date approved_at
    }
    Reference_Image }o--|| Boundary : "for"
    Reference_Image }o--|| User : "by"
    Reference_Image {
        string filename
        User uploaded_by FK
        Boundary boundary FK
        date uploaded_at
        boolean is_visible
        json distortion
    }
```
