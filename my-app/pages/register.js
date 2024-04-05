import { Card, Form, Alert, Button } from "react-bootstrap";
import { useState, useEffect } from 'react';
import { registerUser } from "@/lib/authenticate";
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Register(props) {

  const [warning, setWarning] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [registered, setRegister] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await registerUser(user, password, password2);
      //router.push("/login");
      setRegister(true);
    } catch (err) {
      setWarning(err.message);
    }

  }

  return (
    <>
      <div>
        {!registered ?
          (<div className="justify-content-center align-items-center " style={{ backgroundColor: '#f5f5f5', padding: '20px' }}>
            <Card bg="light" className="mb-3">
              <Card.Body>
                <Card.Title><h2>Register</h2></Card.Title>
                Please enter your information to register:
              </Card.Body>
            </Card>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username:</Form.Label>
                <Form.Control type="text" value={user} id="userName" name="userName" onChange={e => setUser(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password:</Form.Label>
                <Form.Control type="password" value={password} id="password" name="password" onChange={e => setPassword(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm your password:</Form.Label>
                <Form.Control type="password" value={password2} id="password2" name="password2" onChange={e => setPassword2(e.target.value)} />
              </Form.Group>

              {warning && (
                <Alert variant='danger' className="my-3">
                  {warning}
                </Alert>
              )}

              <div>
                <Button variant="primary" type="submit">Create an account</Button>
              </div>
            </Form>
          </div>)
          :
          (<div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#333' }}>You are successfully registered!</h3>
            <Link href="/login" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', backgroundColor: '#2c3e50', color: '#fff', borderRadius: '5px', textDecoration: 'none' }}>
              Login now
            </Link>
          </div>)}
      </div>
    </>
  );
}