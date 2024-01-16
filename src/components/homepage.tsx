'use client'
import axios from 'axios'
import { Button } from './ui/button';

export default function HomePageComponent() {
    async function buscarJogos() {
        const options = {
            method: 'GET',
            url: 'https://api-american-football.p.rapidapi.com/games',
            params: {date: '2024-01-15'},
            headers: {
                'X-RapidAPI-Key': '1175bafbc2mshcbde2b5b68642f3p11ba34jsndd65f63e31f2',
                'X-RapidAPI-Host': 'api-american-football.p.rapidapi.com'
            }
            };
        
            try {
                const response = await axios.request(options);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
    }

    return (
        <div>
            <Button onClick={buscarJogos}>clica ai</Button>
        </div>
    )
}

