import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Tamarind Feedback App</title>
        <meta name="description" content="Tamarind Feedback App" />
      </head>
      <body>{children}</body>
    </html>
  );
}
