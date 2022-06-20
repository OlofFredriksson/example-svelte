<script>
    import { onMount } from "svelte";
    import { myFunction } from "./utils";

    let name = "world";
    let clickedTimes = 0;
    let cats = ["Findus", "Tusse"];

    export let passedProp;

    function handleClick() {
        clickedTimes++;
    }

    onMount(async () => {
        console.log("mounted");
    });
</script>

<div>
    <h1>Hello ({myFunction()}) {name}!</h1>

    Passed prop: {passedProp} <br />
    Clicked: {clickedTimes}
    <button on:click={handleClick}>Button</button>

    <ul>
        {#each cats as cat}
            <li>{cat}</li>
        {/each}
    </ul>
</div>

<style>
    h1 {
        color: blue;
    }
</style>
