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
 


export default function HomePageComponent() {
    const [date, setDate] = React.useState<Date>()


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
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <Card>
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
                    <Button onClick={buscarJogos}>Buscar jogos</Button>
                    
                </CardContent>
            </Card>
           
        </div>
    )
}

