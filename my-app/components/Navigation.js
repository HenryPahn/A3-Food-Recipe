import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import { readToken, removeToken } from '@/lib/authenticate';


export default function Navigation() {
    const router = useRouter();

    let token = readToken()

    function logout() {
        removeToken();
        router.push('/login');
    }

    return (<>
        <Navbar expand="lg" className="fixed-top navbar-dark bg-primary">
            <Container>
                <Navbar.Brand>Food Recipe</Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link href="/" passHref legacyBehavior><Nav.Link active={router.pathname === "/"} >Home</Nav.Link></Link>
                        <Link href="/plans" passHref legacyBehavior><Nav.Link active={router.pathname === "/plans"} >My Plans</Nav.Link></Link>
                        {typeof token !== "undefined" && <Link href="/search" passHref legacyBehavior><Nav.Link active={router.pathname === "/search"} >Search</Nav.Link></Link>}
                    </Nav>
                    &nbsp;
                    <Nav className="ml-auto">
                        {typeof token !== "undefined" ? (
                            <NavDropdown title={`${token.userName}`} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <Nav className="me-auto">
                                <Link href="/login" passHref legacyBehavior><Nav.Link active={router.pathname === "/login"}>Login</Nav.Link></Link>
                                &nbsp;
                                <Link href="/register" passHref legacyBehavior><Nav.Link active={router.pathname === "/register"} >Register</Nav.Link></Link>
                            </Nav>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <br /><br /><br />
    </>);
}