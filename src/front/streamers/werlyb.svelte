<script>

    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';

    let entries = [];
    onMount(getEntries);

    async function getEntries(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v1/werlyb"); 
        if(res.ok){
            const data = await res.json();
            entries = data;
            console.log("Received entries: "+entries.length);
        }
    }
</script>



<main>

	<figure class="text-center">
		<blockquote class="blockquote">
		  <h1>Streamer: Werlyb</h1>
		</blockquote>
		
	  </figure>

{#await entries}
loading
	{:then entries}
	<Table bordered>
		
		
		<thead id="titulitos">
			<tr>
				
				<th>Titulo</th>
				<th>Clip</th>			
		</tr>
		</thead>
		<tbody>
			<tr>		
			</tr>
			{#each entries as entry}
				<tr>
					<td>{entry.title}</td>
					
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

</main>