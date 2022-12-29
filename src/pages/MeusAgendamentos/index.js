import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Alert, TouchableOpacity, FlatList} from "react-native";
import { API_URL } from '@env';
import * as Animatable from 'react-native-animatable'
import User from "../../database/User";
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import Loading from "../../components/loading";

export default function MeusAgendamentos() {
    var moment = require('moment');

    const [agendamentos, setAgendamentos] = useState([]);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);

    function carregarUsuarioLogado() {
        User.first().then((userDB) => {
            setUser(userDB);
        });
    }

    function buscarAgendamentos() {
        setLoading(true);

        if (Object.keys(user).length <= 0) {
            setLoading(false);
            return;
        }

        fetch(API_URL + 'user/schedules', {
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
                if (statusCode !== 200 && statusCode !== 204) {
                    let mensagem = json.message !== undefined ? json.message : "Houve um erro. Verifique os dados e tente novamente";
                    Alert.alert("Ops!!!", mensagem);
                    return;
                }

                let agendamentosApi = [];
                if (statusCode === 200) {
                    json.map((agendamento) => {
                        agendamentosApi.push(agendamento);
                    });

                    setAgendamentos(agendamentosApi);
                }
            });
        }).catch((error) => {
            console.log(error);
            Alert.alert("Ops!!!", "Ocorreu um erro. Verifique sua conexão e tente novamente em instantes");
        }).finally(() => { setLoading(false); });
    }

    function infosAgendamento(id) {
        agendamentos.map((agendamento) => {
            if (agendamento.id === id) {
                let mensagem = "";
                if (agendamento.userId !== user.id) {
                    mensagem += "Criador: " + agendamento.userName + "\n";
                }
                mensagem += "Início: " + moment(agendamento.start_date).format("DD/MM/YYYY HH:mm") + "\n";
                mensagem += "Fim: " + moment(agendamento.end_date).format("DD/MM/YYYY HH:mm") + "\n";
                mensagem += "Voltagem: " + agendamento.voltage + "%\n";
                // mensagem += "Alerta sonoro: " + (agendamento.emit_sound === 1 ? "Sim" : "Não") + "\n";
                Alert.alert(agendamento.plugName, mensagem);
            }
        });
    }

    function verificarRemocaoAgendamento(id) {
        Alert.alert(
            "Atenção!",
            "Deseja realmente remover este agendamento da sua lista?",
            [
                {
                    text: "Sim, remover",
                    onPress: () => removerAgendamento(id)
                },
                {
                    text: "Cancelar",
                    style: "cancel"
                }
            ]
        )
    }

    function removerAgendamento(id) {
        setLoading(true);

        fetch(API_URL + 'schedule/remove/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + user.access_token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            let statusCode = response.status;
            response.json().then((json) => {

                if (statusCode === 200) {
                    setLoading(false);
                    buscarAgendamentos();
                    return;
                }

                let mensagem = json.message !== undefined ? json.message : "Houve um erro. Verifique os dados e tente novamente";
                Alert.alert("Ops!!!", mensagem);
            });
        }).catch((error) => {
            Alert.alert("Ops!!!", "Ocorreu um erro. Verifique sua conexão e tente novamente em instantes");
            console.log(error)
        }).finally(() => setLoading(false));
    }

    useEffect(carregarUsuarioLogado,[]);
    useEffect(buscarAgendamentos, [user]);

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.mensagem}>Agendamentos!</Text>
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
                    onPress={buscarAgendamentos}
                >
                    <Ionicons name="ios-reload-circle" size={24} color="white" />
                </TouchableOpacity>

                { agendamentos.length
                    ? (
                        <FlatList
                            data={agendamentos}
                            keyExtractor={(item) => item.id}
                            renderItem={({item}) =>
                                <View style={styles.itemLista}>
                                    <View style={styles.itemListaInfos}>
                                        <Text style={styles.itemListaTitulo}>{item.plugName}</Text>
                                        { item.started === 1 && <Text style={styles.itemListaTitulo}>EM ANDAMENTO</Text> }

                                        <Text>Início: {moment(item.start_date).format("DD/MM/YYYY HH:mm") }</Text>
                                        <Text>Fim: {moment(item.end_date).format("DD/MM/YYYY HH:mm") }</Text>
                                    </View>

                                    <View style={{ flexDirection: "row" }}>
                                        <TouchableOpacity
                                            onPress={() => infosAgendamento(item.id)}
                                            style={styles.itemListaBotaoInfos}
                                        >
                                            <Ionicons name="search-sharp" size={20} color="white" />
                                        </TouchableOpacity>

                                        {
                                            item.userId === user.id &&
                                            <TouchableOpacity
                                                onPress={() => verificarRemocaoAgendamento(item.id)}
                                                style={styles.itemListaBotao}
                                            >
                                                <FontAwesome name="times" size={22} color="white" />
                                            </TouchableOpacity>}
                                    </View>
                                </View>
                            }
                        />
                    )
                    : (
                        <Text style={styles.label}>
                            { loading ? "Buscando agendamentos..." : "Você não possui agendamentos futuros!" }
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
    },
    itemListaSubTexto: {
        // color: "#0091ea",
        // fontWeight: "bold",
        // fontSize: 16
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%"
    },
    itemListaBotao: {
        backgroundColor: "#d70913",
        paddingVertical: 3,
        paddingHorizontal: 4,
        borderRadius: 3
    },
    itemListaBotaoInfos: {
        paddingVertical: 3,
        paddingHorizontal: 4,
        borderRadius: 3,
        backgroundColor: "grey",
        marginRight: 5
    }
});