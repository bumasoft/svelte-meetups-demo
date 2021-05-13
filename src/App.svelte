<script>
    import meetups from './Meetups/meetups-store.js';
    import Header from "./UI/Header.svelte";
    import MeetupGrid from "./Meetups/MeetupGrid.svelte";
    import MeetupDetail from './Meetups/MeetupDetail.svelte';
    import TextInput from "./UI/TextInput.svelte";
    import Button from "./UI/Button.svelte";
    import EditMeetup from "./Meetups/EditMeetup.svelte";

    // let meetups = ;

    let loadedMeetups = meetups;

    let editMode;
    let editedId = null;
    let page = 'overview';
    let pageData = {};

    function stopEdit() {
        editMode = null;
        editedId = null;
    }

    function showDetails(event) {
        page = 'details';
        pageData.id = event.detail;
    }

    function hideDetails() {
      page = 'overview';
      pageData = {};
    }

    function startEdit(event) {
      editMode = 'edit';
      editedId = event.detail;
    }
</script>

<style>
    main {
        margin-top: 5rem;
    }
</style>

<Header/>

<main>
    {#if page === 'overview'}
        {#if editMode === 'edit'}
            <EditMeetup id="{editedId}" on:save="{stopEdit}" on:cancel="{stopEdit}" />
        {/if}
        <MeetupGrid meetups="{$meetups}" on:showdetails="{showDetails}" on:add="{() => editMode = 'edit'}" on:edit="{startEdit}" />
    {:else}
    <MeetupDetail id="{pageData.id}" on:close="{hideDetails}" />
    {/if}
</main>
