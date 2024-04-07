import "@/styles/globals.css";
import '@/styles/bootstrap.min.css';
import Layout from "@/components/Layout";
import { useRouter } from 'next/router';
// import { SWRConfig } from "swr";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <Layout key={router.pathname}>
        <Component {...pageProps}/>
      </Layout>
    </>
  );
}
