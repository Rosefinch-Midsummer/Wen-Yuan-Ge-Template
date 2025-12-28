# 文渊阁 (Wen Yuan Ge) - PDF Document Library

Based on Vue 3 + Vite + vue-pdf.js, this project creates a static website to display and preview PDF documents hosted on GitHub Pages.

## Features

- **File Explorer**: Browse folders and files with a clean, dark-themed UI.
- **PDF Preview**: Built-in PDF viewer using `vue-pdf.js`.
- **Search**: Global search for files by name.
- **Responsive**: Mobile-friendly design.
- **Automated Deployment**: GitHub Actions workflow included.

## How to Use

### Adding Files

1. Place your PDF files (or folders containing PDFs) into the `public/Files` directory.
2. The directory structure will be automatically reflected in the website.
3. Supported formats: `.pdf`. (Icons available for `.epub` but preview only for PDF currently).

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

   *Note: The file list `public/files.json` is generated manually or during build. To generate it manually:*
   ```bash
   node generate-file-list.js
   ```

### Deployment

This project is configured for **GitHub Pages**.

1. Push the code to your GitHub repository.
2. Go to repository **Settings** -> **Pages**.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. The included `.github/workflows/deploy.yml` will automatically build and deploy the site on every push to `main` (or `master`).

## Project Structure

- `public/Files`: Store your documents here.
- `src/components/FileExplorer.vue`: Main file list and navigation component.
- `src/components/PdfPreview.vue`: PDF viewer component.
- `generate-file-list.js`: Script to scan `public/Files` and generate the JSON manifest.

## Customization

- **Background**: Change the background image in `src/App.vue` (CSS section).
- **Icons**: Uses FontAwesome (CDN in `index.html`).

## License

MIT
