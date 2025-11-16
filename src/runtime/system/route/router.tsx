import styled from "styled-components";
import {useEffect} from "react";
import runtimeRouter from "./runtimeRouter.ts";

const Container = styled.div``;
const Router = () => {
    useEffect(()=> {
        runtimeRouter();
    }, [])
    return (
        <Container>
         </Container>
    )
}

export default Router