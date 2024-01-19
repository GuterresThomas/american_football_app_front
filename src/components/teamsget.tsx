/* eslint-disable @next/next/no-img-element */
'use client'
import axios from "axios"
import React from "react"
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import { Accordion, AccordionItem } from "./ui/accordion";
import { AccordionContent, AccordionTrigger } from "@radix-ui/react-accordion";

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
    async function fetchFootballTeams() {
        const options = {
          method: 'GET',
          url: 'https://api-american-football.p.rapidapi.com/teams',
          params: {
            league: '1',
            season: '2023'
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
      }, []);
    return (
    <Card>
        <CardContent>    
            <CardDescription>Times da nfl</CardDescription>
            <CardHeader>Lista de times da nfl</CardHeader>
            <div>
                <ul>
                    {team.map((team, index) => (
                        <Accordion key={index} type="single" collapsible>
                             <AccordionItem value={`item-${index}`}>
                                <li>
                                    <AccordionTrigger>
                                        <div>
                                            <span><img src={team.logo} alt="team logo" /></span> <span>{team.name}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div></div>
                                    </AccordionContent>
                                </li>
                            </AccordionItem>
                        </Accordion>
                    ))}
                </ul>
            </div>
        </CardContent>
    </Card>
    )
}