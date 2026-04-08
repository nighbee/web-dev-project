# mathWay 🧮

**mathWay** is a minimal, straightforward video learning platform. It features a simple grid of math video lessons hosted on YouTube. Users can browse video titles, watch the lessons, save videos to their favorites, and write personal notes for each video. 

## Group Members (Group [Your Group Name/Number])
* **Member 1:** layla Taubay  
* **Member 2:** Zhanibek Batyrbekov
* **Member 3:** Toktassin Almaz  


## Tech Stack
* **Frontend:** Angular 17+
* **Backend:** Django, Django REST Framework (DRF)
* **Database:** SQLite (Built-in, local)

---

## How the Project Covers the Requirements

### 1. Back-End Requirements (Django + DRF)
* **4 Models & 2 ForeignKey Relationships:**
    1.  `User`: Django's built-in authentication model.
    2.  `Video`: Represents the YouTube lesson (Title, YouTube ID).
    3.  `Note`: Personal notes created by users. Contains **ForeignKeys** to `Video` and `User`.
    4.  `Favorite`: A simple model to save videos for later. Contains **ForeignKeys** to `Video` and `User`.
* **1 Custom Model Manager:** * A custom manager for the `Favorite` model (e.g., `Favorite.objects.get_user_favorites(user)`) to quickly filter a specific user's saved videos.
* **Serializers:**
    * *ModelSerializers (2):* `NoteSerializer` and `FavoriteSerializer` for CRUD operations.
    * *Serializers (2):* `VideoBasicSerializer` (explicitly defining fields for the simple grid list) and `UserLoginSerializer` (for handling authentication).
* **Views:**
    * *Function-Based Views (FBV) (2):* `@api_view` used for `get_video_grid` and `user_logout`.
    * *Class-Based Views (CBV) (2):* `APIView` used for `FavoriteListView` and `NoteDetailView`.
* **Authentication & User Linking:**
    * Token-based authentication (JWT or DRF Token) is configured.
    * When a `Note` or `Favorite` is created, it is strictly linked to `request.user`.
* **Full CRUD Operations:** * Fully implemented for the `Note` model (Users can Create, Read, Update, and Delete their plain-text notes on videos).
* **CORS Configuration:** `django-cors-headers` is installed to allow API requests from the Angular server (`http://localhost:4200`).

### 2. Front-End Requirements (Angular)
* **Interfaces & Services:** Data models (`IVideo`, `INote`, `IFavorite`) are defined. A central `ApiService` and `AuthService` handle API communication via `HttpClient`.
* **Routing (3 Named Routes):** 1.  `/login` - Simple login/register form.
    2.  `/videos` - The main grid listing all video names.
    3.  `/videos/:id` - The watch page containing the YouTube iframe, a "Favorite" button, and the Notes text area.
* **4 Form Controls with `[(ngModel)]`:**
    1.  `username` (Login form)
    2.  `password` (Login form)
    3.  `searchBar` (To filter the grid of video names)
    4.  `noteContent` (Textarea for typing notes)
* **4 Click Events:**
    1.  `(click)="login()"` - Submits credentials.
    2.  `(click)="logout()"` - Logs the user out.
    3.  `(click)="saveNote()"` - Submits the note.
    4.  `(click)="toggleFavorite()"` - Adds/removes a video from the favorites list.
* **Template Directives:** Uses `@for` to generate the plain grid of video names and `@if` to show/hide the Notes section depending on if the user is logged in.
* **Basic CSS:** Minimal styling using basic CSS Grid/Flexbox to arrange the video titles into a structured layout, fulfilling the "basic CSS styling" requirement without over-designing.
* **JWT & Error Handling:** * An `HttpInterceptor` attaches tokens to requests.
    * Basic plain-text error messages appear on the screen if an API request fails.

---


## API Endpoints Overview

The backend exposes the following RESTful API endpoints. A complete Postman collection (`mathWay_Postman.json`) containing request payloads and example responses is included in the repository.

### Authentication
* `POST /api/auth/login/` - Authenticates user credentials and returns a JWT/Auth token.
* `POST /api/auth/logout/` - Invalidates the current user token **(Function-Based View)**.

### Videos
* `GET /api/videos/` - Retrieves a list of all available videos for the main grid **(Function-Based View)**.
* `GET /api/videos/<id>/` - Retrieves details of a specific video (including the YouTube URL for the iframe).

### Notes (Full CRUD Implementation)
* `GET /api/notes/?video_id=<id>` - Retrieves all notes written by the authenticated user for a specific video **(Class-Based View)**.
* `POST /api/notes/` - Creates a new note linked to the authenticated user and a specific video.
* `GET /api/notes/<id>/` - Retrieves a specific note.
* `PUT /api/notes/<id>/` - Updates the text of an existing note.
* `DELETE /api/notes/<id>/` - Deletes a specific note.

### Favorites
* `GET /api/favorites/` - Retrieves a list of the authenticated user's favorite videos **(Class-Based View)**.
* `POST /api/favorites/` - Adds a video to the user's favorites list.
* `DELETE /api/favorites/<id>/` - Removes a video from the user's favorites list.

---