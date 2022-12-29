import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TextInput, TouchableOpacity, Alert} from "react-native";
import * as Animatable from 'react-native-animatable'
import { API_URL } from '@env';
import Loading from "../../components/loading";
import User from "../../database/User";

export default function MeusDados() {
    const [user, setUser] = useState({});

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confSenha, setConfSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [erros, setErros] = useState({});

    function carregarUsuarioLogado() {
        User.first().then((userDB) => {
            setUser(userDB);

            setNome(userDB.name);
            setEmail(userDB.email);
        });
    }

    function validarFormulario() {
        let erroNome = '';
        let erroSenha = '';
        let erroConfSenha = '';

        if (!nome.trim().length) {
            erroNome = "Informe seu nome";
        } else if (nome.trim().split(" ").length < 2) {
            erroNome = "Informe seu nome completo"
        }

        if (senha.length && senha.length < 5) {
            erroSenha = "A sua senha deve ter ao menos 5 caracteres";
        }

        if (senha.length && !confSenha.length) {
            erroConfSenha = "Confirme sua senha";
        } else if (senha !== confSenha) {
            erroConfSenha = "As senhas informadas estão diferentes";
        }

        if (erroNome.length || erroSenha.length || erroConfSenha.length) {
            setErros({
                nome: erroNome,
                senha: erroSenha,
                confSenha: erroConfSenha
            });
            return false;
        }

        setErros({});
        return true;
    }

    function atualizarDados() {
        setLoading(true);

        if (!validarFormulario()) {
            setLoading(false);
            return;
        }

        let dados = { name: nome }
        if (senha.length) {
            dados.password = senha;
        }

        fetch(API_URL + 'user', {
            method: 'PATCH',
            body: JSON.stringify(dados),
            headers: {
                'Authorization': 'Bearer ' + user.access_token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.status === 200) {
                let dadosUser = {...user};
                dadosUser.name = nome;

                //- Vamos remover todos os usuários cadastrados
                User.removeAll().then().catch();

                //- Agora salva os dados recebidos da API
                User.create(dadosUser).then((id) => {
                    setUser(dadosUser);
                    Alert.alert("Sucesso!", "Seus dados foram atualizados.");
                }).catch((error) => {
                    console.log(error);
                    Alert.alert("Ops!!!", "Dados atualizados, mas houve um erro ao salvar os novos dados no dispositivo. Faça login novamente para atualizar os dados em seu aparelho.");
                });

                return;
            }

            let mensagem = json.message !== undefined ? json.message : "Houve um erro. Verifique os dados e tente novamente";
            Alert.alert("Ops!!!", mensagem);
        }).catch((error) => {
            Alert.alert("Ops!!!", "Ocorreu um erro. Verifique sua conexão e tente novamente em instantes");
            console.log(error)
        }).finally(() => { setLoading(false) });
    }

    useEffect(carregarUsuarioLogado,[]);

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.mensagem}>Meus Dados!</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setNome}
                    value={nome}
                />
                {erros.nome && <Text style={styles.labelErro}>{erros.nome}</Text>}

                <Text style={styles.label}>E-mail</Text>
                <TextInput
                    editable={false}
                    style={styles.input}
                    value={email}
                />

                <Text style={styles.label}>Senha</Text>
                <TextInput
                    placeholder="Informe a nova senha"
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={setSenha}
                />
                {erros.senha && <Text style={styles.labelErro}>{erros.senha}</Text>}

                <Text style={styles.label}>Confirme a Senha</Text>
                <TextInput
                    placeholder="Digite novamente a nova senha"
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={setConfSenha}
                />
                {erros.confSenha && <Text style={styles.labelErro}>{erros.confSenha}</Text>}

                <TouchableOpacity
                    style={styles.botaoAtualizar}
                    onPress={ atualizarDados }
                >
                    <Text style={styles.botaoCadastrarTexto}>Alterar dados</Text>
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
    botaoAtualizar: {
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
    labelErro: {
        alignSelf: 'flex-start',
        color: '#ff375b',
        marginBottom: 8
    }
});