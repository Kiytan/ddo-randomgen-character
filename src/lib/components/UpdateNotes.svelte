<script lang="ts">
    import {Button, Modal} from "flowbite-svelte";

let open = false;
</script>

<div class="flex justify-center">
    <div class="flex">
        <Button on:click={() => open = true}>Update Notes</Button>
    </div>
</div>

<Modal title="Update Notes" bind:open={open} autoclose outsideclose>
    <div class="flex flex-col gap-5 text-white">
        <div class="flex flex-col gap-2 bg-orange-700 rounded p-3">
            <h2 class="text-2xl underline font-bold">2025-07-15</h2>

            <div class="flex flex-col gap-1">
                <h3 class="text-xl font-bold">Feature</h3>
                <ul>
                    <li>- Added all the new races/archetypes/iconics from the year of the dragon, myth drannor and chill of ravenloft</li>
                    <li>- updated the way the code checks against archetypes/base classes when randomizing</li>
                </ul>
            </div>
        </div>

        <div class="flex flex-col gap-2 bg-gray-700 rounded p-3">
            <h2 class="text-2xl underline font-bold">024-02-29</h2>

            <div class="flex flex-col gap-1">
                <h3 class="text-xl font-bold">Features</h3>
                <ul>
                    <li>- Added the Dragon Lord archetype</li>
                </ul>
            </div>
        </div>

        <div class="flex flex-col gap-2 bg-gray-700 rounded p-3">
            <h2 class="text-2xl underline font-bold">2023-07-27</h2>

            <div class="flex flex-col gap-1">
                <h3 class="text-xl font-bold">Features</h3>
                <ul>
                    <li>- Added the Machro-Technic Epic Destiny.</li>
                    <li>- Added Racial and Destiny points inputs for characters with more than the minimum amount of points</li>
                </ul>
            </div>
        </div>

        <div class="flex flex-col gap-2 bg-gray-700 rounded p-3">
            <h2 class="text-2xl underline font-bold">2023-07-13</h2>

            <div class="flex flex-col gap-1">
                <h3 class="text-xl font-bold">Features</h3>
                <ul>
                    <li>- <span class="font-bold text-green-500">NEW !</span> Added an optional destiny trees randomizer (if you can make it to 32).</li>
                    <li>- Redesigned some results table columns a bit so everything fits better</li>
                </ul>
            </div>
        </div>

        <div class="flex flex-col gap-2 bg-gray-700 rounded p-3">
            <h2 class="text-2xl underline font-bold">2023-07-12</h2>

            <div class="flex flex-col gap-1">
                <h3 class="text-xl font-bold">Features</h3>
                <ul>
                    <li>- Allow the choice to force a class or an universal capstone</li>
                    <li>- Some elements have been moved to new categories</li>
                    <li>- <span class="font-bold text-green-500">NEW !</span> Added an icon at the end of the table to download a .txt of the build or copy the raw text</li>
                </ul>
            </div>

            <div class="flex flex-col gap-1">
                <h3 class="text-xl font-bold">Fixes</h3>
                <ul>
                    <li>- Alignement now properly takes into account the 2nd and 3rd class (true neutral paladins or monks are no more, they have to follow the law again)</li>
                </ul>
            </div>
        </div>

        <div class="flex flex-col gap-2 bg-gray-700 rounded p-3">
            <h2 class="text-2xl underline font-bold">2023-07-07</h2>

            <div class="flex flex-col gap-1">
                <h3 class="text-xl font-bold">Features</h3>
                <ul>
                    <li>- <span class="font-bold text-green-500">NEW !</span> Added an optional enhancement trees randomizer, there is now even more random to your random character !</li>
                </ul>
            </div>

            <div class="flex flex-col gap-1">
                <h3 class="text-xl font-bold">Adjustments</h3>
                <ul>
                    <li>- The "display names" option state is now saved for future visits</li>
                    <li>- Tooltips should be more readable</li>
                </ul>
            </div>

            <div class="flex flex-col gap-1">
                <h3 class="text-xl font-bold">Fixes</h3>
                <ul>
                    <li>- Fix a crash when selecting only a class and its archetype</li>
                </ul>
            </div>
        </div>
    </div>
    <svelte:fragment slot='footer'>
        <Button>Close</Button>
    </svelte:fragment>
</Modal>