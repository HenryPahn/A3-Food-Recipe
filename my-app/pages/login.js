import { Card, Form, Alert, Button } from "react-bootstrap";
import { useState, useEffect } from 'react';
import { authenticateUser } from "@/lib/authenticate";
import { useRouter } from 'next/router';
import Link from 'next/link';


export default function Login(props) {

  const [warning, setWarning] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    try{
      await authenticateUser(user, password);
      router.push("/");
    }catch(err){
     setWarning(err.message);
    }

  }

  return (
    <>
     <div className="justify-content-center align-items-center " style={{ backgroundColor: '#f5f5f5',  padding: '20px' }}>
      <Card bg="light">
        <Card.Body>
          <h2>Login</h2>
          Please enter your login information below:
        </Card.Body>
      </Card>

      <br />

      <Form onSubmit={handleSubmit}>
        <Form.Group >
          <Form.Label>User:</Form.Label>
          <Form.Control type="text" value={user} id="userName" name="userName" onChange={e => setUser(e.target.value)} />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control type="password" value={password} id="password" name="password" onChange={e => setPassword(e.target.value)} />
        </Form.Group  >

        {warning && <>
          <br />
          <Alert variant='danger'>
            {warning}
          </Alert>
        </>}

        <br />
        <Button variant="primary" className="pull-right" type="submit">Login</Button>
      </Form>
      <br></br>
      <span>Not a member?</span>  <Link href="/register" style={{color: '#2c3e50' }}>Register Now</Link>
      </div>
    </>
  );
}