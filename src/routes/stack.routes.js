import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BemVindo from "../pages/BemVindo";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";

const Stack = createNativeStackNavigator();

export function StackRoutes(props) {
    const setLogado = props.setLogado;
    const pushToken = props.pushToken;

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="BemVindo"
                component={ BemVindo }
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Login"
                component={ Login }
                options={{
                    headerShown: false,
                }}
                initialParams={{ setLogado, pushToken }}
            />
            <Stack.Screen
                name="Cadastro"
                component={ Cadastro }
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    );
}