import React from "react";
import {View, Text, StyleSheet, Image, TouchableOpacity} from "react-native";

import * as Animatable from 'react-native-animatable';
import {useNavigation} from "@react-navigation/native";

export default function BemVindo () {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.containerLogo}>
                <Animatable.Image
                    animation='flipInX'
                    source={require('../../assets/logo.png')}
                    style={{ width: '75%' }}
                    resizeMode="contain"
                />
            </View>

            <Animatable.View delay={600} animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.titulo}>Gerencie suas tomadas inteligentes de onde estiver</Text>
                <Text style={styles.texto}>Faça login para começar</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={ () => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    containerLogo: {
        flex: 2,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerForm: {
        flex: 1,
        backgroundColor: '#0091ea',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 28,
        marginBottom: 12,
        color: '#eee'
    },
    texto: {
        color: '#2d2d39'
    },
    button: {
        position: 'absolute',
        backgroundColor: '#fff',
        borderRadius: 50,
        paddingVertical: 8,
        width: '60%',
        alignSelf: 'center',
        bottom: '15%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 18,
        color: '#2d2d39',
        fontWeight: "bold"
    }
})