# CV Portfolio - Bilingual Developer Resume

A modern, bilingual (English/Spanish) CV website built with Next.js, featuring an admin panel for easy content management and technology filtering.

## Features

- ✅ **Bilingual Support**: Seamless switching between English and Spanish
- ✅ **Technology Filter**: Filter job experiences by specific technologies (React, Angular, TypeScript, etc.)
- ✅ **Admin Panel**: Secure, keyword-protected admin interface for editing CV content
- ✅ **JSON-Based Content**: All content stored in easily editable JSON files
- ✅ **Responsive Design**: Beautiful, mobile-first design with Tailwind CSS
- ✅ **Easy Technology Management**: Add/remove technologies from jobs with a single click
- ✅ **Social Links**: Integrated LinkedIn, GitHub, website, and portfolio links

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd cv-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
cv-portfolio/
├── app/
│   ├── page.tsx              # Main CV page
│   ├── admin/
│   │   └── page.tsx          # Admin panel
│   ├── api/
│   │   ├── cv/[lang]/
│   │   │   └── route.ts      # CV data API endpoints
│   │   └── auth/
│   │       └── route.ts      # Authentication endpoint
│   ├── layout.tsx
│   └── globals.css
├── data/
│   ├── cv-en.json            # English CV content
│   ├── cv-es.json            # Spanish CV content
│   └── admin-password.json   # Admin keyword (default: admin123)
├── types/
│   └── cv.ts                 # TypeScript interfaces
└── README.md
```

## Usage

### Main CV Page

1. Visit `http://localhost:3000` to view the CV
2. Use the language switcher (EN/ES) in the top-right to change languages
3. Click on any technology badge to filter experiences by that technology
4. Click "Show All" to clear the filter

### Admin Panel

1. Navigate to `http://localhost:3000/admin`
2. Enter the admin keyword (default: `admin123`)
3. Edit personal information, experience details, and technologies
4. Add new technologies by typing and pressing Enter or clicking "Add"
5. Remove technologies by clicking the "×" next to them
6. Click "Save Changes" to persist your edits

### Changing the Admin Password

Edit `data/admin-password.json`:
```json
{
  "keyword": "your-new-password"
}
```

### Editing CV Content

You can edit CV content in two ways:

#### Method 1: Using the Admin Panel (Recommended)
- Go to `/admin`, authenticate, and edit through the user interface

#### Method 2: Directly Editing JSON Files
Edit `data/cv-en.json` and `data/cv-es.json` directly. Key sections:

- **personalInfo**: Name, title, contact info, social links, summary
- **experience**: Job positions with technologies, tools, and descriptions
- **projects**: Personal projects with links
- **education**: Academic background
- **languages**: Language proficiencies
- **skills**: Categorized technical and soft skills

### Adding Technologies to Jobs

In the admin panel:
1. Click "Edit" on any experience
2. Type the technology name in the "Add technology..." field
3. Press Enter or click "Add"
4. Click "Save Changes" to persist

### Filtering by Technology

On the main CV page:
1. Click any technology badge at the top
2. Only experiences with that technology will be shown
3. The selected technology is highlighted in the filtered results
4. Click "Show All" to reset the filter

## Extending the Site

### Adding New Pages (e.g., Photography)

1. Create a new data file (e.g., `data/photography-en.json`)
2. Create a new page component (e.g., `app/photography/page.tsx`)
3. Create corresponding API routes if needed
4. Add navigation links in the main layout

### Customizing Styles

- Edit `app/globals.css` for global styles
- Modify Tailwind classes in component files
- Update `tailwind.config.ts` for custom theme colors

## Technologies Used

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Storage**: JSON files (filesystem-based)
- **Authentication**: Simple keyword-based access control

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy automatically

### Other Platforms

Build for production:
```bash
npm run build
npm start
```

## Security Notes

⚠️ **Important**: The current authentication system is basic and suitable for personal use or low-security scenarios. For production use with sensitive data, consider:

- Using environment variables for the admin keyword
- Implementing JWT-based authentication
- Adding rate limiting
- Using a proper database instead of JSON files
- Adding HTTPS in production

## Customization Checklist

- [ ] Update personal information in `data/cv-en.json` and `data/cv-es.json`
- [ ] Change the admin keyword in `data/admin-password.json`
- [ ] Add your actual LinkedIn, GitHub, and portfolio URLs
- [ ] Customize colors and styling in component files
- [ ] Add your profile photo (optional)
- [ ] Update metadata in `app/layout.tsx`

## License

This project is open source and available for personal use.

## Support

For issues or questions, please open an issue on GitHub.
