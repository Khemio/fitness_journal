import { createContext, createResource, createSignal, useContext, } from "solid-js";
import PocketBase from 'pocketbase'

export type Food = {
    id: string,
    name: string,
    amount: number,
    calories: number,
    protein: number
}

export type Day = {
    id: string,
    date: string,
    foods_eaten: Food[],
    calories: number,
    protein: number
}

export type Exercise = {
    id: string,
    name: string,
    type: string,
    sets: number,
    reps: number,
}

export type Workout = {
    id: string,
    date: string,
    exercises: Exercise[],

}

const dbURL = import.meta.env.VITE_DB_URL;
export const pb = new PocketBase(dbURL);

const [isAuth, setAuth] = createSignal(pb.authStore.isValid);
const [foodCopy, setCopy] = createSignal([]);

const fetchFoodJournal = async () => {
    const records = await pb.collection('food_journal').getFullList({
        sort: '-created',
        expand: 'foods_eaten_in_a_day.food_name',
    });

    if(records.length === 0) {
        console.log('records returned empty');
        return [];
    }

    const days: Day[] = records.map(record => {
        return {
            id: record.id,
            // date: record.created,
            date: new Date(record.created.slice(0, 10)).toLocaleDateString(),
            foods_eaten: record.expand.foods_eaten_in_a_day.map((food: Food) => {
                return {
                    id: food.id,
                    name: food.name,
                    amount: food.amount,
                    calories: food.calories,
                    protein: food.protein
                };
            }),
            calories: record.total_calories,
            protein: record.total_protein
        }
    })
    console.log(days)

    return days;
}
const fetchWorkoutJournal = async () => {
    const records = await pb.collection('workout_journal').getFullList({
        sort: '-created',
        expand: 'exercises',
    });

    if(records.length === 0) {
        console.log('workout records returned empty');
        return [];
    }

    const workouts: Workout[] = records.map(record => {
        return {
            id: record.id,
            // date: record.created,
            date: new Date(record.created.slice(0, 10)).toLocaleDateString(),
            exercises: record.expand.exercises.map((exercise: Exercise) => {
                return {
                    id: exercise.id,
                    name: exercise.name,
                    type: exercise.type,
                    sets: exercise.sets,
                    reps: exercise.reps,
                };
            })
        }
    })
    console.log(workouts)

    return workouts;
}

const [days, {mutate: mutateDays, refetch: refetchDays}] = createResource(isAuth, fetchFoodJournal);
const [workouts, {mutate: mutateWorkouts, refetch: refetchWorkouts}] = createResource(isAuth, fetchWorkoutJournal);

const JournalContext = createContext({
    isAuth,
    setAuth,
    foodCopy,
    setCopy,
    days,
    mutateDays,
    refetchDays,
    workouts,
    mutateWorkouts,
    refetchWorkouts
});

export function JournalProvider(props: any) {

    return (
        <JournalContext.Provider value={{
            isAuth, setAuth,
            foodCopy, setCopy,
            days, mutateDays, refetchDays,
            workouts, mutateWorkouts, refetchWorkouts
        }}>
            {props.children}
        </JournalContext.Provider>
    )
}

export function useJournalContext() {return useContext(JournalContext)}