<script>
	import Router from "svelte-spa-router";
	import Home from "./Home.svelte";
	import List from "./streamers/list.svelte";
	import league from "./streamers/league.svelte";
	import ojoninja from "./streamers/ojoninja.svelte";
	import elyoya from "./streamers/elyoya.svelte";
	import werlyb from "./streamers/werlyb.svelte";
	import koldo from "./streamers/koldo.svelte";
	import skain from "./streamers/skain.svelte";
	import nissaxter from "./streamers/nissaxter.svelte";
	import pochipoom from "./streamers/pochipoom.svelte";
	import ffaka from "./streamers/ffaka.svelte";
	import carmensandwich from "./streamers/carmensandwich.svelte";
	import kerios from "./streamers/kerios.svelte";
	import JavierrLoL from "./streamers/JavierrLoL.svelte";
	import zeling from "./streamers/zeling.svelte";
	import th3antonio from "./streamers/th3antonio.svelte";
	import xixauxas from "./streamers/xixauxas.svelte";
	import grekko_ from "./streamers/grekko_.svelte";
	import pausenpaii from "./streamers/pausenpaii.svelte";
	import holasoysergio1 from "./streamers/holasoysergio1.svelte";
	import miniduke from "./streamers/miniduke.svelte";
	import send0o from "./streamers/send0o.svelte";
	import getflakked from "./streamers/getflakked.svelte";
	import elmiillor from "./streamers/elmiillor.svelte";
	import pepiinero from "./streamers/pepiinero.svelte";
	import jaimemellado_ from "./streamers/jaimemellado_.svelte";
	import champi14 from "./streamers/champi14.svelte";
	import knekro from "./streamers/knekro.svelte";
	import ibai from "./streamers/ibai.svelte";
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
		"/kerios" : kerios,
		"/carmensandwich" : carmensandwich,
		"/ffaka" : ffaka,
		"/nissaxter" : nissaxter,
		"/pochipoom" : pochipoom,
		"/JavierrLoL" : JavierrLoL,
		"/th3antonio" : th3antonio,
		"/zeling" : zeling,
		"/send0o" : send0o,
		"/grekko_" : grekko_,
		"/pausenpaii" : pausenpaii,
		"/holasoysergio1" : holasoysergio1,
		"/miniduke" : miniduke,
		"/xixauxas" : xixauxas,
		"/getflakked" : getflakked,
		"/elmiillor" : elmiillor,
		"/pepiinero" : pepiinero,
		"/jaimemellado_" : jaimemellado_,
		"/champi14" : champi14,
		"/knekro" : knekro,
		"/ibai" : ibai,
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
