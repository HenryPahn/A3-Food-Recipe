import { useState } from 'react';
import { registerUser } from "@/lib/authenticate";
import Link from 'next/link';
import styles from '../styles/register.module.css'
import { useRouter } from 'next/router';
import Image from 'next/image'

export default function Register(props) {
  const router = useRouter();
  const [warning, setWarning] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [registered, setRegister] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await registerUser(user, password, password2);
      setRegister(true);
    } catch (err) {
      setWarning(err.message);
    }
  }

  return (
    <>
      <div className={styles['register-container']} >
        <div className={styles["form-side"]}>
          {!registered ? (<>
            <form className={styles["login-form"]} onSubmit={handleSubmit}>
              <div className={styles["form-group"]}>
                <input type="text" placeholder="Username" value={user} name="userName" onChange={e => setUser(e.target.value)} />
              </div>
              <div className={styles["form-group"]}>
                <input type="password" placeholder="Password" value={password} name="password" onChange={e => setPassword(e.target.value)} />
              </div>
              <div className={styles["form-group"]}>
                <input type="password" placeholder="Confirm Password" value={password2} name="password2" onChange={e => setPassword2(e.target.value)} />
              </div>
              {warning && <>
                <p style={{ color: "red", padding: "0px" }}>{warning}</p>
              </>}
              <div className={styles["form-actions"]}>
                <button type="submit" className={styles["btn-signin"]}>Register</button>
              </div>
              <div className={styles["login"]}>
                <Link href="/login">Have an account?</Link>
              </div>
            </form>
          </>) : (
            <div>
              <h3 style={{ color: '#fff', display: 'block' }}>You are successfully registered</h3>
              <button type="button" className={styles["btn-signin"]} style={{ display: 'block' }} onClick={() => { router.push("/login") }}>Login</button>
            </div>
          )}
        </div>
        <div className={styles["image-side"]}>
          <Image src='/images/register.png' alt="register" width={0} height={0} unoptimized/>
        </div>
      </div>

    </>
  );
}