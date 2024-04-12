import "@/styles/globals.css";
import '@/styles/bootstrap.min.css';
import Layout from "@/components/Layout";
import RouteGuard from '@/components/RouteGuard';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <RouteGuard>
        <Layout key={router.pathname}>
          <Component {...pageProps} />
        </Layout>
      </RouteGuard>
    </>
  );
}
