<script>
  import { scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import {createEventDispatcher} from 'svelte';
  import MeetupItem from "./MeetupItem.svelte";
  import MeetupFilter from "./MeetupFilter.svelte";
  import Button from '../UI/Button.svelte';

  export let meetups;
  const dispatch = createEventDispatcher();

  let favsOnly = false;

  $: filteredMeetups = favsOnly ? meetups.filter(m => m.isFavorite) : meetups;

  function setFilter(event) {
    favsOnly = event.detail === 1;
  }
</script>

<style>
  section#meetups {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }

  @media (min-width: 768px) {
    section#meetups {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  section#meetup-controls {
    margin: 1rem;
    display: flex;
    justify-content: space-between;
  }
</style>

<section id="meetup-controls">
  <MeetupFilter on:select="{setFilter}" />

  <Button on:click={() => dispatch('add')}>New Meetup</Button>
</section>

<section id="meetups">
  {#each filteredMeetups as meetup (meetup.id)}
    <div transition:scale animate:flip={{duration: 300}}>
      <MeetupItem
              id={meetup.id}
              title={meetup.title}
              subtitle={meetup.subtitle}
              description={meetup.description}
              imageUrl={meetup.imageUrl}
              email={meetup.contactEmail}
              address={meetup.address}
              isFav={meetup.isFavorite}
              on:showdetails
              on:edit
              on:togglefavorite />
    </div>
  {/each}
</section>
