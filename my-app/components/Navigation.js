import { Container, Nav, Navbar, Button } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import { readToken, removeToken } from '@/lib/authenticate';
import SearchBar from '@/components/SearchBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

export default function Navigation() {
    const router = useRouter();
    const [token, setToken] = useState(undefined)

    useEffect(() => {
        setToken(readToken())
    }, [])

    function logout() {
        removeToken();
        setToken(undefined)
        router.push('/login');
    }
    let home = () => {
        router.push('/');
    }
    const onSearch = async (search_query) => {
        console.log("query: ", search_query)
        router.push(`/search?q=${search_query}`);
    }


    return (<>
        <Navbar expand="lg" style={{ backgroundColor: "#7FB237", marginBottom: "60px" }} className="fixed-top navbar-dark">
            <Container>
                <Navbar.Brand style={{ color: "#FFF" }} onClick={home}><em>FOOD RECIPE</em></Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Nav className="justify-content-center flex-grow-1">
                        <SearchBar onSearch={onSearch} />
                    </Nav>
                    <Nav className="ms-auto">
                        {typeof token !== "undefined" ? (
                            <div className="customNavbar">
                            <div className="dropdown">
                              <button className="dropbtn">admin <FontAwesomeIcon icon={faCaretDown}/></button>
                              <div className="dropdown-content">
                                <a href="/" >Home</a>
                                <a href="/mealPlan" >Meal Plan</a>
                                <a href="/favourites" >Favourites</a>
                                <a href="/history" >History</a>
                                <a href="#" onClick={logout} >Logout</a>
                              </div>
                            </div>
                          </div>
                        ) : (
                            <>
                                <Button style={{ backgroundColor: "#7FB237", border: "0px"}}><a style={{ color: router.pathname === "/login" ? "yellow" : "#fff", textDecoration: "none" }} href="/login">Login</a></Button>
                                <Button style={{ backgroundColor: "#7FB237", border: "0px"}}><a style={{ color: router.pathname === "/register" ? "yellow" : "#fff", textDecoration: "none" }} href="/register">Register</a></Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>);
}