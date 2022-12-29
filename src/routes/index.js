import {NavigationContainer} from "@react-navigation/native";

import {StackRoutes} from "./stack.routes";
import {StatusBar} from "react-native";
import React from "react";
import {TabRoutes} from "./tab.routes";

export function Routes(props) {
    const logado = props.logado;
    const setLogado = props.setLogado;
    const pushToken = props.pushToken;

    return (
        <NavigationContainer>
            <StatusBar backgroundColor="#0091ea" barStyle="light-content"/>
            { logado ? <TabRoutes /> : <StackRoutes setLogado={setLogado} pushToken={pushToken}/> }
        </NavigationContainer>
    );
}