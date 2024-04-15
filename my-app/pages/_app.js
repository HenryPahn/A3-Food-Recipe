import '@/styles/bootstrap.min.css';
import "@/styles/globals.css";
import Layout from "@/components/Layout";
import RouteGuard from '@/components/RouteGuard';
import { useRouter } from 'next/router';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;


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
