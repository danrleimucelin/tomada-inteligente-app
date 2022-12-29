import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList} from "react-native";
import { API_URL } from '@env';
import * as Animatable from 'react-native-animatable'
import User from "../../database/User";
import Loading from "../../components/loading";
import {Ionicons} from "@expo/vector-icons";
import moment from "moment/moment";

export default function Home() {
    const [user, setUser] = useState({});
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(false);

    function buscarUserLogado () {
        User.first().then((userDB) => {
            setUser(userDB);
        });
    }

    function proximosAgendamentosDeHoje() {
        if (Object.keys(user).length <= 0) {
            return;
        }

        fetch(API_URL + 'user/schedules/today', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + user.access_token,
                'Accept': 'application/json',
            },
        }).then((response) => {
            let statusCode = response.status;
            if (statusCode === 204) {
                setAgendamentos([]);
                return;
            }

            response.json().then((json) => {
                if (statusCode !== 200) {
                    return;
                }

                let agendamentosApi = [];
                json.map((agendamento) => {
                    agendamentosApi.push(agendamento);
                });
                setAgendamentos(agendamentosApi);
            });
        }).catch((error) => {
            console.log(error);
        }).finally(() => { });
    }

    useEffect(() => {
        buscarUserLogado();
        setInterval(proximosAgendamentosDeHoje, 30000);
    },[]);

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.mensagem}>
                    { Object.keys(user).length ? "Olá, " + user.name.split(" ")[0] + "!" : "Carregando dados..." }
                </Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <TouchableOpacity
                    style={{
                        backgroundColor: "#0091ea",
                        padding: 5,
                        alignSelf: "flex-end",
                        marginTop: 15,
                        borderRadius: 3
                    }}
                    onPress={proximosAgendamentosDeHoje}
                >
                    <Ionicons name="ios-reload-circle" size={24} color="white" />
                </TouchableOpacity>

                <Text style={styles.label}>Agendamentos de hoje</Text>
                { agendamentos.length
                    ? (
                        <FlatList
                            data={agendamentos}
                            keyExtractor={(item) => item.id}
                            renderItem={({item}) =>
                                <View style={styles.itemLista}>
                                    <View>
                                        <Text style={styles.itemListaTitulo}>{item.plugName}</Text>
                                        { item.started === 1 && <Text style={styles.itemListaTitulo}>EM ANDAMENTO</Text> }

                                        <Text>Início: {moment(item.start_date).format("DD/MM/YYYY HH:mm") }</Text>
                                        <Text>Fim: {moment(item.end_date).format("DD/MM/YYYY HH:mm") }</Text>
                                    </View>
                                </View>
                            }
                        />
                    )
                    : (
                        <Text style={styles.label}>
                            { loading ? "Buscando agendamentos..." : "Você ainda não possui agendamentos para hoje!" }
                        </Text>
                    )
                }

            </Animatable.View>

            { loading && <Loading/> }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0091ea'
    },
    containerHeader: {
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%',
    },
    mensagem: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#eee'
    },
    containerForm: {
        backgroundColor: '#fff',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    },
    label: {
        fontSize: 20,
        marginTop: 28,
    },
    itemLista: {
        justifyContent: "space-between",
        flexDirection: "row",
        backgroundColor: "#fff",
        borderStyle: "solid",
        borderColor: "#0091ea",
        borderWidth: 1,
        padding: 10,
        alignItems: "center",
        borderRadius: 5,
        marginTop: 20
    },
    itemListaTitulo: {
        color: "#0091ea",
        fontWeight: "bold",
        fontSize: 16,
    }
});