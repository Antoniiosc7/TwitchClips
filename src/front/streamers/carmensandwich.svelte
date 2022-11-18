<script>

    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';
	var BASE_API_PATH = "/api/v2/tennis";
    let entries = [];


	let checkMSG = "";
    let visible = false;
    let color = "danger";
    let page = 1;
    let totaldata=6;
 
    let from = null;
	let to = null;
	let offset = 0;
	let limit = 10;

    let maxPages = 0;
	let numEntries;
    onMount(getEntries);

    async function getEntries(){
        console.log("Fetching entries....");
		let cadena = `/api/v1/carmensandwich?limit=${limit}&&offset=${offset*10}&&`;
		if (from != null) {
			cadena = cadena + `from=${from}&&`
		}
		if (to != null) {
			cadena = cadena + `to=${to}&&`
		}
        const res = await fetch(cadena); 
        if(res.ok){
			let cadenaPag = cadena.split(`limit=${limit}&&offset=${offset*10}`);
			maxPagesFunction(cadenaPag[0]+cadenaPag[1]);
            const data = await res.json();
            entries = data;
			numEntries = entries.length;
            console.log("Received entries: "+entries.length);
        }else{
			Errores(res.status);
		}
    }

	async function maxPagesFunction(cadena){
		let num;
        const res = await fetch(cadena,
			{
				method: "GET"
			});
			if(res.ok){
				const data = await res.json();
				maxPages = Math.floor(data.length/10);
				if(maxPages === data.length/10){
					maxPages = maxPages-1;
				}
        }
	}
</script>



<main>

	<figure class="text-center">
		<blockquote class="blockquote">
		  <h1>Streamer: CarmenSandwich</h1>
		</blockquote>
		
	  </figure>

{#await entries}
loading
	{:then entries}
	<Table bordered>
		
		
		<thead id="titulitos">
			<tr>
				<th>Titulo</th>
				<th>Duración</th>
				<th>Descargar</th>
				<th>Visualizaciones</th>
				<th>Fecha</th>
				<th>Clip</th>			
		</tr>
		</thead>
		<tbody>
			<tr>		
			</tr>
			{#each entries as entry}
				<tr>
					<td>{entry.title}</td>
					<td>{entry.duration}</td>
					<td><a href="https://clipsey.com/?clipurl={entry.url}" target="_blank" rel="noopener noreferrer"><button class="btn btn-primary" target="_blank" type="submit">Link</button>  </td>
					<td>{entry.view_count}</td>
					<td>{entry.created_at}</td>
					
                    <td>
						<iframe
   src="https://clips.twitch.tv/embed?clip={entry.id}&parent=localhost"
   height="720"
   width="1280"
   allowfullscreen>
</iframe>
						</td>
                  				
				</tr>
			{/each}
			
		</tbody>
	</Table>
{/await}
<div align="center">
    {#each Array(maxPages+1) as _,page}
    
        <Button outline color="secondary" on:click={()=>{
            offset = page;
            getEntries();
        }}>{page} </Button>&nbsp
        
    {/each}
    <Button outline color="secondary" on:click={()=>{
        getEntries();
    }}>Actualizar nº de página</Button>
</div>
</main>