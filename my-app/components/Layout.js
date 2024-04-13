import { Container } from "react-bootstrap";
import Navigation from "./Navigation.js";

export default function Layout(props) {
    return (
        <>
            <Navigation />
            <br />
            <Container>
                {props.children}
            </Container>
            <br />
        </>
    );
}