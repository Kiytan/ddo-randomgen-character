import {derived, get, writable} from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type { Race } from "./routes/races/+server";
import type { Class } from "./routes/classes/+server";
import type { Tree } from "./routes/destiny_trees/+server";

export type Data = Race & Class & Tree & {
    selected: boolean | string;
}

/** Shape of the shared `data` store once each section has been fetched. */
export interface DataState {
    races?: Record<string, Data[]>;
    classes?: Record<string, Data[]>;
    alignments?: Data[];
    destiny_trees?: Data[];
    universal_trees?: Data[];
    stats?: { name: string; selected: string }[];
}

type DataProps = {
    [index: string]: Data[][];
}

type DataArray = {
    [index: string]: Array<Data>;
}

export const data: Writable<any> = writable({})

export let selectedStartingStats: Writable<any> = writable('28')

// Returns [data store, loading flag, error message (false when none), reload function].
export async function fetchStore(url: string): Promise<[Writable<any>, Writable<boolean>, Writable<boolean | string>, () => Promise<void>]> {
    const loading: Writable<boolean> = writable(false)
    const error: Writable<boolean | string> = writable(false)

    async function get(): Promise<void> {
        loading.set(true)
        error.set(false)
        try {
            const response = await fetch(url)
            const json = await response.json();
            data.update((data: DataArray) => {
                data[url] = json
                return data;
            })
        } catch(e: any) {
            error.set(`Error fetching ${url} ` + e)
        }
        loading.set(false)
    }

    await get();

    return [ data, loading, error, get ]
}

/**
 * Sets `selected` on the items of one data section (e.g. 'races', 'alignments'),
 * for the "Select all ..." checkboxes.
 *
 * Svelte 5 only re-renders when it receives new objects, so the matching items are
 * copied rather than mutated in place; mutating them updated the data but left the
 * portraits/checkboxes on screen showing their old state.
 *
 * Handles both grouped sections ({ free: [...], premium: [...] }) and flat lists.
 * `include` decides which items change; `group` is the group name for grouped sections.
 */
export function setSelected(
    key: string,
    checked: boolean,
    include: (item: any, group?: string) => boolean = () => true
): void {
    const apply = (item: any, group?: string) => include(item, group) ? { ...item, selected: checked } : item;

    data.update((current: any) => {
        const section = current[key];
        if (!section) return current;

        const next = Array.isArray(section)
            ? section.map((item: any) => apply(item))
            : Object.fromEntries(
                Object.entries(section).map(([group, items]) => [
                    group,
                    Array.isArray(items) ? items.map((item: any) => apply(item, group)) : apply(items)
                ])
            );

        return { ...current, [key]: next };
    });
}

export const racesSelected: Readable<Data[]> = derived(
    data,
    ($data: DataProps): Data[] => {
        if (!$data.races) {
            return []
        }

        let selected = Object.values($data.races).flatMap((values: Data[]) => values.filter((r: Data) => r.selected));
        if (selected.length === 0) {
            return Object.values($data.races).flatMap((values: Data[]) => values)
        }

        return selected
    }
);

export const hasAllFreeRaceSelected: Readable<boolean> = derived(
    data,
    ($data: any): boolean => {
        return $data.races ? (Object.values($data.races.free).filter((race: any) => race.selected).length === $data.races.free.length) : false
    }
);

export const hasAllPremiumRaceSelected: Readable<boolean> = derived(
    data,
    ($data: any): boolean | any => {
        return $data.races ? (Object.values($data.races.premium).filter((race: any) => race.selected).length === $data.races.premium.length) : false
    }
);

export const hasAllIconicRaceSelected: Readable<boolean> = derived(
    data,
    ($data: any): boolean | any => {
        return $data.races ? (Object.values($data.races.iconic).filter((race: any) => race.selected).length === $data.races.iconic.length) : false
    }
);

export const classesSelected: Readable<Data[]> = derived(
    data,
    ($data: DataProps): Data[] => {
        if (!$data.classes) {
            return []
        }

        let selected = Object.values($data.classes).flatMap((values: Data[]) => values.filter((r: Data) => r.selected));
        if (selected.length === 0) {
            return Object.values($data.classes).flatMap((values: Data[]) => values)
        }

        return selected
    }
);

export const hasAllFreeClassSelected: Readable<boolean> = derived(
    data,
    ($data: any): boolean | any => {
        return $data.classes ? (Object.values($data.classes.free).filter((race: any) => race.selected).length === $data.classes.free.length) : false
    }
);

export const hasAllPremiumClassSelected: Readable<boolean> = derived(
    data,
    ($data: any): boolean | any => {
        return $data.classes ? (Object.values($data.classes.premium).filter((race: any) => race.selected).length === $data.classes.premium.length) : false
    }
);

export const hasAllArchetypeClassSelected: Readable<boolean> = derived(
    data,
    ($data: any): boolean | any => {
        return $data.classes ? (Object.values($data.classes.archetype).filter((race: any) => race.selected).length === $data.classes.archetype.length) : false
    }
);

export const alignmentsSelected: Readable<Data[]> = derived(
    data,
    ($data: DataArray): Data[] => {
        if (!$data.alignments) {
            return []
        }

        let selected = Object.values($data.alignments).filter((r: Data) => r.selected)
        if (selected.length === 0) {
            return Object.values($data.alignments)
        }

        return selected
    }
);

export const hasAllLawfulAlignmentsSelected: Readable<boolean> = derived(
    data,
    ($data: any): boolean => {
        if (!$data.alignments) return false;

        return Object.values($data.alignments).filter((alignment: any) => {
            return (alignment.alias.startsWith("lawful") || alignment.alias.includes("lawful")) && !alignment.selected;
        }).length === 0
    }
);

export const hasAllNeutralAlignmentsSelected: Readable<boolean> = derived(
    data,
    ($data: any): boolean => {
        if (!$data.alignments) return false;

        return Object.values($data.alignments).filter((alignment: any) => {
            return (alignment.alias.startsWith("neutral") || alignment.alias.includes("neutral")) && !alignment.selected;
        }).length === 0
    }
);

export const hasAllChaoticAlignmentsSelected: Readable<boolean> = derived(
    data,
    ($data: any): boolean => {
        if (!$data.alignments) return false;

        return Object.values($data.alignments).filter((alignment: any) => {
            return (alignment.alias.startsWith("chaotic") || alignment.alias.includes("chaotic")) && !alignment.selected;
        }).length === 0
    }
);


export const universalTreesSelected: Readable<Data[]> = derived(
    data,
    ($data: DataArray): Data[] => {
        if (!$data.universal_trees) {
            return []
        }

        let selected = Object.values($data.universal_trees).filter((r: Data) => r.selected)
        if (selected.length === 0) {
            return []
        }

        return selected
    }
);

export const hasAllUniversalTreesSelected: Readable<boolean> = derived(
    data,
    ($data: DataArray): boolean | any => {
        return $data.universal_trees ? (Object.values($data.universal_trees).filter((tree: Tree) => tree.selected).length === $data.universal_trees.length) : false
    }
);

const toggeableDestinyTrees: Readable<Data[]> = derived(
    data,
    ($data: DataArray): Data[] => {
        return $data.destiny_trees ? Object.values($data.destiny_trees).filter((tree : Tree) => !tree.core && !tree.upcoming) : [];
    }
);

export const hasAllDestinyTreesSelected: Readable<boolean> = derived(
    data,
    ($data: DataArray): boolean | any => {
        return $data.destiny_trees ? (get(toggeableDestinyTrees).filter((tree: Tree) => tree.selected).length === get(toggeableDestinyTrees).length) : false
    }
);

export const destinyTreesSelected: Readable<Data[]> = derived(
    data,
    ($data: DataArray): Data[] => {
        if (!$data.destiny_trees) {
            return []
        }

        let selected = Object.values($data.destiny_trees).filter((r: Data) => !r?.upcoming && (!r.core ? r?.selected : true))

        if (selected.length === 0) {
            return []
        }

        return selected
    }
);