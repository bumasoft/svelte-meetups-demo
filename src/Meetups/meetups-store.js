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

                meetups.set(values);
            })
            .catch(error => console.log);
    },
    addMeetup: (meetupData) => {
        const newMeetup = {
            ...meetupData,
            isFavorite: false
        };
        axios.post('https://svelte-meetups-c1074-default-rtdb.firebaseio.com/meetups.json', newMeetup)
            .then(response => {
                if (response.statusText !== 'OK') {
                    throw new Error('Failed to add meetup.');
                }

                newMeetup.id = data.name;

                meetups.update(items => {
                    return [newMeetup, ...items];
                });
             })
            .catch(error => console.log);
    },
    updateMeetup: (id, meetupData) => {
        meetups.update(items => {
            const meetupIndex = items.findIndex(i => i.id === id);

            return Object.values({...items, [meetupIndex]: ({...items[meetupIndex], ...meetupData})});
        });
    },
    deleteMeetup: id => {
        meetups.update( items => items.filter(i => i.id !== id));
    },
    toggleFavorite: (id) => {
        meetups.update(items => {
            const meetupIndex = items.findIndex(i => i.id === id);

            return Object.values({
                ...items,
                [meetupIndex]: ({...items[meetupIndex], isFavorite: !items[meetupIndex].isFavorite})
            });
        });
    },
};

export default customMeetupsStore;
