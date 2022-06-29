import {useEffect, useState} from 'react';
import {newNear} from '../api';


const useNear = (networkId:string) => {
    const [near, setNear] = useState() as any;
    useEffect(() => {
        if(!networkId) {
            return ;
        }
        (async () => {
            const instance = await newNear(networkId);
            setNear(instance);
        })()
    },[networkId])

    return near
}

export default useNear;