# HolaMeeto: Your Instant Jitsi Meet Link Generator 🌮

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![ShadCN/UI](https://img.shields.io/badge/ShadCN/UI- mukaan%20-%23000000.svg?&style=flat&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)

Welcome to HolaMeeto! This application provides a super quick and easy way to generate unique Jitsi Meet links. No sign-ups, no fuss – just one click to create a meeting link and share it.

The project aims for a clean, modern, and intuitive user experience with a vibrant Mexican/Spanish-inspired theme.

## ✨ Features

- **Instant Meeting Links:** Generate Jitsi Meet links with a single click.
- **Optional Nicknames:** Add a nickname to your meeting for easier identification.
- **Meeting History:** Keep track of your recently generated meeting links (stored locally in your browser).
- **Quick Actions:**
    - Copy link to clipboard.
    - Share link (uses browser's native share functionality).
    - Open link directly in a new tab.
    - Remove individual meetings from history.
    - Clear all meeting history.
- **Responsive Design:** Works seamlessly on desktop and mobile devices.
- **Aesthetically Pleasing UI:** Styled with a custom theme using ShadCN/UI components and Tailwind CSS, featuring a warm gradient background and abstract shapes.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18.x or later recommended)
- npm or yarn

### Installation & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/roneel47/HolaMeeto
    cd HolaMeeto
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    This will start the Next.js development server, typically on `http://localhost:9002`. Open this URL in your browser to see the application.

## 🛠️ Built With

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [ShadCN/UI](https://ui.shadcn.com/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Font:** [Manrope](https://fonts.google.com/specimen/Manrope)
-   **Video Conferencing Backend:** [Jitsi Meet](https://jitsi.org/jitsi-meet/) (public instance)
-   **(Potential for AI):** [Genkit](https://firebase.google.com/docs/genkit) is set up for potential future GenAI integrations.

## 🎨 Theme & Styling

HolaMeeto features a custom theme inspired by Mexican and Spanish aesthetics. The color palette uses warm tones, with a prominent gradient background shifting from a dark orangish-red to a light orange. Abstract shapes float in the background to add visual depth and dynamism.

All theme-related CSS variables can be found in `src/app/globals.css`.

## 📄 Project Structure

-   `src/app/`: Main application routes and layout.
    -   `page.tsx`: The main landing page component.
    -   `layout.tsx`: The root layout for the application.
    -   `globals.css`: Global styles and Tailwind CSS theme configuration.
-   `src/components/`: Reusable UI components.
    -   `InstantConnectForm.tsx`: The core component for generating and managing meeting links.
    -   `ui/`: ShadCN/UI components.
-   `src/hooks/`: Custom React hooks (e.g., `useToast`, `useMobile`).
-   `src/lib/`: Utility functions (e.g., `cn` for classnames).
-   `src/ai/`: (Future Use) Genkit related files for AI features.
-   `public/`: Static assets like images.

## 💡 How It Works

HolaMeeto generates Jitsi Meet links by creating unique room names. The format is typically `https://meet.jit.si/HolaMeeto-[OptionalNickname-]<RandomString>`. Meeting history is stored in the browser's `localStorage`.

## 🧑‍💻 Creator

**Roneel V. – Creator of HolaMeeto 🌮**

## 🙏 Acknowledgements

-   Powered by the open-source [Jitsi Meet](https://jitsi.org/jitsi-meet/) platform.

Enjoy your instant meetings with HolaMeeto!
