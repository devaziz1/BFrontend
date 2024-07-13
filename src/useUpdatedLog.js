import { useEffect } from "react"

export default function useUpdatedLog(value){
    useEffect(() => {
        console.log(value)
    }, [value]);
}