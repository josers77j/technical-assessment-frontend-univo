# technical-assessment-frontend-univo

Frontend application for the technical assessment focused on product and provider management.
This app consumes a REST API and supports create, update, list, and delete operations,
including pagination and filtering.

## 1) Technology Stack

- Angular 19
- TypeScript
- RxJS
- Tailwind CSS v4 + daisyUI

## 2) Prerequisites and System Requirements

- Node.js 22.x
- npm 10+
- Backend API available (local or deployed)

Check versions:

```bash
node -v
npm -v
```

## 3) Installation (Step by Step)

1. Clone repository:

```bash
git clone <URL_DEL_REPOSITORIO>
cd technical-assessment-frontend
```

2. Install dependencies:

```bash
npm install
```

## 4) Environment Configuration

This project uses Angular environment files (no .env file).

- Local development: [src/environments/environment.development.ts](src/environments/environment.development.ts)
- Production: [src/environments/environment.ts](src/environments/environment.ts)

Property used by the app:

- baseUrl: API base URL (example: http://localhost:3000/api/v1)

If you change the backend URL, update baseUrl in the corresponding environment file.

## 5) Database and Migrations

Database setup and migrations belong to the backend project.

- This frontend does not run migrations or seeders.
- For database setup/migrations, follow the backend repository documentation.

## 6) Run Locally

Start development server:

```bash
npm start
```

Open in browser:

http://localhost:4200

## 7) Available Scripts

```bash
npm start      # ng serve
npm run build  # production build
npm test       # unit tests (if added)
```

## 8) API Integration Documentation

This frontend consumes backend endpoints under /api/v1.

Entities used:

- Providers: GET/POST/PATCH/DELETE /providers
- Products: GET/POST/PATCH/DELETE /products

Features consumed by the frontend:

- Pagination
- Filtering
- Sorting
- Field selection (sparse fieldsets)

Detailed request/response documentation is maintained in the backend (Postman/Swagger if available).

## 9) Testing

Current scope:

- No automated frontend tests were included for this submission.
- API tests (Postman/Insomnia) belong to the backend scope.

Recommended manual verification for frontend:

- Create provider
- Create product
- List products with pagination
- Open details by id
- Edit product/provider
- Delete product/provider
- Verify UI error messages

## 10) Deployment (Optional but Recommended)

It is recommended to deploy the frontend to Vercel, Netlify, or Cloudflare Pages.

### Option A: Vercel

1. Connect the repository in Vercel.
2. Configuration:
   - Framework preset: Angular
   - Build command: npm run build
   - Output directory: dist/technical-assessment-frontend
3. Deploy.

### Option B: Netlify

1. Import the repository in Netlify.
2. Configuration:
   - Build command: npm run build
   - Publish directory: dist/technical-assessment-frontend
3. Deploy.

Note:

- Make sure the frontend points to the deployed backend in [src/environments/environment.ts](src/environments/environment.ts).

## 11) Version Control and Structure

- Commit history follows a feat/chore style convention in main branches.
- .gitignore is configured to exclude dependencies, build artifacts, and system files: [.gitignore](.gitignore)
- Domain-based modular structure:
  - app/products
  - app/providers
  - app/shared

Branch strategy (current):

- main as the main delivery branch.

## 12) Known Issues / Limitations

- Build may show an initial bundle budget warning.
- Build may show CSS selector warnings from daisyUI/Tailwind.
- The application depends on backend availability.

These warnings do not block compilation or the application's core behavior.
