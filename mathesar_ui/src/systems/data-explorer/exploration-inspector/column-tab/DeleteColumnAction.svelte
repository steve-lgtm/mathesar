<script lang="ts">
  import {
    Collapsible,
    Button,
    Icon,
    Alert,
  } from '@mathesar-component-library';
  import { iconDeleteMajor } from '@mathesar/icons';
  import type QueryManager from '../../QueryManager';
  import type { ProcessedQueryOutputColumn } from '../../utils';

  export let selectedColumns: ProcessedQueryOutputColumn[];
  export let queryManager: QueryManager;

  $: ({ query } = queryManager);
  $: selectedColumnAliases = selectedColumns.map(
    (selectedColumn) => selectedColumn.column.alias,
  );
  $: disallowColumnDeletion = $query.areColumnsUsedInTransformations(
    selectedColumnAliases,
  );

  function deleteSelectedColumn() {
    void queryManager.update((q) => q.withoutColumns(selectedColumnAliases));
    queryManager.clearSelection();
  }
</script>

<Collapsible isOpen triggerAppearance="plain">
  <span slot="header">Actions</span>
  <div slot="content" class="section-content actions">
    {#if disallowColumnDeletion}
      <Alert appearance="warning">
        {#if selectedColumnAliases.length === 1}
          This column cannot be deleted because it is either used in
          transformations or a result of transformations. Please remove the
          column from the transformations before deleting it.
        {:else}
          Some of the selected columns cannot be deleted because they're either
          used in transformations or results of transformations. Please remove
          them from the transformations before deleting them.
        {/if}
      </Alert>
    {/if}

    <Button
      class="delete-button"
      appearance="outline-primary"
      disabled={disallowColumnDeletion}
      on:click={deleteSelectedColumn}
    >
      <Icon {...iconDeleteMajor} />
      <span>Delete column(s)</span>
    </Button>
  </div>
</Collapsible>

<style lang="scss">
  .section-content {
    :global(.alert-container) {
      margin-bottom: var(--size-large);
    }
  }
</style>
