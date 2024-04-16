import { Container } from "react-bootstrap";
import Navigation from "./Navigation.js";

export default function Layout(props) {
    return (
        <>
            <Navigation/>
            <Container style={{ marginTop: "120px"}}>
                {props.children}
            </Container>
            <br />
        </>
    );
}