<script lang="ts">
  import NameWithIcon from '@mathesar/components/NameWithIcon.svelte';
  import { getColumnIconProps } from '@mathesar/utils/columnUtils';
  import type { DisplayColumn } from './types';

  export let column: DisplayColumn;
  export let isLoading = false;
  export let truncateName = true;

  $: icon = getColumnIconProps(column);
</script>

<NameWithIcon on:click {icon} {isLoading} {truncateName}>
  {column.name}
</NameWithIcon>
