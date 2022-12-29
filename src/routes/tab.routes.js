import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, EvilIcons, FontAwesome, MaterialIcons } from '@expo/vector-icons';

import Home from '../pages/Home'
import MeusAgendamentos from "../pages/MeusAgendamentos";
import MeusDados from "../pages/MeusDados";
import MinhasTomadas from "../pages/MinhasTomadas";
import NovoAgendamento from "../pages/NovoAgendamento";

const Tab = createBottomTabNavigator();

export function TabRoutes() {
    return (
        <Tab.Navigator initialRouteName='Home'>
            <Tab.Screen
                name="MeusAgendamentos"
                component={ MeusAgendamentos }
                options={{
                    headerShown: false,
                    tabBarLabel: "Agendamentos",
                    tabBarIcon: ({color, size}) => (
                        <MaterialIcons name="schedule" color={color} size={size} />
                    )
                }}
            />
            <Tab.Screen
                name="MinhasTomadas"
                component={ MinhasTomadas }
                options={{
                    headerShown: false,
                    tabBarLabel: "Tomadas",
                    tabBarIcon: ({color, size}) => (
                        <Entypo name="power-plug" size={size} color={color} />
                    )
                }}
            />
            <Tab.Screen
                name="Home"
                component={ Home }
                options={{
                    headerShown: false,
                    tabBarLabel: "Início",
                    tabBarIcon: ({color, size}) => (
                        <FontAwesome name="home" size={size} color={color} />
                    )
                }}
            />
            <Tab.Screen
                name="NovoAgendamento"
                component={ NovoAgendamento }
                options={{
                    headerShown: false,
                    tabBarLabel: "Agendar",
                    tabBarIcon: ({color, size}) => (
                        <MaterialIcons name="more-time" color={color} size={size} />
                    )
                }}
            />
            <Tab.Screen
                name="MeusDados"
                component={ MeusDados }
                options={{
                    headerShown: false,
                    tabBarLabel: "Meus Dados",
                    tabBarIcon: ({color, size}) => (
                        <EvilIcons name="user" color={color} size={size} />
                    )
                }}
            />
        </Tab.Navigator>
    );
}