import { Card, Row, Col, Alert, Button } from "react-bootstrap";
import { useState } from 'react';
import { authenticateUser } from "@/lib/authenticate";
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/login.module.css';
import Image from 'next/image'
export default function Login(props) {

  const [warning, setWarning] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await authenticateUser(user, password);
      router.push("/");
    } catch (err) {
      setWarning(err.message);
    }
  }

  return (
    <>
      <div className={styles['login-container']} >
        <div className={styles["image-side"]}>
          <Image src='/images/login.png' alt="login" width={0} height={0} unoptimized/>
        </div>
        <div className={styles["form-side"]}>
          <form className={styles["login-form"]} onSubmit={handleSubmit}>
            <div className={styles["form-group"]}>
              <input type="text" placeholder="Username" value={user} name="userName" onChange={e => setUser(e.target.value)} />
            </div>
            <div className={styles["form-group"]}>
              <input type="password" placeholder="Password" value={password} name="password" onChange={e => setPassword(e.target.value)} />
            </div>
            {warning && <>
                <p style={{color: "red", padding: "0px"}}>{warning}</p>
              </>}
            <div className={styles["form-actions"]}>
              <button type="submit" className={styles["btn-signin"]}>Sign In</button>
            </div>
            <div className={styles["forgot-password"]}>
              <Link href="/resetPassword">Forgot Password?</Link>
              <Link href="/register">Create and account?</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}