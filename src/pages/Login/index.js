import React, {useState} from 'react';
import {Alert, LogBox, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import { API_URL } from '@env';
import * as Animatable from 'react-native-animatable'
import {useNavigation} from "@react-navigation/native";
import User from "../../database/User";
import Validations from "../../helpers/Validations"
import Loading from "../../components/loading";

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

export default function Login(props) {
    const navigation = useNavigation();
    const setLogado = props.route.params.setLogado;
    const pushToken = props.route.params.pushToken;

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erros, setErros] = useState({});
    const [loading, setLoading] = useState(false);

    function validarFormulario() {
        let erroEmail = '';
        let erroSenha = '';

        if (!email.trim().length) {
            erroEmail = "Informe seu e-mail";
        } else if (!Validations.validaEmail(email)) {
            erroEmail = "O e-mail informado não é válido";
        }

        if (!senha.length) {
            erroSenha = "Informe a senha";
        }

        if (erroEmail.length || erroSenha.length) {
            setErros({
                email: erroEmail,
                senha: erroSenha
            });
            return false;
        }

        setErros({});
        return true;
    }

    function acessar() {
        setLoading(true);

        if (!validarFormulario()) {
            setLoading(false);
            return;
        }

        const dados = {
            email,
            password: senha,
            push_token: pushToken
        };

        fetch(API_URL + 'login', {
            method: 'POST',
            body: JSON.stringify(dados),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            },
        }).then((response) => {
            let statusCode = response.status;

            response.json().then((json) => {
                console.log(statusCode, json);

                if (statusCode === 200) {
                    //- Vamos remover todos os usuários cadastrados
                    User.removeAll().then().catch();

                    //- Agora salva os dados recebidos da API
                    User.create({
                        id: json.user.id,
                        name: json.user.name,
                        email: json.user.email,
                        access_token: json.token,
                    }).then((id) => {
                        setLogado(true);
                    }).catch((error) => {
                        console.log(error);
                        Alert.alert("Ops!!!", "Houve um erro ao salvar os dados no dispositivo");
                    });

                    return;
                }

                let mensagem = json.message !== undefined ? json.message : "Houve um erro. Verifique os dados e tente novamente";
                Alert.alert("Ops!!!", mensagem);
            });
        }).catch((error) => {
            Alert.alert("Ops!!!", "Ocorreu um erro. Verifique sua conexão e tente novamente em instantes");
            console.log(error);
        }).finally(() => setLoading(false));
    }

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.mensagem}>Bem-vindo(a)!</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                    placeholder="Digite seu e-mail"
                    style={styles.input}
                    onChangeText={setEmail}
                    value={email}
                />
                {erros.email && <Text style={styles.labelErro}>{erros.email}</Text>}

                <Text style={styles.label}>Senha</Text>
                <TextInput
                    placeholder="Digite sua senha"
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={setSenha}
                    value={senha}
                />
                {erros.senha && <Text style={styles.labelErro}>{erros.senha}</Text>}

                <TouchableOpacity
                    style={styles.botaoAcessar}
                    onPress={ acessar }
                >
                    <Text style={styles.botaoAcessarTexto}>Acessar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botaoCadastrar}
                    onPress={ () => navigation.navigate('Cadastro')}
                >
                    <Text style={styles.botaoCadastrarTexto}>Ainda não tenho uma conta</Text>
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
    botaoAcessar: {
        backgroundColor: '#0091ea',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    botaoAcessarTexto: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    botaoCadastrar: {
        marginTop: 14,
        alignSelf: 'center',
    },
    botaoCadastrarTexto: {
        color: '#a1a1a1'
    },
    labelErro: {
        alignSelf: 'flex-start',
        color: '#ff375b',
        marginBottom: 8
    }
});