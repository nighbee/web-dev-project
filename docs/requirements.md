Project Implementation Requirements
Web Development  |  Angular + Django  |  KBTU

Group Rules
Exactly 3 students per group
All group members must be from the same practice lesson
Inform your practice lesson teacher: group members, project name, and GitHub repo link

Pre-Defense Checklist (by Week 9-10)
Create a GitHub repository for your project
Add a README.md with project description and group members
Initialize the Angular project template (ng new) and commit it to the repo
Groups whose info is not submitted by the deadline cannot defend

Front-End Requirements (Angular)
Create interfaces and services to interact with back-end APIs
At least 4 (click) events that trigger API requests
At least 4 form controls using [(ngModel)] (FormsModule)
Apply basic CSS styling to components
Set up the Routing module with at least 3 named routes and navigation between pages
Use @for to loop over data and @if for conditional rendering (Angular 17+; legacy *ngFor/*ngIf accepted on older versions)
JWT authentication: HTTP interceptor, login page, logout functionality
At least 1 Angular Service using HttpClient for all API communication
Handle API errors gracefully (e.g., display error messages to the user on failed requests)

Back-End Requirements (Django + DRF)
Define at least 4 models
Optionally, create 1 custom model manager
Include at least 2 ForeignKey relationships between models
Serializers:
At least 2 from serializers.Serializer
At least 2 from serializers.ModelSerializer
Views:
At least 2 Function-Based Views (FBV) using DRF decorators
At least 2 Class-Based Views (CBV) using APIView
Token-based authentication with login and logout endpoints
Provide full CRUD operations for at least one model
When creating objects, link them to the authenticated user (e.g., request.user)
Configure CORS (django-cors-headers) to allow requests from the Angular dev server
Prepare a Postman collection with all requests (including example responses) committed to the repo

Project Defense Requirements
Defense takes place during Week 14 practice lessons
Total time: 5-7 minutes + up to 2-3 minutes Q&A per group
Prepare a presentation: maximum 4 pages, in PDF format — describing what was built and how requirements are covered
After the last slide, show a live demo of the fully working project (frontend + backend together)
Prepare the GitHub repository with README, commit history, and Postman collection
All group members must be able to explain both the frontend and backend parts
Bring one laptop with the fully running project

Grading Rubric (per student, 10 pts total)