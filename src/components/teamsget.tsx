/* eslint-disable @next/next/no-img-element */
'use client'
import axios from "axios"
import React from "react"
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import { Accordion, AccordionItem } from "./ui/accordion";
import { AccordionContent, AccordionTrigger } from "@radix-ui/react-accordion";
import Image from "next/image";


interface Team {
    id: number;
    name: string;
    code: string;
    city: string;
    coach: string;
    stadium: string;
    owner: string;
    logo: string;
  }
export default function GetTeamsPage() {
    const [team, setTeam] = React.useState<Team[]>([])
    const [selectedYear, setSelectedYear] = useState<string>('2023');
    const [years, setYears] = useState<string[]>(generateYearRange(1999, 2024));

    async function fetchFootballTeams() {
        const options = {
          method: 'GET',
          url: 'https://api-american-football.p.rapidapi.com/teams',
          params: {
            league: '1',
            season: selectedYear,
          },
          headers: {
            'X-RapidAPI-Key': '1175bafbc2mshcbde2b5b68642f3p11ba34jsndd65f63e31f2',
            'X-RapidAPI-Host': 'api-american-football.p.rapidapi.com'
          }
        };
      
        try {
          const response = await axios.request(options);
          console.log(response.data);

          const filteredTeams = response.data.response.filter((team: Team) => {
            // Exclui times da AFC e NFC
            return !['AFC', 'NFC'].includes(team.name);
          });
          console.log('times filtrados', filteredTeams)

          setTeam(filteredTeams);
        } catch (error) {
          console.error(error);
          // Handle errors here
        }
      }

      useEffect(() => {
        fetchFootballTeams();
      }, [selectedYear]);

      function generateYearRange(start: number, end: number): string[] {
        const years = [];
        for (let year = start; year <= end; year++) {
            years.push(year.toString());
        }
        return years;
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
            <div className="flex justify-center">
                <label htmlFor="year" className="mr-2">
                    Selecione o ano:
                </label>        
                <select
                    id="year"
                    onChange={(e) => setSelectedYear(e.target.value)}
                    value={selectedYear}
                >
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>         
            <Card className="bg-zinc-50 m-4">
                <CardContent>    
                    <CardDescription>Times da nfl</CardDescription>
                    <CardHeader>Lista de times da nfl por temporada: {selectedYear}</CardHeader>
                    <div className="flex justify-center">
                        <ul>
                            {team.map((team, index) => (
                                <Accordion key={index} type="single" collapsible>
                                    <AccordionItem value={`item-${index}`}>
                                        <li>
                                            <AccordionTrigger>
                                                <div className="flex gap-2">
                                                    <span><img src={team.logo} height={50} width={50} alt="team logo" /></span> <span className='font-medium text-zinc-900'>{team.name}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="m-2 gap-2">
                                                    <p className='font-medium text-zinc-900'>cidade: <span className='font-medium text-zinc-900'>{team.city}</span></p>
                                                    <p className='font-medium text-zinc-900'>abreviação: <span className='font-medium text-zinc-900'>{team.code}</span></p>
                                                    <p className='font-medium text-zinc-900'>coach: <span className='font-medium text-zinc-900'>{team.coach}</span></p>
                                                    <p className='font-medium text-zinc-900'>estádio: <span className='font-medium text-zinc-900'>{team.stadium}</span></p>
                                                </div>
                                            </AccordionContent>
                                        </li>
                                    </AccordionItem>
                                </Accordion>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}