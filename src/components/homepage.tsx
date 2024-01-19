/* eslint-disable @next/next/no-img-element */
'use client'
import axios from 'axios'
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader } from './ui/card';
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
 
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Image from 'next/image';
import { Separator } from './ui/separator';
 
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
                <CardHeader className='font-bold text-2xl '>Ver jogos por data:</CardHeader>
                <CardContent className='flex flex-col'>
                    <CardDescription>Selecione a data por favor:</CardDescription>
                    
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
                    <Button className=' bg-sky-500 hover:bg-sky-800' onClick={buscarJogos}>Buscar jogos</Button>
                    <Card className='w-full'>
                    {jogos.length > 0 && (
                        <CardContent>
                            <CardDescription>Dados dos Jogos:</CardDescription>
                            <div>
                                <ul>
                                    {jogos.map((jogo, index) => (
                                        <Accordion key={index} type="single" collapsible>
                                            <AccordionItem value={`item-${index}`}>
                                            <li className='m-2'>
                                                <AccordionTrigger className='bg-gray-200 rounded-md flex justify-center hover:no-underline'>
                                                    <div className="sm:flex items-center md:flex md:items-center">
                                                        <img className='' src={jogo.teams.home.logo} width={50} height={50} alt={`${jogo.teams.home.name} logo`} />
                                                        <span className='font-bold text-zinc-900'>{jogo.teams.home.name}</span>
                                                        </div>
                                                        <span className='font-bold text-sky-900 ml-2 mr-2'>{jogo.scores.home.total}</span>
                                                        <span className='font-bold text-3xl ml-2 mr-2 text-white'>vs</span>
                                                        <div className="flex items-center">
                                                            <span className='font-bold text-blue-900 ml-2 mr-2'>{jogo.scores.away.total}</span>  
                                                            <span className='font-bold text-zinc-900'>{jogo.teams.away.name}</span>       
                                                        </div>
                                                        <img className='ml-2 mr-2' src={jogo.teams.away.logo} width={50} height={50} alt={`${jogo.teams.away.name} logo`} />
                                                                                  
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className='text-center gap-2'>
                                                        <p><span className='font-medium text-gray-950'>Estágio: </span> <span className='font-medium text-gray-800'>{jogo.game.stage}</span></p>
                                                        <p><span className='font-medium text-gray-950'>Semana:</span> <span className='font-medium text-gray-800'>{jogo.game.week}</span></p>
                                                        <p><span className='font-medium text-gray-950'>Data: </span> <span className='font-medium text-gray-800'>{format(new Date(jogo.game.date.timestamp * 1000), "dd/MM/yyyy HH:mm")}</span></p>
                                                        <p><span className='font-medium text-gray-950'>Local: </span><span className='font-medium text-gray-800'>{jogo.game.venue.name}</span>, <span className='font-medium text-gray-800'>{jogo.game.venue.city}</span></p>
                                                        <p><span className='font-medium text-gray-950'>Status:</span> <span className='font-medium text-gray-800'>{jogo.game.status.long}</span></p>
                                                    </div>
                                                    <div className='flex justify-center'>
                                                        <Accordion type="single" collapsible>
                                                        <AccordionItem value="item-1">
                                                            <AccordionTrigger className='m-2'>Pontuações:</AccordionTrigger>
                                                            <AccordionContent className='flex flex-col gap-2 text-center'>
                                                                <p className='font-medium text-gray-950'>1º quarto</p>
                                                                <p className='flex gap-2'><img src={jogo.teams.home.logo} height={20} width={20} alt='home team logo' /><span className='font-medium text-gray-950'>{jogo.scores.home.quarter_1}</span> <span> VS </span> <span className='font-medium text-gray-950'>{jogo.scores.away.quarter_1}</span> <img src={jogo.teams.away.logo} height={20} width={20} alt='away team logo' /></p>
                                                                <p className='font-medium text-gray-950'>2º quarto</p>
                                                                <p className='flex gap-2'><img src={jogo.teams.home.logo} height={20} width={20} alt='home team logo' /><span className='font-medium text-gray-950'>{jogo.scores.home.quarter_2}</span> <span> VS </span> <span className='font-medium text-gray-950'>{jogo.scores.away.quarter_2}</span> <img src={jogo.teams.away.logo} height={20} width={20} alt='away team logo' /></p>
                                                                <p className='font-medium text-gray-950'>3º quarto</p>
                                                                <p className='flex gap-2'><img src={jogo.teams.home.logo} height={20} width={20} alt='home team logo' /><span className='font-medium text-gray-950'>{jogo.scores.home.quarter_3}</span> <span> VS </span> <span className='font-medium text-gray-950'>{jogo.scores.away.quarter_3}</span> <img src={jogo.teams.away.logo} height={20} width={20} alt='away team logo' /></p>
                                                                <p className='font-medium text-gray-950'>4º quarto</p>
                                                                <p className='flex gap-2'><img src={jogo.teams.home.logo} height={20} width={20} alt='home team logo' /><span className='font-medium text-gray-950'>{jogo.scores.home.quarter_4}</span> <span> VS </span> <span className='font-medium text-gray-950'>{jogo.scores.away.quarter_4}</span> <img src={jogo.teams.away.logo} height={20} width={20} alt='away team logo' /></p>
                                                                <p className='font-medium text-gray-950'>total</p>
                                                                <p className='flex gap-2'><img src={jogo.teams.home.logo} height={20} width={20} alt='home team logo' /><span className='font-medium text-gray-950'>{jogo.scores.home.total}</span> <span> VS </span> <span className='font-medium text-gray-950'>{jogo.scores.away.total}</span> <img src={jogo.teams.away.logo} height={20} width={20} alt='away team logo' /></p>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                        </Accordion>
                                                    </div>
                                                <Separator className='m-2'/>
                                            </AccordionContent>
                                                </li>
                                        </AccordionItem>    
                                    </Accordion>  
                                        ))}       
                                </ul>
                            </div>
                        </CardContent>
                    ) }
                    </Card>
                    <Card>
                                 {jogos.length === 0 && (
                                    <CardContent className='flex justify-center p-2'>
                                        <span className='text-gray-900 font-medium'>Sem dados de jogos</span>
                                    </CardContent>
                                 )}
                    </Card>
                </CardContent>
            </Card>
            
        </div>
    )
}

