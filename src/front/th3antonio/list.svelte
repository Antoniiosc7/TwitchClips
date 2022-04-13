<script>

    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';

    let entries = [];

	let newEntry = {
		country: "",
		year: "",
		most_grand_slam: "",
        masters_finals: "",
        olympic_gold_medals: ""
	}

    onMount(getEntries);

    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v1/th3antonio"); 
        if(res.ok){
            const data = await res.json();
            entries = data;
            console.log("Received entries: "+entries.length);
        }
    }

	async function insertEntry(){
        console.log("Inserting entry...."+JSON.stringify(newEntry));
        const res = await fetch("/api/v1/th3antonio",
			{
				method: "POST",
				body: JSON.stringify(newEntry),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
				getEntries();
				window.alert("Entrada introducida con éxito");
			}); 
    }

	async function BorrarEntry(countryDelete, yearDelete){
        console.log("Deleting entry....");
        const res = await fetch("/api/v1/th3antonio/"+countryDelete+"/"+yearDelete,
			{
				method: "DELETE"
			}).then(function (res){
				getEntries();
				window.alert("Entrada eliminada con éxito");
			});
    }

	async function BorrarEntries(){
        console.log("Deleting entries....");
        const res = await fetch("/api/v1/th3antonio/",
			{
				method: "DELETE"
			}).then(function (res){
				getEntries();
				window.alert("Entradas elimidas con éxito");
			});
    }

	async function LoadEntries(){
        console.log("Loading entries....");
        const res = await fetch("/api/v1/tennis/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				getEntries();
				window.alert("Entradas cargadas con éxito");
			});
    }

	

</script>



<main>
	<figure class="text-center">
		<blockquote class="blockquote">
		  <h1>TENNIS API</h1>
		</blockquote>
		<p>
		 Los últimos campeones de los grandes torneos del tenis internacional.
		</p>
	  </figure>

{#await entries}
loading
	{:then entries}
	<Table bordered>
		
		
		<thead id="titulitos">
			<tr>
				
				<th>Titulo</th>
				<th>Clip</th>
				<th>Descargar</th>
				<th>#</th>
                <th>#</th>
			
				
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newEntry.country}"></td>
				<td><input bind:value="{newEntry.year}"></td>
				<td><input bind:value="{newEntry.most_grand_slam}"></td>
                <td><input bind:value="{newEntry.masters_finals}"></td>
                <td><input bind:value="{newEntry.olympic_gold_medals}"></td>
				<td><Button outline color="primary" on:click="{insertEntry}">
					Añadir
					</Button>
				</td>
			</tr>
			{#each entries as entry}
				<tr>
					<td>{entry.title}</td>
					
                    <td>
						<iframe
   src="https://clips.twitch.tv/embed?clip={entry.id}&parent=localhost"
   height="360"
   width="640"
   allowfullscreen>
</iframe>
						</td>
                  
					<td><Button outline color="warning" on:click={function (){
						window.location.href = `/#/th3antonio/${entry.country}/${entry.year}`
					}}>
						Editar
					</Button>
					<td><Button outline color="danger" on:click={BorrarEntry(entry.country,entry.year)}>
						Borrar
					</Button>
					</td>
				</tr>
			{/each}
			<tr>
				<td><Button outline color="success" on:click={LoadEntries}>
					Cargar datos
				</Button></td>
				<td><Button outline color="danger" on:click={BorrarEntries}>
					Borrar todo
				</Button></td>
			</tr>
		</tbody>
	</Table>
{/await}

</main>