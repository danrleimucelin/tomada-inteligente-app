import React, {Component, useState, useEffect, useRef} from 'react'
import {View, Text, StyleSheet, Alert} from 'react-native'
import Slider from '@react-native-community/slider';
import {API_URL} from '@env';

export default function Tomada(props) {
    const [value, setValue] = useState(props.power);
    const [consumption, setConsumption] = useState(props.consumption);
    const [tomada, setTomada] = useState(props.tomada);

    const makePost = async (values) => {
        tomada.power = values;

        await fetch(API_URL + "plug", {
            method: 'PUT',
            body: JSON.stringify(tomada),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            let statusCode = response.status;
            if (statusCode === 201) {
                response.json().then((json) => {
                    let plug = json.plug;

                    setValue(plug.power);
                    setConsumption(plug.consumption);
                });

                return;
            }

            response.json().then((json) => {
                let mensagem = json.message !== undefined ? json.message : "Houve um erro. Verifique os dados e tente novamente";
                Alert.alert("Ops!!!", mensagem);
            });
        }).catch((error) => {
            Alert.alert("Ops!!!", "Ocorreu um erro. Verifique sua conexão e tente novamente em instantes");
            console.log(error)
        })
    };

    const mudarValor2 = (values) => {
        setValue(values);
    };

    const getConsumption = async () => {
        await fetch(API_URL + 'plug/'+tomada.serial_number+'/consumption', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        }).then((response) => {
            let statusCode = response.status;
            if (statusCode !== 200) {
                return;
            }

            response.text().then((text) => {
                let consumo = parseFloat(text);
                setConsumption(isNaN(consumo) ? 0 : consumo);
            });
        }).catch((error) => {
            Alert.alert("Ops!!!", "Ocorreu um erro ao atualizar o consumo!");
            console.log(error)
        })
    }

    useEffect(() => {
        setInterval(getConsumption, 10000);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{tomada?.name}</Text>
            <Slider
                style={{width: 200, height: 60, backgroundColor:'lavender', marginTop:10, marginBottom:10}}
                value={value}
                step={1}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="#00BFFF"
                maximumTrackTintColor="#FFFFFF"
                onValueChange={event => mudarValor2(event)}
                onSlidingComplete={event => makePost(event)}
            />
            <Text style={styles.power}>Potência: {value}%</Text>
            <Text style={styles.power}>Consumo: {consumption}W</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        width: '90%'
    },
    contentContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    power: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});