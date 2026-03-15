"use client";
import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import data from "./_components/data.json";
import { DataTable } from "./_components/data-table";
import { SectionCards } from "./_components/section-cards";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";

export default function Page() {
	const [profiles, setProfiles] = useState([]);
	const [companiesData, setCompaniesData] = useState([]);

	useEffect(() => {
		async function fetchProfiles() {
			const { data, error } = await supabase
				.from("profiles")
				.select("*, signature_status, signature_url");
			if (error) {
				console.error("Erreur Supabase:", error.message);
			} else {
				setProfiles(data);
				console.log("Profils candidats:", data);
			}
		}
		fetchProfiles();
	}, []);

	useEffect(() => {
		async function fetchCompanies() {
			const { data, error } = await supabase
				.from("companies")
				.select("*");
			if (error) {
				console.error("Erreur Supabase companies:", error.message);
			} else {
				setCompaniesData(data);
				console.log("Données companies:", data);
			}
		}
		fetchCompanies();
	}, []);

	return (
		<div className='@container/main flex flex-col gap-4 md:gap-6'>
			<SectionCards />
			<ChartAreaInteractive />
			<DataTable data={profiles} companies={companiesData} />
		</div>
	);
}
