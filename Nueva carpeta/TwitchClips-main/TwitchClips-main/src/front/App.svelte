<script>
	import Router from "svelte-spa-router";
	import Home from "./Home.svelte";
	//import List from "./tennis/list.svelte";
	//import Edit from "./tennis/edit.svelte";
	import List from "./streamers/list.svelte";
	import league from "./streamers/league.svelte";
	import ojoninja from "./streamers/ojoninja.svelte";
	import elyoya from "./streamers/elyoya.svelte";
	import werlyb from "./streamers/werlyb.svelte";
	import koldo from "./streamers/koldo.svelte";
	import skain from "./streamers/skain.svelte";
	import Footer from "./components/Footer.svelte";
	import Header from "./components/Header.svelte";

	const routes = {

		"/": Home,
		//"/tennis" : List,
		//"/tennis/:country/:year" : Edit
		"/th3antonio" : List,
		"/elojoninja" : ojoninja,
		"/elyoya" : elyoya,
		"/werlyb" : werlyb,
		"/koldo" : koldo,
		"/skain" : skain,
		"/leagueoflegends" : league
		
	};

</script>
<Header />
<main>
	<Router {routes} />
</main>
<Footer />
<style>
	main{
		margin-left: 10%;
		margin-right: 10%;
		
		margin:50px; 
	}

</style>
