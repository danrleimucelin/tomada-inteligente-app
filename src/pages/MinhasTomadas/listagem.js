import React, {useEffect, useState} from "react";
import { API_URL } from '@env';
import {Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import Loading from "../../components/loading";
import Tomada from "../../components/Plug";

export default function MinhasTomadasListagem(props) {
    const user = props.user;
    const setShowNewPlugPage = props.setShowNewPlugPage;
    const [tomadas, setTomadas] = useState([]);
    const [loading, setLoading] = useState(false);

    function buscarTomadas() {
        setLoading(true);

        if (Object.keys(user).length <= 0) {
            setLoading(false);
            return;
        }

        fetch(API_URL + 'user/plugs', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + user.access_token,
                'Accept': 'application/json',
            },
        }).then((response) => {
            let statusCode = response.status;
            response.json().then((json) => {
                if (statusCode === 200) {
                    let tomadasApi = [];
                    json.map((tomada) => {
                        tomadasApi.push({
                            id: tomada.id,
                            serial_number: tomada.serial_number,
                            name: tomada.pivot.name,
                            power: tomada.power,
                            consumption: tomada.consumption
                        });
                    });

                    setTomadas(tomadasApi);
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

    function verificarRemocaoTomada(id) {
        Alert.alert(
            "Atenção!",
            "Deseja realmente remover esta tomada da sua lista?",
            [
                {
                    text: "Sim, remover",
                    onPress: () => removerTomada(id)
                },
                {
                    text: "Cancelar",
                    style: "cancel"
                }
            ]
        )
    }

    function removerTomada(id) {
        setLoading(true);

        fetch(API_URL + 'user/detach-plug/' + id, {
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
                    buscarTomadas();
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

    useEffect(buscarTomadas, [user]);

    return (
        <View style={styles.container}>

            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.mensagem}>Minhas Tomadas!</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <View style={{
                    justifyContent: "flex-end",
                    flexDirection: "row",
                }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#0091ea",
                            padding: 5,
                            marginTop: 15,
                            marginHorizontal: 5,
                            borderRadius: 3
                        }}
                        onPress={buscarTomadas}
                    >
                        <Ionicons name="ios-reload-circle" size={24} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            backgroundColor: "green",
                            padding: 5,
                            paddingHorizontal: 6,
                            marginTop: 15,
                            marginLeft: 5,
                            borderRadius: 3
                        }}
                        onPress={() => setShowNewPlugPage(true)}
                    >
                        <FontAwesome name="plus-circle" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <View>
                    { tomadas.length
                        ? (
                            <FlatList
                                data={tomadas}
                                keyExtractor={(item) => item.id}
                                renderItem={({item}) =>
                                    <View style={styles.itemLista}>
                                        
                                        <Tomada  tomada={item} power={item.power} consumption={item.consumption}/>

                                        {
                                        /*
                                            <Text style={styles.itemListaTexto}>
                                                {item.name}
                                            </Text>
                                        */
                                        }
                                        <TouchableOpacity
                                            onPress={() => verificarRemocaoTomada(item.id)}
                                            style={styles.itemListaBotao}
                                        >
                                            <FontAwesome name="times" size={22} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                }
                            />
                        )
                        : (
                            <Text style={styles.label}>
                                { loading ? "Buscando tomadas..." : "Você não possui tomadas vinculadas!" }
                            </Text>
                        )
                    }
                </View>
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
    itemListaTexto: {
        color: "#0091ea",
        fontWeight: "bold",
        fontSize: 16
    },
    itemListaBotao: {
        backgroundColor: "#d70913",
        paddingVertical: 3,
        paddingHorizontal: 4,
        borderRadius: 3
    }
});