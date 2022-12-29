import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TextInput, Keyboard, TouchableOpacity, Alert, ScrollView, LogBox} from "react-native";
import * as Animatable from 'react-native-animatable'
import RNDateTimePicker from "@react-native-community/datetimepicker";

import DropDownPicker from 'react-native-dropdown-picker';
import { API_URL } from '@env';
import User from "../../database/User";
import Loading from "../../components/loading";
import {Ionicons} from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

export default function NovoAgendamento() {
    const [user, setUser] = useState({});
    const [tomadas, setTomadas] = useState([]);

    const [time, setTime] = useState(5 * 60);
    const [date, setDate] = useState(formatarDate(new Date()));
    const [dateTime, setDateTime] = useState(new Date(new Date().getTime() + 5 * 60000).toLocaleTimeString().substring(0,5) + ":00");
    const [voltage, setVoltage] = useState(100);

    const [tempoDigitado, setTempoDigitado] = useState("");

    const [openComboTomadas, setOpenComboTomadas] = useState(false);
    const [valueComboTomadas, setValueComboTomadas] = useState(null);

    const [loading, setLoading] = useState(false);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showCustomTimeField, setShowCustomTimeField] = useState(false);

    function carregarUsuarioLogado() {
        User.first().then((userDB) => {
            setUser(userDB);
        });
    }

    const setDatePicker = (event: DateTimePickerEvent, date: Date) => {
        setShowDatePicker(false);
        Keyboard.dismiss();

        const { type } = event;
        if (type === "dismissed" || type === "neutralButtonPressed") {
            return;
        }

        setDate(formatarDate(date));
        setShowTimePicker(true);
    };

    const setTimePicker = (event: DateTimePickerEvent, date: Date) => {
        setShowTimePicker(false);
        Keyboard.dismiss();

        const { type } = event;
        if (type === "dismissed" || type === "neutralButtonPressed") {
            return;
        }

        setDateTime(date.toLocaleTimeString().substring(0,5) + ":00");
    };

    function formatarDate(date) {
        let dia = date.getDate();
        let mes = date.getMonth() + 1;
        let ano = date.getFullYear();

        return (dia < 10 ? "0" + dia : dia) + "/" + (mes < 10 ? "0" + mes : mes) + "/" + ano;
    }

    function adicionarTextoNumerico(callback, text, min, max) {
        let valor = parseInt(text.replace(/[^0-9]/g, ''));

        if (isNaN(valor))
            valor = 0;
        else if (min !== undefined && valor < min)
            valor = min;
        else if (max !== undefined && valor > max)
            valor = max;

        callback(valor);
    }

    function adicionarTextoNumericoTempo(callback, text) {
        let valor = parseInt(text.toString().replace(/[^0-9]/g, ''));

        if (isNaN(valor))
            valor = 0;

        callback(valor * 60);
    }

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
                            value: tomada.id,
                            label: tomada.pivot.name,
                        });
                    });

                    setTomadas(tomadasApi);
                    if (tomadasApi.length) {
                        setValueComboTomadas(tomadasApi[0].value);
                    }

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

    function formatarDataParaYMD(data) {
        let partes = data.split("/");
        let dia = partes[0];
        let mes = partes[1];
        let ano = partes[2];

        return ano + "-" + mes + "-" + dia;
    }

    function agendar() {
        setLoading(true);

        let start_date = formatarDataParaYMD(date) + " " + dateTime;
        let dados = {time, start_date, voltage};

        fetch(API_URL + valueComboTomadas + '/schedule', {
            method: 'POST',
            body: JSON.stringify(dados),
            headers: {
                'Authorization': 'Bearer ' + user.access_token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            let statusCode = response.status;

            if (statusCode === 201) {
                Alert.alert("Sucesso!", "Seu agendamento foi realizado com sucesso!");
                return;
            }

            response.json().then((json) => {
                let mensagem = json.message !== undefined ? json.message : "Houve um erro. Verifique os dados e tente novamente";
                Alert.alert("Ops!!!", mensagem);
            });
        }).catch((error) => {
            Alert.alert("Ops!!!", "Ocorreu um erro. Verifique sua conexão e tente novamente em instantes");
            console.log(error)
        }).finally(() => setLoading(false));
    }

    useEffect(() => {
        carregarUsuarioLogado();
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    },[]);
    useEffect(buscarTomadas, [user]);

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.mensagem}>Novo Agendamento!</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <ScrollView style={{ paddingStart: "5%", paddingEnd: "5%", marginTop: 15 }}>
                    <Text style={styles.label}>Tomada</Text>
                    { tomadas.length ?
                        <View style={{ justifyContent: "flex-start", flexDirection: "row" }}>
                            <DropDownPicker
                                open={openComboTomadas}
                                value={valueComboTomadas}
                                items={tomadas}
                                setOpen={setOpenComboTomadas}
                                setValue={setValueComboTomadas}
                                style={{ width: "85%" }}
                            />
                            <TouchableOpacity
                                style={{
                                    backgroundColor: "#0091ea",
                                    padding: 7,
                                    borderRadius: 3,
                                    marginLeft: -46
                                }}
                                onPress={ buscarTomadas }
                            >
                                <Ionicons name="ios-reload-circle" size={32} color="white" />
                            </TouchableOpacity>
                        </View>
                         :
                        <View style={{ justifyContent: "flex-start", flexDirection: "row" }}>
                            <Text style={{width: "85%"}}>Nenhuma tomada encontrada</Text>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: "#0091ea",
                                    padding: 7,
                                    borderRadius: 3,
                                }}
                                onPress={ buscarTomadas }
                            >
                                <Ionicons name="ios-reload-circle" size={32} color="white" />
                            </TouchableOpacity>
                        </View>
                    }

                    <Text style={styles.label}>Data de início</Text>
                    <TextInput
                        placeholder="Clique para selecionar a data de início"
                        style={styles.input}
                        onFocus={ () => setShowDatePicker(true) }
                        value={date}
                    />

                    <Text style={styles.label}>Hora de início</Text>
                    <TextInput
                        placeholder="Clique para selecionar a hora de início"
                        style={styles.input}
                        onFocus={ () => setShowTimePicker(true) }
                        value={dateTime}
                    />

                    <Text style={styles.label}>Potência</Text>
                    <View style={{ justifyContent: "flex-start", flexDirection: "row", marginTop: 10 }}>
                        <Slider
                            style={{width: "87%"}}
                            value={100}
                            step={1}
                            minimumValue={1}
                            maximumValue={100}
                            minimumTrackTintColor="#00BFFF"
                            maximumTrackTintColor="#FFFFFF"
                            onValueChange={event => setVoltage(event)}
                        />
                        <Text>{voltage}%</Text>
                    </View>

                    {/*<TextInput*/}
                    {/*    placeholder="100%"*/}
                    {/*    style={styles.input}*/}
                    {/*    onChangeText={(text) => adicionarTextoNumerico(setVoltage, text, 1, 100)}*/}
                    {/*    value={ voltage.toString() }*/}
                    {/*    keyboardType='numeric'*/}
                    {/*/>*/}

                    <Text style={styles.label}>Tempo de funcionamento: <Text style={{ fontWeight: "bold" }}>{time / 60} minutos</Text></Text>
                    <View style={ styles.containerBtnsTempo }>
                        <TouchableOpacity style={ styles.btnTempo } onPress={() => setTime(5 * 60)}>
                            <Text style={ styles.textBtnTempo } >05 Min</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={ styles.btnTempo } onPress={() => setTime(10 * 60)}>
                            <Text style={ styles.textBtnTempo } >10 Min</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={ styles.btnTempo } onPress={() => setTime(15 * 60)}>
                            <Text style={ styles.textBtnTempo } >15 Min</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={ styles.btnTempo } onPress={() => setTime(30 * 60)}>
                            <Text style={ styles.textBtnTempo } >30 Min</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={ styles.btnTempo } onPress={() => setTime(60 * 60)}>
                            <Text style={ styles.textBtnTempo } >60 Min</Text>
                        </TouchableOpacity>
                    </View>

                    {
                        showCustomTimeField &&
                        <View>
                            <TextInput
                                placeholder="Informe o tempo em MINUTOS"
                                style={styles.input}
                                onChangeText={(text) => adicionarTextoNumerico(setTempoDigitado, text)}
                                value={ tempoDigitado.toString() }
                                keyboardType='numeric'
                            />
                        </View>
                    }

                    <View style={ styles.containerBtnsTempo }>
                        <TouchableOpacity
                            style={[
                                { width: "100%", alignItems: "center", marginTop: 5 }
                            ]}
                            onPress={() => {
                                if (showCustomTimeField) {
                                    adicionarTextoNumericoTempo(setTime, tempoDigitado);
                                }

                                setShowCustomTimeField(!showCustomTimeField);
                            }}>
                            <Text>{ showCustomTimeField ? "Confirmar tempo" : "Tempo personalizado" }</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.botaoAgendar}
                        onPress={ agendar }
                    >
                        <Text style={styles.botaoAgendarTexto}>Agendar</Text>
                    </TouchableOpacity>

                    { showDatePicker &&
                        <RNDateTimePicker
                            value={new Date(new Date().getTime() + 5 * 60000)}
                            minimumDate={new Date()}
                            locale="pt-BR"
                            is24Hour={true}
                            mode="date"
                            onChange={ setDatePicker }
                        />
                    }

                    { showTimePicker &&
                        <RNDateTimePicker
                            value={new Date()}
                            minimumDate={new Date()}
                            locale="pt-BR"
                            is24Hour={true}
                            mode="time"
                            onChange={ setTimePicker }
                        />
                    }
                </ScrollView>
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
        paddingStart: 0,
        paddingEnd: 0,
    },
    label: {
        fontSize: 20,
        marginTop: 28,
    },
    containerBtnsTempo: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    btnTempo: {
        padding: 7,
        marginTop: 15,
        borderRadius: 3,
        backgroundColor: "#0091ea",
    },
    textBtnTempo: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    },
    input: {
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16
    },
    botaoAgendar: {
        padding: 10,
        marginVertical: 30,
        borderRadius: 3,
        backgroundColor: "#0091ea",
        alignItems: "center"
    },
    botaoAgendarTexto: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold"
    },
});