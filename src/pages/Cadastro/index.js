import React, {useState} from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView} from "react-native";
import { API_URL } from '@env';
import * as Animatable from 'react-native-animatable'
import {useNavigation} from "@react-navigation/native";
import Validations from "../../helpers/Validations";
import Loading from "../../components/loading";

export default function Cadastro() {
    const navigation = useNavigation();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confSenha, setConfSenha] = useState('');

    const [erros, setErros] = useState({});
    const [loading, setLoading] = useState(false);

    function validarFormulario() {
        let erroNome = '';
        let erroEmail = '';
        let erroSenha = '';
        let erroConfSenha = '';

        if (!nome.trim().length) {
            erroNome = "Informe seu nome";
        } else if (nome.trim().split(" ").length < 2) {
            erroNome = "Informe seu nome completo"
        }

        if (!email.trim().length) {
            erroEmail = "Informe seu e-mail";
        } else if (!Validations.validaEmail(email)) {
            erroEmail = "O e-mail informado não é válido";
        }

        if (!senha.length) {
            erroSenha = "Informe uma senha";
        } else if (senha.length < 5) {
            erroSenha = "A sua senha deve ter ao menos 5 caracteres";
        }

        if (!confSenha.length) {
            erroConfSenha = "Confirme sua senha";
        } else if (senha !== confSenha) {
            erroConfSenha = "As senhas informadas estão diferentes";
        }

        if (erroNome.length || erroEmail.length || erroSenha.length || erroConfSenha.length) {
            setErros({
                nome: erroNome,
                email: erroEmail,
                senha: erroSenha,
                confSenha: erroConfSenha
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
            email,
            password: senha
        };

        fetch(API_URL + 'user', {
            method: 'POST',
            body: JSON.stringify(dados),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json',
            },
        }).then((response) => {
            if (response.status === 201) {
                Alert.alert("Cadastro realizado com sucesso!", "Agora você pode realizar o acesso a sua conta.");
                navigation.navigate('Login');
                return;
            }

            if (response.status === 422) {
                response.json().then((json) => {
                    let message = json.message;

                    if (json.errors.email !== undefined || json.errors.name !== undefined || json.errors.password !== undefined) {
                        message = "Foram encontrados 1 ou mais problemas:\n";

                        if (json.errors.email !== undefined) {
                            message += "- " + json.errors.email[0] + "\n";
                        }
                        if (json.errors.name !== undefined) {
                            message += "- " + json.errors.name[0] + "\n";
                        }
                        if (json.errors.password !== undefined) {
                            message += "- " + json.errors.password[0] + "\n";
                        }
                    }

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

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.mensagem}>Cadastre-se!</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <ScrollView style={{ paddingStart: "5%", paddingEnd: "5%", marginTop: 15 }}>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        placeholder="Informe seu nome completo"
                        style={styles.input}
                        onChangeText={setNome}
                        value={nome}
                    />
                    {erros.nome && <Text style={styles.labelErro}>{erros.nome}</Text>}

                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        placeholder="Informe seu e-mail"
                        style={styles.input}
                        onChangeText={setEmail}
                        value={email}
                    />
                    {erros.email && <Text style={styles.labelErro}>{erros.email}</Text>}

                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        placeholder="Informe uma senha"
                        style={styles.input}
                        secureTextEntry={true}
                        onChangeText={setSenha}
                        value={senha}
                    />
                    {erros.senha && <Text style={styles.labelErro}>{erros.senha}</Text>}

                    <Text style={styles.label}>Confirme a Senha</Text>
                    <TextInput
                        placeholder="Digite novamente sua senha"
                        style={styles.input}
                        secureTextEntry={true}
                        onChangeText={setConfSenha}
                        value={confSenha}
                    />
                    {erros.confSenha && <Text style={styles.labelErro}>{erros.confSenha}</Text>}

                    <TouchableOpacity
                        style={styles.botaoCadastrar}
                        onPress={ cadastrar }
                    >
                        <Text style={styles.botaoCadastrarTexto}>Cadastrar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.botaoVoltar}
                        onPress={ () => navigation.navigate('Login')}
                    >
                        <Text style={styles.botaoVoltarTexto}>Voltar</Text>
                    </TouchableOpacity>
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