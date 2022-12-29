import React, {useEffect, useState} from 'react';
import User from "../../database/User";
import MinhasTomadasListagem from "./listagem";
import MinhasTomadasNovaTomada from "./nova-tomada";

export default function MinhasTomadas() {
    const [user, setUser] = useState({});
    const [showNewPlugPage, setShowNewPlugPage] = useState(false);

    function carregarUsuarioLogado() {
        User.first().then((userDB) => {
            setUser(userDB);
        });
    }

    useEffect(carregarUsuarioLogado,[]);

    return showNewPlugPage ?
        <MinhasTomadasNovaTomada user={user} setShowNewPlugPage={setShowNewPlugPage}/> :
        <MinhasTomadasListagem user={user} setShowNewPlugPage={setShowNewPlugPage}/>;
}