
import '../styles/globals.css';
import Layout from '../components/Layout';
import 'leaflet/dist/leaflet.css';
import Script from "next/script";
import { AuthProvider } from "../hooks/useAuth";

<Script
  src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
/>


export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      {/* opcional: seu layout global */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
