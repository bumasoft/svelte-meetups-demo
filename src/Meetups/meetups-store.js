import {writable} from 'svelte/store';
import axios from 'axios';

const meetups = writable([]);

const customMeetupsStore = {
    subscribe: meetups.subscribe,
    fetch: () => {
        return axios.get('https://svelte-meetups-c1074-default-rtdb.firebaseio.com/meetups.json')
            .then(response => {
                if (response.statusText !== 'OK') {
                    throw new Error('Failed to add meetup.');
                }

                const keys = Object.keys(response.data);
                const values = Object.values(response.data);

                values.forEach((value, index, array) => {
                    array[index].id = keys[index];
                });

                meetups.set(values.reverse());
            })
            .catch(error => console.log);
    },
    addMeetup: (meetupData) => {
        const newMeetup = {
            ...meetupData,
            isFavorite: false
        };
        return axios.post('https://svelte-meetups-c1074-default-rtdb.firebaseio.com/meetups.json', newMeetup)
            .then(response => {
                if (response.statusText !== 'OK') {
                    throw new Error('Failed to add meetup.');
                }

                const { data } = response;

                newMeetup.id = data.name;

                meetups.update(items => {
                    return [newMeetup, ...items];
                });
             })
            .catch(error => console.log);
    },
    updateMeetup: (id, meetupData) => {
        return axios.patch(`https://svelte-meetups-c1074-default-rtdb.firebaseio.com/meetups/${id}.json`, meetupData)
            .then(response => {
                if (response.statusText !== 'OK') {
                    throw new Error('Failed to update meetup.');
                }

                meetups.update(items => {
                    const meetupIndex = items.findIndex(i => i.id === id);
                    const item = items[meetupIndex];

                    return Object.values({...items, [meetupIndex]: ({...item, ...meetupData})});
                });
            })
            .catch(error => console.log);
    },
    deleteMeetup: id => {
        return axios.delete(`https://svelte-meetups-c1074-default-rtdb.firebaseio.com/meetups/${id}.json`)
            .then(response => {
                if (response.statusText !== 'OK') {
                    throw new Error('Failed to delete meetup.');
                }

                meetups.update( items => items.filter(i => i.id !== id));
            })
            .catch(error => console.log);
    },
    toggleFavorite: (id, isFav) => {
        return axios.patch(`https://svelte-meetups-c1074-default-rtdb.firebaseio.com/meetups/${id}.json`, {isFavorite: isFav})
            .then(response => {
                if (response.statusText !== 'OK') {
                    throw new Error('Failed to toggle favorite.');
                }

                meetups.update(items => {
                    const meetupIndex = items.findIndex(i => i.id === id);
                    const item = items[meetupIndex];

                    return Object.values({
                        ...items,
                        [meetupIndex]: ({...item, isFavorite: isFav})
                    });
                });
            })
            .catch(error => console.log);
    },
};

export default customMeetupsStore;
