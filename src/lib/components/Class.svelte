<script lang="ts">
    import { onMount } from 'svelte';
    import {Checkbox, Spinner, Tooltip} from 'flowbite-svelte';
    import {fetchStore, hasAllFreeClassSelected, hasAllPremiumClassSelected, hasAllArchetypeClassSelected, setSelected, type DataState } from '../../store'
    import { writable, type Writable } from "svelte/store";

    let { displayNames }: { displayNames: boolean } = $props()

    let data: Writable<DataState> = $state(writable({}));
    let loading: Writable<boolean> = $state(writable(true));
    let error: Writable<boolean | string> = $state(writable(false));
    let dataValue: DataState = $derived($data);

    onMount(async () => {
        const [store, loadingStore, errorStore] = await fetchStore('classes');
        data = store;
        loading = loadingStore;
        error = errorStore;
    })

    const handleChange = () => {
        data.set($data)
    }

    const toggleAll = (e: Event) => {
        setSelected('classes', (e.target as HTMLInputElement).checked)
    }

    const toggle = (e: Event, type: string) => {
        setSelected('classes', (e.target as HTMLInputElement).checked, (_, group) => group === type)
    }
</script>

<div class="flex flex-col justify-center gap-2">
    <span class="text-orange-500 mr-2">Class Selector</span>
    <div class="flex flex-wrap gap-3">
        <Checkbox checked={$hasAllFreeClassSelected && $hasAllPremiumClassSelected && $hasAllArchetypeClassSelected } onchange={e => toggleAll(e)}>
            Select all
        </Checkbox>
        <Checkbox checked={$hasAllFreeClassSelected} onchange={e => toggle(e, 'free')}>
            Select all free classes
        </Checkbox>
        <Checkbox checked={$hasAllPremiumClassSelected} onchange={e => toggle(e, 'premium')}>
            Select all premium classes
        </Checkbox>
        <Checkbox checked={$hasAllArchetypeClassSelected} onchange={e => toggle(e, 'archetype')}>
            Select all archetype classes
        </Checkbox>
    </div>

    <div class="flex">
        {#if $loading}
            <div class="text-center m-3">
                Loading <Spinner></Spinner>
            </div>
        {:else if $error}
        <p class="text-red-500">{$error}</p>
        {:else }
            {#if dataValue?.classes?.free?.length}
                <div class="flex flex-col gap-2 p-2 bg-blue-500 grow rounded-l-lg">
                    <span class="text-center text-slate-900">Free</span>
                    <div class="flex flex-wrap justify-center gap-2">
                        {#each Object.values(dataValue.classes.free) as data}
                            <input class="hidden" bind:checked={data.selected} type="checkbox" id="free_{data.alias}"
                                   onchange={handleChange}
                            />
                            <label for="free_{data.alias}" class="flex flex-col items-center">
                                <img src="images/classes/free/{data.alias}_class_icon.png"
                                    alt="{data.name}"
                                    title="{data.name}"
                                />
                                <Tooltip class="flex flex-col">
                                    <span>
                                        Name : <span class="text-blue-500">{data.name}</span>
                                    </span>
                                    <span>
                                        Weight modifier : {@html data.weightedStats.map(s => `<span class="text-purple-400">${s.name}</span>`).join(', ')}
                                    </span>
                                    <span>
                                        Enhancement trees : {@html data.enhancementTrees.map(s => `<span class="text-green-300">${s.name}</span>`).join(', ')}
                                    </span>
                                </Tooltip>
                                {#if displayNames}
                                    <small>{data.name}</small>
                                {/if}
                            </label>
                        {/each}
                    </div>
                </div>
            {/if}
            {#if dataValue?.classes?.premium?.length}
                <div class="flex flex-col gap-2 p-2 bg-red-500 grow">
                    <span class="text-center text-slate-900">Premium</span>
                    <div class="flex flex-wrap justify-center gap-2">
                        {#each Object.values(dataValue.classes.premium) as data}
                            <input class="hidden" bind:checked={data.selected} type="checkbox" id="premium_{data.alias}"
                                   onchange={handleChange}
                            />
                            <label for="premium_{data.alias}" class="flex flex-col items-center">
                                <img src="images/classes/premium/{data.alias}_class_icon.png"
                                     alt="{data.name}"
                                     title="{data.name}"
                                />
                                <Tooltip class="flex flex-col">
                                    <span>
                                        Name : <span class="text-red-500">{data.name}</span>
                                    </span>
                                    <span>
                                        Weight modifier : {@html data.weightedStats.map(s => `<span class="text-purple-400">${s.name}</span>`).join(', ')}
                                    </span>
                                    <span>
                                        Enhancement trees : {@html data.enhancementTrees.map(s => `<span class="text-green-300">${s.name}</span>`).join(', ')}
                                    </span>
                                </Tooltip>
                                {#if displayNames}
                                    <small>{data.name}</small>
                                {/if}
                            </label>
                        {/each}
                    </div>
                </div>
            {/if}
            {#if dataValue?.classes?.archetype?.length}
                <div class="flex flex-col gap-2 p-2 bg-yellow-500 grow rounded-r-lg">
                    <span class="text-center text-slate-900">Archetype</span>
                    <div class="flex flex-wrap justify-center gap-2">
                        {#each Object.values(dataValue.classes.archetype) as data}
                            <input class="hidden" bind:checked={data.selected} type="checkbox" id="archetype_{data.alias}"
                                   onchange={handleChange}
                            />
                            <label for="archetype_{data.alias}" class="flex flex-col items-center">
                                <img src="images/classes/archetype/{data.alias}_class_icon.png"
                                     alt="{data.name}"
                                     title="{data.name}"
                                />
                                <Tooltip class="flex flex-col">
                                    <span>
                                        Name : <span class="text-yellow-500">{data.name}</span>
                                    </span>
                                    <span>
                                        Weight modifier : {@html data.weightedStats.map(s => `<span class="text-purple-400">${s.name}</span>`).join(', ')}
                                    </span>
                                    <span>
                                        Enhancement trees : {@html data.enhancementTrees.map(t => `<span class="text-green-300">${t.name}</span>`).join(', ')}
                                    </span>
                                </Tooltip>
                                {#if displayNames}
                                    <small>{data.name}</small>
                                {/if}
                            </label>
                        {/each}
                    </div>
                </div>
            {/if}
        {/if}
    </div>
</div>

<style>
    label img {
        opacity: 50%;
    }

    :checked+label img {
        opacity: 100%;
    }

    input[type=checkbox] {
        display: none;
    }
</style>