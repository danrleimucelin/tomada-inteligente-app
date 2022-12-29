import {ActivityIndicator, View} from "react-native";
import React from "react";

const Loading = () => {
    return (
        <View style={{
            backgroundColor: "rgba(0, 0, 0,.6)",
            height: "100%",
            position: "absolute",
            top:0,
            left: 0,
            width: "100%",
            justifyContent: "center",
        }}>
            <ActivityIndicator size={75} color="#fff"/>
        </View>
    );
}

export default Loading;