import { A } from "@solidjs/router";

export default function Card(props: any) {

    return (
        <A href={`/${props.journal}-journal/${props.id}` } classList={{'pointer-events-none': props.editable}} 
            class="p-3 rounded-md text-center bg-blue-400 text-white
            flex flex-col justify-between gap-3 transition-all hover:scale-105 hover:bg-blue-500">
            {props.children}
        </A>
    )
}