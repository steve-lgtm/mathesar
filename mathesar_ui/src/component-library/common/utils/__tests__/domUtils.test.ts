import { getGloballyUniqueId } from "../domUtils";

test('Unique ID',()=>{
    expect(getGloballyUniqueId()).toBe('_global-id-1')
})