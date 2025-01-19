# Profile Map App

Profile Map App is a React-based web application designed to display and manage profiles, showcasing their locations on a map. The app includes a dark mode toggle, search functionality, and integration with Supabase for authentication and data management.

## Features

- **Profile List Display**: View a list of profiles with details like name, description, location, email, and phone number.
- **Search Functionality**: Search for profiles by name, description, or address.
- **Map Integration**: View profile locations on an interactive map using `react-leaflet`.
- **Dark Mode Toggle**: Switch between light and dark themes.
- **Authentication**: Secure login/logout functionality using Supabase.
- **Admin Panel**: Manage profiles and perform administrative tasks.

## Technologies Used

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **React Leaflet**: For map visualization.
- **Tailwind CSS**: For styling with support for dark mode.
- **Zustand**: State management.
- **Lucide Icons**: For modern, customizable icons.

### Backend

- **Supabase**: Backend-as-a-service for authentication and database management.

### Development Tools

- **Vite**: A fast build tool for modern web development.
- **TypeScript**: For type-safe JavaScript development.
- **ESLint**: Linting and code quality.
- **PostCSS/Autoprefixer**: For CSS processing.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd profile-map-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up Supabase:

   - Create a Supabase project at [Supabase](https://supabase.com/).
   - Retrieve the Supabase `URL` and `Anon Key` from the dashboard.
   - Create a `.env` file in the root of your project and add:
     ```env
     VITE_SUPABASE_URL=your-supabase-url
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## Scripts

- **`npm run dev`**: Start the development server.
- **`npm run build`**: Build the application for production.
- **`npm run preview`**: Preview the production build.
- **`npm run lint`**: Lint the codebase using ESLint.

## Folder Structure

```
profile-map-app/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── store/           # Zustand state management
│   ├── lib/             # Supabase client
│   ├── styles/          # Tailwind CSS styles
│   └── App.tsx          # Main application entry
├── .env                 # Environment variables
├── package.json         # Project configuration and scripts
└── README.md            # Project documentation
```

## Development Guidelines

1. **Coding Standards**:

   - Follow ESLint rules.
   - Use TypeScript for type safety.

2. **Styling**:

   - Use Tailwind CSS for consistent design.
   - Ensure dark mode compatibility for all components.

3. **Testing**:

   - Manually test features before merging changes.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Made with ❤️ using React and Supabase.

Note: Dark Mode is not implemented yet.
