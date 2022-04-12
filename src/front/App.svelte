<script>
	import Router from "svelte-spa-router";
	import Home from "./Home.svelte";
	//import List from "./tennis/list.svelte";
	//import Edit from "./tennis/edit.svelte";
	import List from "./th3antonio/list.svelte";


	const routes = {

		"/": Home,
		//"/tennis" : List,
		//"/tennis/:country/:year" : Edit
		"/th3antonio" : List
		
	};

</script>

<main>
	<Router {routes} />
</main>
