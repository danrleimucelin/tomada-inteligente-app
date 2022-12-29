import * as Animatable from "react-native-animatable";
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import { API_URL } from '@env';
import Loading from "../../components/loading";
import React, {useEffect, useState} from "react";

export default function MinhasTomadasNovaTomada(props) {
    const user = props.user;
    const setShowNewPlugPage = props.setShowNewPlugPage;
    const [loading, setLoading] = useState(false);

    const [nome, setNome] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [erros, setErros] = useState({});

    function adicionarTextoNumerico(callback, text) {
        callback(text.replace(/[^0-9]/g, ''));
    }

    function validarFormulario() {
        let erroNome = "";
        let erroSerialNumber = "";
        let erroPinCode = "";

        if (!nome.trim().length)
            erroNome = "Informe um nome para a tomada. Ex: Cozinha, Luminária, etc.";

        if (!serialNumber.trim().length)
            erroSerialNumber = "Informe o número serial da sua tomada";

        if (!pinCode.trim().length)
            erroPinCode = "Informe o código PIN da sua tomada.";

        if (erroNome.length || erroSerialNumber.length || erroPinCode.length) {
            setErros({
                nome: erroNome,
                serialNumber: erroSerialNumber,
                pinCode: erroPinCode,
            });
            return false;
        }

        setErros({});
        return true;
    }

    function cadastrar() {
        setLoading(true);

        if (!validarFormulario()) {
            setLoading(false);
            return;
        }

        const dados = {
            name: nome,
            pin: pinCode
        };

        fetch(API_URL + 'user/attach-plug/' + serialNumber, {
            method: 'POST',
            body: JSON.stringify(dados),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + user.access_token,
            },
        }).then((response) => {
            if (response.status === 201) {
                let mensagem = "Tomada adicionada com sucesso.";

                response.json().then((json) => {
                    if (json.message !== undefined) {
                        mensagem = json.message;
                    }

                    Alert.alert("Sucesso!", mensagem);
                    setShowNewPlugPage(false);
                });
                return;
            }

            if (response.status === 404) {
                response.json().then((json) => {
                    console.log(json);
                    let message = json.message;
                    Alert.alert("Ops!!!", message);
                });
            } else {
                console.log(response);
                Alert.alert("Ops!!!", "Ocorreu em erro. Tente novamente em instântes.");
            }
        }).catch((error) => {
            Alert.alert("Ops!!!", "Ocorreu um erro. Verifique sua conexão e tente novamente em instantes");
            console.log(error.message)
        }).finally(() => setLoading(false));
    }

    useEffect(() => {
        Alert.alert("Antes disso...", "Você já conectou sua nova tomada ao Wi-fi?", [
            {
                text: "Não",
                style: "cancel",
                onPress: () => {
                    Alert.alert("Siga as seguintes instruções",
                        "1 - Primeiramente, certifique-se de que a sua tomada esteja energizada. Você pode conferir isso através do LED laranja em sua tomada.\n" +
                        "\n" +
                        "2 - Em seguida, fique próximo da sua tomada, e acesse a configurações Wi-Fi do seu celular.\n" +
                        "\n" +
                        "3 - Procure por uma rede chamada, \"TOMADA-INTELIGENTE\" e conecte-se a ela. Não é nescessário senha.\n" +
                        "\n" +
                        "4 - Espere em torno de 30 segundos até aparecer na tela, uma menssagem para efetuar a configuração da tomada, caso isso não aconteça, vá até o navedor de internet de seu celular, e digite o seguinte IP na barra de endereço: http://192.168.4.1\n" +
                        "\n" +
                        "5 - Na tela que abrir, toque em \"Configure WiFi\".\n" +
                        "\n" +
                        "6 - Será mostrada uma lista com todas redes Wi-fi's que sua tomada encontrou.\n" +
                        "\n" +
                        "7 - Após isso, basta selecionar sua rede Wi-Fi desejada, e na sequência, digitar sua senha.\n" +
                        "\n" +
                        "8 - Por fim, se a conexão der certo, a tomada irá reiniciar e e você já pode voltar a conectar seu celular, na sua rede Wi-Fi e voltar para o APP.\n" +
                        "\n" +
                        "OBS: Para fazer sua tomada funcionar em outra rede Wi-Fi, basta pressionar o botão RESET da tomada por cerca de 10 segundos, e repetir os passos acima.");
                }
            },{
                text: "Sim"
            }
        ]);
    }, []);

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.mensagem}>Adicionar Tomada!</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                    placeholder="Ex.: Ar-condicionado, Cozinha, Luminária, etc."
                    style={styles.input}
                    onChangeText={setNome}
                    value={nome}
                />
                {erros.nome && <Text style={styles.labelErro}>{erros.nome}</Text>}

                <Text style={styles.label}>Serial</Text>
                <TextInput
                    placeholder="Informe o número serial da tomada"
                    style={styles.input}
                    onChangeText={(text) => adicionarTextoNumerico(setSerialNumber, text)}
                    value={serialNumber}
                    keyboardType='numeric'
                />
                {erros.serialNumber && <Text style={styles.labelErro}>{erros.serialNumber}</Text>}

                <Text style={styles.label}>PIN</Text>
                <TextInput
                    placeholder="Informe o código PIN da tomada"
                    style={styles.input}
                    onChangeText={(text) => adicionarTextoNumerico(setPinCode, text)}
                    value={pinCode}
                    keyboardType='numeric'
                />
                {erros.pinCode && <Text style={styles.labelErro}>{erros.pinCode}</Text>}

                <TouchableOpacity
                    style={styles.botaoCadastrar}
                    onPress={ cadastrar }
                >
                    <Text style={styles.botaoCadastrarTexto}>Adicionar Tomada</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botaoVoltar}
                    onPress={ () => setShowNewPlugPage(false)}
                >
                    <Text style={styles.botaoVoltarTexto}>Voltar para lista de tomadas</Text>
                </TouchableOpacity>
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
    input: {
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16
    },
    botaoCadastrar: {
        backgroundColor: '#0091ea',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    botaoCadastrarTexto: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    botaoVoltar: {
        marginTop: 14,
        alignSelf: 'center',
    },
    botaoVoltarTexto: {
        color: '#a1a1a1'
    },
    labelErro: {
        alignSelf: 'flex-start',
        color: '#ff375b',
        marginBottom: 8
    }
});