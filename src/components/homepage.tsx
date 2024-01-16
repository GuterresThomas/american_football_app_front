'use client'
import axios from 'axios'
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader } from './ui/card';
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Image from 'next/image';
 
interface Jogo {
    game: {
        id: number;
        stage: string;
        week: string;
        date: {
            timezone: string;
            date: string;
            time: string;
            timestamp: number;
        };
        venue: {
            name: string;
            city: string;
        };
        status: {
            short: string;
            long: string;
            timer: null;
        };
    };
    league: {
        id: number;
        name: string;
        season: string;
        logo: string;
        country: {
            name: string;
            code: string;
            flag: string;
        };
    };
    teams: {
        home: {
            id: number;
            name: string;
            logo: string;
        };
        away: {
            id: number;
            name: string;
            logo: string;
        };
    };
    scores: {
        home: {
            quarter_1: number;
            quarter_2: number;
            quarter_3: number;
            quarter_4: number;
            overtime: null;
            total: number;
        };
        away: {
            quarter_1: number;
            quarter_2: number;
            quarter_3: number;
            quarter_4: number;
            overtime: null;
            total: number;
        };
    };
}

export default function HomePageComponent() {
    const [date, setDate] = React.useState<Date>()
    const [jogos, setJogos] = React.useState<Jogo[]>([]);



    async function buscarJogos() {
        if (!date) {
            console.log("Por favor, selecione uma data antes de buscar jogos.")
            return;
        }

        const formattedDate = format(date, "yyyy-MM-dd");

        const options = {
            method: 'GET',
            url: 'https://api-american-football.p.rapidapi.com/games',
            params: { date: formattedDate },
            headers: {
                'X-RapidAPI-Key': '1175bafbc2mshcbde2b5b68642f3p11ba34jsndd65f63e31f2',
                'X-RapidAPI-Host': 'api-american-football.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            console.log(response.data);
            setJogos(response.data.response); 

            console.log("Estado jogos atualizado:", jogos);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <div className="flex justify-center">
                <Image src='/logo_american_football.png'
                width={200}
                height={200}
                alt="logo"
                />
            </div>
            <Card className='bg-zinc-50 m-4'>
                <CardHeader>Jogos na data selecionada:</CardHeader>
                <CardContent className='flex flex-col'>
                    <CardDescription>Lista de jogos na data selecionada:</CardDescription>
                    
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Selecione uma data</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Button className=' bg-cyan-400 hover:bg-cyan-800' onClick={buscarJogos}>Buscar jogos</Button>
                    <Card className='m-4'>
                    {jogos.length > 0 && (
                        <CardContent>
                            <CardDescription>Dados dos Jogos:</CardDescription>
                            <ul>
                                {jogos.map((jogo, index) => (
                                    <li key={index} className='m-2'>
                                        <h3>Jogo {jogo.game.id}</h3>
                                        <p>Estágio: {jogo.game.stage}</p>
                                        <p>Semana: {jogo.game.week}</p>
                                        <p>Data: {format(new Date(jogo.game.date.timestamp * 1000), "PPP p")}</p>
                                        <p>Local: {jogo.game.venue.name}, {jogo.game.venue.city}</p>
                                        <p>Status: {jogo.game.status.long}</p>

                                        <p>Resultado:</p>
                                        <p>{jogo.teams.home.name} {jogo.scores.home.total} vs {jogo.teams.away.name} {jogo.scores.away.total}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    )}
                    </Card>
                </CardContent>
            </Card>
            
        </div>
    )
}

